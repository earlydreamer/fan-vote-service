import type { CreateRoomCommandPayload } from './createRoomCommand';

export interface CreateRoomReceiptAction {
  label: string;
  href: string;
}

export interface CreateRoomReceiptViewModel {
  command: 'create-room.accepted';
  requestId: 'demo-create-room-request';
  roomTitle: string;
  voteTitle: string;
  reviewStatus: 'pending_review';
  note: string;
  nextActions: CreateRoomReceiptAction[];
}

export function buildCreateRoomReceipt(payload: CreateRoomCommandPayload): CreateRoomReceiptViewModel {
  return {
    command: 'create-room.accepted',
    requestId: 'demo-create-room-request',
    roomTitle: payload.room.roomTitle,
    voteTitle: payload.room.voteTitle,
    reviewStatus: 'pending_review',
    note: '실제 DB 생성 없이 서버 응답 예시만 보여줘요. 승인 뒤에는 read model이 새 방과 비용 차감 상태를 함께 갱신해요.',
    nextActions: [
      { label: '홈 피드로 돌아가기', href: '/' },
      { label: '내 활동에서 만든 방 확인', href: '/profile' },
      { label: '데모 방 상세 보기', href: '/rooms/room-stage-opening' }
    ]
  };
}
