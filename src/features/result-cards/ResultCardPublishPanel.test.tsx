import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import type { CommandResult } from '../../shared/api/commandClient';
import type { PublishResultCardInput, PublishResultCardResponse } from './publishResultCardApi';
import { ResultCardPublishPanel } from './ResultCardPublishPanel';

type PublishResultCardCommand = (
  input: PublishResultCardInput
) => Promise<CommandResult<PublishResultCardResponse>>;

function renderPublishPanel({
  isOwner = true,
  isPublishable = true,
  publishResultCardCommand = async () => ({
    ok: true,
    data: {
      resultCardId: 'result-card-1',
      redirectTo: '/rooms/room-closed/result'
    }
  })
}: {
  isOwner?: boolean;
  isPublishable?: boolean;
  publishResultCardCommand?: PublishResultCardCommand;
} = {}) {
  return render(
    <ResultCardPublishPanel
      roomId="room-closed"
      roomTitle="막 내린 투표방"
      isOwner={isOwner}
      isPublishable={isPublishable}
      unavailableReason="투표가 종료된 뒤 발행할 수 있어요."
      publishResultCardCommand={publishResultCardCommand}
    />
  );
}

describe('ResultCardPublishPanel', () => {
  it('lets the owner publish with roomId only and shows the redirect from the response', async () => {
    const user = userEvent.setup();
    const publishResultCardCommand = vi.fn<PublishResultCardCommand>(async () => ({
      ok: true,
      data: {
        resultCardId: 'result-card-1',
        redirectTo: '/rooms/room-closed/result'
      }
    }));

    renderPublishPanel({ publishResultCardCommand });

    const panel = screen.getByRole('region', { name: '결과 카드 발행' });

    await user.click(within(panel).getByRole('button', { name: '결과 카드 발행' }));

    expect(publishResultCardCommand).toHaveBeenCalledWith({
      roomId: 'room-closed'
    });
    const submittedInputs = publishResultCardCommand.mock.calls as unknown as Array<[PublishResultCardInput]>;
    const submittedInput = submittedInputs[0]?.[0];

    expect(JSON.stringify(submittedInput)).not.toContain('winnerCandidateId');
    expect(JSON.stringify(submittedInput)).not.toContain('totalParticipants');
    expect(JSON.stringify(submittedInput)).not.toContain('topMessage');
    expect(JSON.stringify(submittedInput)).not.toContain('voteCount');
    expect(await within(panel).findByRole('status')).toHaveTextContent('결과 카드 발행 요청 완료');
    expect(within(panel).getByRole('link', { name: '발행된 결과 카드로 이동' })).toHaveAttribute(
      'href',
      '/rooms/room-closed/result'
    );
  });

  it('hides the publish button from non-owners', () => {
    const publishResultCardCommand = vi.fn<PublishResultCardCommand>();

    renderPublishPanel({
      isOwner: false,
      publishResultCardCommand
    });

    const panel = screen.getByRole('region', { name: '결과 카드 발행' });

    expect(within(panel).getByText('방장만 결과 카드를 발행할 수 있어요.')).toBeInTheDocument();
    expect(within(panel).queryByRole('button', { name: '결과 카드 발행' })).not.toBeInTheDocument();
    expect(publishResultCardCommand).not.toHaveBeenCalled();
  });

  it('keeps ongoing rooms from calling the publish command', async () => {
    const user = userEvent.setup();
    const publishResultCardCommand = vi.fn<PublishResultCardCommand>();

    renderPublishPanel({
      isPublishable: false,
      publishResultCardCommand
    });

    const panel = screen.getByRole('region', { name: '결과 카드 발행' });
    const publishButton = within(panel).getByRole('button', { name: '결과 카드 발행' });

    expect(within(panel).getByText('투표가 종료된 뒤 발행할 수 있어요.')).toBeInTheDocument();
    expect(publishButton).toBeDisabled();

    await user.click(publishButton);

    expect(publishResultCardCommand).not.toHaveBeenCalled();
  });

  it('shows command errors without creating a redirect', async () => {
    const user = userEvent.setup();
    const publishResultCardCommand = vi.fn<PublishResultCardCommand>(async () => ({
      ok: false,
      error: {
        code: 'FORBIDDEN',
        message: '이 작업을 수행할 권한이 없어요.'
      }
    }));

    renderPublishPanel({ publishResultCardCommand });

    const panel = screen.getByRole('region', { name: '결과 카드 발행' });

    await user.click(within(panel).getByRole('button', { name: '결과 카드 발행' }));

    expect(await within(panel).findByRole('alert')).toHaveTextContent('이 작업을 수행할 권한이 없어요.');
    expect(within(panel).queryByRole('link', { name: '발행된 결과 카드로 이동' })).not.toBeInTheDocument();
  });

  it('marks same-route redirects to bypass the SPA router and reload the result page', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/rooms/room-closed/result');

    renderPublishPanel();

    const panel = screen.getByRole('region', { name: '결과 카드 발행' });

    await user.click(within(panel).getByRole('button', { name: '결과 카드 발행' }));

    expect(await within(panel).findByRole('status')).toHaveTextContent('결과 카드 발행 요청 완료');
    expect(within(panel).getByRole('link', { name: '발행된 결과 카드로 이동' })).toHaveAttribute('target', '_self');
  });

  it('treats canonical redirects as the same result route even when the current URL has search params', async () => {
    const user = userEvent.setup();
    window.history.pushState({}, '', '/rooms/room-closed/result?from=publish');

    renderPublishPanel();

    const panel = screen.getByRole('region', { name: '결과 카드 발행' });

    await user.click(within(panel).getByRole('button', { name: '결과 카드 발행' }));

    expect(await within(panel).findByRole('status')).toHaveTextContent('결과 카드 발행 요청 완료');
    expect(within(panel).getByRole('link', { name: '발행된 결과 카드로 이동' })).toHaveAttribute('target', '_self');
  });
});
