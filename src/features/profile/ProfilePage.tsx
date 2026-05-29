import { Ticket } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { RoomCard } from '../../shared/ui/RoomCard';

export function ProfilePage() {
  const profile = demoReadRepository.getProfile();
  const dashboard = demoReadRepository.getDashboard();
  const joinedRooms = dashboard.allRooms.filter((room) => profile.joinedRoomIds.includes(room.id));
  const followedCategories = dashboard.categories.filter((category) =>
    profile.followedCategoryIds.includes(category.id)
  );

  return (
    <div className="profile-page">
      <section className="profile-hero" aria-labelledby="profile-title">
        <div className="profile-avatar" aria-hidden="true">
          ME
        </div>
        <div>
          <p className="eyebrow">My vote loop</p>
          <h1 id="profile-title">내 활동</h1>
          <p>투표권과 RP를 모아 후보 추가, 결과 카드 테마, 반복 참여 루프로 다시 사용하는 상태예요.</p>
        </div>
      </section>

      <section className="stat-grid wide" aria-label="내 활동 요약">
        <div>
          <span>누적 RP</span>
          <strong>{profile.totalRp.toLocaleString()}</strong>
        </div>
        <div>
          <span>이번 주 RP</span>
          <strong>{profile.weeklyRp.toLocaleString()}</strong>
        </div>
        <div>
          <span>보유 투표권</span>
          <strong>{profile.voteTickets}장</strong>
        </div>
        <div>
          <span>연속 참여</span>
          <strong>{profile.streakDays}일</strong>
        </div>
      </section>

      <section className="content-shelf" aria-labelledby="reward-title">
        <div className="collection-heading compact">
          <div>
            <p className="eyebrow">Rewards</p>
            <h2 id="reward-title">획득 아이콘과 관심 카테고리</h2>
          </div>
          <Ticket size={18} aria-hidden="true" />
        </div>
        <div className="reward-row">
          {profile.earnedRewards.map((reward) => (
            <span key={reward} className="chip chip-reward">
              {reward}
            </span>
          ))}
          {followedCategories.map((category) => (
            <span key={category.id} className="chip">
              {category.name}
            </span>
          ))}
        </div>
      </section>

      <section className="content-collection" aria-labelledby="joined-title">
        <div className="collection-heading">
          <div>
            <p className="eyebrow">History</p>
            <h2 id="joined-title">참여 중인 투표방</h2>
          </div>
        </div>
        <div className="vote-card-grid compact-grid">
          {joinedRooms.map((room) => (
            <RoomCard key={room.id} room={room} category={demoReadRepository.getCategory(room.categoryId)} compact />
          ))}
        </div>
      </section>
    </div>
  );
}
