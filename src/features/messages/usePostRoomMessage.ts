import { useState } from 'react';
import type { CommandResult } from '../../shared/api/commandClient';
import type { MessageType, RoomMessage } from '../../shared/types/rallyroom';
import type { PostRoomMessageInput, PostRoomMessageResponse } from './postRoomMessageApi';

export const MAX_MESSAGE_BODY_LENGTH = 280;

export type PostRoomMessageCommand = (
  input: PostRoomMessageInput
) => Promise<CommandResult<PostRoomMessageResponse>>;

export interface MessageRewardReceipt {
  awardedRp: number;
  awardedEnergy: number;
}

export interface UsePostRoomMessageOptions {
  roomId: string;
  messages: RoomMessage[];
  postRoomMessageCommand: PostRoomMessageCommand;
}

export interface UsePostRoomMessageResult {
  messages: RoomMessage[];
  messageType: MessageType;
  body: string;
  error: string | null;
  receipt: MessageRewardReceipt | null;
  isSubmitting: boolean;
  setMessageType(type: MessageType): void;
  setBody(body: string): void;
  submitMessage(): Promise<void>;
}

export function usePostRoomMessage(options: UsePostRoomMessageOptions): UsePostRoomMessageResult {
  const [messages, setMessages] = useState<RoomMessage[]>(options.messages);
  const [messageType, setMessageType] = useState<MessageType>('cheer');
  const [body, setBody] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [receipt, setReceipt] = useState<MessageRewardReceipt | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitMessage = async () => {
    if (isSubmitting) return;

    const trimmedBody = body.trim();

    if (!trimmedBody) {
      setError('메시지를 입력해 주세요.');
      setReceipt(null);
      return;
    }

    if (trimmedBody.length > MAX_MESSAGE_BODY_LENGTH) {
      setError(`${MAX_MESSAGE_BODY_LENGTH}자 이하로 입력해 주세요.`);
      setReceipt(null);
      return;
    }

    setIsSubmitting(true);
    setError(null);

    const submittedType = messageType;
    const result = await options.postRoomMessageCommand({
      roomId: options.roomId,
      type: submittedType,
      body: trimmedBody
    });

    if (result.ok) {
      setMessages((current) => [
        {
          id: result.data.message.id,
          type: result.data.message.type ?? submittedType,
          body: result.data.message.body,
          status: 'visible',
          createdAt: result.data.message.createdAt
        },
        ...current
      ]);
      setReceipt({
        awardedRp: result.data.awardedRp ?? 0,
        awardedEnergy: result.data.awardedEnergy ?? 0
      });
      setBody('');
    } else {
      setError(result.error.message);
      setReceipt(null);
    }

    setIsSubmitting(false);
  };

  return {
    messages,
    messageType,
    body,
    error,
    receipt,
    isSubmitting,
    setMessageType,
    setBody,
    submitMessage
  };
}
