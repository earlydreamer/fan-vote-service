import { type CSSProperties } from 'react';
import type { CategoryTone, RallyRoom } from '../types/rallyroom';

const ROOM_VISUAL_ASSETS = [
  'https://cdn.vibe-x.app/apps/871a45296be42693e004065f/assets/original/feature-1-dc59fb6f-4c07-490c-b308-9efb11daa17a.png',
  'https://cdn.vibe-x.app/apps/871a45296be42693e004065f/assets/original/feature-2-a4b50744-1afb-491f-a97c-67a105f47849.png',
  'https://cdn.vibe-x.app/apps/871a45296be42693e004065f/assets/original/feature-3-307284d5-8ca5-49f1-8542-f0e7d1de6bd1.png',
  'https://cdn.vibe-x.app/apps/871a45296be42693e004065f/assets/original/feature-4-63a8efb9-3ff9-4a78-89e9-5b3964781cdd.png'
] as const;

interface RoomThumbnailProps {
  room: RallyRoom;
  categoryName?: string;
  href?: string;
  className?: string;
  decorativeLink?: boolean;
}

export function RoomThumbnail({ room, categoryName = '투표방', href, className, decorativeLink = false }: RoomThumbnailProps) {
  const thumbnailStyle = {
    '--thumb-accent': room.thumbnail.accent
  } as CSSProperties;
  const classNames = ['room-thumbnail', className].filter(Boolean).join(' ');
  const content = (
    <>
      <img src={getRoomVisualAsset(room.id)} alt="" loading="lazy" decoding="async" />
      <span className="room-thumbnail__status">{formatRoomStatus(room)}</span>
      <span className="room-thumbnail__category" data-tone={room.thumbnail.tone}>
        {categoryName}
      </span>
    </>
  );

  if (href) {
    return (
      <a
        className={classNames}
        href={href}
        style={thumbnailStyle}
        aria-hidden={decorativeLink}
        aria-label={decorativeLink ? undefined : `${room.title} 썸네일`}
        tabIndex={decorativeLink ? -1 : undefined}
      >
        {content}
      </a>
    );
  }

  return (
    <div className={classNames} style={thumbnailStyle} aria-label={`${room.title} 썸네일`}>
      {content}
    </div>
  );
}

function getRoomVisualAsset(roomId: string): string {
  const hash = Array.from(roomId).reduce((sum, character) => sum + character.charCodeAt(0), 0);
  return ROOM_VISUAL_ASSETS[hash % ROOM_VISUAL_ASSETS.length] ?? ROOM_VISUAL_ASSETS[0];
}

function formatRoomStatus(room: RallyRoom): string {
  if (room.status === 'result_published') return 'RESULT';
  if (room.status === 'closed') return 'CLOSED';
  return 'LIVE';
}

export function getRoomToneLabel(tone: CategoryTone): string {
  const labels: Record<CategoryTone, string> = {
    stage: '무대',
    story: '스토리',
    game: '게임',
    sports: '스포츠',
    character: '캐릭터',
    meme: '밈',
    anime: '애니',
    music: '음악',
    food: '푸드',
    fashion: '패션',
    creator: '크리에이터',
    free: '자유'
  };

  return labels[tone];
}
