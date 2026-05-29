import { useState } from 'react';
import type { CommandResult } from '../../shared/api/commandClient';
import type { Mission } from '../../shared/types/rallyroom';
import type { CompleteMissionInput, CompleteMissionResponse } from './completeMissionApi';

export const MIN_TEXT_MISSION_LENGTH = 10;

export type CompleteMissionCommand = (
  input: CompleteMissionInput
) => Promise<CommandResult<CompleteMissionResponse>>;

export interface MissionRewardReceipt {
  awardedRp: number;
  awardedEnergy: number;
  earnedRewards: string[];
}

export interface UseCompleteMissionOptions {
  roomId: string;
  missions: Mission[];
  completeMissionCommand: CompleteMissionCommand;
}

export interface UseCompleteMissionResult {
  missions: Mission[];
  textValues: Record<string, string>;
  receipts: Record<string, MissionRewardReceipt>;
  errors: Record<string, string>;
  submittingMissionId: string | null;
  setTextValue(missionId: string, value: string): void;
  completeMission(missionId: string): Promise<void>;
}

export function useCompleteMission(options: UseCompleteMissionOptions): UseCompleteMissionResult {
  const [missions, setMissions] = useState<Mission[]>(options.missions);
  const [textValues, setTextValues] = useState<Record<string, string>>({});
  const [receipts, setReceipts] = useState<Record<string, MissionRewardReceipt>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submittingMissionId, setSubmittingMissionId] = useState<string | null>(null);

  const setTextValue = (missionId: string, value: string) => {
    setTextValues((current) => ({ ...current, [missionId]: value }));
  };

  const completeMission = async (missionId: string) => {
    const mission = missions.find((item) => item.id === missionId);
    if (!mission || mission.isCompleted || submittingMissionId) return;

    const textValue = textValues[missionId]?.trim() ?? '';
    if (requiresText(mission) && textValue.length < MIN_TEXT_MISSION_LENGTH) {
      setErrors((current) => ({
        ...current,
        [missionId]: `텍스트 미션은 ${MIN_TEXT_MISSION_LENGTH}자 이상 입력해 주세요.`
      }));
      return;
    }

    setSubmittingMissionId(missionId);
    setErrors((current) => {
      const { [missionId]: _removed, ...rest } = current;
      return rest;
    });

    const result = await options.completeMissionCommand({
      roomId: options.roomId,
      missionId,
      ...(textValue ? { textValue } : {})
    });

    if (result.ok) {
      setMissions((current) =>
        current.map((item) => (item.id === missionId ? { ...item, isCompleted: true } : item))
      );
      setReceipts((current) => ({
        ...current,
        [missionId]: {
          awardedRp: result.data.awardedRp,
          awardedEnergy: result.data.awardedEnergy,
          earnedRewards: result.data.earnedRewards
        }
      }));
    } else {
      setErrors((current) => ({
        ...current,
        [missionId]: result.error.message
      }));
    }

    setSubmittingMissionId(null);
  };

  return {
    missions,
    textValues,
    receipts,
    errors,
    submittingMissionId,
    setTextValue,
    completeMission
  };
}

function requiresText(mission: Mission): boolean {
  return mission.type === 'message';
}
