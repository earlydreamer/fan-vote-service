import { normalizeCommandError, type CommandError } from './commandErrors';

export type CommandFunctionName =
  | 'create-room'
  | 'cast-vote'
  | 'complete-mission'
  | 'post-room-message'
  | 'publish-result-card';

export type CommandResult<Data> = { ok: true; data: Data } | { ok: false; error: CommandError };

export interface CommandClient {
  functionsUrl: string;
  anonKey?: string;
  getAccessToken?: () => Promise<string | null | undefined> | string | null | undefined;
  fetcher: typeof fetch;
}

export interface CreateCommandClientOptions {
  functionsUrl: string;
  anonKey?: string;
  getAccessToken?: CommandClient['getAccessToken'];
  fetcher?: typeof fetch;
}

export function createCommandClient(options: CreateCommandClientOptions): CommandClient {
  return {
    functionsUrl: trimTrailingSlash(options.functionsUrl),
    ...(options.anonKey ? { anonKey: options.anonKey } : {}),
    ...(options.getAccessToken ? { getAccessToken: options.getAccessToken } : {}),
    fetcher: options.fetcher ?? globalThis.fetch.bind(globalThis)
  };
}

export async function postCommand<Data, Payload>(
  client: CommandClient,
  functionName: CommandFunctionName,
  payload: Payload
): Promise<CommandResult<Data>> {
  try {
    const response = await client.fetcher(`${client.functionsUrl}/${functionName}`, {
      method: 'POST',
      headers: await buildCommandHeaders(client),
      body: JSON.stringify(payload)
    });
    const responseBody = await readJsonBody(response);

    if (!response.ok) {
      return {
        ok: false,
        error: normalizeCommandError(extractErrorBody(responseBody), response.status)
      };
    }

    return {
      ok: true,
      data: extractDataBody<Data>(responseBody)
    };
  } catch {
    return {
      ok: false,
      error: normalizeCommandError({ code: 'NETWORK_ERROR' })
    };
  }
}

async function buildCommandHeaders(client: CommandClient): Promise<Headers> {
  const headers = new Headers({
    'Content-Type': 'application/json'
  });

  if (client.anonKey) {
    headers.set('apikey', client.anonKey);
  }

  const accessToken = await client.getAccessToken?.();
  if (accessToken) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  return headers;
}

async function readJsonBody(response: Response): Promise<unknown> {
  const text = await response.text();
  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    return null;
  }
}

function extractErrorBody(responseBody: unknown): unknown {
  if (isRecord(responseBody) && 'error' in responseBody) {
    return responseBody.error;
  }

  return responseBody;
}

function extractDataBody<Data>(responseBody: unknown): Data {
  if (isRecord(responseBody) && 'data' in responseBody) {
    return responseBody.data as Data;
  }

  return responseBody as Data;
}

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
