import { describe, expect, it, vi } from 'vitest';
import { completeMission } from '../../features/missions/completeMissionApi';
import { postRoomMessage } from '../../features/messages/postRoomMessageApi';
import { publishResultCard } from '../../features/result-cards/publishResultCardApi';
import { createRoom, type CreateRoomRequest } from '../../features/rooms/createRoomApi';
import { castVote } from '../../features/voting/castVoteApi';
import { createCommandClient } from './commandClient';

function createRecordingClient() {
  const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
    new Response(JSON.stringify({ data: { accepted: true } }))
  );
  const client = createCommandClient({
    functionsUrl: 'https://project-ref.functions.supabase.co',
    fetcher: fetcher as unknown as typeof fetch
  });

  return {
    client,
    fetcher,
    sentBody() {
      const [, init] = fetcher.mock.calls[0] as [RequestInfo | URL, RequestInit];

      return JSON.parse(init.body as string);
    }
  };
}

const resultVisibilityTypeCanary: CreateRoomRequest = {
  title: 'type canary',
  description: 'result visibility type canary',
  categoryId: 'category-1',
  primaryTargetId: 'target-1',
  voteMode: 'pick',
  topic: 'type canary',
  candidateTargetIds: ['candidate-target-1'],
  customCandidates: [],
  endAt: '2026-06-05T14:59:59.000Z',
  goalValue: 500,
  rewardIcon: 'Spotlight',
  allowCandidateSuggestion: false,
  resultVisibility: 'live'
};

const invalidResultVisibilityTypeCanary: CreateRoomRequest = {
  ...resultVisibilityTypeCanary,
  // @ts-expect-error public belongs to room visibility, not result visibility.
  resultVisibility: 'public'
};

void invalidResultVisibilityTypeCanary;

describe('command API wrappers', () => {
  it('creates a room with the documented Edge Function request body', async () => {
    const { client, sentBody } = createRecordingClient();

    await createRoom(client, {
      title: '테스트 투표방',
      description: '팬 기록용 비공식 투표',
      categoryId: 'category-1',
      primaryTargetId: 'target-1',
      voteMode: 'pick',
      topic: '가장 다시 보고 싶은 장면은?',
      candidateTargetIds: ['candidate-target-1', 'candidate-target-2'],
      customCandidates: [],
      endAt: '2026-06-05T14:59:59.000Z',
      goalValue: 500,
      rewardIcon: 'Spotlight',
      allowCandidateSuggestion: false,
      resultVisibility: 'after_vote'
    });

    const body = sentBody();

    expect(body).toEqual({
      title: '테스트 투표방',
      description: '팬 기록용 비공식 투표',
      categoryId: 'category-1',
      primaryTargetId: 'target-1',
      voteMode: 'pick',
      topic: '가장 다시 보고 싶은 장면은?',
      candidateTargetIds: ['candidate-target-1', 'candidate-target-2'],
      customCandidates: [],
      endAt: '2026-06-05T14:59:59.000Z',
      goalValue: 500,
      rewardIcon: 'Spotlight',
      allowCandidateSuggestion: false,
      resultVisibility: 'after_vote'
    });
    expect(JSON.stringify(body)).not.toContain('vote_count');
    expect(JSON.stringify(body)).not.toContain('current_goal_value');
    expect(JSON.stringify(body)).not.toContain('reward_rp');
    expect(JSON.stringify(body)).not.toContain('total_rp');
  });

  it('casts a vote with roomId and candidateIds only', async () => {
    const { client, sentBody } = createRecordingClient();

    await castVote(client, {
      roomId: 'room-1',
      candidateIds: ['candidate-1']
    });

    const body = sentBody();

    expect(body).toEqual({
      roomId: 'room-1',
      candidateIds: ['candidate-1']
    });
    expect(JSON.stringify(body)).not.toContain('voteCount');
    expect(JSON.stringify(body)).not.toContain('vote_count');
    expect(JSON.stringify(body)).not.toContain('currentGoalValue');
    expect(JSON.stringify(body)).not.toContain('current_goal_value');
  });

  it('completes a mission without sending reward values', async () => {
    const { client, sentBody } = createRecordingClient();

    await completeMission(client, {
      roomId: 'room-1',
      missionId: 'mission-1',
      textValue: '오늘도 참여했어요'
    });

    const body = sentBody();

    expect(body).toEqual({
      roomId: 'room-1',
      missionId: 'mission-1',
      textValue: '오늘도 참여했어요'
    });
    expect(JSON.stringify(body)).not.toContain('rewardRp');
    expect(JSON.stringify(body)).not.toContain('reward_rp');
    expect(JSON.stringify(body)).not.toContain('awardedEnergy');
  });

  it('posts a room message through the command boundary', async () => {
    const { client, sentBody } = createRecordingClient();

    await postRoomMessage(client, {
      roomId: 'room-1',
      type: 'cheer',
      body: '이 장면 다시 보고 싶어요'
    });

    expect(sentBody()).toEqual({
      roomId: 'room-1',
      type: 'cheer',
      body: '이 장면 다시 보고 싶어요'
    });
  });

  it('publishes a result card request with roomId only', async () => {
    const { client, sentBody } = createRecordingClient();

    await publishResultCard(client, {
      roomId: 'room-1'
    });

    const body = sentBody();

    expect(body).toEqual({
      roomId: 'room-1'
    });
    expect(JSON.stringify(body)).not.toContain('winnerCandidateId');
    expect(JSON.stringify(body)).not.toContain('participantCount');
    expect(JSON.stringify(body)).not.toContain('topMessage');
  });
});
