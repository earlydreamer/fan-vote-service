import { Trophy } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { RoomCard } from '../../shared/ui/RoomCard';
import { NotFoundPage } from '../not-found/NotFoundPage';

interface ResultCardPageProps {
  roomId: string;
}

export function ResultCardPage({ roomId }: ResultCardPageProps) {
  const room = demoReadRepository.getRoomDetail(roomId);

  if (!room) return <NotFoundPage />;

  if (room.status !== 'result_published' || !room.resultCard.publishedAt) {
    return (
      <div className="result-page">
        <section className="result-pending" aria-labelledby="result-pending-title">
          <p className="eyebrow">Result pending</p>
          <h1 id="result-pending-title">결과 카드 준비 중</h1>
          <p>
            {room.title}의 결과 카드는 방이 종료되고 서버 발행 상태가 확정된 뒤 공개돼요. 진행 중에는
            우승 후보와 대표 메시지를 미리 노출하지 않습니다.
          </p>
          <a className="button button-secondary" href={`/rooms/${room.id}`}>
            투표방으로 돌아가기
          </a>
        </section>
      </div>
    );
  }

  const winner = room.candidates.find((candidate) => candidate.id === room.resultCard.winnerCandidateId);
  const nextRooms = demoReadRepository.getDashboard().activeRooms.slice(0, 4);

  return (
    <div className="result-page">
      <section className="result-showcase" aria-labelledby="result-title">
        <div className="result-poster">
          <Trophy size={32} aria-hidden="true" />
          <p className="result-kicker">{room.title}</p>
          <h1 id="result-title">결과 카드</h1>
          <h2>{winner?.title ?? '집계 대기 중'}</h2>
          <p>{room.resultCard.topMessage}</p>
          <span className="chip chip-reward">{room.resultCard.earnedIcon}</span>
        </div>
        <div className="result-context">
          <p className="eyebrow">Published vote memory</p>
          <h2>{room.resultCard.totalParticipants.toLocaleString()}명이 만든 투표 기록</h2>
          <p>
            결과 카드는 다음 투표방, 팬월 메시지, 후보 추가 아이디어로 다시 이어지는 재방문 지점이에요.
          </p>
          <a className="button button-primary" href="/rooms/new">
            후속 투표방 만들기
          </a>
        </div>
      </section>

      <section className="content-collection" aria-labelledby="next-vote-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">Next loop</p>
            <h2 id="next-vote-title">다음에 참여할 투표</h2>
          </div>
        </div>
        <div className="vote-card-grid compact-grid">
          {nextRooms.map((nextRoom) => (
            <RoomCard
              key={nextRoom.id}
              room={nextRoom}
              category={demoReadRepository.getCategory(nextRoom.categoryId)}
              compact
            />
          ))}
        </div>
      </section>
    </div>
  );
}
