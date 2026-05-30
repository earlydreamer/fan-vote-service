import type { Category, CrewRoomStat, CrewStatsReadModel } from '../../shared/types/rallyroom';

interface CrewDashboardOptions {
  hasAccess?: boolean;
}

export type CrewDashboardViewModel = CrewDashboardGrantedViewModel | CrewDashboardDeniedViewModel;

export interface CrewDashboardDeniedViewModel {
  access: 'denied';
  reason: string;
}

export interface CrewDashboardGrantedViewModel {
  access: 'granted';
  summary: {
    totalRooms: number;
    activeRooms: number;
    totalParticipants: number;
    averageMissionCompletionRate: number;
    strongestCategoryName: string;
  };
  roomCards: CrewRoomStat[];
  nextMissionSuggestion: string;
}

export function buildCrewDashboardViewModel(
  crewStats: CrewStatsReadModel,
  categories: readonly Category[],
  options: CrewDashboardOptions = {}
): CrewDashboardViewModel {
  if (options.hasAccess === false) {
    return {
      access: 'denied',
      reason: '운영자 권한이 있는 계정에서만 Crew 대시보드를 볼 수 있어요.'
    };
  }

  return {
    access: 'granted',
    summary: {
      totalRooms: crewStats.totalRooms,
      activeRooms: crewStats.activeRooms,
      totalParticipants: crewStats.totalParticipants,
      averageMissionCompletionRate: crewStats.averageMissionCompletionRate,
      strongestCategoryName: categories.find((category) => category.id === crewStats.strongestCategoryId)?.name ?? '미분류'
    },
    roomCards: crewStats.roomStats.map((room) => ({
      roomId: room.roomId,
      title: room.title,
      participantCount: room.participantCount,
      voteCount: room.voteCount,
      missionCompletionRate: room.missionCompletionRate,
      messageCount: room.messageCount
    })),
    nextMissionSuggestion: crewStats.nextMissionSuggestion
  };
}
