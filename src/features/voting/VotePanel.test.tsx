import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CommandResult } from '../../shared/api/commandClient';
import type { Candidate } from '../../shared/types/rallyroom';
import type { CastVoteInput, CastVoteResponse } from './castVoteApi';
import { VotePanel } from './VotePanel';
import { demoReadRepository } from '../../shared/api/demoReadRepository';

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
  candidates?: Candidate[];
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
  candidates = [candidate('candidate-1', '첫 번째 장면', 10), candidate('candidate-2', '두 번째 장면', 7)],
  isVotingOpen,
  closedReason,
  voteTickets = 5
}: RenderVotePanelOptions = {}) {
  return render(
    <VotePanel
      roomId="room-1"
      candidates={candidates}
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

  it('sorts candidate rows by vote count and shows vote share percentages', () => {
    renderVotePanel({
      candidates: [
        candidate('candidate-1', '낮은 득표 후보', 5),
        candidate('candidate-2', '높은 득표 후보', 15)
      ]
    });

    const candidateRows = within(screen.getByRole('list', { name: '투표 후보 목록' })).getAllByRole('listitem');

    expect(candidateRows[0]).toHaveTextContent('1');
    expect(candidateRows[0]).toHaveTextContent('높은 득표 후보');
    expect(candidateRows[0]).toHaveTextContent('75%');
    expect(candidateRows[1]).toHaveTextContent('2');
    expect(candidateRows[1]).toHaveTextContent('낮은 득표 후보');
    expect(candidateRows[1]).toHaveTextContent('25%');
  });

  it('uses voter-facing candidate helper copy instead of implementation terms', () => {
    renderVotePanel();

    const candidateList = screen.getByRole('list', { name: '투표 후보 목록' });

    expect(within(candidateList).getAllByText('실시간 집계')).toHaveLength(2);
    expect(within(candidateList).queryByText(/read model/i)).not.toBeInTheDocument();
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

  it('groups inline option controls into layout fields', async () => {
    const user = userEvent.setup();

    renderVotePanel();

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    await user.click(within(votePanel).getByRole('button', { name: '항목 추가' }));

    expect(within(votePanel).getByLabelText('새 투표 항목').closest('.inline-option-form__field')).toHaveClass(
      'inline-option-form__field--title'
    );
    expect(within(votePanel).getByLabelText('자동 투표권').closest('.inline-option-form__field')).toHaveClass(
      'inline-option-form__field--ticket'
    );
    expect(within(votePanel).getByRole('button', { name: '추가하고 1표 자동 투표' })).toHaveClass(
      'inline-option-form__submit'
    );
  });

  it('prevents adding an option while a vote command is pending', async () => {
    const user = userEvent.setup();
    let resolveVote: (response: CommandResult<CastVoteResponse>) => void = () => undefined;
    const castVoteCommand = vi.fn(
      () =>
        new Promise<CommandResult<CastVoteResponse>>((resolve) => {
          resolveVote = resolve;
        })
    );

    renderVotePanel({ castVoteCommand });

    const votePanel = screen.getByRole('region', { name: '투표 현황' });

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.click(within(votePanel).getByRole('button', { name: '투표하기' }));

    await waitFor(() => expect(within(votePanel).getByRole('button', { name: '항목 추가' })).toBeDisabled());

    resolveVote({
      ok: true,
      data: {
        roomId: 'room-1',
        candidateVotes: [{ candidateId: 'candidate-1', voteCount: 11 }],
        currentGoalValue: 201,
        participantCount: 42
      }
    });
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

  it('allows multiple votes when tickets are remaining and displays cumulative ticket count', async () => {
    const user = userEvent.setup();
    const castVoteCommand = vi.fn(async (): Promise<CommandResult<CastVoteResponse>> => ({
      ok: true,
      data: {
        roomId: 'room-1',
        candidateVotes: [{ candidateId: 'candidate-1', voteCount: 12 }],
        currentGoalValue: 202,
        participantCount: 42
      }
    }));

    renderVotePanel({
      castVoteCommand,
      voteTickets: 5
    });

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    
    expect(within(votePanel).queryByText(/내가 투표한 투표권:/)).not.toBeInTheDocument();

    await user.click(within(votePanel).getByRole('radio', { name: /첫 번째 장면/ }));
    await user.selectOptions(within(votePanel).getByLabelText('사용할 투표권'), '2');
    
    const submitButton = within(votePanel).getByRole('button', { name: '투표하기' });
    await user.click(submitButton);

    expect(await within(votePanel).findByText(/내가 투표한 투표권:/)).toHaveTextContent('내가 투표한 투표권: 2장');
    
    const nextButton = within(votePanel).getByRole('button', { name: '추가 투표하기' });
    expect(nextButton).not.toBeDisabled();

    await user.selectOptions(within(votePanel).getByLabelText('사용할 투표권'), '1');
    await user.click(nextButton);

    expect(await within(votePanel).findByText(/내가 투표한 투표권:/)).toHaveTextContent('내가 투표한 투표권: 3장');
  });

  it('renders RP exchange control, executes exchange update on click, and reflects updated tickets prop', async () => {
    const user = userEvent.setup();
    const exchangeMock = vi.spyOn(demoReadRepository, 'exchangeRpToTickets').mockImplementation(() => {
      const current = demoReadRepository.getProfile();
      demoReadRepository.updateProfile({
        totalRp: current.totalRp - 100,
        voteTickets: current.voteTickets + 1
      });
      return true;
    });

    const { rerender } = render(
      <VotePanel
        roomId="room-1"
        candidates={[candidate('candidate-1', '후보 1', 10)]}
        currentGoalValue={200}
        goalValue={500}
        participantCount={41}
        castVoteCommand={async () => ({ ok: true, data: { roomId: 'room-1', candidateVotes: [], currentGoalValue: 200, participantCount: 41 } })}
        voteTickets={0}
        userRp={250}
      />
    );

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const exchangeButton = within(votePanel).getByRole('button', { name: 'RP 교환' });
    const selectBox = within(votePanel).getByLabelText('사용할 투표권');

    expect(selectBox).toBeDisabled();

    await user.click(exchangeButton);

    expect(exchangeMock).toHaveBeenCalledWith(1);

    rerender(
      <VotePanel
        roomId="room-1"
        candidates={[candidate('candidate-1', '후보 1', 10)]}
        currentGoalValue={200}
        goalValue={500}
        participantCount={41}
        castVoteCommand={async () => ({ ok: true, data: { roomId: 'room-1', candidateVotes: [], currentGoalValue: 200, participantCount: 41 } })}
        voteTickets={1}
        userRp={150}
      />
    );

    expect(selectBox).not.toBeDisabled();

    exchangeMock.mockRestore();
  });

  it('prevents double-decrementing of tickets when prop updates after a successful vote', async () => {
    const user = userEvent.setup();
    let rerenderFn: any;

    const castVoteCommand = vi.fn(async (): Promise<CommandResult<CastVoteResponse>> => {
      // 실제 런타임처럼 투표 중 프로필 갱신 이벤트로 인해 부모가 먼저 리렌더링되는 시나리오 모사 (10ms 뒤 실행)
      setTimeout(() => {
        if (rerenderFn) {
          rerenderFn(
            <VotePanel
              roomId="room-1"
              candidates={[candidate('candidate-1', '후보 1', 11)]}
              currentGoalValue={201}
              goalValue={500}
              participantCount={42}
              castVoteCommand={castVoteCommand}
              voteTickets={2}
              userRp={100}
            />
          );
        }
      }, 10);

      // 투표 커맨드 응답은 20ms 뒤에 리졸브하여 타이밍 꼬임 유도
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            ok: true,
            data: {
              roomId: 'room-1',
              candidateVotes: [{ candidateId: 'candidate-1', voteCount: 11 }],
              currentGoalValue: 201,
              participantCount: 42
            }
          });
        }, 20);
      });
    });

    const { rerender } = render(
      <VotePanel
        roomId="room-1"
        candidates={[candidate('candidate-1', '후보 1', 10)]}
        currentGoalValue={200}
        goalValue={500}
        participantCount={41}
        castVoteCommand={castVoteCommand}
        voteTickets={3}
        userRp={100}
      />
    );
    rerenderFn = rerender;

    const votePanel = screen.getByRole('region', { name: '투표 현황' });
    const optionRadio = within(votePanel).getByRole('radio', { name: /후보 1/ });
    await user.click(optionRadio);

    const selectBox = within(votePanel).getByLabelText('사용할 투표권');
    await user.selectOptions(selectBox, '1');

    const submitButton = within(votePanel).getByRole('button', { name: '투표하기' });
    await user.click(submitButton);

    expect(castVoteCommand).toHaveBeenCalled();

    // 모든 비동기 상태 갱신 및 렌더링이 가라앉을 때까지 대기
    await new Promise((resolve) => setTimeout(resolve, 50));

    // 잔여 투표권이 2장이므로 option 갯수가 2개인지 검증 (버그 발생 시 1개로 깎여있을 것임)
    const optionsList = within(selectBox).getAllByRole('option');
    expect(optionsList).toHaveLength(2);
  });
});
