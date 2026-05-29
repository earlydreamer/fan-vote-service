import { describe, expect, it } from 'vitest';
import { buildCreateRoomCommand } from './createRoomCommand';

const validInput = {
  roomTitle: '은하 무대 오프닝 투표방',
  voteTitle: '가상 쇼케이스 최고의 오프닝 장면',
  topic: '팬들이 기억하고 싶은 오프닝 장면을 고르는 비공식 팬 투표',
  categoryId: 'cat-stage',
  targetId: 'target-galaxy-stage',
  pollFormat: 'single',
  endAt: '2026-05-31T23:59',
  rewardIcon: 'Spotlight',
  candidates: ['첫 장면 스포트라이트', '합창 엔딩 포즈', '커튼콜 실루엣'],
  addOptionCost: {
    voteTickets: 1,
    rp: 120
  }
} as const;

describe('buildCreateRoomCommand', () => {
  it('converts valid room creation input into a create-room command payload', () => {
    const result = buildCreateRoomCommand(validInput);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.payload).toMatchObject({
      command: 'create-room',
      room: {
        roomTitle: '은하 무대 오프닝 투표방',
        voteTitle: '가상 쇼케이스 최고의 오프닝 장면',
        categoryId: 'cat-stage',
        targetId: 'target-galaxy-stage',
        pollFormat: 'single',
        rewardIcon: 'Spotlight',
        candidateTitles: ['첫 장면 스포트라이트', '합창 엔딩 포즈', '커튼콜 실루엣'],
        addOptionCost: {
          voteTickets: 1,
          rp: 120
        }
      }
    });
  });

  it('rejects officiality and delivery-guarantee phrases', () => {
    const result = buildCreateRoomCommand({
      ...validInput,
      topic: '소속사 전달 보장 공식 인증 투표입니다'
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.errors.some((error) => error.includes('공식'))).toBe(true);
    expect(result.errors.some((error) => error.includes('전달 보장'))).toBe(true);
  });

  it('rejects standalone agency and real-world reflection phrases', () => {
    const result = buildCreateRoomCommand({
      ...validInput,
      topic: '소속사가 확인하는 투표이고 결과가 실제 반영됩니다'
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.errors.some((error) => error.includes('소속사'))).toBe(true);
    expect(result.errors.some((error) => error.includes('실제 반영'))).toBe(true);
  });

  it('rejects fewer than two non-empty candidates', () => {
    const result = buildCreateRoomCommand({
      ...validInput,
      candidates: ['첫 장면 스포트라이트', '   ']
    });

    expect(result.ok).toBe(false);
    if (result.ok) return;

    expect(result.errors).toContain('투표 항목은 최소 2개 이상 필요해요.');
  });

  it('does not include trusted read model fields in the command payload', () => {
    const result = buildCreateRoomCommand(validInput);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const serializedPayload = JSON.stringify(result.payload);

    expect(serializedPayload).not.toContain('vote_count');
    expect(serializedPayload).not.toContain('current_goal_value');
    expect(serializedPayload).not.toContain('reward_rp');
    expect(serializedPayload).not.toContain('total_rp');
    expect(serializedPayload).not.toContain('voteCount');
    expect(serializedPayload).not.toContain('currentGoalValue');
    expect(serializedPayload).not.toContain('rewardRp');
    expect(serializedPayload).not.toContain('totalRp');
  });
});
