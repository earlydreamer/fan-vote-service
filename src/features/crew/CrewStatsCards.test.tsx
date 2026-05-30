import { render, screen, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { CrewDashboardViewModel } from './crewStatsReadModel';
import { CrewStatsCards } from './CrewStatsCards';

const viewModel: CrewDashboardViewModel = {
  access: 'granted',
  summary: {
    totalRooms: 26,
    activeRooms: 18,
    totalParticipants: 15104,
    averageMissionCompletionRate: 68,
    strongestCategoryName: '무대'
  },
  roomCards: [
    {
      roomId: 'room-stage-opening',
      title: '은하 무대 오프닝 투표방',
      participantCount: 1368,
      voteCount: 3175,
      missionCompletionRate: 76,
      messageCount: 184
    }
  ],
  nextMissionSuggestion: '팬월 메시지 미션을 노출해 결과 카드 재료를 모으세요.'
};

describe('CrewStatsCards', () => {
  it('renders aggregate metrics and room performance cards', () => {
    render(<CrewStatsCards viewModel={viewModel} />);

    expect(screen.getByRole('region', { name: 'Crew 요약 지표' })).toHaveTextContent('15,104');
    expect(screen.getByText('무대')).toBeInTheDocument();

    const performanceCard = screen.getByRole('article', { name: '은하 무대 오프닝 투표방 성과' });
    expect(within(performanceCard).getByText('3,175표')).toBeInTheDocument();
    expect(within(performanceCard).getByText('메시지 184개')).toBeInTheDocument();
    expect(within(performanceCard).getByText('미션 76%')).toBeInTheDocument();
    expect(screen.getByText('팬월 메시지 미션을 노출해 결과 카드 재료를 모으세요.')).toBeInTheDocument();
  });

  it('renders an access restricted state', () => {
    render(
      <CrewStatsCards
        viewModel={{
          access: 'denied',
          reason: '운영자 권한이 있는 계정에서만 Crew 대시보드를 볼 수 있어요.'
        }}
      />
    );

    expect(screen.getByRole('heading', { name: '운영 권한이 필요해요' })).toBeInTheDocument();
    expect(screen.getByText('운영자 권한이 있는 계정에서만 Crew 대시보드를 볼 수 있어요.')).toBeInTheDocument();
  });
});
