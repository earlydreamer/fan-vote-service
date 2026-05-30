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

interface RenderVotePanelOptions {
  castVoteCommand?: (input: CastVoteInput) => Promise<CommandResult<CastVoteResponse>>;
  isVotingOpen?: boolean;
  closedReason?: string;
  voteTickets?: number;
}

function renderVotePanel({
  castVoteCommand = async () => ({
    ok: true,
    data: {
      roomId: 'room-1',
      candidateVotes: [{ candidateId: 'candidate-1', voteCount: 17 }],
      currentGoalValue: 230,
      participantCount: 42
    }
  }),
  isVotingOpen,
  closedReason,
  voteTickets = 5
}: RenderVotePanelOptions = {}) {
  return render(
    <VotePanel
      roomId="room-1"
      candidates={[candidate('candidate-1', '첫 번째 장면', 10), candidate('candidate-2', '두 번째 장면', 7)]}
      currentGoalValue={200}
      goalValue={500}
      participantCount={41}
      castVoteCommand={castVoteCommand}
      isVotingOpen={isVotingOpen}
      closedReason={closedReason}
      voteTickets={voteTickets}
    />
  );
}

describe('VotePanel', () => {
  it('renders candidates as a vertical list with ticket spending controls', () => {
    renderVotePanel();

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const candidateList = within(votePanel).getByRole('list', { name: '투표 후보 목록' });

    expect(candidateList).toHaveClass('candidate-list');
    expect(within(candidateList).getAllByRole('radio')).toHaveLength(2);
    expect(within(votePanel).getByLabelText('사용할 투표권')).toHaveValue('1');
  });

  it('submits roomId, candidateIds, and voteTicketCount after a candidate is selected', async () => {
    const user = userEvent.setup();
    const castVoteCommand = vi.fn(async (): Promise<CommandResult<CastVoteResponse>> => ({
      ok: true,
      data: {
        roomId: 'room-1',
        candidateVotes: [{ candidateId: 'candidate-1', voteCount: 19 }],
        currentGoalValue: 203,
        participantCount: 42
      }
    }));

    renderVotePanel({ castVoteCommand });

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const submitButton = within(votePanel).getByRole('button', { name: '투표하기' });

    expect(submitButton).toBeDisabled();

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.selectOptions(within(votePanel).getByLabelText('사용할 투표권'), '3');
    await user.click(submitButton);

    expect(castVoteCommand).toHaveBeenCalledWith({
      roomId: 'room-1',
      candidateIds: ['candidate-1'],
      voteTicketCount: 3
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

  it('closes the current vote when Vote Energy reaches the goal', async () => {
    const user = userEvent.setup();
    const castVoteCommand = vi.fn(async (): Promise<CommandResult<CastVoteResponse>> => ({
      ok: true,
      data: {
        roomId: 'room-1',
        candidateVotes: [{ candidateId: 'candidate-1', voteCount: 310 }],
        currentGoalValue: 500,
        participantCount: 42
      }
    }));

    renderVotePanel({ castVoteCommand });

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.click(within(votePanel).getByRole('button', { name: '투표하기' }));

    expect(await within(votePanel).findByRole('status')).toHaveTextContent('Vote Energy가 가득 차 투표가 마감됐어요.');
    expect(within(votePanel).getByRole('button', { name: '투표 마감' })).toBeDisabled();
  });

  it('adds an option inline with automatic votes from spent tickets', async () => {
    const user = userEvent.setup();

    renderVotePanel();

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    await user.click(within(votePanel).getByRole('button', { name: '항목 추가' }));
    await user.type(within(votePanel).getByLabelText('새 투표 항목'), '세 번째 장면');
    await user.selectOptions(within(votePanel).getByLabelText('자동 투표권'), '2');
    await user.click(within(votePanel).getByRole('button', { name: '추가하고 2표 자동 투표' }));

    const candidateList = within(votePanel).getByRole('list', { name: '투표 후보 목록' });

    expect(within(candidateList).getByText('세 번째 장면')).toBeInTheDocument();
    expect(within(candidateList).getByText('2표')).toBeInTheDocument();
    expect(within(votePanel).getByText('202 / 500')).toBeInTheDocument();
    expect(within(votePanel).getByRole('status')).toHaveTextContent('세 번째 장면 항목을 추가하고 2표를 자동 반영했어요.');
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

    renderVotePanel({ castVoteCommand });

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.click(within(votePanel).getByRole('button', { name: '투표하기' }));

    expect(await within(votePanel).findByRole('alert')).toHaveTextContent('이미 이 투표에 참여했어요.');
    expect(within(votePanel).getByText('10표')).toBeInTheDocument();
    expect(within(votePanel).getByText('41명 참여')).toBeInTheDocument();
  });

  it('keeps closed rooms read-only and never calls the vote command', async () => {
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

    renderVotePanel({
      castVoteCommand,
      isVotingOpen: false,
      closedReason: '결과가 공개된 방은 투표가 종료됐어요.'
    });

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const submitButton = within(votePanel).getByRole('button', { name: '투표 종료' });

    expect(within(votePanel).getByText('결과가 공개된 방은 투표가 종료됐어요.')).toBeInTheDocument();
    expect(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ })).toBeDisabled();
    expect(submitButton).toBeDisabled();

    await user.click(submitButton);

    expect(castVoteCommand).not.toHaveBeenCalled();
    expect(within(votePanel).getByText('10표')).toBeInTheDocument();
    expect(within(votePanel).getByText('41명 참여')).toBeInTheDocument();
  });
});
