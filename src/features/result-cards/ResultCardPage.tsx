import { Trophy } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { NotFoundPage } from '../not-found/NotFoundPage';

interface ResultCardPageProps {
  roomId: string;
}

export function ResultCardPage({ roomId }: ResultCardPageProps) {
  const room = demoReadRepository.getRoomDetail(roomId);

  if (!room) return <NotFoundPage />;

  const winner = room.candidates.find((candidate) => candidate.id === room.resultCard.winnerCandidateId);

  return (
    <div className="page-grid result-page">
      <section className="result-card" aria-labelledby="result-title">
        <p className="eyebrow">Published rally memory</p>
        <h1 id="result-title">결과 카드</h1>
        <div className="result-card__inner">
          <Trophy size={28} aria-hidden="true" />
          <p className="result-kicker">{room.title}</p>
          <h2>{winner?.title ?? '집계 대기 중'}</h2>
          <p>{room.resultCard.topMessage}</p>
          <span className="chip chip-reward">{room.resultCard.earnedIcon}</span>
        </div>
      </section>

      <aside className="content-panel">
        <h2>다음 응원 루프</h2>
        <p>
          참여자 {room.resultCard.totalParticipants.toLocaleString()}명이 만든 결과를 다음 응원방의
          시작점으로 연결해요.
        </p>
        <a className="button button-primary" href="/rooms/new">
          후속 응원방 만들기
        </a>
      </aside>
    </div>
  );
}
