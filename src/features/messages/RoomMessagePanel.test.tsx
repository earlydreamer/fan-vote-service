import { fireEvent, render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CommandResult } from '../../shared/api/commandClient';
import type { MessageType, RoomMessage } from '../../shared/types/rallyroom';
import type { PostRoomMessageInput, PostRoomMessageResponse } from './postRoomMessageApi';
import { RoomMessagePanel } from './RoomMessagePanel';

type PostRoomMessageCommand = (
  input: PostRoomMessageInput
) => Promise<CommandResult<PostRoomMessageResponse>>;

function message(id: string, type: MessageType, body: string): RoomMessage {
  return {
    id,
    type,
    body,
    status: 'visible',
    createdAt: '2026-05-30T09:00:00.000Z'
  };
}

function renderRoomMessagePanel(
  postRoomMessageCommand: PostRoomMessageCommand = async (input) => ({
    ok: true,
    data: {
      message: {
        id: 'message-new',
        type: input.type,
        body: input.body,
        createdAt: '2026-05-30T09:05:00.000Z'
      },
      awardedRp: 12,
      awardedEnergy: 4
    }
  })
) {
  return render(
    <RoomMessagePanel
      roomId="room-1"
      messages={[
        message('message-1', 'cheer', '첫 장면 조명이 아직도 기억나요.'),
        message('message-2', 'question', '다음 후보도 추가할 수 있나요?')
      ]}
      postRoomMessageCommand={postRoomMessageCommand}
    />
  );
}

describe('RoomMessagePanel', () => {
  it('blocks empty messages before calling the command', async () => {
    const user = userEvent.setup();
    const postRoomMessageCommand = vi.fn<PostRoomMessageCommand>();

    renderRoomMessagePanel(postRoomMessageCommand);

    const fanWall = screen.getByRole('region', { name: '팬월' });

    await user.type(within(fanWall).getByRole('textbox', { name: '메시지 내용' }), '   ');
    await user.click(within(fanWall).getByRole('button', { name: '메시지 남기기' }));

    expect(await within(fanWall).findByRole('alert')).toHaveTextContent('메시지를 입력해 주세요.');
    expect(postRoomMessageCommand).not.toHaveBeenCalled();
  });

  it('blocks messages that exceed the body length limit', async () => {
    const user = userEvent.setup();
    const postRoomMessageCommand = vi.fn<PostRoomMessageCommand>();

    renderRoomMessagePanel(postRoomMessageCommand);

    const fanWall = screen.getByRole('region', { name: '팬월' });

    const messageInput = within(fanWall).getByRole('textbox', { name: '메시지 내용' });
    fireEvent.change(messageInput, { target: { value: '가'.repeat(281) } });
    await user.click(within(fanWall).getByRole('button', { name: '메시지 남기기' }));

    expect(await within(fanWall).findByRole('alert')).toHaveTextContent('280자 이하');
    expect(postRoomMessageCommand).not.toHaveBeenCalled();
  });

  it('sends only message identity and body, then displays the response message and rewards', async () => {
    const user = userEvent.setup();
    const postRoomMessageCommand = vi.fn<PostRoomMessageCommand>(async (input) => ({
      ok: true,
      data: {
        message: {
          id: 'message-new',
          type: input.type,
          body: input.body,
          createdAt: '2026-05-30T09:05:00.000Z'
        },
        awardedRp: 12,
        awardedEnergy: 4
      }
    }));

    renderRoomMessagePanel(postRoomMessageCommand);

    const fanWall = screen.getByRole('region', { name: '팬월' });
    const messageInput = within(fanWall).getByRole('textbox', { name: '메시지 내용' });

    await user.click(within(fanWall).getByRole('radio', { name: '질문' }));
    await user.type(messageInput, '  다음 후보는 누구인가요?  ');
    await user.click(within(fanWall).getByRole('button', { name: '메시지 남기기' }));

    expect(postRoomMessageCommand).toHaveBeenCalledWith({
      roomId: 'room-1',
      type: 'question',
      body: '다음 후보는 누구인가요?'
    });
    const submittedInputs = postRoomMessageCommand.mock.calls as unknown as Array<[PostRoomMessageInput]>;
    const submittedInput = submittedInputs[0]?.[0];

    expect(JSON.stringify(submittedInput)).not.toContain('awardedRp');
    expect(JSON.stringify(submittedInput)).not.toContain('awardedEnergy');
    expect(JSON.stringify(submittedInput)).not.toContain('totalRp');
    expect(JSON.stringify(submittedInput)).not.toContain('currentGoalValue');
    expect(await within(fanWall).findByText('다음 후보는 누구인가요?')).toBeInTheDocument();
    expect(within(fanWall).getByRole('status')).toHaveTextContent('+12 RP');
    expect(within(fanWall).getByRole('status')).toHaveTextContent('Energy +4');
    expect(messageInput).toHaveValue('');
  });

  it('shows command errors without adding a message', async () => {
    const user = userEvent.setup();
    const postRoomMessageCommand = vi.fn<PostRoomMessageCommand>(async () => ({
      ok: false,
      error: {
        code: 'RATE_LIMITED',
        message: '잠시 쉬었다가 다시 시도해 주세요.'
      }
    }));

    renderRoomMessagePanel(postRoomMessageCommand);

    const fanWall = screen.getByRole('region', { name: '팬월' });

    await user.type(within(fanWall).getByRole('textbox', { name: '메시지 내용' }), '속도 제한 테스트 메시지');
    await user.click(within(fanWall).getByRole('button', { name: '메시지 남기기' }));

    expect(await within(fanWall).findByRole('alert')).toHaveTextContent(
      '잠시 쉬었다가 다시 시도해 주세요.'
    );
    expect(within(fanWall).queryByRole('article', { name: /속도 제한 테스트 메시지/ })).not.toBeInTheDocument();
  });
});
