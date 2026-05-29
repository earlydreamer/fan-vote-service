import { useState } from 'react';
import type { CommandResult } from '../../shared/api/commandClient';
import type { Candidate } from '../../shared/types/rallyroom';
import type { CastVoteInput, CastVoteResponse } from './castVoteApi';
import { applyCastVoteResponse, type VoteReadState } from './voteResultMapper';

export type CastVoteCommand = (input: CastVoteInput) => Promise<CommandResult<CastVoteResponse>>;

export interface UseCastVoteOptions extends VoteReadState {
  roomId: string;
  castVoteCommand: CastVoteCommand;
}

export interface UseCastVoteResult extends VoteReadState {
  selectedCandidateId: string;
  isSubmitting: boolean;
  hasVoted: boolean;
  statusMessage: string | null;
  errorMessage: string | null;
  selectCandidate(candidateId: string): void;
  submitVote(): Promise<void>;
}

export function useCastVote(options: UseCastVoteOptions): UseCastVoteResult {
  const [state, setState] = useState<VoteReadState>({
    candidates: options.candidates,
    currentGoalValue: options.currentGoalValue,
    participantCount: options.participantCount
  });
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const submitVote = async () => {
    if (!selectedCandidateId || isSubmitting || hasVoted) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    const result = await options.castVoteCommand({
      roomId: options.roomId,
      candidateIds: [selectedCandidateId]
    });

    if (result.ok) {
      setState((current) => applyCastVoteResponse(current, result.data));
      setHasVoted(true);
      setStatusMessage('투표가 반영됐어요.');
    } else {
      setErrorMessage(result.error.message);
      if (result.error.code === 'DUPLICATE_VOTE') {
        setHasVoted(true);
      }
    }

    setIsSubmitting(false);
  };

  return {
    ...state,
    selectedCandidateId,
    isSubmitting,
    hasVoted,
    statusMessage,
    errorMessage,
    selectCandidate: setSelectedCandidateId,
    submitVote
  };
}
