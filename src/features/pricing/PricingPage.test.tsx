import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { PricingPage } from './PricingPage';

describe('PricingPage', () => {
  it('shows selectable fan packages and loop CTAs', () => {
    render(<PricingPage />);

    expect(screen.getByRole('heading', { name: '요금제' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Plus 시작하기' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '투표권 팩 선택' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Crew 문의하기' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '투표방 만들기' })).toHaveAttribute('href', '/rooms/new');
    expect(screen.getByRole('link', { name: '내 활동에서 보상 확인' })).toHaveAttribute('href', '/profile');
  });

  it('shows a checkout command intent preview for a paid Plus selection', async () => {
    const user = userEvent.setup();
    render(<PricingPage />);

    await user.click(screen.getByRole('button', { name: 'Plus 시작하기' }));

    const preview = screen.getByRole('region', { name: '결제 준비 내용' });

    expect(within(preview).getByText('create-checkout-session')).toBeInTheDocument();
    expect(within(preview).getByText(/plus-monthly/)).toBeInTheDocument();
    expect(within(preview).getByText(/실제 결제는 아직 실행하지 않아요/)).toBeInTheDocument();
    expect(preview).not.toHaveTextContent('totalRp');
    expect(preview).not.toHaveTextContent('voteTickets');
    expect(preview).not.toHaveTextContent('rewardRp');
  });

  it('routes Crew selection into a partnership inquiry intent', async () => {
    const user = userEvent.setup();
    render(<PricingPage />);

    await user.click(screen.getByRole('button', { name: 'Crew 문의하기' }));

    const preview = screen.getByRole('region', { name: '결제 준비 내용' });

    expect(within(preview).getByText('request-crew-partnership')).toBeInTheDocument();
    expect(within(preview).getByText(/official-account-review/)).toBeInTheDocument();
    expect(within(preview).getByText(/공식 계정 검토 문의/)).toBeInTheDocument();
  });
});
