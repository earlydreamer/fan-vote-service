import { Award, CircleDollarSign, Clock3, Ticket } from 'lucide-react';
import type { ProfileRewardHistoryViewModel } from './rewardHistoryReadModel';

interface ProfileSummaryProps {
  viewModel: ProfileRewardHistoryViewModel | null;
}

export function ProfileSummary({ viewModel }: ProfileSummaryProps) {
  if (!viewModel) {
    return (
      <section className="content-panel profile-empty-state" aria-labelledby="profile-empty-title">
        <p className="eyebrow">Profile</p>
        <h2 id="profile-empty-title">로그인이 필요해요</h2>
        <p>프로필 보상 이력은 로그인 후 확인할 수 있어요. 지금은 데모 피드에서 투표 루프를 둘러볼 수 있습니다.</p>
        <a className="button button-primary" href="/">
          홈 피드로 돌아가기
        </a>
      </section>
    );
  }

  const { summary } = viewModel;

  return (
    <section className="profile-summary" aria-labelledby="profile-summary-title">
      <div className="profile-summary__headline">
        <div>
          <p className="eyebrow">Reward loop</p>
          <h2 id="profile-summary-title">내 보상 루프</h2>
          <p>모은 보상은 후보 추가, 반복 투표, 결과 카드 공유 흐름에서 다시 사용할 수 있어요.</p>
        </div>
        <a className="button button-secondary" href="/rooms/new">
          투표방 만들기
        </a>
      </div>

      <div className="stat-grid wide" aria-label="프로필 보상 요약">
        <div>
          <span>누적 RP</span>
          <strong>{summary.totalRp.toLocaleString()}</strong>
        </div>
        <div>
          <span>이번 주 RP</span>
          <strong>{summary.weeklyRp.toLocaleString()}</strong>
        </div>
        <div>
          <span>보유 투표권</span>
          <strong>{summary.voteTickets}장</strong>
        </div>
        <div>
          <span>연속 참여</span>
          <strong>{summary.streakDays}일</strong>
        </div>
      </div>

      <div className="profile-loop-grid">
        <section className="content-panel profile-reward-wallet" aria-labelledby="earned-reward-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Wallet</p>
              <h3 id="earned-reward-title">획득 아이콘</h3>
            </div>
            <Award size={18} aria-hidden="true" />
          </div>
          <div className="reward-row">
            {viewModel.earnedRewards.map((reward) => (
              <span key={reward} className="chip chip-reward">
                {reward}
              </span>
            ))}
          </div>
          <dl className="profile-micro-stats">
            <div>
              <dt>오늘 투표</dt>
              <dd>{summary.todayVotes}회</dd>
            </div>
            <div>
              <dt>참여 방</dt>
              <dd>{summary.joinedRoomCount}개</dd>
            </div>
            <div>
              <dt>만든 방</dt>
              <dd>{summary.createdRoomCount}개</dd>
            </div>
          </dl>
        </section>

        <section className="content-panel reward-history-panel" aria-labelledby="reward-history-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Recent rewards</p>
              <h3 id="reward-history-title">최근 보상 이력</h3>
            </div>
            <Clock3 size={18} aria-hidden="true" />
          </div>
          <ol className="reward-history-list">
            {viewModel.rewardHistory.map((reward) => (
              <li key={reward.id}>
                <span className="reward-history-list__icon" aria-hidden="true">
                  {reward.icon?.slice(0, 1) ?? 'R'}
                </span>
                <div>
                  <strong>{reward.label}</strong>
                  {reward.roomTitle && <span>{reward.roomTitle}</span>}
                </div>
                <em>
                  {reward.rpDelta > 0 && (
                    <span>
                      <CircleDollarSign size={14} aria-hidden="true" />+{reward.rpDelta} RP
                    </span>
                  )}
                  {reward.voteTicketDelta > 0 && (
                    <span>
                      <Ticket size={14} aria-hidden="true" />+{reward.voteTicketDelta}장
                    </span>
                  )}
                </em>
              </li>
            ))}
          </ol>
        </section>
      </div>
    </section>
  );
}
