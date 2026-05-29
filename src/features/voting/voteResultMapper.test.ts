import { describe, expect, it } from 'vitest';
import type { Candidate } from '../../shared/types/rallyroom';
import type { CastVoteResponse } from './castVoteApi';
import { applyCastVoteResponse } from './voteResultMapper';

function candidate(id: string, voteCount: number): Candidate {
  return {
    id,
    targetId: `${id}-target`,
    title: `${id} title`,
    status: 'approved',
    voteCount
  };
}

describe('applyCastVoteResponse', () => {
  it('updates vote state only from the command response DTO', () => {
    const initialCandidates = [candidate('candidate-1', 10), candidate('candidate-2', 7)];
    const response: CastVoteResponse = {
      roomId: 'room-1',
      candidateVotes: [{ candidateId: 'candidate-1', voteCount: 17 }],
      currentGoalValue: 230,
      participantCount: 42
    };

    const result = applyCastVoteResponse(
      {
        candidates: initialCandidates,
        currentGoalValue: 200,
        participantCount: 41
      },
      response
    );

    expect(result).toEqual({
      candidates: [candidate('candidate-1', 17), candidate('candidate-2', 7)],
      currentGoalValue: 230,
      participantCount: 42
    });
    expect(initialCandidates[0]?.voteCount).toBe(10);
  });
});
