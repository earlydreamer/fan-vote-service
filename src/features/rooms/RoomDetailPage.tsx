import { MessageSquareText, Vote } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { ProgressMeter } from '../../shared/ui/ProgressMeter';
import { NotFoundPage } from '../not-found/NotFoundPage';

interface RoomDetailPageProps {
  roomId: string;
}

export function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  const room = demoReadRepository.getRoomDetail(roomId);

  if (!room) return <NotFoundPage />;

  return (
    <div className="room-detail-page">
      <section className="detail-hero" aria-labelledby="room-title">
        <div>
          <p className="eyebrow">Rally room</p>
          <h1 id="room-title">{room.title}</h1>
          <p>{room.topic}</p>
        </div>
        <a className="button button-secondary" href={`/rooms/${room.id}/result`}>
          결과 카드 보기
        </a>
      </section>

      <div className="detail-grid">
        <section className="content-panel" aria-labelledby="vote-status-title">
          <div className="section-heading compact">
            <h2 id="vote-status-title">투표 현황</h2>
            <Vote size={18} aria-hidden="true" />
          </div>
          <ProgressMeter label="Room Energy" value={room.currentGoalValue} max={room.goalValue} />
          <div className="candidate-list">
            {room.candidates.map((candidate) => (
              <article key={candidate.id} className="candidate-card">
                <h3>{candidate.title}</h3>
                <strong>{candidate.voteCount.toLocaleString()}표</strong>
                <p>투표 확정은 command API 응답 이후 read model로 반영돼요.</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-panel" aria-labelledby="mission-panel-title">
          <h2 id="mission-panel-title">미션</h2>
          <div className="mission-list">
            {room.missions.map((mission) => (
              <article key={mission.id} className="mission-card">
                <span className="chip chip-mission">+{mission.rewardRp} RP</span>
                <h3>{mission.title}</h3>
                <p>Energy +{mission.rewardEnergy}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-panel fan-wall" aria-labelledby="fan-wall-title">
          <div className="section-heading compact">
            <h2 id="fan-wall-title">팬월</h2>
            <MessageSquareText size={18} aria-hidden="true" />
          </div>
          {room.messages.map((message) => (
            <article key={message.id} className="message-row">
              <span className="chip">{message.type === 'cheer' ? '응원' : '질문'}</span>
              <p>{message.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}
