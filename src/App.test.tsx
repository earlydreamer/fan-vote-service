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
    expect(within(banner).getByRole('link', { name: '투표방 만들기' })).toBeInTheDocument();
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

  it('navigates to room creation from the global CTA', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(within(screen.getByRole('banner')).getByRole('link', { name: '투표방 만들기' }));

    expect(screen.getByRole('heading', { name: '새 투표방 열기' })).toBeInTheDocument();
    expect(screen.getByText(/공식 제휴나 전달 보장을 암시하지 않도록/)).toBeInTheDocument();
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

  it('lets a user add a vote option by spending a vote ticket on the room detail page', async () => {
    const user = userEvent.setup();
    render(<App />);

    const gallery = screen.getByRole('region', { name: '인기 투표 갤러리' });
    await user.click(within(gallery).getByRole('link', { name: /은하 무대 오프닝/ }));

    const optionComposer = screen.getByRole('region', { name: '투표 항목 추가' });

    expect(within(optionComposer).getByText('보유 투표권 3장')).toBeInTheDocument();

    await user.type(within(optionComposer).getByRole('textbox', { name: '새 투표 항목' }), '레이저 엔딩 하트');
    await user.click(within(optionComposer).getByRole('button', { name: '투표 항목 추가 - 투표권 1장' }));

    expect(screen.getByText('레이저 엔딩 하트')).toBeInTheDocument();
    expect(within(optionComposer).getByText('보유 투표권 2장')).toBeInTheDocument();
    expect(within(optionComposer).getByText(/추가 항목은 검수 대기 상태/)).toBeInTheDocument();
  });

  it('renders a published result card only for published rooms', () => {
    window.history.pushState({}, '', '/rooms/room-pixel-season/result');

    render(<App />);

    expect(screen.getByRole('heading', { name: '결과 카드' })).toBeInTheDocument();
    expect(screen.getByText('픽셀 리그 시즌 투표 결과')).toBeInTheDocument();
    expect(screen.getByText('역전승 하이라이트')).toBeInTheDocument();
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
