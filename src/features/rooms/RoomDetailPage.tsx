import { useState } from 'react';
import { demoReadRepository } from '../../shared/api/demoReadRepository';
import { createRoomSessionViewModel } from '../../shared/domain/roomSessionViewModel';
import type { ProfileReadModel, RallyRoom, RoomStatus } from '../../shared/types/rallyroom';
import { RoomThumbnail } from '../../shared/ui/RoomThumbnail';
import { Button } from '../../shared/ui/Button';
import { RoomMessagePanel } from '../messages/RoomMessagePanel';
import type { PostRoomMessageCommand } from '../messages/usePostRoomMessage';
import { MissionList } from '../missions/MissionList';
import type { CompleteMissionCommand } from '../missions/useCompleteMission';
import { NotFoundPage } from '../not-found/NotFoundPage';
import { VotePanel } from '../voting/VotePanel';
import type { CastVoteCommand } from '../voting/useCastVote';

interface RoomDetailPageProps {
  roomId: string;
  viewerProfile?: ProfileReadModel | null;
}

const roomDetailTabs = [
  { id: 'current-vote', label: '현재 투표' },
  { id: 'fan-wall', label: '팬월' },
  { id: 'missions', label: '미션' },
  { id: 'result-history', label: '결과/기록' }
] as const;

type RoomDetailTab = (typeof roomDetailTabs)[number]['id'];

