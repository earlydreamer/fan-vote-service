import { type FormEvent, useState } from 'react';
import { MessageSquareText, PlusCircle, Ticket } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { getVoteTitle } from '../../shared/domain/roomDisplay';
import type { RallyRoom, RoomStatus } from '../../shared/types/rallyroom';
import { MissionList } from '../missions/MissionList';
import type { CompleteMissionCommand } from '../missions/useCompleteMission';
import { NotFoundPage } from '../not-found/NotFoundPage';
import { VotePanel } from '../voting/VotePanel';
import type { CastVoteCommand } from '../voting/useCastVote';

interface RoomDetailPageProps {
  roomId: string;
}

interface OptionAddIntent {
  title: string;
  costLabel: string;
}

export function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  const room = demoReadRepository.getRoomDetail(roomId);
  const profile = demoReadRepository.getProfile();
  const [newOptionTitle, setNewOptionTitle] = useState('');
  const [optionAddIntent, setOptionAddIntent] = useState<OptionAddIntent | null>(null);

  if (!room) return <NotFoundPage />;

  const category = demoReadRepository.getCategory(room.categoryId);
  const voteTitle = getVoteTitle(room);
  const castVoteCommand = createDemoCastVoteCommand(room);
  const completeMissionCommand = createDemoCompleteMissionCommand(room);
  const isVotingOpen = room.status === 'active';
  const voteClosedReason = isVotingOpen ? undefined : getVoteClosedReason(room.status);
  const canSpendTicket = profile.voteTickets >= room.addOptionCost.voteTickets;
  const canSpendRp = profile.totalRp >= room.addOptionCost.rp;
  const optionCostLabel = canSpendTicket ? `투표권 ${room.addOptionCost.voteTickets}장` : `${room.addOptionCost.rp} RP`;
  const canAddOption = newOptionTitle.trim().length > 0 && (canSpendTicket || canSpendRp);

  const handleAddOption = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAddOption) return;

    const title = newOptionTitle.trim();
    setOptionAddIntent({ title, costLabel: optionCostLabel });
    setNewOptionTitle('');
  };

  return (
    <div className="room-detail-page">
      <section className="detail-stage" aria-labelledby="room-title">
        <div className="detail-stage__visual" aria-hidden="true">
          <span>{room.thumbnail.label}</span>
        </div>
        <div className="detail-stage__copy">
          <p className="eyebrow">Vote detail</p>
          <h1 id="room-title">{room.title}</h1>
          <div className="detail-vote-title">
            <span>투표 제목</span>
            <strong>{voteTitle}</strong>
          </div>
          <p>{room.topic}</p>
          <div className="room-card__meta">
            <span className="chip">{category?.name ?? '투표방'}</span>
            {room.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="chip chip-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <a className="button button-secondary" href={`/rooms/${room.id}/result`}>
          결과 카드 보기
        </a>
      </section>

      <div className="detail-content-grid">
        <VotePanel
          key={room.id}
          roomId={room.id}
          candidates={room.candidates}
          currentGoalValue={room.currentGoalValue}
          goalValue={room.goalValue}
          participantCount={room.participantCount}
          castVoteCommand={castVoteCommand}
          isVotingOpen={isVotingOpen}
          closedReason={voteClosedReason}
        />

        <section className="content-panel option-composer" aria-labelledby="option-composer-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Reward spend</p>
              <h2 id="option-composer-title">투표 항목 추가</h2>
            </div>
            <Ticket size={18} aria-hidden="true" />
          </div>
          <div className="wallet-strip">
            <span>보유 투표권 {profile.voteTickets}장</span>
            <span>{profile.totalRp.toLocaleString()} RP</span>
          </div>
          <form className="option-form" onSubmit={handleAddOption}>
            <label htmlFor="new-option-title">새 투표 항목</label>
            <div>
              <input
                id="new-option-title"
                value={newOptionTitle}
                onChange={(event) => setNewOptionTitle(event.target.value)}
                placeholder="예: 커튼콜 마지막 장면"
              />
              <button type="submit" disabled={!canAddOption}>
                <PlusCircle size={17} aria-hidden="true" />
                투표 항목 추가 - {optionCostLabel}
              </button>
            </div>
          </form>
          <p className="guard-copy">
            지금은 후보 추가 command intent만 만들어요. 실제 투표권/RP 차감과 후보 반영은 서버 승인 후 read model에서 같이 갱신되는 흐름으로
            이어질 예정이에요.
          </p>
          {optionAddIntent && (
            <p className="success-copy" role="status">
              후보 추가 요청을 만들었어요. {optionAddIntent.title} 항목은 command API 승인 후 read model에 반영돼요. 예상 비용:{' '}
              {optionAddIntent.costLabel}
            </p>
          )}
        </section>

        <MissionList
          key={`${room.id}-missions`}
          roomId={room.id}
          missions={room.missions}
          completeMissionCommand={completeMissionCommand}
        />

        <section className="content-panel fan-wall" aria-labelledby="fan-wall-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Messages</p>
              <h2 id="fan-wall-title">팬월</h2>
            </div>
            <MessageSquareText size={18} aria-hidden="true" />
          </div>
          {room.messages.map((message) => (
            <article key={message.id} className="message-row">
              <span className="chip">{message.type === 'cheer' ? '메시지' : '질문'}</span>
              <p>{message.body}</p>
            </article>
          ))}
        </section>
      </div>
    </div>
  );
}

function createDemoCastVoteCommand(room: RallyRoom): CastVoteCommand {
  return async ({ roomId, candidateIds }) => {
    const selectedCandidateIds = new Set(candidateIds);

    return {
      ok: true,
      data: {
        roomId,
        candidateVotes: room.candidates.map((candidate) => ({
          candidateId: candidate.id,
          voteCount: candidate.voteCount + (selectedCandidateIds.has(candidate.id) ? 1 : 0)
        })),
        currentGoalValue: Math.min(room.currentGoalValue + candidateIds.length, room.goalValue),
        participantCount: room.participantCount + 1
      }
    };
  };
}

function createDemoCompleteMissionCommand(room: RallyRoom): CompleteMissionCommand {
  return async ({ missionId }) => {
    const mission = room.missions.find((item) => item.id === missionId);

    return {
      ok: true,
      data: {
        missionId,
        awardedRp: mission?.rewardRp ?? 0,
        awardedEnergy: mission?.rewardEnergy ?? 0,
        earnedRewards: mission ? [`${mission.title} 배지`] : []
      }
    };
  };
}

function getVoteClosedReason(status: RoomStatus): string {
  if (status === 'result_published') {
    return '결과가 공개된 방은 투표가 종료됐어요.';
  }

  return '마감된 방은 투표가 종료됐어요.';
}
