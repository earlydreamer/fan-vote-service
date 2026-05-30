import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { RallyRoom } from '../types/rallyroom';
import { RoomThumbnail } from './RoomThumbnail';

describe('RoomThumbnail', () => {
  it('uses semantic room badges instead of exposing raw thumbnail labels', () => {
    render(<RoomThumbnail room={buildRoom()} categoryName="무대" href="/rooms/room-test" />);

    expect(screen.getByText('LIVE')).toBeInTheDocument();
    expect(screen.getByText('무대')).toBeInTheDocument();
    expect(screen.queryByText('OPENING')).not.toBeInTheDocument();
  });
});

function buildRoom(overrides: Partial<RallyRoom> = {}): RallyRoom {
  return {
    id: 'room-test',
    slug: 'room-test',
    title: '테스트 응원방',
    voteTitle: '테스트 대표 투표',
    topic: '테스트 투표 설명',
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
      label: 'OPENING',
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
