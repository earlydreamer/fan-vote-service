import { type FormEvent, useState } from 'react';
import { CheckCircle2, ImagePlus, PlusCircle, Ticket, X } from 'lucide-react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import type { PollFormat } from '../../shared/types/rallyroom';
import {
  buildCreateRoomCommand,
  type CreateRoomCommandPayload,
  type CreateRoomFormInput
} from './createRoomCommand';
import { buildCreateRoomReceipt, type CreateRoomReceiptViewModel } from './createRoomReceipt';

const pollFormatOptions: Array<{ value: PollFormat; label: string }> = [
  { value: 'single', label: '단일 선택' },
  { value: 'matchup', label: '1:1 매치업' },
  { value: 'bracket', label: '브래킷' },
  { value: 'scene', label: '장면 선택' },
  { value: 'line', label: '대사 선택' },
  { value: 'quick', label: '퀵 투표' }
];

const initialCandidates = ['첫 장면 스포트라이트', '합창 엔딩 포즈', '커튼콜 실루엣', '원테이크 카메라 워크'];

export function RoomCreatePage() {
  const dashboard = demoReadRepository.getDashboard();
  const [formInput, setFormInput] = useState<CreateRoomFormInput>({
    roomTitle: '은하 무대 오프닝 투표방',
    voteTitle: '가상 쇼케이스 최고의 오프닝 장면',
    topic: '공식 전달 없이 팬 기록으로 남기는 장면 투표',
    categoryId: dashboard.categories[0]?.id ?? '',
    targetId: dashboard.targets[0]?.id ?? '',
    pollFormat: 'single',
    endAt: '2026-05-31T23:59',
    rewardIcon: 'Spotlight',
    candidates: initialCandidates,
    addOptionCost: {
      voteTickets: 1,
      rp: 120
    }
  });
  const [newCandidateTitle, setNewCandidateTitle] = useState('');
  const [errors, setErrors] = useState<string[]>([]);
  const [payload, setPayload] = useState<CreateRoomCommandPayload | null>(null);
  const [receipt, setReceipt] = useState<CreateRoomReceiptViewModel | null>(null);

  const updateField = <Key extends keyof CreateRoomFormInput>(key: Key, value: CreateRoomFormInput[Key]) => {
    setFormInput((currentInput) => ({
      ...currentInput,
      [key]: value
    }));
    setPayload(null);
    setReceipt(null);
  };

  const handleAddCandidate = () => {
    const candidateTitle = newCandidateTitle.trim();
    if (!candidateTitle) return;

    updateField('candidates', [...formInput.candidates, candidateTitle]);
    setNewCandidateTitle('');
  };

  const handleRemoveCandidate = (indexToRemove: number) => {
    updateField(
      'candidates',
      formInput.candidates.filter((_, index) => index !== indexToRemove)
    );
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const result = buildCreateRoomCommand(formInput);

    if (!result.ok) {
      setErrors(result.errors);
      setPayload(null);
      setReceipt(null);
      return;
    }

    setErrors([]);
    setPayload(result.payload);
    setReceipt(buildCreateRoomReceipt(result.payload));
  };

  return (
    <div className="create-studio-page">
      <section className="create-studio-hero" aria-labelledby="room-create-title">
        <div>
          <p className="eyebrow">Create vote room</p>
          <h1 id="room-create-title">새 투표방 열기</h1>
          <p className="guard-copy">
            공식 제휴나 전달 보장을 암시하지 않도록, 투표 주제와 대상은 팬 주도 기록으로만 표현해요.
          </p>
        </div>
        <a className="button button-primary" href="/">
          홈 피드 보기
        </a>
      </section>

      <div className="create-studio-grid">
        <section className="content-panel form-panel" aria-labelledby="basic-info-title">
          <h2 id="basic-info-title">기본 정보</h2>
          <form className="stacked-form" onSubmit={handleSubmit}>
            <label htmlFor="room-title">방 이름</label>
            <input
              id="room-title"
              value={formInput.roomTitle}
              onChange={(event) => updateField('roomTitle', event.target.value)}
            />

            <label htmlFor="vote-title">투표 제목</label>
            <input
              id="vote-title"
              value={formInput.voteTitle}
              onChange={(event) => updateField('voteTitle', event.target.value)}
            />

            <label htmlFor="vote-topic">투표 주제</label>
            <input
              id="vote-topic"
              value={formInput.topic}
              onChange={(event) => updateField('topic', event.target.value)}
            />

            <label htmlFor="category-id">카테고리</label>
            <select
              id="category-id"
              value={formInput.categoryId}
              onChange={(event) => updateField('categoryId', event.target.value)}
            >
              {dashboard.categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>

            <label htmlFor="target-id">연결 대상</label>
            <select
              id="target-id"
              value={formInput.targetId}
              onChange={(event) => updateField('targetId', event.target.value)}
            >
              {dashboard.targets.map((target) => (
                <option key={target.id} value={target.id}>
                  {target.name} · 데모 대상
                </option>
              ))}
            </select>

            <label htmlFor="poll-format">투표 방식</label>
            <select
              id="poll-format"
              value={formInput.pollFormat}
              onChange={(event) => updateField('pollFormat', event.target.value as PollFormat)}
            >
              {pollFormatOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            <label htmlFor="room-end-at">마감일</label>
            <input
              id="room-end-at"
              type="datetime-local"
              value={formInput.endAt}
              onChange={(event) => updateField('endAt', event.target.value)}
            />

            <label htmlFor="reward-icon">리워드 아이콘</label>
            <input
              id="reward-icon"
              value={formInput.rewardIcon}
              onChange={(event) => updateField('rewardIcon', event.target.value)}
            />

            <button type="submit" className="button button-primary">
              생성 intent 만들기
            </button>
          </form>
        </section>

        <section className="content-panel candidate-setup" aria-labelledby="candidate-setup-title">
          <div className="collection-heading compact">
            <div>
              <p className="eyebrow">Poll options</p>
              <h2 id="candidate-setup-title">투표 항목 구성</h2>
            </div>
            <Ticket size={18} aria-hidden="true" />
          </div>
          <div className="candidate-chip-grid">
            {formInput.candidates.map((candidate, index) => (
              <span key={`${candidate}-${index}`}>
                {candidate}
                <button type="button" aria-label={`후보 ${index + 1} 삭제`} onClick={() => handleRemoveCandidate(index)}>
                  <X size={14} aria-hidden="true" />
                </button>
              </span>
            ))}
          </div>
          <div className="option-form">
            <label htmlFor="new-candidate-title">새 후보 항목</label>
            <div>
              <input
                id="new-candidate-title"
                value={newCandidateTitle}
                onChange={(event) => setNewCandidateTitle(event.target.value)}
                placeholder="예: 암전 후 첫 조명"
              />
              <button type="button" className="button button-secondary" onClick={handleAddCandidate}>
                <PlusCircle size={17} aria-hidden="true" />
                초기 후보 항목 추가
              </button>
            </div>
          </div>
          <p>
            방을 처음 만들 때 구성하는 후보는 무료예요. 이미 시작된 투표에 새 항목을 중간 추가할 때만 투표권을 사용하고,
            사용한 투표권만큼 새 항목에 자동 투표돼요.
          </p>
          {errors.length > 0 && (
            <div className="guard-copy" role="alert">
              {errors.map((error) => (
                <p key={error}>{error}</p>
              ))}
            </div>
          )}
        </section>

        <aside className="live-preview" aria-labelledby="preview-title">
          <div className="preview-media">
            <ImagePlus size={28} aria-hidden="true" />
            <span>{formInput.rewardIcon || 'REWARD'}</span>
          </div>
          <div className="preview-card">
            <p className="eyebrow">Preview</p>
            <h2 id="preview-title">방 카드 미리보기</h2>
            <p>{formInput.voteTitle}</p>
            <ul className="check-list">
              <li>
                <CheckCircle2 size={18} aria-hidden="true" />
                신뢰 필드는 서버 read model에서만 표시
              </li>
              <li>
                <CheckCircle2 size={18} aria-hidden="true" />
                투표/미션/후보 추가는 command API로 확장 예정
              </li>
            </ul>
          </div>
        </aside>

        {payload && (
          <section className="content-panel command-preview" aria-label="생성 command preview">
            <p className="eyebrow">Command payload</p>
            <h2>create-room</h2>
            <pre>{JSON.stringify(payload, null, 2)}</pre>
          </section>
        )}

        {receipt && (
          <section className="content-panel create-receipt" aria-label="생성 요청 receipt">
            <p className="eyebrow">Mock command response</p>
            <h2>생성 요청 접수</h2>
            <div className="receipt-status-row">
              <span className="chip chip-format">{receipt.command}</span>
              <span className="chip chip-mission">{receipt.reviewStatus}</span>
              <span className="chip chip-muted">{receipt.requestId}</span>
            </div>
            <p>
              <strong>{receipt.roomTitle}</strong> · {receipt.voteTitle}
            </p>
            <p className="guard-copy">{receipt.note}</p>
            <div className="receipt-action-row">
              {receipt.nextActions.map((action) => (
                <a key={action.href} className="button button-secondary" href={action.href}>
                  {action.label}
                </a>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
