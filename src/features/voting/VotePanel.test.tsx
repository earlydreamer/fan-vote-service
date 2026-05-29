import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CommandResult } from '../../shared/api/commandClient';
import type { Candidate } from '../../shared/types/rallyroom';
import type { CastVoteInput, CastVoteResponse } from './castVoteApi';
import { VotePanel } from './VotePanel';

function candidate(id: string, title: string, voteCount: number): Candidate {
  return {
    id,
    targetId: `${id}-target`,
    title,
    status: 'approved',
    voteCount
  };
}

function renderVotePanel(
  castVoteCommand: (input: CastVoteInput) => Promise<CommandResult<CastVoteResponse>> = async () => ({
    ok: true,
    data: {
      roomId: 'room-1',
      candidateVotes: [{ candidateId: 'candidate-1', voteCount: 17 }],
      currentGoalValue: 230,
      participantCount: 42
    }
  })
) {
  return render(
    <VotePanel
      roomId="room-1"
      candidates={[candidate('candidate-1', '첫 번째 장면', 10), candidate('candidate-2', '두 번째 장면', 7)]}
      currentGoalValue={200}
      goalValue={500}
      participantCount={41}
      castVoteCommand={castVoteCommand}
    />
  );
}

describe('VotePanel', () => {
  it('submits only roomId and candidateIds after a candidate is selected', async () => {
    const user = userEvent.setup();
    const castVoteCommand = vi.fn(async (): Promise<CommandResult<CastVoteResponse>> => ({
      ok: true,
      data: {
        roomId: 'room-1',
        candidateVotes: [{ candidateId: 'candidate-1', voteCount: 17 }],
        currentGoalValue: 230,
        participantCount: 42
      }
    }));

    renderVotePanel(castVoteCommand);

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const submitButton = within(votePanel).getByRole('button', { name: '투표하기' });

    expect(submitButton).toBeDisabled();

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.click(submitButton);

    expect(castVoteCommand).toHaveBeenCalledWith({
      roomId: 'room-1',
      candidateIds: ['candidate-1']
    });
    const submittedInputs = castVoteCommand.mock.calls as unknown as Array<[CastVoteInput]>;
    const submittedInput = submittedInputs[0]?.[0];

    expect(JSON.stringify(submittedInput)).not.toContain('voteCount');
    expect(JSON.stringify(submittedInput)).not.toContain('currentGoalValue');
    expect(JSON.stringify(submittedInput)).not.toContain('participantCount');
  });

  it('updates counts and the energy gauge from a successful command response', async () => {
    const user = userEvent.setup();

    renderVotePanel();

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.click(within(votePanel).getByRole('button', { name: '투표하기' }));

    expect(await within(votePanel).findByRole('status')).toHaveTextContent('투표가 반영됐어요');
    expect(within(votePanel).getByText('17표')).toBeInTheDocument();
    expect(within(votePanel).getByText('7표')).toBeInTheDocument();
    expect(within(votePanel).getByText('42명 참여')).toBeInTheDocument();
    expect(within(votePanel).getByText('230 / 500')).toBeInTheDocument();
  });

  it('shows duplicate vote errors without optimistic count changes', async () => {
    const user = userEvent.setup();
    const castVoteCommand = vi.fn(async (): Promise<CommandResult<CastVoteResponse>> => ({
      ok: false,
      error: {
        code: 'DUPLICATE_VOTE',
        message: '이미 이 투표에 참여했어요.'
      }
    }));

    renderVotePanel(castVoteCommand);

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.click(within(votePanel).getByRole('button', { name: '투표하기' }));

    expect(await within(votePanel).findByRole('alert')).toHaveTextContent('이미 이 투표에 참여했어요.');
    expect(within(votePanel).getByText('10표')).toBeInTheDocument();
    expect(within(votePanel).getByText('41명 참여')).toBeInTheDocument();
  });
});
