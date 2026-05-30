import { describe, expect, it } from 'vitest';
import type { ProfileReadModel, RallyRoom } from '../../shared/types/rallyroom';
import { buildProfileRewardHistory } from './rewardHistoryReadModel';

const rooms = [
  {
    id: 'joined-room',
    title: '참여한 투표방',
    slug: 'joined-room'
  },
  {
    id: 'created-room',
    title: '내가 만든 투표방',
    slug: 'created-room'
  }
] as RallyRoom[];

const profile: ProfileReadModel = {
  totalRp: 2480,
  weeklyRp: 520,
  streakDays: 5,
  voteTickets: 3,
  todayVotes: 8,
  followedCategoryIds: ['cat-stage'],
  earnedRewards: ['Spotlight Crew', 'Mission Starter'],
  joinedRoomIds: ['joined-room'],
  createdRoomIds: ['created-room'],
  rewardHistory: [
    {
      id: 'old-reward',
      label: '미션 완료 보상',
      earnedAt: '2026-05-28T09:00:00Z',
      rpDelta: 80,
      voteTicketDelta: 0,
      icon: 'Mission Starter',
      reason: 'mission',
      roomId: 'joined-room'
    },
    {
      id: 'new-reward',
      label: '결과 카드 공유 보상',
      earnedAt: '2026-05-29T12:00:00Z',
      rpDelta: 120,
      voteTicketDelta: 1,
      icon: 'Spotlight Crew',
      reason: 'result_card',
      roomId: 'created-room'
    }
  ]
};

describe('buildProfileRewardHistory', () => {
  it('maps profile ids to joined and created rooms with summary stats', () => {
    const viewModel = buildProfileRewardHistory(profile, rooms);

    expect(viewModel).not.toBeNull();
    expect(viewModel?.summary).toMatchObject({
      totalRp: 2480,
      weeklyRp: 520,
      voteTickets: 3,
      streakDays: 5,
      todayVotes: 8,
      joinedRoomCount: 1,
      createdRoomCount: 1,
      earnedRewardCount: 2
    });
    expect(viewModel?.joinedRooms.map((room) => room.title)).toEqual(['참여한 투표방']);
    expect(viewModel?.createdRooms.map((room) => room.title)).toEqual(['내가 만든 투표방']);
  });

  it('sorts reward history newest first and attaches room titles', () => {
    const viewModel = buildProfileRewardHistory(profile, rooms);

    expect(viewModel?.rewardHistory.map((reward) => reward.id)).toEqual(['new-reward', 'old-reward']);
    expect(viewModel?.rewardHistory[0]).toMatchObject({
      label: '결과 카드 공유 보상',
      roomTitle: '내가 만든 투표방',
      rpDelta: 120,
      voteTicketDelta: 1
    });
  });

  it('returns null when profile data is not available', () => {
    expect(buildProfileRewardHistory(null, rooms)).toBeNull();
  });
});
