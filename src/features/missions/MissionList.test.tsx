import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CommandResult } from '../../shared/api/commandClient';
import type { Mission, MissionType } from '../../shared/types/rallyroom';
import type { CompleteMissionInput, CompleteMissionResponse } from './completeMissionApi';
import { MissionList } from './MissionList';

function mission(id: string, type: MissionType, title: string, isCompleted = false): Mission {
  return {
    id,
    type,
    title,
    rewardRp: type === 'message' ? 45 : 30,
    rewardEnergy: type === 'message' ? 30 : 25,
    isCompleted
  };
}

function renderMissionList(
  completeMissionCommand: (input: CompleteMissionInput) => Promise<CommandResult<CompleteMissionResponse>> = async () => ({
    ok: true,
    data: {
      missionId: 'mission-message',
      awardedRp: 77,
      awardedEnergy: 33,
      earnedRewards: [{ code: 'cheer_badge', name: '응원 배지', icon: '✨' }]
    }
  })
) {
  return render(
    <MissionList
      roomId="room-1"
      missions={[
        mission('mission-vote', 'vote', '오늘의 투표권 사용하기'),
        mission('mission-message', 'message', '선택 이유를 팬월에 남기기'),
        mission('mission-done', 'vote', '이미 완료한 미션', true)
      ]}
      completeMissionCommand={completeMissionCommand}
    />
  );
}

describe('MissionList', () => {
  it('blocks short text missions before calling the command', async () => {
    const user = userEvent.setup();
    const completeMissionCommand = vi.fn();

    renderMissionList(completeMissionCommand);

    const missionCard = screen.getByRole('article', { name: '선택 이유를 팬월에 남기기' });

    await user.type(within(missionCard).getByRole('textbox', { name: '선택 이유를 팬월에 남기기 입력' }), '짧아');
    await user.click(within(missionCard).getByRole('button', { name: '미션 완료하기' }));

    expect(await within(missionCard).findByRole('alert')).toHaveTextContent('10자 이상');
    expect(completeMissionCommand).not.toHaveBeenCalled();
  });

  it('sends only mission identity and text, then displays rewards from the response', async () => {
    const user = userEvent.setup();
    const completeMissionCommand = vi.fn(async (): Promise<CommandResult<CompleteMissionResponse>> => ({
      ok: true,
      data: {
        missionId: 'mission-message',
        awardedRp: 77,
        awardedEnergy: 33,
        earnedRewards: [{ code: 'cheer_badge', name: '응원 배지', icon: '✨' }]
      }
    }));

    renderMissionList(completeMissionCommand);

    const missionCard = screen.getByRole('article', { name: '선택 이유를 팬월에 남기기' });

    await user.type(
      within(missionCard).getByRole('textbox', { name: '선택 이유를 팬월에 남기기 입력' }),
      '이 장면을 다시 보고 싶어서 남겨요'
    );
    await user.click(within(missionCard).getByRole('button', { name: '미션 완료하기' }));

    expect(completeMissionCommand).toHaveBeenCalledWith({
      roomId: 'room-1',
      missionId: 'mission-message',
      textValue: '이 장면을 다시 보고 싶어서 남겨요'
    });
    const submittedInputs = completeMissionCommand.mock.calls as unknown as Array<[CompleteMissionInput]>;
    const submittedInput = submittedInputs[0]?.[0];

    expect(JSON.stringify(submittedInput)).not.toContain('rewardRp');
    expect(JSON.stringify(submittedInput)).not.toContain('rewardEnergy');
    expect(JSON.stringify(submittedInput)).not.toContain('awardedRp');
    expect(JSON.stringify(submittedInput)).not.toContain('totalRp');
    expect(JSON.stringify(submittedInput)).not.toContain('currentGoalValue');
    expect(await within(missionCard).findByRole('status')).toHaveTextContent('+77 RP');
    expect(within(missionCard).getByRole('status')).toHaveTextContent('Energy +33');
    expect(within(missionCard).getByRole('status')).toHaveTextContent('✨');
    expect(within(missionCard).getByRole('status')).toHaveTextContent('응원 배지');
    expect(within(missionCard).getByRole('button', { name: '완료했어요' })).toBeDisabled();
  });

  it('locks the mission when the command reports duplicate completion', async () => {
    const user = userEvent.setup();
    const completeMissionCommand = vi.fn(async (): Promise<CommandResult<CompleteMissionResponse>> => ({
      ok: false,
      error: {
        code: 'DUPLICATE_MISSION_COMPLETION',
        message: '이미 완료한 미션이에요.'
      }
    }));

    renderMissionList(completeMissionCommand);

    const missionCard = screen.getByRole('article', { name: '오늘의 투표권 사용하기' });

    await user.click(within(missionCard).getByRole('button', { name: '미션 완료하기' }));

    expect(await within(missionCard).findByRole('alert')).toHaveTextContent('이미 완료한 미션이에요.');
    expect(within(missionCard).getByRole('button', { name: '완료했어요' })).toBeDisabled();

    await user.click(within(missionCard).getByRole('button', { name: '완료했어요' }));

    expect(completeMissionCommand).toHaveBeenCalledTimes(1);
  });

  it('does not submit missions that are already completed', async () => {
    const user = userEvent.setup();
    const completeMissionCommand = vi.fn();

    renderMissionList(completeMissionCommand);

    const missionCard = screen.getByRole('article', { name: '이미 완료한 미션' });
    const completeButton = within(missionCard).getByRole('button', { name: '완료했어요' });

    expect(completeButton).toBeDisabled();

    await user.click(completeButton);

    expect(completeMissionCommand).not.toHaveBeenCalled();
  });
});
