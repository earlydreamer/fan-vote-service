import { Clock3, UsersRound } from 'lucide-react';
import { getVoteTitle } from '../domain/roomDisplay';
import type { Category, PollFormat, RallyRoom } from '../types/rallyroom';
import { ProgressMeter } from './ProgressMeter';
import { RoomThumbnail } from './RoomThumbnail';

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
  const voteCount = room.candidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  const voteTitle = getVoteTitle(room);

  return (
    <article
      className={compact ? 'room-card room-card--compact' : 'room-card'}
      aria-label={`${voteTitle} 투표 카드`}
      data-category={category?.colorToken ?? 'primary'}
      data-tone={room.thumbnail.tone}
    >
      <RoomThumbnail
        room={room}
        categoryName={category?.name}
        href={`/rooms/${room.id}`}
        className="room-card__visual"
        decorativeLink
      />

      <div className="room-card__body">
        <div className="room-card__meta">
          <span className="chip">{category?.name ?? '투표방'}</span>
          <span className="chip chip-format">{formatPollFormat(room.pollFormat)}</span>
          {!compact && <span className="chip chip-energy">{room.candidates.length}개 항목</span>}
        </div>

        <span className="room-card__room-name">응원방 · {room.title}</span>
        <h3>
          <a href={`/rooms/${room.id}`}>{voteTitle}</a>
        </h3>
        {!compact && <p className="room-card__topic-copy">{room.topic}</p>}

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

        {!compact && <ProgressMeter label="Vote Energy" value={room.currentGoalValue} max={room.goalValue} />}

        <div className="room-card__stats">
          <span>
            <UsersRound size={16} aria-hidden="true" />
            {room.participantCount.toLocaleString()}명
          </span>
          <span>
            <Clock3 size={16} aria-hidden="true" />
            {room.status === 'result_published' ? '결과' : formatDday(room.endAt)}
          </span>
        </div>

        {!compact && (
          <div className="room-card__footer">
            <span>{voteCount.toLocaleString()}표</span>
            <a href={`/rooms/${room.id}`}>{room.status === 'result_published' ? '결과 보기' : '투표하기'}</a>
          </div>
        )}
      </div>
    </article>
  );
}

function formatPollFormat(format: PollFormat): string {
  const labels: Record<PollFormat, string> = {
    single: '인기투표',
    matchup: '매치업',
    bracket: '브래킷',
    scene: '장면픽',
    line: '문구픽',
    quick: '퀵투표',
    multi_pick: '복수선택'
  };

  return labels[format];
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
