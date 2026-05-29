import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';

export interface PublishResultCardInput {
  roomId: string;
}

export interface PublishResultCardResponse {
  resultCardId: string;
  publishedAt: string;
}

export function publishResultCard(
  client: CommandClient,
  input: PublishResultCardInput
): Promise<CommandResult<PublishResultCardResponse>> {
  return postCommand(client, 'publish-result-card', {
    command: 'publish-result-card',
    resultCard: {
      roomId: input.roomId
    }
  });
}
