import { BarChart3, LockKeyhole, MessageCircle, Sparkles, Users } from 'lucide-react';
import type { CrewDashboardViewModel } from './crewStatsReadModel';

interface CrewStatsCardsProps {
  viewModel: CrewDashboardViewModel;
}

export function CrewStatsCards({ viewModel }: CrewStatsCardsProps) {
  if (viewModel.access === 'denied') {
    return (
      <section className="content-panel crew-restricted" aria-labelledby="crew-restricted-title">
        <LockKeyhole size={28} aria-hidden="true" />
        <p className="eyebrow">Restricted</p>
        <h2 id="crew-restricted-title">운영 권한이 필요해요</h2>
        <p>{viewModel.reason}</p>
        <a className="button button-secondary" href="/">
          홈 피드로 돌아가기
        </a>
      </section>
    );
  }

  return (
    <>
      <section className="stat-grid wide" aria-label="Crew 요약 지표">
        <div>
          <span>누적 투표방</span>
          <strong>{viewModel.summary.totalRooms}</strong>
        </div>
        <div>
          <span>진행 중</span>
          <strong>{viewModel.summary.activeRooms}</strong>
        </div>
        <div>
          <span>참여자</span>
          <strong>{viewModel.summary.totalParticipants.toLocaleString()}</strong>
        </div>
        <div>
          <span>미션 완료율</span>
          <strong>{viewModel.summary.averageMissionCompletionRate}%</strong>
        </div>
        <div>
          <span>강한 카테고리</span>
          <strong>{viewModel.summary.strongestCategoryName}</strong>
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
          {viewModel.roomCards.map((room) => (
            <article key={room.roomId} className="performance-card crew-performance-card" aria-label={`${room.title} 성과`}>
              <strong>{room.title}</strong>
              <span>
                <Users size={15} aria-hidden="true" />
                {room.participantCount.toLocaleString()}명
              </span>
              <span>
                <BarChart3 size={15} aria-hidden="true" />
                {room.voteCount.toLocaleString()}표
              </span>
              <span>
                <MessageCircle size={15} aria-hidden="true" />
                메시지 {room.messageCount.toLocaleString()}개
              </span>
              <span>미션 {room.missionCompletionRate}%</span>
            </article>
          ))}
        </div>
      </section>

      <section className="content-shelf crew-next-action" aria-labelledby="crew-next-action-title">
        <p className="eyebrow">Next action</p>
        <h2 id="crew-next-action-title">다음 미션 추천</h2>
        <p>{viewModel.nextMissionSuggestion}</p>
        <span>
          <Sparkles size={16} aria-hidden="true" />
          결과 카드 재료가 쌓이는 행동을 먼저 노출하세요.
        </span>
      </section>
    </>
  );
}
