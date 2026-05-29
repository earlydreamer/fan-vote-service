import type { Candidate } from '../../shared/types/rallyroom';
import type { CastVoteResponse } from './castVoteApi';

export interface VoteReadState {
  candidates: Candidate[];
  currentGoalValue: number;
  participantCount: number;
}

export function applyCastVoteResponse(state: VoteReadState, response: CastVoteResponse): VoteReadState {
  const voteCountsByCandidateId = new Map(
    response.candidateVotes.map((candidateVote) => [candidateVote.candidateId, candidateVote.voteCount])
  );

  return {
    candidates: state.candidates.map((candidate) => ({
      ...candidate,
      voteCount: voteCountsByCandidateId.get(candidate.id) ?? candidate.voteCount
    })),
    currentGoalValue: response.currentGoalValue,
    participantCount: response.participantCount
  };
}
