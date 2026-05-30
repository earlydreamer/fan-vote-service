import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { createRoomSessionViewModel } from '../../shared/domain/roomSessionViewModel';
import type { RallyRoom, RoomStatus } from '../../shared/types/rallyroom';
import { RoomThumbnail } from '../../shared/ui/RoomThumbnail';
import { RoomMessagePanel } from '../messages/RoomMessagePanel';
import type { PostRoomMessageCommand } from '../messages/usePostRoomMessage';
import { MissionList } from '../missions/MissionList';
import type { CompleteMissionCommand } from '../missions/useCompleteMission';
import { NotFoundPage } from '../not-found/NotFoundPage';
import { VotePanel } from '../voting/VotePanel';
import type { CastVoteCommand } from '../voting/useCastVote';

interface RoomDetailPageProps {
  roomId: string;
}

export function RoomDetailPage({ roomId }: RoomDetailPageProps) {
  const room = demoReadRepository.getRoomDetail(roomId);
  const profile = demoReadRepository.getProfile();

  if (!room) return <NotFoundPage />;

  const category = demoReadRepository.getCategory(room.categoryId);
  const session = createRoomSessionViewModel(room, profile);
  const castVoteCommand = createDemoCastVoteCommand(room);
  const completeMissionCommand = createDemoCompleteMissionCommand(room);
  const postRoomMessageCommand = createDemoPostRoomMessageCommand(room);
  const isVotingOpen = room.status === 'active';
  const isMessageOpen = room.status !== 'closed';
  const voteClosedReason = isVotingOpen ? undefined : getVoteClosedReason(room.status);
  return (
    <div className="room-detail-page">
      <section className="detail-stage" aria-labelledby="room-title">
        <RoomThumbnail room={room} categoryName={category?.name} className="detail-stage__visual" />
        <div className="detail-stage__copy">
          <p className="eyebrow">Vote detail</p>
          <h1 id="room-title">{session.room.title}</h1>
          <div className="detail-vote-title">
            <span>투표 제목</span>
            <strong>{session.currentVote.title}</strong>
          </div>
          <p>{session.room.topic}</p>
          <div className="room-card__meta">
            <span className="chip">{category?.name ?? '투표방'}</span>
            {room.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="chip chip-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <a className="button button-secondary" href={`/rooms/${room.id}/result`}>
          결과 카드 보기
        </a>
      </section>

      <div className="detail-content-grid">
        <VotePanel
          key={room.id}
          roomId={room.id}
          candidates={room.candidates}
          currentGoalValue={room.currentGoalValue}
          goalValue={room.goalValue}
          participantCount={room.participantCount}
          castVoteCommand={castVoteCommand}
          isVotingOpen={isVotingOpen}
          closedReason={voteClosedReason}
          voteTickets={profile.voteTickets}
        />

        <MissionList
          key={`${room.id}-missions`}
          roomId={room.id}
          missions={room.missions}
          completeMissionCommand={completeMissionCommand}
        />

        <RoomMessagePanel
          key={`${room.id}-messages`}
          roomId={room.id}
          messages={room.messages}
          postRoomMessageCommand={postRoomMessageCommand}
          isMessageOpen={isMessageOpen}
          closedReason="마감된 방은 팬월 메시지 작성이 종료됐어요."
        />
      </div>
    </div>
  );
}

function createDemoCastVoteCommand(room: RallyRoom): CastVoteCommand {
  return async ({ roomId, candidateIds, voteTicketCount }) => {
    const selectedCandidateIds = new Set(candidateIds);

    return {
      ok: true,
      data: {
        roomId,
        candidateVotes: room.candidates.map((candidate) => ({
          candidateId: candidate.id,
          voteCount: candidate.voteCount + (selectedCandidateIds.has(candidate.id) ? voteTicketCount : 0)
        })),
        currentGoalValue: Math.min(room.currentGoalValue + voteTicketCount, room.goalValue),
        participantCount: room.participantCount + 1
      }
    };
  };
}

function createDemoCompleteMissionCommand(room: RallyRoom): CompleteMissionCommand {
  return async ({ missionId }) => {
    const mission = room.missions.find((item) => item.id === missionId);

    return {
      ok: true,
      data: {
        missionId,
        awardedRp: mission?.rewardRp ?? 0,
        awardedEnergy: mission?.rewardEnergy ?? 0,
        earnedRewards: mission
          ? [
              {
                code: mission.id,
                name: `${mission.title} 배지`,
                icon: '✨'
              }
            ]
          : []
      }
    };
  };
}

let demoMessageSequence = 0;

function createDemoPostRoomMessageCommand(room: RallyRoom): PostRoomMessageCommand {
  return async ({ type, body }) => {
    demoMessageSequence += 1;

    return {
      ok: true,
      data: {
        message: {
          id: `${room.id}-message-demo-${demoMessageSequence}`,
          type,
          body,
          createdAt: '2026-05-30T09:05:00.000Z'
        },
        awardedRp: 10,
        awardedEnergy: 3
      }
    };
  };
}

function getVoteClosedReason(status: RoomStatus): string {
  if (status === 'result_published') {
    return '결과가 공개된 방은 투표가 종료됐어요.';
  }

  return '마감된 방은 투표가 종료됐어요.';
}
