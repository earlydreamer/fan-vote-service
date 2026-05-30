import { describe, expect, it } from 'vitest';
import type { Category, CrewStatsReadModel } from '../../shared/types/rallyroom';
import { buildCrewDashboardViewModel } from './crewStatsReadModel';

const categories: Category[] = [
  {
    id: 'cat-stage',
    name: '무대',
    tone: 'stage',
    colorToken: 'primary',
    isActive: true
  }
];

const crewStats: CrewStatsReadModel = {
  totalRooms: 26,
  activeRooms: 18,
  totalParticipants: 15104,
  averageMissionCompletionRate: 68,
  strongestCategoryId: 'cat-stage',
  nextMissionSuggestion: '팬월 메시지 미션을 노출해 결과 카드 재료를 모으세요.',
  roomStats: [
    {
      roomId: 'room-stage-opening',
      title: '은하 무대 오프닝 투표방',
      participantCount: 1368,
      voteCount: 3175,
      missionCompletionRate: 76,
      messageCount: 184
    }
  ]
};

describe('buildCrewDashboardViewModel', () => {
  it('maps aggregate crew stats without exposing raw event rows', () => {
    const viewModel = buildCrewDashboardViewModel(crewStats, categories);

    expect(viewModel.access).toBe('granted');
    if (viewModel.access !== 'granted') throw new Error('expected granted view model');
    expect(viewModel.summary).toMatchObject({
      totalRooms: 26,
      activeRooms: 18,
      totalParticipants: 15104,
      averageMissionCompletionRate: 68,
      strongestCategoryName: '무대'
    });
    expect(viewModel.roomCards[0]).toMatchObject({
      roomId: 'room-stage-opening',
      title: '은하 무대 오프닝 투표방',
      participantCount: 1368,
      voteCount: 3175,
      missionCompletionRate: 76,
      messageCount: 184
    });
    expect(Object.keys(viewModel.roomCards[0])).not.toContain('events');
  });

  it('returns a restricted view model when access is denied', () => {
    const viewModel = buildCrewDashboardViewModel(crewStats, categories, { hasAccess: false });

    expect(viewModel).toEqual({
      access: 'denied',
      reason: '운영자 권한이 있는 계정에서만 Crew 대시보드를 볼 수 있어요.'
    });
  });
});
