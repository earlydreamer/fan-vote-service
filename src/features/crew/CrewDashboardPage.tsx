import { BarChart3 } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';

export function CrewDashboardPage() {
  const crewStats = demoReadRepository.getCrewStats();

  return (
    <div className="crew-page">
      <section className="ops-hero" aria-labelledby="crew-title">
        <div>
          <p className="eyebrow">Creator operations</p>
          <h1 id="crew-title">Crew 대시보드</h1>
          <p>공식 계정이나 크리에이터 확장 시 aggregate read model로 운영 흐름을 확인하는 화면이에요.</p>
        </div>
        <BarChart3 size={32} aria-hidden="true" />
      </section>

      <section className="stat-grid wide" aria-label="Crew 요약 지표">
        <div>
          <span>누적 투표방</span>
          <strong>{crewStats.totalRooms}</strong>
        </div>
        <div>
          <span>진행 중</span>
          <strong>{crewStats.activeRooms}</strong>
        </div>
        <div>
          <span>참여자</span>
          <strong>{crewStats.totalParticipants.toLocaleString()}</strong>
        </div>
        <div>
          <span>미션 완료율</span>
          <strong>{crewStats.averageMissionCompletionRate}%</strong>
        </div>
      </section>

      <section className="content-collection" aria-labelledby="crew-room-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">Room performance</p>
            <h2 id="crew-room-title">투표방별 성과</h2>
          </div>
        </div>
        <div className="performance-grid">
          {crewStats.roomStats.map((room) => (
            <article key={room.roomId} className="performance-card">
              <strong>{room.title}</strong>
              <span>{room.participantCount.toLocaleString()}명</span>
              <span>{room.voteCount.toLocaleString()}표</span>
              <span>미션 {room.missionCompletionRate}%</span>
            </article>
          ))}
        </div>
      </section>

      <section className="content-shelf">
        <p className="eyebrow">Next action</p>
        <h2>다음 미션 추천</h2>
        <p>{crewStats.nextMissionSuggestion}</p>
      </section>
    </div>
  );
}
