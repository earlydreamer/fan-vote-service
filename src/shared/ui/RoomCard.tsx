import { Clock3, UsersRound } from 'lucide-react';
import type { Category, RallyRoom } from '../types/rallyroom';
import { ProgressMeter } from './ProgressMeter';

const SERVICE_CALENDAR_TIME_ZONE = 'Asia/Seoul';
const SERVICE_DAY_MS = 86_400_000;
const serviceCalendarFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: SERVICE_CALENDAR_TIME_ZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
});

interface RoomCardProps {
  room: RallyRoom;
  category?: Category;
  compact?: boolean;
}

export function RoomCard({ room, category, compact = false }: RoomCardProps) {
  const candidateRanking = [...room.candidates]
    .sort((left, right) => right.voteCount - left.voteCount)
    .slice(0, compact ? 1 : 2);

  return (
    <article className="room-card" data-category={category?.colorToken ?? 'primary'}>
      <div className="room-card__strip" aria-hidden="true" />
      <div className="room-card__body">
        <div className="room-card__meta">
          <span className="chip">{category?.name ?? '투표방'}</span>
          <span className="chip chip-energy">{formatDday(room.endAt)}</span>
        </div>
        <h3>
          <a href={`/rooms/${room.id}`}>{room.title}</a>
        </h3>
        {!compact && <p>{room.topic}</p>}
        {candidateRanking.length > 0 && (
          <ol className="room-card__leaders" aria-label="후보 랭킹 미리보기">
            {candidateRanking.map((candidate, index) => (
              <li key={candidate.id}>
                <span>{index + 1}</span>
                <strong>{candidate.title}</strong>
                <em>{candidate.voteCount.toLocaleString()}표</em>
              </li>
            ))}
          </ol>
        )}
        <ProgressMeter label="Vote Energy" value={room.currentGoalValue} max={room.goalValue} />
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
  const endDay = serviceCalendarDayValue(end);
  const nowDay = serviceCalendarDayValue(now);

  return Math.round((endDay - nowDay) / SERVICE_DAY_MS);
}

function serviceCalendarDayValue(date: Date): number {
  const parts = serviceCalendarFormatter.formatToParts(date);
  const year = Number(parts.find((part) => part.type === 'year')?.value);
  const month = Number(parts.find((part) => part.type === 'month')?.value);
  const day = Number(parts.find((part) => part.type === 'day')?.value);

  return Date.UTC(year, month - 1, day);
}
