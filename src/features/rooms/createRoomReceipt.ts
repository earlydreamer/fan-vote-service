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
    note: '지금은 데모라서 접수 화면만 보여줘요. 승인이 끝나면 새 방과 비용 차감 상태가 목록에 함께 보여요.',
    nextActions: [
      { label: '홈 피드로 돌아가기', href: '/' },
      { label: '내 활동 보기', href: '/profile' },
      { label: '데모 방 열어보기', href: '/rooms/room-stage-opening' }
    ]
  };
}
