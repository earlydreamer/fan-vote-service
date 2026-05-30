import { render, screen, within } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import type { RallyRoom } from '../types/rallyroom';
import { RoomCard } from './RoomCard';

describe('RoomCard', () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.useRealTimers();
  });

  it('computes D-day from the current calendar date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-29T12:00:00+09:00'));

    render(<RoomCard room={buildRoom({ endAt: '2026-05-31T14:59:00.000Z' })} />);

    expect(screen.getByText('D-2')).toBeInTheDocument();
  });

  it('marks same-calendar-day rooms as ending today', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-31T09:00:00+09:00'));

    render(<RoomCard room={buildRoom({ endAt: '2026-05-31T14:59:00.000Z' })} />);

    expect(screen.getByText('오늘 마감')).toBeInTheDocument();
  });

  it('uses the service calendar date when the local timezone lags KST', () => {
    vi.stubEnv('TZ', 'UTC');
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-05-30T15:30:00.000Z'));

    render(<RoomCard room={buildRoom({ endAt: '2026-05-31T14:59:00.000Z' })} />);

    expect(screen.getByText('오늘 마감')).toBeInTheDocument();
  });

  it('shows a compact candidate ranking preview', () => {
    render(<RoomCard room={buildRoom()} />);

    const ranking = screen.getByRole('list', { name: '후보 랭킹 미리보기' });

    expect(within(ranking).getByText('1')).toBeInTheDocument();
    expect(within(ranking).getByText('테스트 후보')).toBeInTheDocument();
    expect(within(ranking).getByText('10표')).toBeInTheDocument();
  });

  it('separates the vote title from the room name in the card hierarchy', () => {
    render(
      <RoomCard
        room={buildRoom({
          title: '테스트 투표방',
          voteTitle: '테스트 대표 투표',
          topic: '테스트 투표 설명'
        })}
      />
    );

    expect(screen.getByRole('heading', { name: '테스트 대표 투표' })).toBeInTheDocument();
    expect(screen.getByText('투표방 · 테스트 투표방')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '테스트 투표방' })).not.toBeInTheDocument();
  });
});

function buildRoom(overrides: Partial<RallyRoom> = {}): RallyRoom {
  return {
    id: 'room-test',
    slug: 'room-test',
    title: '테스트 투표방',
    topic: '테스트 투표 주제',
    categoryId: 'cat-stage',
    primaryTargetId: 'target-test',
    createdAt: '2026-05-29T00:00:00.000Z',
    status: 'active',
    visibility: 'public',
    endAt: '2026-05-31T14:59:00.000Z',
    pollFormat: 'single',
    tags: ['테스트'],
    thumbnail: {
      tone: 'stage',
      label: 'TEST',
      accent: '#00D084'
    },
    isFeatured: false,
    addOptionCost: {
      voteTickets: 1,
      rp: 120
    },
    goalValue: 100,
    currentGoalValue: 50,
    participantCount: 12,
    candidates: [
      {
        id: 'candidate-test',
        targetId: 'target-test',
        title: '테스트 후보',
        status: 'approved',
        voteCount: 10
      }
    ],
    missions: [],
    messages: [],
    resultCard: {
      winnerCandidateId: 'candidate-test',
      totalParticipants: 12,
      topMessage: '테스트 메시지',
      earnedIcon: '테스트 배지'
    },
    ...overrides
  };
}
