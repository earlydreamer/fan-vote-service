import { postCommand, type CommandClient, type CommandResult } from '../../shared/api/commandClient';

export interface CompleteMissionInput {
  roomId: string;
  missionId: string;
  textValue?: string;
}

export interface EarnedReward {
  code: string;
  name: string;
  icon: string;
}

export interface CompleteMissionResponse {
  missionId: string;
  awardedRp: number;
  awardedEnergy: number;
  newTotalRp?: number;
  newRoomEnergy?: number;
  earnedRewards: EarnedReward[];
}

interface CompleteMissionRequest {
  roomId: string;
  missionId: string;
  textValue?: string;
}

export function completeMission(
  client: CommandClient,
  input: CompleteMissionInput
): Promise<CommandResult<CompleteMissionResponse>> {
  return postCommand(client, 'complete-mission', buildCompleteMissionPayload(input));
}

function buildCompleteMissionPayload(input: CompleteMissionInput): CompleteMissionRequest {
  return {
    roomId: input.roomId,
    missionId: input.missionId,
    ...(input.textValue?.trim() ? { textValue: input.textValue.trim() } : {})
  };
}
