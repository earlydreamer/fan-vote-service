import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';
import type { MessageType } from '../../shared/types/rallyroom';

export interface PostRoomMessageInput {
  roomId: string;
  type: MessageType;
  body: string;
}

export interface PostRoomMessageResponse {
  messageId: string;
  awardedRp?: number;
  awardedEnergy?: number;
}

interface PostRoomMessageRequest {
  roomId: string;
  type: MessageType;
  body: string;
}

export function postRoomMessage(
  client: CommandClient,
  input: PostRoomMessageInput
): Promise<CommandResult<PostRoomMessageResponse>> {
  return postCommand(client, 'post-room-message', buildPostRoomMessagePayload(input));
}

function buildPostRoomMessagePayload(input: PostRoomMessageInput): PostRoomMessageRequest {
  return {
    roomId: input.roomId,
    type: input.type,
    body: input.body.trim()
  };
}
