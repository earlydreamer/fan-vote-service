import { Trophy } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { NotFoundPage } from '../not-found/NotFoundPage';

interface ResultCardPageProps {
  roomId: string;
}

export function ResultCardPage({ roomId }: ResultCardPageProps) {
  const room = demoReadRepository.getRoomDetail(roomId);

  if (!room) return <NotFoundPage />;

  if (room.status !== 'result_published' || !room.resultCard.publishedAt) {
    return (
      <div className="page-grid result-page">
        <section className="content-panel result-pending" aria-labelledby="result-pending-title">
          <p className="eyebrow">Result pending</p>
          <h1 id="result-pending-title">결과 카드 준비 중</h1>
          <p>
            {room.title}의 결과 카드는 방이 종료되고 서버 발행 상태가 확정된 뒤 공개돼요. 진행 중에는
            우승 후보와 대표 메시지를 미리 노출하지 않습니다.
          </p>
        </section>

        <aside className="content-panel">
          <h2>응원은 아직 진행 중</h2>
          <p>현재는 투표와 미션 참여가 가능한 상태예요. 결과 카드는 발행 후 다시 확인해 주세요.</p>
          <a className="button button-secondary" href={`/rooms/${room.id}`}>
            응원방으로 돌아가기
          </a>
        </aside>
      </div>
    );
  }

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
