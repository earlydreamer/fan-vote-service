export type AppRoute =
  | { name: 'home'; path: '/' }
  | { name: 'roomCreate'; path: '/rooms/new' }
  | { name: 'roomDetail'; path: string; roomId: string }
  | { name: 'resultCard'; path: string; roomId: string }
  | { name: 'profile'; path: '/profile' }
  | { name: 'auth'; path: '/login' }
  | { name: 'crew'; path: '/crew' }
  | { name: 'pricing'; path: '/pricing' }
  | { name: 'notFound'; path: string };

export const primaryNavItems = [
  { label: '홈', href: '/' },
  { label: '내 활동', href: '/profile' },
  { label: 'Crew', href: '/crew' },
  { label: '요금제', href: '/pricing' }
] as const;

export function matchRoute(pathname: string): AppRoute {
  const path = normalizePath(pathname);

  if (path === '/') return { name: 'home', path: '/' };
  if (path === '/rooms/new') return { name: 'roomCreate', path: '/rooms/new' };
  if (path === '/profile') return { name: 'profile', path: '/profile' };
  if (path === '/login') return { name: 'auth', path: '/login' };
  if (path === '/crew') return { name: 'crew', path: '/crew' };
  if (path === '/pricing') return { name: 'pricing', path: '/pricing' };

  const resultMatch = path.match(/^\/rooms\/([^/]+)\/result$/);
  if (resultMatch) {
    return { name: 'resultCard', path, roomId: decodeURIComponent(resultMatch[1]) };
  }

  const roomMatch = path.match(/^\/rooms\/([^/]+)$/);
  if (roomMatch) {
    return { name: 'roomDetail', path, roomId: decodeURIComponent(roomMatch[1]) };
  }

  return { name: 'notFound', path };
}

function normalizePath(pathname: string): string {
  if (!pathname || pathname === '/') return '/';
  return pathname.endsWith('/') ? pathname.slice(0, -1) : pathname;
}
