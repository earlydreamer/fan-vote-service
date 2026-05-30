import { CheckCircle2, Sparkles } from 'lucide-react';
import type { Mission } from '../../shared/types/rallyroom';
import { Button } from '../../shared/ui/Button';
import { type CompleteMissionCommand, useCompleteMission } from './useCompleteMission';

export interface MissionListProps {
  roomId: string;
  missions: Mission[];
  completeMissionCommand: CompleteMissionCommand;
}

export function MissionList({ roomId, missions, completeMissionCommand }: MissionListProps) {
  const missionState = useCompleteMission({
    roomId,
    missions,
    completeMissionCommand
  });

  return (
    <section className="content-panel mission-panel" aria-labelledby="mission-panel-title">
      <div className="collection-heading compact">
        <div>
          <p className="eyebrow">미션</p>
          <h2 id="mission-panel-title">참여 미션</h2>
        </div>
        <Sparkles size={18} aria-hidden="true" />
      </div>

      <div className="mission-card-grid">
        {missionState.missions.map((mission) => {
          const receipt = missionState.receipts[mission.id];
          const error = missionState.errors[mission.id];
          const isSubmitting = missionState.submittingMissionId === mission.id;
          const isAnyMissionSubmitting = missionState.submittingMissionId !== null;
          const isCompleted = mission.isCompleted || Boolean(receipt);
          const earnedRewardText = receipt?.earnedRewards
            .map((reward) => `${reward.icon} ${reward.name}`)
            .join(' · ');
          const titleId = `${mission.id}-title`;

          return (
            <article key={mission.id} className="mission-card" aria-labelledby={titleId}>
              <span className="chip chip-mission">+{mission.rewardRp} RP</span>
              <h3 id={titleId}>{mission.title}</h3>
              <p>Energy +{mission.rewardEnergy}</p>

              {mission.type === 'message' && !isCompleted && (
                <label className="mission-card__text-field">
                  <textarea
                    aria-label={`${mission.title} 입력`}
                    value={missionState.textValues[mission.id] ?? ''}
                    onChange={(event) => missionState.setTextValue(mission.id, event.target.value)}
                    placeholder="선택 이유를 10자 이상 남겨 주세요"
                  />
                </label>
              )}

              <Button
                variant="unstyled"
                className="mission-card__button"
                disabled={isCompleted || isAnyMissionSubmitting}
                onClick={() => {
                  void missionState.completeMission(mission.id);
                }}
              >
                {isCompleted ? (
                  <>
                    <CheckCircle2 size={16} aria-hidden="true" />
                    완료했어요
                  </>
                ) : isSubmitting ? (
                  '처리하고 있어요'
                ) : (
                  '미션 완료하기'
                )}
              </Button>

              {error && (
                <p className="error-copy" role="alert">
                  {error}
                </p>
              )}

              {receipt && (
                <p className="mission-card__receipt" role="status">
                  +{receipt.awardedRp} RP · Energy +{receipt.awardedEnergy}
                  {earnedRewardText ? ` · ${earnedRewardText}` : ''}
                </p>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
