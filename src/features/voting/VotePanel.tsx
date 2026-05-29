import { type FormEvent } from 'react';
import { CheckCircle2, Vote } from 'lucide-react';
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
}

export function VotePanel({
  roomId,
  candidates,
  currentGoalValue,
  goalValue,
  participantCount,
  castVoteCommand
}: VotePanelProps) {
  const voteState = useCastVote({
    roomId,
    candidates,
    currentGoalValue,
    participantCount,
    castVoteCommand
  });

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void voteState.submitVote();
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

      <form className="vote-form" onSubmit={handleSubmit}>
        <div className="candidate-grid" role="radiogroup" aria-label="투표 후보">
          {voteState.candidates.map((candidate, index) => (
            <label
              key={candidate.id}
              className="candidate-card candidate-card--selectable"
              data-selected={voteState.selectedCandidateId === candidate.id}
            >
              <input
                type="radio"
                name={`${roomId}-candidate`}
                value={candidate.id}
                checked={voteState.selectedCandidateId === candidate.id}
                disabled={voteState.isSubmitting || voteState.hasVoted}
                onChange={() => voteState.selectCandidate(candidate.id)}
              />
              <span>{index + 1}</span>
              <h3>{candidate.title}</h3>
              <strong>{candidate.voteCount.toLocaleString()}표</strong>
              <p>{voteState.selectedCandidateId === candidate.id ? '선택한 후보' : '서버 read model 기준 집계'}</p>
            </label>
          ))}
        </div>

        <div className="vote-action-row">
          <button type="submit" disabled={!voteState.selectedCandidateId || voteState.isSubmitting || voteState.hasVoted}>
            {voteState.hasVoted ? (
              <>
                <CheckCircle2 size={17} aria-hidden="true" />
                투표 완료
              </>
            ) : (
              '투표하기'
            )}
          </button>
          {voteState.statusMessage && (
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
