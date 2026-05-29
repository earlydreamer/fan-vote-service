import { Clock3, UsersRound } from 'lucide-react';
import type { Category, RallyRoom } from '../types/rallyroom';
import { ProgressMeter } from './ProgressMeter';

interface RoomCardProps {
  room: RallyRoom;
  category?: Category;
  compact?: boolean;
}

export function RoomCard({ room, category, compact = false }: RoomCardProps) {
  return (
    <article className="room-card" data-category={category?.colorToken ?? 'primary'}>
      <div className="room-card__strip" aria-hidden="true" />
      <div className="room-card__body">
        <div className="room-card__meta">
          <span className="chip">{category?.name ?? '응원방'}</span>
          <span className="chip chip-energy">{formatDday(room.endAt)}</span>
        </div>
        <h3>
          <a href={`/rooms/${room.id}`}>{room.title}</a>
        </h3>
        {!compact && <p>{room.topic}</p>}
        <ProgressMeter label="Room Energy" value={room.currentGoalValue} max={room.goalValue} />
        <div className="room-card__stats">
          <span>
            <UsersRound size={16} aria-hidden="true" />
            {room.participantCount.toLocaleString()}명
          </span>
          <span>
            <Clock3 size={16} aria-hidden="true" />
            후보 {room.candidates.length}개
          </span>
        </div>
      </div>
    </article>
  );
}

function formatDday(endAt: string): string {
  const now = new Date();
  const end = new Date(endAt);
  const days = Math.max(calendarDayDiff(end, now), 0);
  return days === 0 ? '오늘 마감' : `D-${days}`;
}

function calendarDayDiff(end: Date, now: Date): number {
  const endDay = new Date(end.getFullYear(), end.getMonth(), end.getDate());
  const nowDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  return Math.round((endDay.getTime() - nowDay.getTime()) / 86_400_000);
}
