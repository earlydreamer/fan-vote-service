import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';

export interface CompleteMissionInput {
  roomId: string;
  missionId: string;
  proofText?: string;
}

export interface CompleteMissionResponse {
  missionId: string;
  awardedRp: number;
  awardedEnergy: number;
  earnedRewards: string[];
}

interface CompleteMissionCommandPayload {
  command: 'complete-mission';
  mission: {
    roomId: string;
    missionId: string;
    proofText?: string;
  };
}

export function completeMission(
  client: CommandClient,
  input: CompleteMissionInput
): Promise<CommandResult<CompleteMissionResponse>> {
  return postCommand(client, 'complete-mission', buildCompleteMissionPayload(input));
}

function buildCompleteMissionPayload(input: CompleteMissionInput): CompleteMissionCommandPayload {
  return {
    command: 'complete-mission',
    mission: {
      roomId: input.roomId,
      missionId: input.missionId,
      ...(input.proofText?.trim() ? { proofText: input.proofText.trim() } : {})
    }
  };
}
