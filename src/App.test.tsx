import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('RallyRoom app shell', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders an app dashboard instead of a landing hero', () => {
    render(<App />);

    expect(screen.getByRole('banner')).toHaveTextContent('RallyRoom');
    expect(screen.getByRole('heading', { name: '오늘의 응원방 보드' })).toBeInTheDocument();
    expect(screen.getByRole('navigation', { name: '주요 화면' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '응원방 만들기' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '진행 중인 응원방' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '마감 임박' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '오늘의 미션' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '내 RP' })).toBeInTheDocument();
    expect(screen.queryByText('Fan-led micro rally rooms')).not.toBeInTheDocument();
  });

  it('navigates to room creation from the global CTA', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: '응원방 만들기' }));

    expect(screen.getByRole('heading', { name: '새 응원방 열기' })).toBeInTheDocument();
    expect(screen.getByText(/공식 제휴나 전달 보장을 암시하지 않도록/)).toBeInTheDocument();
  });

  it('opens a room detail page and its result card route', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: /은하 무대 오프닝 응원방/ }));

    expect(screen.getByRole('heading', { name: '은하 무대 오프닝 응원방' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '투표 현황' })).toBeInTheDocument();
    expect(screen.getByRole('region', { name: '팬월' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '결과 카드 보기' }));

    expect(screen.getByRole('heading', { name: '결과 카드' })).toBeInTheDocument();
    expect(screen.getByText('은하 무대 오프닝 응원방')).toBeInTheDocument();
  });

  it('routes to profile, crew dashboard, and pricing pages from navigation', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('link', { name: '내 활동' }));
    expect(screen.getByRole('heading', { name: '내 활동' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: 'Crew' }));
    expect(screen.getByRole('heading', { name: 'Crew 대시보드' })).toBeInTheDocument();

    await user.click(screen.getByRole('link', { name: '요금제' }));
    expect(screen.getByRole('heading', { name: '요금제' })).toBeInTheDocument();
  });

  it('renders a safe fallback for unknown routes', () => {
    window.history.pushState({}, '', '/missing-page');

    render(<App />);

    expect(screen.getByRole('heading', { name: '페이지를 찾을 수 없어요' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: '홈으로 돌아가기' })).toHaveAttribute('href', '/');
  });
});
