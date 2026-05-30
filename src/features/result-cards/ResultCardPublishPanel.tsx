import { Rocket } from 'lucide-react';
import { type PublishResultCardCommand, usePublishResultCard } from './usePublishResultCard';
import { Button } from '../../shared/ui/Button';

export interface ResultCardPublishPanelProps {
  roomId: string;
  roomTitle: string;
  isOwner: boolean;
  isPublishable: boolean;
  unavailableReason: string;
  publishResultCardCommand: PublishResultCardCommand;
}

export function ResultCardPublishPanel({
  roomId,
  roomTitle,
  isOwner,
  isPublishable,
  unavailableReason,
  publishResultCardCommand
}: ResultCardPublishPanelProps) {
  const publishState = usePublishResultCard({
    roomId,
    publishResultCardCommand
  });
  const titleId = `${roomId}-result-publish-title`;

  return (
    <section className="content-panel result-publish-panel" aria-labelledby={titleId}>
      <div className="collection-heading compact">
        <div>
          <p className="eyebrow">방장 작업</p>
          <h2 id={titleId}>결과 카드 만들기</h2>
        </div>
        <Rocket size={18} aria-hidden="true" />
      </div>

      {isPublishable && <p className="result-publish-panel__room">{roomTitle}</p>}

      {!isOwner ? (
        <p className="guard-copy">방장만 결과 카드를 발행할 수 있어요.</p>
      ) : (
        <>
          {!isPublishable && <p className="guard-copy">{unavailableReason}</p>}
          <Button
            variant="unstyled"
            className="result-publish-panel__button"
            disabled={!isPublishable || publishState.isSubmitting}
            onClick={() => {
              void publishState.publishResultCard();
            }}
          >
            {publishState.isSubmitting ? '결과 카드 준비 중' : '결과 카드 만들기'}
          </Button>
        </>
      )}

      {publishState.error && (
        <p className="error-copy" role="alert">
          {publishState.error}
        </p>
      )}

      {publishState.receipt && (
        <div className="result-publish-panel__receipt" role="status">
          <p>결과 카드를 만들었어요</p>
          <a
            href={publishState.receipt.redirectTo}
            target={getRedirectTarget(publishState.receipt.redirectTo)}
          >
            결과 카드 보러가기
          </a>
        </div>
      )}
    </section>
  );
}

function getRedirectTarget(redirectTo: string): '_self' | undefined {
  const redirectUrl = new URL(redirectTo, window.location.origin);

  return redirectUrl.origin === window.location.origin && redirectUrl.pathname === window.location.pathname
    ? '_self'
    : undefined;
}
