import type { OptionAddCost, PollFormat } from '../../shared/types/rallyroom';

export interface CreateRoomFormInput {
  roomTitle: string;
  voteTitle: string;
  topic: string;
  categoryId: string;
  targetId: string;
  pollFormat: PollFormat;
  endAt: string;
  rewardIcon: string;
  candidates: readonly string[];
  addOptionCost: OptionAddCost;
}

export interface CreateRoomCommandPayload {
  command: 'create-room';
  room: {
    roomTitle: string;
    voteTitle: string;
    topic: string;
    categoryId: string;
    targetId: string;
    pollFormat: PollFormat;
    endAt: string;
    rewardIcon: string;
    candidateTitles: string[];
    addOptionCost: OptionAddCost;
  };
}

export type CreateRoomCommandResult =
  | { ok: true; payload: CreateRoomCommandPayload }
  | { ok: false; errors: string[] };

const forbiddenRules = [
  {
    label: '공식',
    pattern: /(^|[^비])공식(?!\s*전달\s*없이)/
  },
  {
    label: '인증',
    pattern: /인증/
  },
  {
    label: '전달 보장',
    pattern: /전달\s*보장/
  },
  {
    label: '소속사',
    pattern: /소속사/
  },
  {
    label: '실제 반영',
    pattern: /실제\s*반영/
  }
] as const;

export function buildCreateRoomCommand(input: CreateRoomFormInput): CreateRoomCommandResult {
  const candidateTitles = normalizeCandidateTitles(input.candidates);
  const errors = validateCreateRoomInput(input, candidateTitles);

  if (errors.length > 0) {
    return { ok: false, errors };
  }

  return {
    ok: true,
    payload: {
      command: 'create-room',
      room: {
        roomTitle: input.roomTitle.trim(),
        voteTitle: input.voteTitle.trim(),
        topic: input.topic.trim(),
        categoryId: input.categoryId,
        targetId: input.targetId,
        pollFormat: input.pollFormat,
        endAt: input.endAt,
        rewardIcon: input.rewardIcon.trim(),
        candidateTitles,
        addOptionCost: {
          voteTickets: input.addOptionCost.voteTickets,
          rp: input.addOptionCost.rp
        }
      }
    }
  };
}

function validateCreateRoomInput(input: CreateRoomFormInput, candidateTitles: string[]): string[] {
  const errors: string[] = [];

  if (!input.roomTitle.trim()) errors.push('방 이름을 입력해 주세요.');
  if (!input.voteTitle.trim()) errors.push('투표 제목을 입력해 주세요.');
  if (!input.topic.trim()) errors.push('투표 주제를 입력해 주세요.');
  if (!input.categoryId) errors.push('카테고리를 선택해 주세요.');
  if (!input.targetId) errors.push('연결 대상을 선택해 주세요.');
  if (!input.endAt) errors.push('마감일을 입력해 주세요.');
  if (!input.rewardIcon.trim()) errors.push('리워드 아이콘 이름을 입력해 주세요.');
  if (candidateTitles.length < 2) errors.push('투표 항목은 최소 2개 이상 필요해요.');

  const textForSafetyCheck = [
    input.roomTitle,
    input.voteTitle,
    input.topic,
    input.rewardIcon,
    ...candidateTitles
  ].join(' ');

  for (const rule of forbiddenRules) {
    if (rule.pattern.test(textForSafetyCheck)) {
      errors.push(`공식성 오인 문구 "${rule.label}"는 사용할 수 없어요.`);
    }
  }

  return [...new Set(errors)];
}

function normalizeCandidateTitles(candidates: readonly string[]): string[] {
  const seen = new Set<string>();

  return candidates
    .map((candidate) => candidate.trim())
    .filter(Boolean)
    .filter((candidate) => {
      if (seen.has(candidate)) return false;
      seen.add(candidate);
      return true;
    });
}
