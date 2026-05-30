import { describe, expect, it } from 'vitest';
import { buildCreateRoomReceipt } from './createRoomReceipt';
import type { CreateRoomCommandPayload } from './createRoomCommand';

const commandPayload: CreateRoomCommandPayload = {
  command: 'create-room',
  room: {
    roomTitle: '팬이 고르는 오프닝 명장면',
    voteTitle: '가장 다시 보고 싶은 오프닝은?',
    topic: '공식 전달 없이 팬 기록으로 남기는 장면 투표',
    categoryId: 'cat-stage',
    targetId: 'target-galaxy-stage',
    pollFormat: 'single',
    endAt: '2026-05-31T23:59',
    rewardIcon: 'Spotlight',
    candidateTitles: ['첫 장면 스포트라이트', '암전 후 첫 조명'],
    addOptionCost: {
      voteTickets: 1,
      rp: 120
    }
  }
};

describe('buildCreateRoomReceipt', () => {
  it('builds an accepted receipt view model with next actions', () => {
    const receipt = buildCreateRoomReceipt(commandPayload);

    expect(receipt).toMatchObject({
      command: 'create-room.accepted',
      roomTitle: '팬이 고르는 오프닝 명장면',
      reviewStatus: 'pending_review',
      requestId: 'demo-create-room-request',
      nextActions: [
        { label: '홈 피드로 돌아가기', href: '/' },
        { label: '내 활동 보기', href: '/profile' },
        { label: '데모 방 상세 보기', href: '/rooms/room-stage-opening' }
      ]
    });
  });

  it('does not include trusted read model fields in the receipt', () => {
    const receipt = buildCreateRoomReceipt(commandPayload);
    const serializedReceipt = JSON.stringify(receipt);

    expect(serializedReceipt).not.toContain('vote_count');
    expect(serializedReceipt).not.toContain('current_goal_value');
    expect(serializedReceipt).not.toContain('reward_rp');
    expect(serializedReceipt).not.toContain('total_rp');
    expect(serializedReceipt).not.toContain('voteCount');
    expect(serializedReceipt).not.toContain('currentGoalValue');
    expect(serializedReceipt).not.toContain('rewardRp');
    expect(serializedReceipt).not.toContain('totalRp');
  });
});
