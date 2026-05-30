import { describe, expect, it, vi } from 'vitest';
import { readCommandConfig } from '../config/env';
import { createCommandClient, postCommand } from './commandClient';
import { mapCommandErrorMessage } from './commandErrors';

function jsonResponse(body: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(body), {
    status: init?.status ?? 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}

describe('command client boundary', () => {
  it('posts a command payload to the configured function URL', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ data: { roomId: 'room-1' } })
    );
    const client = createCommandClient({
      functionsUrl: 'https://project-ref.functions.supabase.co',
      fetcher: fetcher as unknown as typeof fetch
    });

    const result = await postCommand(client, 'create-room', {
      command: 'create-room',
      room: { title: '테스트 투표방' }
    });

    expect(result).toEqual({ ok: true, data: { roomId: 'room-1' } });
    expect(fetcher).toHaveBeenCalledTimes(1);
    const [url, init] = fetcher.mock.calls[0] as [RequestInfo | URL, RequestInit];

    expect(url).toBe('https://project-ref.functions.supabase.co/create-room');
    expect(init.method).toBe('POST');
    expect(new Headers(init.headers).get('Content-Type')).toBe('application/json');
    expect(JSON.parse(init.body as string)).toEqual({
      command: 'create-room',
      room: { title: '테스트 투표방' }
    });
  });

  it('sends anon key and access token headers when configured', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse({ data: { accepted: true } })
    );
    const client = createCommandClient({
      functionsUrl: 'https://project-ref.functions.supabase.co/',
      anonKey: 'anon-key',
      getAccessToken: () => 'user-token',
      fetcher: fetcher as unknown as typeof fetch
    });

    await postCommand(client, 'cast-vote', {
      command: 'cast-vote',
      vote: { roomId: 'room-1', candidateIds: ['candidate-1'] }
    });

    const [url, init] = fetcher.mock.calls[0] as [RequestInfo | URL, RequestInit];
    const headers = new Headers(init.headers);

    expect(url).toBe('https://project-ref.functions.supabase.co/cast-vote');
    expect(headers.get('apikey')).toBe('anon-key');
    expect(headers.get('Authorization')).toBe('Bearer user-token');
  });

  it('maps standard command error codes to Korean user messages', () => {
    expect(mapCommandErrorMessage({ code: 'DUPLICATE_VOTE' })).toBe('이미 이 투표에 참여했어요.');
    expect(mapCommandErrorMessage({ code: 'DUPLICATE_MISSION_COMPLETION' })).toBe('이미 완료한 미션이에요.');
    expect(mapCommandErrorMessage({ code: 'VALIDATION_ERROR' })).toBe('입력값을 다시 확인해 주세요.');
    expect(mapCommandErrorMessage({ code: 'CONFIG_MISSING' })).toBe('앱 설정을 마치면 이용할 수 있어요.');
  });

  it('returns a command error when the edge function rejects the request', async () => {
    const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
      jsonResponse(
        {
          error: {
            code: 'DUPLICATE_VOTE',
            message: 'duplicate'
          }
        },
        { status: 409 }
      )
    );
    const client = createCommandClient({
      functionsUrl: 'https://project-ref.functions.supabase.co',
      fetcher: fetcher as unknown as typeof fetch
    });

    const result = await postCommand(client, 'cast-vote', {
      command: 'cast-vote',
      vote: { roomId: 'room-1', candidateIds: ['candidate-1'] }
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'DUPLICATE_VOTE',
        message: '이미 이 투표에 참여했어요.',
        status: 409
      }
    });
  });

  it('maps platform status-only errors to standard command error codes', async () => {
    const cases = [
      { status: 401, code: 'UNAUTHENTICATED', message: '로그인이 필요해요.' },
      { status: 403, code: 'FORBIDDEN', message: '권한이 있는 계정으로 이용할 수 있어요.' },
      { status: 429, code: 'RATE_LIMITED', message: '잠시 쉬었다가 다시 시도해 주세요.' },
      { status: 404, code: 'NOT_FOUND', message: '대상을 다시 선택해 주세요.' }
    ] as const;

    for (const testCase of cases) {
      const fetcher = vi.fn(async (_input: RequestInfo | URL, _init?: RequestInit) =>
        jsonResponse({ message: 'Missing authorization header' }, { status: testCase.status })
      );
      const client = createCommandClient({
        functionsUrl: 'https://project-ref.functions.supabase.co',
        fetcher: fetcher as unknown as typeof fetch
      });

      const result = await postCommand(client, 'cast-vote', {
        roomId: 'room-1',
        candidateIds: ['candidate-1']
      });

      expect(result).toEqual({
        ok: false,
        error: {
          code: testCase.code,
          message: testCase.message,
          status: testCase.status
        }
      });
    }
  });

  it('returns a config error when required command env values are missing', () => {
    const result = readCommandConfig({
      VITE_SUPABASE_FUNCTIONS_URL: ''
    });

    expect(result).toEqual({
      ok: false,
      error: {
        code: 'CONFIG_MISSING',
        message: '앱 설정을 마치면 이용할 수 있어요.',
        missingKeys: ['VITE_SUPABASE_FUNCTIONS_URL']
      }
    });
  });
});
