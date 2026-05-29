import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';
import type { CreateRoomCommandPayload } from './createRoomCommand';

export interface CreateRoomResponse {
  roomId: string;
  slug: string;
}

export function createRoom(
  client: CommandClient,
  payload: CreateRoomCommandPayload
): Promise<CommandResult<CreateRoomResponse>> {
  return postCommand(client, 'create-room', payload);
}
