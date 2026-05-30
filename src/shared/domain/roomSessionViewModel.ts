import type { Candidate, PollFormat, ProfileReadModel, RallyRoom, RoomStatus } from '../types/rallyroom';
import { getVoteTitle } from './roomDisplay';

export type ViewerRole = 'guest' | 'participant' | 'owner';

export interface RoomSpaceViewModel {
  id: string;
  slug: string;
  title: string;
  topic: string;
  categoryId: string;
  tags: string[];
  status: RoomStatus;
}

export interface CurrentVoteViewModel {
  id: string;
  title: string;
  status: RoomStatus;
  format: PollFormat;
  participantCount: number;
  candidates: Candidate[];
  energy: {
    current: number;
    goal: number;
    remaining: number;
  };
}

export interface VoteHistorySummaryViewModel {
  id: string;
  title: string;
  status: RoomStatus;
  winnerCandidateId: string;
  participantCount: number;
  publishedAt?: string;
}

export interface RoomSessionViewModel {
  room: RoomSpaceViewModel;
  currentVote: CurrentVoteViewModel;
  voteHistory: VoteHistorySummaryViewModel[];
  viewerRole: ViewerRole;
}

export function createRoomSessionViewModel(room: RallyRoom, profile?: ProfileReadModel): RoomSessionViewModel {
  const voteTitle = getVoteTitle(room);
  const currentEnergy = Math.min(room.currentGoalValue, room.goalValue);

  return {
    room: {
      id: room.id,
      slug: room.slug,
      title: room.title,
      topic: room.topic,
      categoryId: room.categoryId,
      tags: room.tags,
      status: room.status
    },
    currentVote: {
      id: `${room.id}:current`,
      title: voteTitle,
      status: room.status,
      format: room.pollFormat,
      participantCount: room.participantCount,
      candidates: room.candidates,
      energy: {
        current: currentEnergy,
        goal: room.goalValue,
        remaining: Math.max(room.goalValue - currentEnergy, 0)
      }
    },
    voteHistory: createVoteHistory(room, voteTitle),
    viewerRole: resolveViewerRole(room.id, profile)
  };
}

function createVoteHistory(room: RallyRoom, voteTitle: string): VoteHistorySummaryViewModel[] {
  if (room.status !== 'result_published') return [];

  return [
    {
      id: `${room.id}:result`,
      title: voteTitle,
      status: room.status,
      winnerCandidateId: room.resultCard.winnerCandidateId,
      participantCount: room.resultCard.totalParticipants,
      publishedAt: room.resultCard.publishedAt
    }
  ];
}

function resolveViewerRole(roomId: string, profile?: ProfileReadModel): ViewerRole {
  if (!profile) return 'guest';
  if (profile.createdRoomIds.includes(roomId)) return 'owner';
  if (profile.joinedRoomIds.includes(roomId)) return 'participant';
  return 'guest';
}
