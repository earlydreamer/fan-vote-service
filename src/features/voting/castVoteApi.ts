import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';

export interface CastVoteInput {
  roomId: string;
  candidateIds: readonly string[];
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

interface CastVoteCommandPayload {
  command: 'cast-vote';
  vote: {
    roomId: string;
    candidateIds: string[];
  };
}

export function castVote(client: CommandClient, input: CastVoteInput): Promise<CommandResult<CastVoteResponse>> {
  return postCommand(client, 'cast-vote', buildCastVotePayload(input));
}

function buildCastVotePayload(input: CastVoteInput): CastVoteCommandPayload {
  return {
    command: 'cast-vote',
    vote: {
      roomId: input.roomId,
      candidateIds: [...input.candidateIds]
    }
  };
}
