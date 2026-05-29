import { Trophy } from 'lucide-react';

export interface ResultCardPreviewProps {
  roomTitle: string;
  winnerTitle: string;
  topMessage: string;
  totalParticipants: number;
  earnedIcon: string;
}

export function ResultCardPreview({
  roomTitle,
  winnerTitle,
  topMessage,
  totalParticipants,
  earnedIcon
}: ResultCardPreviewProps) {
  return (
    <article className="result-poster result-card-preview" aria-label={`${roomTitle} 공유용 결과 카드 미리보기`}>
      <Trophy size={32} aria-hidden="true" />
      <p className="result-kicker">{roomTitle}</p>
      <h1 id="result-title">결과 카드</h1>
      <h2>{winnerTitle}</h2>
      <p>{topMessage}</p>
      <div className="result-card-preview__stats">
        <span>{totalParticipants.toLocaleString()}명 참여</span>
        <span className="chip chip-reward">{earnedIcon}</span>
      </div>
    </article>
  );
}