export function RoomDetailPage({ roomId, viewerProfile = demoReadRepository.getProfile() }: RoomDetailPageProps) {
  const [activeTab, setActiveTab] = useState<RoomDetailTab>('current-vote');
  const room = demoReadRepository.getRoomDetail(roomId);
  const profile = viewerProfile;

  if (!room) return <NotFoundPage />;

  const category = demoReadRepository.getCategory(room.categoryId);
  const session = createRoomSessionViewModel(room, profile ?? undefined);
  const castVoteCommand = createDemoCastVoteCommand(room);
  const completeMissionCommand = createDemoCompleteMissionCommand(room);
  const postRoomMessageCommand = createDemoPostRoomMessageCommand(room);
  const isVotingOpen = room.status === 'active';
  const isMessageOpen = room.status !== 'closed';
  const voteClosedReason = isVotingOpen ? undefined : getVoteClosedReason(room.status);
  const isOwner = session.viewerRole === 'owner';
  const voteTickets = profile?.voteTickets ?? 0;

  return (
    <div className="room-detail-page">
      <section className="detail-stage" aria-labelledby="room-title">
        <RoomThumbnail room={room} categoryName={category?.name} className="detail-stage__visual" />
        <div className="detail-stage__copy">
          <p className="eyebrow">투표 상세</p>
          <h1 id="room-title">{session.room.title}</h1>
          <div className="detail-vote-title">
            <span>투표 제목</span>
            <strong>{session.currentVote.title}</strong>
          </div>
          <p>{session.room.topic}</p>
          <div className="room-card__meta">
            <span className="chip">{category?.name ?? '투표방'}</span>
            {isOwner && <span className="chip chip-owner">방장</span>}
            {room.tags.slice(0, 4).map((tag) => (
              <span key={tag} className="chip chip-muted">
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="detail-stage__actions">
          {isOwner && (
            <Button variant="secondary">
              방 관리
            </Button>
          )}
          <a className="button button-secondary" href={`/rooms/${room.id}/result`}>
            결과 카드 보기
          </a>
        </div>
      </section>

      <section className="detail-tab-shell" aria-label="투표방 상세 콘텐츠">
        <div className="detail-tab-list" role="tablist" aria-label="투표방 상세 탭">
          {roomDetailTabs.map((tab) => (
            <Button
              key={tab.id}
              id={`${tab.id}-tab`}
              variant="unstyled"
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`${tab.id}-panel`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        <div
          id="current-vote-panel"
          className="detail-tab-panel"
          role="tabpanel"
          aria-labelledby="current-vote-tab"
          hidden={activeTab !== 'current-vote'}
        >
          {session.viewerRole === 'guest' ? (
            <section className="content-panel guest-vote-cta" aria-labelledby="guest-vote-title">
              <p className="eyebrow">로그인 안내</p>
              <h2 id="guest-vote-title">투표 참여는 로그인 후 가능해요</h2>
              <p>데모 계정으로 들어오면 투표권을 사용하고 새 후보를 중간 추가하는 흐름까지 확인할 수 있어요.</p>
              <a className="button button-primary" href="/login">
                로그인하고 투표 참여하기
              </a>
            </section>
          ) : (
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
              voteTickets={voteTickets}
              userRp={profile?.totalRp ?? 0}
            />
          )}
        </div>

        <div
          id="fan-wall-panel"
          className="detail-tab-panel"
          role="tabpanel"
          aria-labelledby="fan-wall-tab"
          hidden={activeTab !== 'fan-wall'}
        >
          <RoomMessagePanel
            key={`${room.id}-messages`}
            roomId={room.id}
            messages={room.messages}
            postRoomMessageCommand={postRoomMessageCommand}
            isMessageOpen={isMessageOpen && session.viewerRole !== 'guest'}
            closedReason={
              session.viewerRole === 'guest'
                ? '로그인 후 팬월에 메시지를 남길 수 있어요.'
                : '마감된 방은 팬월 메시지 작성이 종료됐어요.'
            }
          />
        </div>

        <div
          id="missions-panel"
          className="detail-tab-panel"
          role="tabpanel"
          aria-labelledby="missions-tab"
          hidden={activeTab !== 'missions'}
        >
          <MissionList
            key={`${room.id}-missions`}
            roomId={room.id}
            missions={room.missions}
            completeMissionCommand={completeMissionCommand}
          />
        </div>

        <div
          id="result-history-panel"
          className="detail-tab-panel"
          role="tabpanel"
          aria-labelledby="result-history-tab"
          hidden={activeTab !== 'result-history'}
        >
          <section className="content-panel result-history-panel" aria-labelledby="result-history-title">
            <div className="collection-heading compact">
              <div>
                <p className="eyebrow">기록</p>
                <h2 id="result-history-title">결과/기록</h2>
              </div>
              <a className="button button-secondary" href={`/rooms/${room.id}/result`}>
                결과 카드 보기
              </a>
            </div>
            {session.voteHistory.length > 0 ? (
              <ol className="result-history-list">
                {session.voteHistory.map((history) => (
                  <li key={history.id}>
                    <strong>{history.title}</strong>
                    <span>{history.participantCount.toLocaleString()}명 참여</span>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="guard-copy">현재 투표가 완료되면 이 방의 결과 카드와 이전 투표 기록이 여기에 쌓여요.</p>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}

function createDemoCastVoteCommand(room: RallyRoom): CastVoteCommand {
  return async ({ roomId, candidateIds, voteTicketCount }) => {
    const currentProfile = demoReadRepository.getProfile();
    demoReadRepository.updateProfile({
      voteTickets: Math.max(currentProfile.voteTickets - voteTicketCount, 0),
      todayVotes: currentProfile.todayVotes + voteTicketCount
    });

    const result = demoReadRepository.castVoteDemo(roomId, candidateIds, voteTicketCount);
    if (!result) {
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
    }

    return {
      ok: true,
      data: {
        roomId,
        ...result
      }
    };
  };
}

function createDemoCompleteMissionCommand(room: RallyRoom): CompleteMissionCommand {
  return async ({ missionId }) => {
    const mission = room.missions.find((item) => item.id === missionId);
    const rewardRp = mission?.rewardRp ?? 0;

    if (rewardRp > 0) {
      const currentProfile = demoReadRepository.getProfile();
      demoReadRepository.updateProfile({
        totalRp: currentProfile.totalRp + rewardRp
      });
    }

    return {
      ok: true,
      data: {
        missionId,
        awardedRp: rewardRp,
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
    const rewardRp = 10;

    const currentProfile = demoReadRepository.getProfile();
    demoReadRepository.updateProfile({
      totalRp: currentProfile.totalRp + rewardRp
    });

    return {
      ok: true,
      data: {
        message: {
          id: `${room.id}-message-demo-${demoMessageSequence}`,
          type,
          body,
          createdAt: '2026-05-30T09:05:00.000Z'
        },
        awardedRp: rewardRp,
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
