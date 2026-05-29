import { type FormEvent, useState } from 'react';
import { MessageSquareText, PlusCircle, Ticket, Vote } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import type { Candidate } from '../../shared/types/rallyroom';
import { ProgressMeter } from '../../shared/ui/ProgressMeter';
import { NotFoundPage } from '../not-found/NotFoundPage';

interface RoomDetailPageProps {
  roomId: string;
}

export function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  const room = demoReadRepository.getRoomDetail(roomId);
  const profile = demoReadRepository.getProfile();
  const [candidates, setCandidates] = useState<Candidate[]>(() => room?.candidates ?? []);
  const [newOptionTitle, setNewOptionTitle] = useState('');
  const [voteTickets, setVoteTickets] = useState(profile.voteTickets);
  const [rp, setRp] = useState(profile.totalRp);
  const [optionAddMessage, setOptionAddMessage] = useState('');

  if (!room) return <NotFoundPage />;

  const category = demoReadRepository.getCategory(room.categoryId);
  const canSpendTicket = voteTickets >= room.addOptionCost.voteTickets;
  const canSpendRp = rp >= room.addOptionCost.rp;
  const optionCostLabel = canSpendTicket ? `투표권 ${room.addOptionCost.voteTickets}장` : `${room.addOptionCost.rp} RP`;
  const canAddOption = newOptionTitle.trim().length > 0 && (canSpendTicket || canSpendRp);

  const handleAddOption = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!canAddOption) return;

    const title = newOptionTitle.trim();
    const pendingCandidate: Candidate = {
      id: `candidate-user-${Date.now()}`,
      targetId: room.primaryTargetId,
      title,
      status: 'pending',
      voteCount: 0
    };

    setCandidates((currentCandidates) => [...currentCandidates, pendingCandidate]);
    if (canSpendTicket) {
      setVoteTickets((currentTickets) => currentTickets - room.addOptionCost.voteTickets);
    } else {
      setRp((currentRp) => currentRp - room.addOptionCost.rp);
    }
    setNewOptionTitle('');
    setOptionAddMessage('추가 항목은 검수 대기 상태로 올라갔어요. 승인되면 투표 후보에 반영돼요.');
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
        <section className="content-panel vote-panel" aria-labelledby="vote-status-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Ranking</p>
              <h2 id="vote-status-title">투표 현황</h2>
            </div>
            <Vote size={18} aria-hidden="true" />
          </div>
          <ProgressMeter label="Vote Energy" value={room.currentGoalValue} max={room.goalValue} />
          <div className="candidate-grid">
            {candidates.map((candidate, index) => (
              <article key={candidate.id} className="candidate-card" data-status={candidate.status}>
                <span>{index + 1}</span>
                <h3>{candidate.title}</h3>
                <strong>{candidate.voteCount.toLocaleString()}표</strong>
                <p>{candidate.status === 'pending' ? '검수 대기 중인 팬 추가 항목' : '서버 read model 기준 집계'}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="content-panel option-composer" aria-labelledby="option-composer-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Reward spend</p>
              <h2 id="option-composer-title">투표 항목 추가</h2>
            </div>
            <Ticket size={18} aria-hidden="true" />
          </div>
          <div className="wallet-strip">
            <span>보유 투표권 {voteTickets}장</span>
            <span>{rp.toLocaleString()} RP</span>
          </div>
          <form className="option-form" onSubmit={handleAddOption}>
            <label htmlFor="new-option-title">새 투표 항목</label>
            <div>
              <input
                id="new-option-title"
                value={newOptionTitle}
                onChange={(event) => setNewOptionTitle(event.target.value)}
                placeholder="예: 커튼콜 실루엣"
              />
              <button type="submit" disabled={!canAddOption}>
                <PlusCircle size={17} aria-hidden="true" />
                투표 항목 추가 - {optionCostLabel}
              </button>
            </div>
          </form>
          <p className="guard-copy">
            투표권이 있으면 먼저 투표권을 사용하고, 없을 때는 RP로 후보 제안 비용을 지불하는 데모
            흐름이에요.
          </p>
          {optionAddMessage && <p className="success-copy">{optionAddMessage}</p>}
        </section>

        <section className="content-panel mission-panel" aria-labelledby="mission-panel-title">
          <h2 id="mission-panel-title">참여 미션</h2>
          <div className="mission-card-grid">
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
