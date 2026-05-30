import { useState, useEffect, useRef } from 'react';
import type { CommandResult } from '../../shared/api/commandClient';
import type { Candidate } from '../../shared/types/rallyroom';
import type { CastVoteInput, CastVoteResponse } from './castVoteApi';
import { applyCastVoteResponse, type VoteReadState } from './voteResultMapper';

export type CastVoteCommand = (input: CastVoteInput) => Promise<CommandResult<CastVoteResponse>>;

export interface UseCastVoteOptions extends VoteReadState {
  roomId: string;
  goalValue: number;
  voteTickets: number;
  castVoteCommand: CastVoteCommand;
}

export interface UseCastVoteResult extends VoteReadState {
  selectedCandidateId: string;
  selectedVoteTicketCount: number;
  remainingVoteTickets: number;
  maxSpendableTickets: number;
  isSubmitting: boolean;
  hasVoted: boolean;
  myVotedTickets: number;
  statusMessage: string | null;
  errorMessage: string | null;
  selectCandidate(candidateId: string): void;
  setVoteTicketCount(voteTicketCount: number): void;
  submitVote(): Promise<void>;
  addOptionWithTickets(title: string, voteTicketCount: number): boolean;
}

let localOptionSequence = 0;

export function useCastVote(options: UseCastVoteOptions): UseCastVoteResult {
  const [state, setState] = useState<VoteReadState>({
    candidates: options.candidates,
    currentGoalValue: options.currentGoalValue,
    participantCount: options.participantCount
  });
  const [selectedCandidateId, setSelectedCandidateId] = useState('');
  const [selectedVoteTicketCount, setSelectedVoteTicketCount] = useState(1);
  const [remainingVoteTickets, setRemainingVoteTickets] = useState(options.voteTickets);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [myVotedTickets, setMyVotedTickets] = useState(0);

  const votedTicketsPendingRef = useRef(0);
  const prevVoteTicketsRef = useRef(options.voteTickets);

  useEffect(() => {
    const prev = prevVoteTicketsRef.current;
    prevVoteTicketsRef.current = options.voteTickets;

    if (options.voteTickets > prev) {
      const diff = options.voteTickets - prev;
      setRemainingVoteTickets((current) => current + diff);
    } else if (options.voteTickets < prev) {
      const diff = prev - options.voteTickets;
      const pending = votedTicketsPendingRef.current;

      if (diff <= pending) {
        votedTicketsPendingRef.current = pending - diff;
      } else {
        const extraDiff = diff - pending;
        votedTicketsPendingRef.current = 0;
        setRemainingVoteTickets((current) => Math.max(current - extraDiff, 0));
      }
    }
  }, [options.voteTickets]);

  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const remainingEnergy = Math.max(options.goalValue - state.currentGoalValue, 0);
  const maxSpendableTickets = Math.min(remainingVoteTickets, remainingEnergy);

  const submitVote = async () => {
    const voteTicketCount = clampVoteTicketCount(selectedVoteTicketCount, maxSpendableTickets);
    if (!selectedCandidateId || voteTicketCount < 1 || isSubmitting) return;

    setIsSubmitting(true);
    setErrorMessage(null);
    setStatusMessage(null);

    votedTicketsPendingRef.current += voteTicketCount;

    const result = await options.castVoteCommand({
      roomId: options.roomId,
      candidateIds: [selectedCandidateId],
      voteTicketCount
    });

    if (result.ok) {
      const nextState = applyCastVoteResponse(state, result.data);
      setState(nextState);
      setRemainingVoteTickets((current) => Math.max(current - voteTicketCount, 0));
      setMyVotedTickets((current) => current + voteTicketCount);
      setHasVoted(true);
      setStatusMessage(
        nextState.currentGoalValue >= options.goalValue
          ? 'Vote Energy가 가득 차 투표가 마감됐어요.'
          : '투표가 반영됐어요.'
      );
    } else {
      votedTicketsPendingRef.current = Math.max(votedTicketsPendingRef.current - voteTicketCount, 0);
      setErrorMessage(result.error.message);
      if (result.error.code === 'DUPLICATE_VOTE') {
        setHasVoted(true);
      }
    }

    setIsSubmitting(false);
  };

  const addOptionWithTickets = (title: string, voteTicketCount: number): boolean => {
    const trimmedTitle = title.trim();
    const spendCount = clampVoteTicketCount(voteTicketCount, maxSpendableTickets);

    if (!trimmedTitle || spendCount < 1) return false;

    localOptionSequence += 1;
    setState((current) => ({
      candidates: [
        ...current.candidates,
        {
          id: `${options.roomId}-local-option-${localOptionSequence}`,
          targetId: `${options.roomId}-local-option-target-${localOptionSequence}`,
          title: trimmedTitle,
          status: 'pending',
          voteCount: spendCount
        }
      ],
      currentGoalValue: Math.min(current.currentGoalValue + spendCount, options.goalValue),
      participantCount: current.participantCount + 1
    }));
    setRemainingVoteTickets((current) => Math.max(current - spendCount, 0));
    setMyVotedTickets((current) => current + spendCount);
    setHasVoted(true);
    setStatusMessage(`${trimmedTitle} 항목을 추가하고 ${spendCount}표를 자동 반영했어요.`);
    setErrorMessage(null);
    return true;
  };

  const setVoteTicketCount = (voteTicketCount: number) => {
    setSelectedVoteTicketCount(clampVoteTicketCount(voteTicketCount, Math.max(maxSpendableTickets, 1)));
  };

  return {
    ...state,
    selectedCandidateId,
    selectedVoteTicketCount: clampVoteTicketCount(selectedVoteTicketCount, Math.max(maxSpendableTickets, 1)),
    remainingVoteTickets,
    maxSpendableTickets,
    isSubmitting,
    hasVoted,
    myVotedTickets,
    statusMessage,
    errorMessage,
    selectCandidate: setSelectedCandidateId,
    setVoteTicketCount,
    submitVote,
    addOptionWithTickets
  };
}

function clampVoteTicketCount(voteTicketCount: number, maxSpendableTickets: number): number {
  if (!Number.isFinite(voteTicketCount)) return 1;
  return Math.min(Math.max(Math.trunc(voteTicketCount), 1), Math.max(maxSpendableTickets, 0));
}
