import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';

export interface CastVoteInput {
  roomId: string;
  candidateIds: readonly string[];
  voteTicketCount: number;
}

export interface CastVoteResponse {
  roomId: string;
  candidateVotes: Array<{
    candidateId: string;
    voteCount: number;
  }>;
  currentGoalValue: number;
  participantCount: number;
}

interface CastVoteRequest {
  roomId: string;
  candidateIds: string[];
  voteTicketCount: number;
}

export function castVote(client: CommandClient, input: CastVoteInput): Promise<CommandResult<CastVoteResponse>> {
  return postCommand(client, 'cast-vote', buildCastVotePayload(input));
}

function buildCastVotePayload(input: CastVoteInput): CastVoteRequest {
  return {
    roomId: input.roomId,
    candidateIds: [...input.candidateIds],
    voteTicketCount: input.voteTicketCount
  };
}
