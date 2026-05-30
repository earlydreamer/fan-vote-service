import { type FormEvent, useState } from 'react';
import { CheckCircle2, PlusCircle, Vote } from 'lucide-react';
import { ProgressMeter } from '../../shared/ui/ProgressMeter';
import type { Candidate } from '../../shared/types/rallyroom';
import { type CastVoteCommand, useCastVote } from './useCastVote';

export interface VotePanelProps {
  roomId: string;
  candidates: Candidate[];
  currentGoalValue: number;
  goalValue: number;
  participantCount: number;
  castVoteCommand: CastVoteCommand;
  isVotingOpen?: boolean;
  closedReason?: string;
  voteTickets?: number;
}

export function VotePanel({
  roomId,
  candidates,
  currentGoalValue,
  goalValue,
  participantCount,
  castVoteCommand,
  isVotingOpen = true,
  closedReason,
  voteTickets = 0
}: VotePanelProps) {
  const [isOptionFormOpen, setIsOptionFormOpen] = useState(false);
  const [newOptionTitle, setNewOptionTitle] = useState('');
  const [optionVoteTicketCount, setOptionVoteTicketCount] = useState(1);
  const voteState = useCastVote({
    roomId,
    candidates,
    currentGoalValue,
    goalValue,
    participantCount,
    voteTickets,
    castVoteCommand
  });
  const isEnergyClosed = voteState.currentGoalValue >= goalValue;
  const isVoteClosed = !isVotingOpen || isEnergyClosed;
  const submitLabel = !isVotingOpen ? '투표 종료' : isEnergyClosed ? '투표 마감' : voteState.hasVoted ? '투표 완료' : '투표하기';
  const voteClosedMessage = !isVotingOpen
    ? closedReason
    : isEnergyClosed
      ? 'Vote Energy가 가득 차 투표가 마감됐어요.'
      : undefined;
  const rankedCandidates = rankCandidatesByVotes(voteState.candidates);
  const totalVoteCount = rankedCandidates.reduce((sum, candidate) => sum + candidate.voteCount, 0);
  const ticketOptions = buildTicketOptions(voteState.maxSpendableTickets);
  const optionTicketOptions = buildTicketOptions(voteState.maxSpendableTickets);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isVoteClosed) return;

    void voteState.submitVote();
  };

  const handleAddOption = () => {
    if (voteState.isSubmitting) return;

    const added = voteState.addOptionWithTickets(newOptionTitle, optionVoteTicketCount);
    if (!added) return;

    setNewOptionTitle('');
    setOptionVoteTicketCount(1);
    setIsOptionFormOpen(false);
  };

  return (
    <section className="content-panel vote-panel" aria-labelledby="vote-status-title">
      <div className="collection-heading compact">
        <div>
          <p className="eyebrow">Voting</p>
          <h2 id="vote-status-title">투표 현황</h2>
        </div>
        <Vote size={18} aria-hidden="true" />
      </div>

      <div className="vote-panel__summary">
        <ProgressMeter label="Vote Energy" value={voteState.currentGoalValue} max={goalValue} />
        <span>{voteState.participantCount.toLocaleString()}명 참여</span>
      </div>
      {isVoteClosed && voteClosedMessage && (
        <p className="vote-panel__closed" role="status">
          {voteClosedMessage}
        </p>
      )}

      <form className="vote-form" onSubmit={handleSubmit}>
        <ol className="candidate-list" aria-label="투표 후보 목록">
          {rankedCandidates.map((candidate, index) => (
            <li key={candidate.id} className="candidate-row" data-pending={candidate.status === 'pending'}>
              <label
                className="candidate-row__label"
                data-selected={voteState.selectedCandidateId === candidate.id}
                data-disabled={isVoteClosed}
              >
                <input
                  type="radio"
                  name={`${roomId}-candidate`}
                  value={candidate.id}
                  checked={voteState.selectedCandidateId === candidate.id}
                  disabled={isVoteClosed || voteState.isSubmitting || voteState.hasVoted}
                  onChange={() => voteState.selectCandidate(candidate.id)}
                />
                <span className="candidate-row__rank">{index + 1}</span>
                <span className="candidate-row__main">
                  <strong>{candidate.title}</strong>
                  <em>
                    {voteState.selectedCandidateId === candidate.id
                      ? '선택한 후보'
                      : candidate.status === 'pending'
                        ? '새로 추가한 후보'
                        : '실시간 집계'}
                  </em>
                </span>
                <span className="candidate-row__metrics">
                  <span className="candidate-row__votes">{candidate.voteCount.toLocaleString()}표</span>
                  <span className="candidate-row__share">{formatVoteShare(candidate.voteCount, totalVoteCount)}%</span>
                </span>
              </label>
            </li>
          ))}
          <li className="candidate-row candidate-row--add">
            {!isOptionFormOpen ? (
              <button
                type="button"
                className="button button-secondary"
                disabled={isVoteClosed || voteState.isSubmitting || voteState.maxSpendableTickets < 1}
                onClick={() => setIsOptionFormOpen(true)}
              >
                <PlusCircle size={17} aria-hidden="true" />
                항목 추가
              </button>
            ) : (
              <div className="inline-option-form">
                <div className="inline-option-form__field inline-option-form__field--title">
                  <label htmlFor={`${roomId}-new-option-title`}>새 투표 항목</label>
                  <input
                    id={`${roomId}-new-option-title`}
                    value={newOptionTitle}
                    disabled={voteState.isSubmitting}
                    onChange={(event) => setNewOptionTitle(event.target.value)}
                    placeholder="예: 커튼콜 마지막 장면"
                  />
                </div>
                <div className="inline-option-form__field inline-option-form__field--ticket">
                  <label htmlFor={`${roomId}-option-ticket-count`}>자동 투표권</label>
                  <select
                    id={`${roomId}-option-ticket-count`}
                    value={optionVoteTicketCount}
                    disabled={voteState.isSubmitting}
                    onChange={(event) => setOptionVoteTicketCount(Number(event.target.value))}
                  >
                    {optionTicketOptions.map((ticketCount) => (
                      <option key={ticketCount} value={ticketCount}>
                        {ticketCount}장
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  type="button"
                  className="inline-option-form__submit"
                  disabled={!newOptionTitle.trim() || voteState.isSubmitting || voteState.maxSpendableTickets < 1}
                  onClick={handleAddOption}
                >
                  추가하고 {optionVoteTicketCount}표 자동 투표
                </button>
              </div>
            )}
          </li>
        </ol>

        <div className="vote-action-row">
          <label className="ticket-select" htmlFor={`${roomId}-vote-ticket-count`}>
            사용할 투표권
            <select
              id={`${roomId}-vote-ticket-count`}
              value={voteState.selectedVoteTicketCount}
              disabled={isVoteClosed || voteState.maxSpendableTickets < 1 || voteState.hasVoted}
              onChange={(event) => voteState.setVoteTicketCount(Number(event.target.value))}
            >
              {ticketOptions.map((ticketCount) => (
                <option key={ticketCount} value={ticketCount}>
                  {ticketCount}장
                </option>
              ))}
            </select>
          </label>
          <button
            type="submit"
            disabled={
              isVoteClosed ||
              !voteState.selectedCandidateId ||
              voteState.maxSpendableTickets < 1 ||
              voteState.isSubmitting ||
              voteState.hasVoted
            }
          >
            {voteState.hasVoted && !isVoteClosed ? (
              <>
                <CheckCircle2 size={17} aria-hidden="true" />
                {submitLabel}
              </>
            ) : (
              submitLabel
            )}
          </button>
          {voteState.statusMessage && voteState.statusMessage !== voteClosedMessage && (
            <p className="success-copy" role="status">
              {voteState.statusMessage}
            </p>
          )}
          {voteState.errorMessage && (
            <p className="error-copy" role="alert">
              {voteState.errorMessage}
            </p>
          )}
        </div>
      </form>
    </section>
  );
}

function buildTicketOptions(maxSpendableTickets: number): number[] {
  const max = Math.max(Math.min(maxSpendableTickets, 10), 1);
  return Array.from({ length: max }, (_, index) => index + 1);
}

function rankCandidatesByVotes(candidates: Candidate[]): Candidate[] {
  return [...candidates].sort(
    (left, right) => right.voteCount - left.voteCount || left.title.localeCompare(right.title, 'ko')
  );
}

function formatVoteShare(voteCount: number, totalVoteCount: number): number {
  if (totalVoteCount < 1) return 0;
  return Math.round((voteCount / totalVoteCount) * 100);
}
