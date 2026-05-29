interface ProgressMeterProps {
  label: string;
  value: number;
  max: number;
  tone?: 'energy' | 'mission' | 'reward';
}

export function ProgressMeter({ label, value, max, tone = 'energy' }: ProgressMeterProps) {
  const percent = Math.min(Math.round((value / max) * 100), 100);

  return (
    <div className="progress-meter" data-tone={tone}>
      <div className="progress-meter__row">
        <span>{label}</span>
        <strong>
          {value.toLocaleString()} / {max.toLocaleString()}
        </strong>
      </div>
      <div className="progress-meter__track" aria-hidden="true">
        <span style={{ inlineSize: `${percent}%` }} />
      </div>
      <span className="sr-only">{percent}% 달성</span>
    </div>
  );
}
