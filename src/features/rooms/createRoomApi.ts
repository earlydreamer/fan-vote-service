import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';

export type CreateRoomVoteMode = 'pick' | 'multi_pick' | 'matchup' | 'bracket' | 'scene' | 'line' | 'quick';
export type CreateRoomResultVisibility = 'after_vote' | 'after_close' | 'public';

export interface CreateRoomRequest {
  title: string;
  description: string;
  categoryId: string;
  primaryTargetId: string;
  voteMode: CreateRoomVoteMode;
  topic: string;
  candidateTargetIds: string[];
  customCandidates: string[];
  endAt: string;
  goalValue: number;
  rewardIcon: string;
  allowCandidateSuggestion: boolean;
  resultVisibility: CreateRoomResultVisibility;
}

export interface CreateRoomResponse {
  roomId: string;
  slug: string;
}

export function createRoom(
  client: CommandClient,
  payload: CreateRoomRequest
): Promise<CommandResult<CreateRoomResponse>> {
  return postCommand(client, 'create-room', payload);
}
