import { type FormEvent } from 'react';
import { MessageSquareText, SendHorizontal } from 'lucide-react';
import type { MessageType, RoomMessage } from '../../shared/types/rallyroom';
import {
  MAX_MESSAGE_BODY_LENGTH,
  type PostRoomMessageCommand,
  usePostRoomMessage
} from './usePostRoomMessage';

export interface RoomMessagePanelProps {
  roomId: string;
  messages: RoomMessage[];
  postRoomMessageCommand: PostRoomMessageCommand;
  isMessageOpen?: boolean;
  closedReason?: string;
}

const messageTypeOptions: Array<{ value: MessageType; label: string }> = [
  { value: 'cheer', label: '응원' },
  { value: 'question', label: '질문' }
];

export function RoomMessagePanel({
  roomId,
  messages,
  postRoomMessageCommand,
  isMessageOpen = true,
  closedReason
}: RoomMessagePanelProps) {
  const messageState = usePostRoomMessage({
    roomId,
    messages,
    postRoomMessageCommand
  });
  const visibleMessages = messageState.messages.filter((message) => message.status === 'visible');
  const remainingCharacters = MAX_MESSAGE_BODY_LENGTH - messageState.body.trim().length;

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isMessageOpen) return;

    void messageState.submitMessage();
  };

  return (
    <section className="content-panel fan-wall" aria-labelledby="fan-wall-title">
      <div className="collection-heading compact">
        <div>
          <p className="eyebrow">Messages</p>
          <h2 id="fan-wall-title">팬월</h2>
        </div>
        <MessageSquareText size={18} aria-hidden="true" />
      </div>

      {isMessageOpen ? (
        <form className="message-form" onSubmit={handleSubmit}>
          <fieldset className="message-type-toggle">
            <legend className="sr-only">메시지 유형</legend>
            {messageTypeOptions.map((option) => (
              <label key={option.value} className="message-type-option">
                <input
                  type="radio"
                  name={`${roomId}-message-type`}
                  value={option.value}
                  checked={messageState.messageType === option.value}
                  onChange={() => messageState.setMessageType(option.value)}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </fieldset>

          <label className="message-field" htmlFor={`${roomId}-message-body`}>
            메시지 내용
          </label>
          <textarea
            id={`${roomId}-message-body`}
            value={messageState.body}
            onChange={(event) => messageState.setBody(event.target.value)}
            placeholder="투표 이유나 다음 후보 아이디어를 남겨보세요"
            aria-invalid={Boolean(messageState.error)}
            aria-describedby={`${roomId}-message-count`}
          />

          <div className="message-form__actions">
            <span id={`${roomId}-message-count`} className={remainingCharacters < 0 ? 'over-limit' : undefined}>
              {messageState.body.trim().length}/{MAX_MESSAGE_BODY_LENGTH}
            </span>
            <button type="submit" disabled={messageState.isSubmitting}>
              <SendHorizontal size={16} aria-hidden="true" />
              {messageState.isSubmitting ? '등록 중' : '메시지 남기기'}
            </button>
          </div>

          {messageState.error && (
            <p className="error-copy" role="alert">
              {messageState.error}
            </p>
          )}

          {messageState.receipt && (
            <p className="message-reward-receipt" role="status">
              +{messageState.receipt.awardedRp} RP · Energy +{messageState.receipt.awardedEnergy}
            </p>
          )}
        </form>
      ) : (
        <p className="guard-copy">{closedReason ?? '이 방은 더 이상 메시지를 받을 수 없어요.'}</p>
      )}

      <div className="message-list" aria-label="팬월 메시지 목록">
        {visibleMessages.map((message) => (
          <article
            key={message.id}
            className="message-row"
            aria-label={`${getMessageTypeLabel(message.type)} 메시지: ${message.body}`}
          >
            <span className="chip">{getMessageTypeLabel(message.type)}</span>
            <p>{message.body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function getMessageTypeLabel(type: MessageType): string {
  return type === 'cheer' ? '응원' : '질문';
}
