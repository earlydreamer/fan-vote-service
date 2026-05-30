import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import type { ProfileRewardHistoryViewModel } from './rewardHistoryReadModel';
import { ProfileSummary } from './ProfileSummary';

const viewModel: ProfileRewardHistoryViewModel = {
  summary: {
    totalRp: 2480,
    weeklyRp: 520,
    voteTickets: 3,
    streakDays: 5,
    todayVotes: 8,
    joinedRoomCount: 2,
    createdRoomCount: 1,
    earnedRewardCount: 3
  },
  earnedRewards: ['Spotlight Crew', 'Story Maker', 'Mission Starter'],
  rewardHistory: [
    {
      id: 'reward-1',
      label: '결과 카드 공유 보상',
      earnedAt: '2026-05-29T12:00:00Z',
      rpDelta: 120,
      voteTicketDelta: 1,
      icon: 'Spotlight Crew',
      reason: 'result_card',
      roomId: 'room-created',
      roomTitle: '내가 만든 투표방'
    }
  ],
  joinedRooms: [],
  createdRooms: []
};

describe('ProfileSummary', () => {
  it('renders user reward stats and recent reward history', () => {
    render(<ProfileSummary viewModel={viewModel} />);

    expect(screen.getByRole('heading', { name: '내 보상 루프' })).toBeInTheDocument();
    expect(screen.getByText('2,480')).toBeInTheDocument();
    expect(screen.getByText('3장')).toBeInTheDocument();
    expect(screen.getByText('Spotlight Crew')).toBeInTheDocument();
    expect(screen.getByText('결과 카드 공유 보상')).toBeInTheDocument();
    expect(screen.getByText('내가 만든 투표방')).toBeInTheDocument();
  });

  it('shows a login guidance state when profile data is missing', () => {
    render(<ProfileSummary viewModel={null} />);

    expect(screen.getByRole('heading', { name: '로그인이 필요해요' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈 피드로 돌아가기' })).toHaveAttribute('href', '/');
  });
});
