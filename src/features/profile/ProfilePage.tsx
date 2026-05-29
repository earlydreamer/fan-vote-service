import { demoReadRepository } from '../../shared/api/demoReadRepository';

export function ProfilePage() {
  const profile = demoReadRepository.getProfile();
  const dashboard = demoReadRepository.getDashboard();
  const joinedRooms = dashboard.activeRooms.filter((room) => profile.joinedRoomIds.includes(room.id));

  return (
    <div className="page-grid profile-page">
      <section className="content-panel" aria-labelledby="profile-title">
        <p className="eyebrow">My activity</p>
        <h1 id="profile-title">내 활동</h1>
        <div className="stat-grid">
          <div>
            <span>누적 RP</span>
            <strong>{profile.totalRp.toLocaleString()}</strong>
          </div>
          <div>
            <span>이번 주 RP</span>
            <strong>{profile.weeklyRp.toLocaleString()}</strong>
          </div>
          <div>
            <span>연속 참여</span>
            <strong>{profile.streakDays}일</strong>
          </div>
        </div>
      </section>

      <section className="content-panel" aria-labelledby="reward-title">
        <h2 id="reward-title">획득 아이콘</h2>
        <div className="reward-row">
          {profile.earnedRewards.map((reward) => (
            <span key={reward} className="chip chip-reward">
              {reward}
            </span>
          ))}
        </div>
      </section>

      <section className="content-panel" aria-labelledby="joined-title">
        <h2 id="joined-title">참여 중인 응원방</h2>
        <div className="mini-list">
          {joinedRooms.map((room) => (
            <a key={room.id} href={`/rooms/${room.id}`} className="mini-row">
              <span>{room.title}</span>
              <strong>{room.participantCount.toLocaleString()}명</strong>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
