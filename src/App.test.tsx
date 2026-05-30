import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('RallyRoom app shell', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders a discovery home with featured votes, categories, and a broad card gallery', () => {
    render(<App />);

    const banner = screen.getByRole('banner');
    const primaryNav = screen.getByRole('navigation', { name: '주요 화면' });

    expect(banner).toHaveTextContent('RallyRoom');
    expect(banner).toHaveTextContent('Fan Vote Discovery');
    expect(screen.getByText('팬이 만드는 투표의 공간')).toBeInTheDocument();
    expect(screen.getByAltText('RallyRoom 팬 투표 커뮤니티')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: '지금 뜨는 팬 투표를 직접 만들어보세요' })).toBeInTheDocument();
    expect(primaryNav).toBeInTheDocument();
    expect(within(banner).getByRole('link', { name: '내 프로필' })).toBeInTheDocument();
    expect(within(banner).getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
    expect(banner).toHaveTextContent('투표권 3장');
    expect(within(banner).queryByRole('link', { name: '투표방 만들기' })).not.toBeInTheDocument();
    expect(screen.getByRole('region', { name: 'Featured 투표' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '카테고리 탐색' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '전체' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('button', { name: '게임' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '마감순' })).toBeInTheDocument();
    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });
    expect(within(gallery).getAllByRole('article', { name: /카드/ }).length).toBeGreaterThanOrEqual(12);
    expect(screen.getByRole('region', { name: '마감 임박 투표' })).toBeInTheDocument();
    expect(screen.queryByText('Fan-led micro rally rooms')).not.toBeInTheDocument();
    expect(screen.queryByText('Fan Ops Board')).not.toBeInTheDocument();
  });

  it('toggles between login and logout controls in the account area', async () => {
    const user = userEvent.setup();
    render(<App />);

    const banner = screen.getByRole('banner');

    await user.click(within(banner).getByRole('button', { name: '로그아웃' }));

    expect(within(banner).getByRole('button', { name: '로그인' })).toBeInTheDocument();
    expect(within(banner).queryByRole('link', { name: '내 프로필' })).not.toBeInTheDocument();

    await user.click(within(banner).getByRole('button', { name: '로그인' }));

    expect(within(banner).getByRole('link', { name: '내 프로필' })).toBeInTheDocument();
    expect(within(banner).getByRole('button', { name: '로그아웃' })).toBeInTheDocument();
  });

  it('keeps hash-only skip links out of the SPA router', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: '본문으로 건너뛰기' }));

    expect(screen.getByRole('heading', { name: '지금 뜨는 팬 투표를 직접 만들어보세요' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: '페이지를 찾을 수 없어요' })).not.toBeInTheDocument();
    expect(window.location.hash).toBe('#main-content');
  });

  it('filters the home gallery by category chips', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '게임' }));

    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });

    expect(screen.getByRole('button', { name: '게임' })).toHaveAttribute('aria-pressed', 'true');
    expect(within(gallery).getByText('응원방 · 픽셀 리그 시즌 투표 결과')).toBeInTheDocument();
    expect(within(gallery).queryByText('은하 무대 오프닝 투표방')).not.toBeInTheDocument();
  });

  it('sorts the home gallery without changing the selected category', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '마감순' }));

    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });
    const cards = within(gallery).getAllByRole('article', { name: /카드/ });

    expect(screen.getByRole('button', { name: '마감순' })).toHaveAttribute('aria-pressed', 'true');
    expect(cards[0]).toHaveTextContent('은하 무대 오프닝 투표방');
  });

  it('navigates to room creation from the hero CTA', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(within(screen.getByRole('region', { name: 'Featured 투표' })).getByRole('link', { name: '투표방 만들기' }));

    expect(screen.getByRole('heading', { name: '새 투표방 열기' })).toBeInTheDocument();
    expect(screen.getByText(/공식 제휴나 전달 보장을 암시하지 않도록/)).toBeInTheDocument();
  });

  it('builds a safe create-room command intent from the room creation form', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(within(screen.getByRole('region', { name: 'Featured 투표' })).getByRole('link', { name: '투표방 만들기' }));

    await user.clear(screen.getByRole('textbox', { name: '방 이름' }));
    await user.type(screen.getByRole('textbox', { name: '방 이름' }), '팬이 고르는 오프닝 명장면');
    await user.clear(screen.getByRole('textbox', { name: '투표 제목' }));
    await user.type(screen.getByRole('textbox', { name: '투표 제목' }), '가장 다시 보고 싶은 오프닝은?');
    await user.clear(screen.getByRole('textbox', { name: '투표 주제' }));
    await user.type(screen.getByRole('textbox', { name: '투표 주제' }), '공식 전달 없이 팬 기록으로 남기는 장면 투표');

    await user.click(screen.getByRole('button', { name: '후보 4 삭제' }));
    await user.type(screen.getByRole('textbox', { name: '새 후보 항목' }), '암전 후 첫 조명');
    await user.click(screen.getByRole('button', { name: '후보 항목 추가 - 투표권 1장 또는 120 RP' }));
    await user.click(screen.getByRole('button', { name: '생성 intent 만들기' }));

    const preview = screen.getByRole('region', { name: '생성 command preview' });
    const receipt = screen.getByRole('region', { name: '생성 요청 receipt' });

    expect(within(preview).getByText('create-room')).toBeInTheDocument();
    expect(within(preview).getByText(/팬이 고르는 오프닝 명장면/)).toBeInTheDocument();
    expect(within(preview).getByText(/암전 후 첫 조명/)).toBeInTheDocument();
    expect(within(preview).queryByText(/vote_count/)).not.toBeInTheDocument();
    expect(within(preview).queryByText(/current_goal_value/)).not.toBeInTheDocument();
    expect(within(preview).queryByText(/reward_rp/)).not.toBeInTheDocument();
    expect(within(preview).queryByText(/total_rp/)).not.toBeInTheDocument();
    expect(within(receipt).getByText('생성 요청 접수')).toBeInTheDocument();
    expect(within(receipt).getByText('pending_review')).toBeInTheDocument();
    expect(within(receipt).getByText(/실제 DB 생성 없이 서버 응답 예시만 보여줘요/)).toBeInTheDocument();
    expect(within(receipt).getByRole('link', { name: '홈 피드로 돌아가기' })).toHaveAttribute('href', '/');
    expect(within(receipt).getByRole('link', { name: '내 활동에서 만든 방 확인' })).toHaveAttribute('href', '/profile');
    expect(within(receipt).getByRole('link', { name: '데모 방 상세 보기' })).toHaveAttribute(
      'href',
      '/rooms/room-stage-opening'
    );
    expect(JSON.stringify(receipt.textContent)).not.toContain('voteCount');
    expect(JSON.stringify(receipt.textContent)).not.toContain('totalRp');
  });

  it('shows creation validation errors for officiality phrases and too few candidates', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(within(screen.getByRole('region', { name: 'Featured 투표' })).getByRole('link', { name: '투표방 만들기' }));

    await user.clear(screen.getByRole('textbox', { name: '투표 주제' }));
    await user.type(screen.getByRole('textbox', { name: '투표 주제' }), '공식 인증 후 소속사 전달 보장');
    await user.click(screen.getByRole('button', { name: '후보 4 삭제' }));
    await user.click(screen.getByRole('button', { name: '후보 3 삭제' }));
    await user.click(screen.getByRole('button', { name: '후보 2 삭제' }));
    await user.click(screen.getByRole('button', { name: '생성 intent 만들기' }));

    expect(screen.getByRole('alert')).toHaveTextContent('공식');
    expect(screen.getByRole('alert')).toHaveTextContent('전달 보장');
    expect(screen.getByRole('alert')).toHaveTextContent('투표 항목은 최소 2개 이상 필요해요.');
    expect(screen.queryByRole('region', { name: '생성 요청 receipt' })).not.toBeInTheDocument();
  });

  it('opens a room detail page and gates an unpublished result card route', async () => {
    const user = userEvent.setup();
    render(<App />);

    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });

    await user.click(within(gallery).getByRole('link', { name: /은하 무대 오프닝/ }));

    expect(screen.getByRole('heading', { name: '은하 무대 오프닝 투표방' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '투표 현황' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '팬월' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '결과 카드 보기' }));

    expect(screen.getByRole('heading', { name: '결과 카드 준비 중' })).toBeInTheDocument();
    expect(screen.getByText(/은하 무대 오프닝 투표방/)).toBeInTheDocument();
    expect(screen.queryByText('첫 장면 스포트라이트')).not.toBeInTheDocument();
    expect(screen.queryByText('오프닝 장면이 오래 기억될 수 있게 같이 밀어보자.')).not.toBeInTheDocument();
  });

  it('submits a vote option command intent without mutating trusted read model state', async () => {
    const user = userEvent.setup();
    render(<App />);

    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });
    await user.click(within(gallery).getByRole('link', { name: /은하 무대 오프닝/ }));

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const optionComposer = screen.getByRole('region', { name: '투표 항목 추가' });

    expect(within(optionComposer).getByText('보유 투표권 3장')).toBeInTheDocument();

    await user.type(within(optionComposer).getByRole('textbox', { name: '새 투표 항목' }), '레이저 엔딩 하트');
    await user.click(within(optionComposer).getByRole('button', { name: '투표 항목 추가 - 투표권 1장' }));

    expect(within(votePanel).queryByText('레이저 엔딩 하트')).not.toBeInTheDocument();
    expect(within(optionComposer).getByText('보유 투표권 3장')).toBeInTheDocument();
    expect(screen.getByRole('banner')).toHaveTextContent('투표권 3장');
    expect(within(optionComposer).getByText(/후보 추가 요청을 만들었어요/)).toBeInTheDocument();
    expect(within(optionComposer).getByText(/레이저 엔딩 하트/)).toBeInTheDocument();
  });

  it('completes a room mission and shows rewards from the command response', async () => {
    const user = userEvent.setup();
    render(<App />);

    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });
    await user.click(within(gallery).getByRole('link', { name: /은하 무대 오프닝/ }));

    const missionPanel = screen.getByRole('region', { name: '참여 미션' });
    const missionCard = within(missionPanel).getByRole('article', { name: '오늘의 투표권 사용하기' });

    await user.click(within(missionCard).getByRole('button', { name: '미션 완료' }));

    expect(await within(missionCard).findByRole('status')).toHaveTextContent('+30 RP');
    expect(within(missionCard).getByRole('status')).toHaveTextContent('Energy +25');
    expect(within(missionCard).getByRole('button', { name: '완료됨' })).toBeDisabled();
  });

  it('posts a fan wall message from room detail and shows command rewards', async () => {
    const user = userEvent.setup();
    render(<App />);

    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });
    await user.click(within(gallery).getByRole('link', { name: /은하 무대 오프닝/ }));

    const fanWall = screen.getByRole('region', { name: '팬월' });

    await user.click(within(fanWall).getByRole('radio', { name: '질문' }));
    await user.type(within(fanWall).getByRole('textbox', { name: '메시지 내용' }), '다음 투표는 엔딩곡도 하면 좋겠어요');
    await user.click(within(fanWall).getByRole('button', { name: '메시지 남기기' }));

    expect(await within(fanWall).findByText('다음 투표는 엔딩곡도 하면 좋겠어요')).toBeInTheDocument();
    expect(within(fanWall).getByRole('status')).toHaveTextContent('+10 RP');
    expect(within(fanWall).getByRole('status')).toHaveTextContent('Energy +3');
  });

  it('keeps voting disabled when a published result room is opened as a detail page', () => {
    window.history.pushState({}, '', '/rooms/room-pixel-season');

    render(<App />);

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    expect(within(votePanel).getByText('결과가 공개된 방은 투표가 종료됐어요.')).toBeInTheDocument();
    expect(within(votePanel).getByRole('button', { name: '투표 종료' })).toBeDisabled();
    expect(within(votePanel).getAllByRole('radio').every((radio) => radio.hasAttribute('disabled'))).toBe(true);
  });

  it('renders a published result card only for published rooms', () => {
    window.history.pushState({}, '', '/rooms/room-pixel-season/result');

    render(<App />);

    expect(screen.getByRole('heading', { name: '결과 카드' })).toBeInTheDocument();
    expect(screen.getByText('픽셀 리그 시즌 투표 결과')).toBeInTheDocument();
    expect(screen.getByText('역전승 하이라이트')).toBeInTheDocument();
  });

  it('lets a room owner request result card publishing for a closed unpublished room', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/rooms/room-closed-finale/result');

    render(<App />);

    const publishPanel = screen.getByRole('region', { name: '결과 카드 발행' });

    expect(screen.getByRole('heading', { name: '결과 카드 준비 중' })).toBeInTheDocument();
    expect(within(publishPanel).getByText('종료된 결승 장면 투표')).toBeInTheDocument();

    await user.click(within(publishPanel).getByRole('button', { name: '결과 카드 발행' }));

    expect(await within(publishPanel).findByRole('status')).toHaveTextContent('결과 카드 발행 요청 완료');
    expect(within(publishPanel).getByRole('link', { name: '발행된 결과 카드로 이동' })).toHaveAttribute(
      'href',
      '/rooms/room-closed-finale/result'
    );
  });

  it('routes to profile, crew dashboard, and pricing pages from navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    const primaryNav = screen.getByRole('navigation', { name: '주요 화면' });

    await user.click(within(primaryNav).getByRole('link', { name: '내 활동' }));
    expect(screen.getByRole('heading', { name: '내 활동' })).toBeInTheDocument();

    await user.click(within(primaryNav).getByRole('link', { name: 'Crew' }));
    expect(screen.getByRole('heading', { name: 'Crew 대시보드' })).toBeInTheDocument();

    await user.click(within(primaryNav).getByRole('link', { name: '요금제' }));
    expect(screen.getByRole('heading', { name: '요금제' })).toBeInTheDocument();
  });

  it('renders a safe fallback for unknown routes', () => {
    window.history.pushState({}, '', '/missing-page');

    render(<App />);

    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없어요' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈으로 돌아가기' })).toHaveAttribute('href', '/');
  });
});
