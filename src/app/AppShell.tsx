import { type MouseEvent, useEffect, useState } from 'react';
import { Home, PlusCircle, Ticket, UserRound } from 'lucide-react';
import { Button } from '../shared/ui/Button';
import { AuthPage } from '../features/auth/AuthPage';
import { CrewDashboardPage } from '../features/crew/CrewDashboardPage';
import { HomePage } from '../features/home/HomePage';
import { NotFoundPage } from '../features/not-found/NotFoundPage';
import { PricingPage } from '../features/pricing/PricingPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { ResultCardPage } from '../features/result-cards/ResultCardPage';
import { RoomCreatePage } from '../features/rooms/RoomCreatePage';
import { RoomDetailPage } from '../features/rooms/RoomDetailPage';
import { demoReadRepository } from '../shared/api/demoReadRepository';
import { type AppRoute, matchRoute, primaryNavItems } from './routes';

export function AppShell() {
  const [route, setRoute] = useState<AppRoute>(() => matchRoute(window.location.pathname));
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [profile, setProfile] = useState(() => demoReadRepository.getProfile());

  useEffect(() => {
    const handlePopState = () => {
      setRoute(matchRoute(window.location.pathname));
    };

    const handleProfileUpdate = () => {
      setProfile({ ...demoReadRepository.getProfile() });
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('profile-updated', handleProfileUpdate);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('profile-updated', handleProfileUpdate);
    };
  }, []);

  const navigate = (href: string) => {
    if (href === window.location.pathname) return;
    window.history.pushState({}, '', href);
    setRoute(matchRoute(href));
  };

  const loginWithDemoAccount = () => {
    setIsAuthenticated(true);
    navigate('/profile');
  };

  const handleShellClick = (event: MouseEvent<HTMLDivElement>) => {
    const anchor = (event.target as Element).closest('a[href]');

    if (!(anchor instanceof HTMLAnchorElement)) return;
    if (anchor.target || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;

    const url = new URL(anchor.href);
    if (url.origin !== window.location.origin) return;
    if (url.pathname === window.location.pathname && url.search === window.location.search && url.hash) return;

    event.preventDefault();
    navigate(`${url.pathname}${url.search}${url.hash}`);
  };

  return (
    <div className="app-frame" onClick={handleShellClick}>
      <a className="skip-link" href="#main-content">
        본문으로 건너뛰기
      </a>
      <header className="app-header">
        <a className="brand-mark" href="/" aria-label="PickRally 홈">
          <span className="brand-sigil" aria-hidden="true">
            PR
          </span>
          <span>
            <strong>PickRally</strong>
            <small>Fan Vote Discovery</small>
          </span>
        </a>

        <nav className="primary-nav" aria-label="주요 화면">
          {primaryNavItems.map((item) => (
            <a key={item.href} href={item.href} aria-current={isCurrentRoute(route, item.href) ? 'page' : undefined}>
              {item.label}
            </a>
          ))}
        </nav>

        <div className="account-area">
          {isAuthenticated ? (
            <>
              <a className="account-chip" href="/profile" aria-label="내 프로필">
                <span className="account-chip__wallet">
                  <Ticket size={16} aria-hidden="true" />
                  <span>투표권 {profile.voteTickets}장</span>
                </span>
                <span className="account-chip__rp">{profile.totalRp.toLocaleString()} RP</span>
                <span className="account-avatar" aria-hidden="true">
                  나
                </span>
              </a>
              <Button variant="unstyled" className="auth-button" onClick={() => setIsAuthenticated(false)}>
                로그아웃
              </Button>
            </>
          ) : (
            <a className="auth-button auth-button--primary" href="/login">
              로그인
            </a>
          )}
        </div>
      </header>

      <main id="main-content" className="app-main">
        {renderRoute(route, {
          isAuthenticated,
          onLogin: loginWithDemoAccount
        })}
      </main>

      <nav className="bottom-nav" aria-label="모바일 주요 화면">
        <a href="/">
          <Home size={18} aria-hidden="true" />
          홈
        </a>
        <a href="/rooms/new">
          <PlusCircle size={18} aria-hidden="true" />
          만들기
        </a>
        <a href="/profile">
          <UserRound size={18} aria-hidden="true" />
          내 활동
        </a>
      </nav>
    </div>
  );
}

interface RouteRenderOptions {
  isAuthenticated: boolean;
  onLogin: () => void;
}

function renderRoute(route: AppRoute, options: RouteRenderOptions) {
  const profile = options.isAuthenticated ? demoReadRepository.getProfile() : null;

  switch (route.name) {
    case 'home':
      return <HomePage />;
    case 'roomCreate':
      return <RoomCreatePage />;
    case 'roomDetail':
      return <RoomDetailPage roomId={route.roomId} viewerProfile={profile} />;
    case 'resultCard':
      return <ResultCardPage roomId={route.roomId} />;
    case 'profile':
      return <ProfilePage profile={profile} />;
    case 'auth':
      return <AuthPage onLogin={options.onLogin} />;
    case 'crew':
      return <CrewDashboardPage />;
    case 'pricing':
      return <PricingPage />;
    case 'notFound':
      return <NotFoundPage />;
  }
}

function isCurrentRoute(route: AppRoute, href: string): boolean {
  if (href === '/') return route.name === 'home';
  return route.path === href;
}
