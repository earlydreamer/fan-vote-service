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

  it('lets authenticated viewers vote in public rooms they have not joined yet', () => {
    render(<RoomDetailPage roomId="room-synth-mv" />);

    expect(screen.getByRole('region', { name: '투표 현황' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: '로그인하고 투표 참여하기' })).not.toBeInTheDocument();
  });

  it('keeps voting totals cumulative across repeat submissions', async () => {
    const user = userEvent.setup();

    render(<RoomDetailPage roomId="room-stage-opening" />);

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const optionRadio = within(votePanel).getByRole('radio', { name: /첫 장면 스포트라이트/ });
    const submitButton = within(votePanel).getByRole('button', { name: '투표하기' });
    const selectBox = within(votePanel).getByLabelText('사용할 투표권');

    // 1차 투표: 1표 제출
    await user.click(optionRadio);
    await user.selectOptions(selectBox, '1');
    await user.click(submitButton);

    // 1차 투표 결과 검증
    expect(await within(votePanel).findByText('913표')).toBeInTheDocument();
    expect(within(votePanel).getByText('1,369명 참여')).toBeInTheDocument();
    expect(within(votePanel).getByText('1,841 / 2,200')).toBeInTheDocument();

    // 2차 추가 투표: 2표 제출
    await user.click(optionRadio);
    await user.selectOptions(selectBox, '2');
    await user.click(submitButton);

    // 2차 투표 결과 검증 (누적으로 915표가 되어야 함. 버그가 있다면 최초 912표 기준으로 2표를 가산해 914표가 됨)
    expect(await within(votePanel).findByText('915표')).toBeInTheDocument();
    expect(within(votePanel).getByText('1,370명 참여')).toBeInTheDocument();
    expect(within(votePanel).getByText('1,843 / 2,200')).toBeInTheDocument();
  });
});
