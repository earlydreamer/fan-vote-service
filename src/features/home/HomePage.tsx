import { Sparkles } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { ProgressMeter } from '../../shared/ui/ProgressMeter';
import { RoomCard } from '../../shared/ui/RoomCard';

export function HomePage() {
  const dashboard = demoReadRepository.getDashboard();

  return (
    <div className="dashboard-page">
      <section className="dashboard-intro" aria-labelledby="home-title">
        <div>
          <p className="eyebrow">Fan Ops Board</p>
          <h1 id="home-title">오늘의 응원방 보드</h1>
          <p>
            팬이 직접 응원 주제를 열고, 투표와 미션으로 Room Energy를 채운 뒤 결과 카드로 기록을
            남겨요.
          </p>
        </div>
        <a className="button button-primary" href="/rooms/new">
          응원방 만들기
        </a>
      </section>

      <div className="dashboard-grid">
        <section className="board-section room-feed" aria-labelledby="active-rooms-title">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Live rooms</p>
              <h2 id="active-rooms-title">진행 중인 응원방</h2>
            </div>
            <span className="metric-chip">{dashboard.activeRooms.length}개 진행 중</span>
          </div>

          <div className="room-list">
            {dashboard.activeRooms.map((room) => (
              <RoomCard
                key={room.id}
                room={room}
                category={demoReadRepository.getCategory(room.categoryId)}
              />
            ))}
          </div>
        </section>

        <aside className="side-rail">
          <section className="content-panel profile-panel" aria-labelledby="profile-summary-title">
            <p className="eyebrow">My rally power</p>
            <h2 id="profile-summary-title">내 RP</h2>
            <div className="rp-number">{dashboard.profile.totalRp.toLocaleString()} RP</div>
            <p>
              이번 주 {dashboard.profile.weeklyRp.toLocaleString()} RP 획득 · {dashboard.profile.streakDays}일
              연속 참여
            </p>
            <div className="reward-row">
              {dashboard.profile.earnedRewards.slice(0, 3).map((reward) => (
                <span key={reward} className="chip chip-reward">
                  {reward}
                </span>
              ))}
            </div>
          </section>

          <section className="content-panel" aria-labelledby="expiring-title">
            <div className="section-heading compact">
              <h2 id="expiring-title">마감 임박</h2>
              <span className="chip chip-energy">D-day</span>
            </div>
            <div className="mini-list">
              {dashboard.expiringRooms.map((room) => (
                <a key={room.id} href={`/rooms/${room.id}`} className="mini-row">
                  <span>{room.title}</span>
                  <strong>{room.currentGoalValue.toLocaleString()}</strong>
                </a>
              ))}
            </div>
          </section>

          <section className="content-panel" aria-labelledby="missions-title">
            <div className="section-heading compact">
              <h2 id="missions-title">오늘의 미션</h2>
              <Sparkles size={18} aria-hidden="true" />
            </div>
            <div className="mission-list">
              {dashboard.todayMissions.map((mission) => (
                <article key={mission.id} className="mission-card">
                  <span className="chip chip-mission">{mission.roomTitle}</span>
                  <h3>{mission.title}</h3>
                  <p>
                    +{mission.rewardRp} RP · Energy +{mission.rewardEnergy}
                  </p>
                </article>
              ))}
            </div>
          </section>

          <section className="content-panel" aria-labelledby="templates-title">
            <h2 id="templates-title">빠른 템플릿</h2>
            <div className="template-grid">
              {dashboard.templates.map((template) => (
                <a key={template.id} href="/rooms/new" className="template-card">
                  <strong>{template.title}</strong>
                  <span>{template.description}</span>
                </a>
              ))}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
