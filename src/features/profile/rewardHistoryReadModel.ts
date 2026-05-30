import type { ProfileReadModel, RallyRoom, RewardHistoryEntry } from '../../shared/types/rallyroom';

export interface ProfileRewardHistoryViewModel {
  summary: {
    totalRp: number;
    weeklyRp: number;
    voteTickets: number;
    streakDays: number;
    todayVotes: number;
    joinedRoomCount: number;
    createdRoomCount: number;
    earnedRewardCount: number;
  };
  earnedRewards: string[];
  rewardHistory: ProfileRewardHistoryItem[];
  joinedRooms: RallyRoom[];
  ongoingJoinedRooms: RallyRoom[];
  completedVoteRooms: RallyRoom[];
  createdRooms: RallyRoom[];
}

export interface ProfileRewardHistoryItem extends RewardHistoryEntry {
  roomTitle?: string;
}

export function buildProfileRewardHistory(
  profile: ProfileReadModel | null | undefined,
  rooms: readonly RallyRoom[]
): ProfileRewardHistoryViewModel | null {
  if (!profile) return null;

  const roomById = new Map(rooms.map((room) => [room.id, room]));
  const joinedRooms = mapRooms(profile.joinedRoomIds, roomById);
  const createdRooms = mapRooms(profile.createdRoomIds, roomById);
  const completedVoteRoomIds = new Set([
    ...profile.joinedRoomIds,
    ...profile.createdRoomIds,
    ...profile.rewardHistory.flatMap((reward) => (reward.roomId ? [reward.roomId] : []))
  ]);
  const completedVoteRooms = rooms.filter(
    (room) => room.status === 'result_published' && completedVoteRoomIds.has(room.id)
  );

  return {
    summary: {
      totalRp: profile.totalRp,
      weeklyRp: profile.weeklyRp,
      voteTickets: profile.voteTickets,
      streakDays: profile.streakDays,
      todayVotes: profile.todayVotes,
      joinedRoomCount: joinedRooms.length,
      createdRoomCount: createdRooms.length,
      earnedRewardCount: profile.earnedRewards.length
    },
    earnedRewards: [...profile.earnedRewards],
    rewardHistory: profile.rewardHistory
      .map((reward) => ({
        ...reward,
        roomTitle: reward.roomId ? roomById.get(reward.roomId)?.title : undefined
      }))
      .sort((left, right) => new Date(right.earnedAt).getTime() - new Date(left.earnedAt).getTime()),
    joinedRooms,
    ongoingJoinedRooms: joinedRooms.filter((room) => room.status === 'active'),
    completedVoteRooms,
    createdRooms
  };
}

function mapRooms(roomIds: readonly string[], roomById: ReadonlyMap<string, RallyRoom>): RallyRoom[] {
  return roomIds.flatMap((roomId) => {
    const room = roomById.get(roomId);

    return room ? [room] : [];
  });
}
