import { describe, expect, it, vi } from 'vitest';
import { completeMission } from '../../features/missions/completeMissionApi';
import { postRoomMessage } from '../../features/messages/postRoomMessageApi';
import { publishResultCard } from '../../features/resultCards/publishResultCardApi';
import { castVote } from '../../features/voting/castVoteApi';
import { createCommandClient } from './commandClient';

function createRecordingClient() {
  const fetcher = vi.fn(async () => new Response(JSON.stringify({ data: { accepted: true } })));
  const client = createCommandClient({
    functionsUrl: 'https://project-ref.functions.supabase.co',
    fetcher: fetcher as unknown as typeof fetch
  });

  return {
    client,
    fetcher,
    sentBody() {
      return JSON.parse((fetcher.mock.calls[0]?.[1] as RequestInit).body as string);
    }
  };
}

describe('command API wrappers', () => {
  it('casts a vote with roomId and candidateIds only', async () => {
    const { client, sentBody } = createRecordingClient();

    await castVote(client, {
      roomId: 'room-1',
      candidateIds: ['candidate-1']
    });

    const body = sentBody();

    expect(body).toEqual({
      command: 'cast-vote',
      vote: {
        roomId: 'room-1',
        candidateIds: ['candidate-1']
      }
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
      proofText: '오늘도 참여했어요'
    });

    const body = sentBody();

    expect(body).toEqual({
      command: 'complete-mission',
      mission: {
        roomId: 'room-1',
        missionId: 'mission-1',
        proofText: '오늘도 참여했어요'
      }
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
      command: 'post-room-message',
      message: {
        roomId: 'room-1',
        type: 'cheer',
        body: '이 장면 다시 보고 싶어요'
      }
    });
  });

  it('publishes a result card request with roomId only', async () => {
    const { client, sentBody } = createRecordingClient();

    await publishResultCard(client, {
      roomId: 'room-1'
    });

    const body = sentBody();

    expect(body).toEqual({
      command: 'publish-result-card',
      resultCard: {
        roomId: 'room-1'
      }
    });
    expect(JSON.stringify(body)).not.toContain('winnerCandidateId');
    expect(JSON.stringify(body)).not.toContain('participantCount');
    expect(JSON.stringify(body)).not.toContain('topMessage');
  });
});
