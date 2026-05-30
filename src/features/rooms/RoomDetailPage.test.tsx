import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { RoomDetailPage } from './RoomDetailPage';

describe('RoomDetailPage', () => {
  it('uses tabs for vote, fan wall, missions, and result history', async () => {
    const user = userEvent.setup();

    render(<RoomDetailPage roomId="room-stage-opening" />);

    const tablist = screen.getByRole('tablist', { name: '투표방 상세 탭' });

    expect(within(tablist).getByRole('tab', { name: '현재 투표' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('region', { name: '투표 현황' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '팬월' })).not.toBeInTheDocument();

    await user.click(within(tablist).getByRole('tab', { name: '팬월' }));

    expect(within(tablist).getByRole('tab', { name: '팬월' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('region', { name: '팬월' })).toBeInTheDocument();
    expect(screen.queryByRole('region', { name: '투표 현황' })).not.toBeInTheDocument();
  });

  it('shows owner affordances when the viewer created the room', () => {
    render(<RoomDetailPage roomId="room-stage-opening" />);

    expect(screen.getByText('방장')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '방 관리' })).toBeInTheDocument();
  });

  it('shows a login CTA instead of owner controls for guest viewers', () => {
    render(<RoomDetailPage roomId="room-stage-opening" viewerProfile={null} />);

    expect(screen.queryByText('방장')).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: '방 관리' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: '로그인하고 투표 참여하기' })).toHaveAttribute('href', '/login');
  });
});
