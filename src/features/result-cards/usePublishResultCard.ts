import { useState } from 'react';
import type { CommandResult } from '../../shared/api/commandClient';
import type { PublishResultCardInput, PublishResultCardResponse } from './publishResultCardApi';

export type PublishResultCardCommand = (
  input: PublishResultCardInput
) => Promise<CommandResult<PublishResultCardResponse>>;

export interface PublishResultReceipt {
  resultCardId: string;
  redirectTo: string;
}

export interface UsePublishResultCardOptions {
  roomId: string;
  publishResultCardCommand: PublishResultCardCommand;
}

export interface UsePublishResultCardResult {
  receipt: PublishResultReceipt | null;
  error: string | null;
  isSubmitting: boolean;
  publishResultCard(): Promise<void>;
}

export function usePublishResultCard(options: UsePublishResultCardOptions): UsePublishResultCardResult {
  const [receipt, setReceipt] = useState<PublishResultReceipt | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const publishResultCard = async () => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const result = await options.publishResultCardCommand({
      roomId: options.roomId
    });

    if (result.ok) {
      setReceipt({
        resultCardId: result.data.resultCardId,
        redirectTo: result.data.redirectTo
      });
    } else {
      setReceipt(null);
      setError(result.error.message);
    }

    setIsSubmitting(false);
  };

  return {
    receipt,
    error,
    isSubmitting,
    publishResultCard
  };
}
