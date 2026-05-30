import { describe, expect, it } from 'vitest';
import type { ProfileReadModel, RallyRoom } from '../types/rallyroom';
import { createRoomSessionViewModel } from './roomSessionViewModel';

describe('room session view model', () => {
  it('maps a RallyRoom into a persistent room and current vote hierarchy', () => {
    const viewModel = createRoomSessionViewModel(buildRoom(), buildProfile());

    expect(viewModel.room.title).toBe('스텔라 무대 응원방');
    expect(viewModel.currentVote.title).toBe('최고의 오프닝 장면');
    expect(viewModel.currentVote.energy).toEqual({
      current: 40,
      goal: 100,
      remaining: 60
    });
    expect(viewModel.currentVote.candidates).toHaveLength(2);
    expect(viewModel.voteHistory).toEqual([]);
  });

  it('marks the viewer as owner before participant when they created the room', () => {
    const viewModel = createRoomSessionViewModel(
      buildRoom({ id: 'room-owned' }),
      buildProfile({
        joinedRoomIds: ['room-owned'],
        createdRoomIds: ['room-owned']
      })
    );

    expect(viewModel.viewerRole).toBe('owner');
  });

  it('marks joined viewers as participants and anonymous viewers as guests', () => {
    expect(
      createRoomSessionViewModel(buildRoom({ id: 'room-joined' }), buildProfile({ joinedRoomIds: ['room-joined'] }))
        .viewerRole
    ).toBe('participant');

    expect(createRoomSessionViewModel(buildRoom(), undefined).viewerRole).toBe('guest');
  });

  it('keeps authenticated viewers as participants when they open a new public room', () => {
    const viewModel = createRoomSessionViewModel(
      buildRoom({ id: 'room-new-to-viewer' }),
      buildProfile({
        joinedRoomIds: [],
        createdRoomIds: []
      })
    );

    expect(viewModel.viewerRole).toBe('participant');
  });
});

function buildRoom(overrides: Partial<RallyRoom> = {}): RallyRoom {
  return {
    id: 'room-stage-opening',
    slug: 'room-stage-opening',
    title: '스텔라 무대 응원방',
    voteTitle: '최고의 오프닝 장면',
    topic: '팬들이 다시 보고 싶은 오프닝 무대를 고르는 현재 투표',
    categoryId: 'cat-stage',
    primaryTargetId: 'target-stage',
    createdAt: '2026-05-29T00:00:00.000Z',
    status: 'active',
    visibility: 'public',
    endAt: '2026-05-31T14:59:00.000Z',
    pollFormat: 'scene',
    tags: ['오프닝', '무대'],
    thumbnail: {
      tone: 'stage',
      label: 'OPENING',
      accent: '#7C5CFF'
    },
    isFeatured: true,
    addOptionCost: {
      voteTickets: 1,
      rp: 120
    },
    goalValue: 100,
    currentGoalValue: 40,
    participantCount: 520,
    candidates: [
      {
        id: 'candidate-1',
        targetId: 'target-stage',
        title: '첫 번째 오프닝',
        status: 'approved',
        voteCount: 120
      },
      {
        id: 'candidate-2',
        targetId: 'target-stage',
        title: '두 번째 오프닝',
        status: 'approved',
        voteCount: 90
      }
    ],
    missions: [],
    messages: [],
    resultCard: {
      winnerCandidateId: 'candidate-1',
      totalParticipants: 520,
      topMessage: '다시 봐도 좋아요',
      earnedIcon: '스테이지 배지'
    },
    ...overrides
  };
}

function buildProfile(overrides: Partial<ProfileReadModel> = {}): ProfileReadModel {
  return {
    totalRp: 2400,
    weeklyRp: 400,
    streakDays: 3,
    voteTickets: 5,
    todayVotes: 2,
    followedCategoryIds: ['cat-stage'],
    earnedRewards: [],
    joinedRoomIds: [],
    createdRoomIds: [],
    rewardHistory: [],
    ...overrides
  };
}
