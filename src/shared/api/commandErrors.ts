export type CommandErrorCode =
  | 'UNAUTHENTICATED'
  | 'FORBIDDEN'
  | 'VALIDATION_ERROR'
  | 'DUPLICATE_VOTE'
  | 'DUPLICATE_MISSION_COMPLETION'
  | 'RATE_LIMITED'
  | 'NOT_FOUND'
  | 'SERVER_ERROR'
  | 'NETWORK_ERROR'
  | 'CONFIG_MISSING'
  | 'UNKNOWN_ERROR';

export interface CommandError {
  code: CommandErrorCode;
  message: string;
  status?: number;
  fieldErrors?: Record<string, string[]>;
}

const knownErrorCodes: CommandErrorCode[] = [
  'UNAUTHENTICATED',
  'FORBIDDEN',
  'VALIDATION_ERROR',
  'DUPLICATE_VOTE',
  'DUPLICATE_MISSION_COMPLETION',
  'RATE_LIMITED',
  'NOT_FOUND',
  'SERVER_ERROR',
  'NETWORK_ERROR',
  'CONFIG_MISSING',
  'UNKNOWN_ERROR'
];

export function mapCommandErrorMessage(error: { code?: string; message?: string }): string {
  switch (error.code) {
    case 'UNAUTHENTICATED':
      return '로그인이 필요해요.';
    case 'FORBIDDEN':
      return '이 작업을 수행할 권한이 없어요.';
    case 'VALIDATION_ERROR':
      return '입력값을 다시 확인해 주세요.';
    case 'DUPLICATE_VOTE':
      return '이미 이 투표에 참여했어요.';
    case 'DUPLICATE_MISSION_COMPLETION':
      return '이미 완료한 미션이에요.';
    case 'RATE_LIMITED':
      return '요청이 너무 많아요. 잠시 뒤 다시 시도해 주세요.';
    case 'NOT_FOUND':
      return '요청한 대상을 찾을 수 없어요.';
    case 'SERVER_ERROR':
      return '서버에서 문제가 발생했어요. 잠시 뒤 다시 시도해 주세요.';
    case 'NETWORK_ERROR':
      return '네트워크 연결을 확인해 주세요.';
    case 'CONFIG_MISSING':
      return '앱 설정이 아직 완료되지 않았어요.';
    default:
      return error.message?.trim() || '알 수 없는 문제가 발생했어요.';
  }
}

export function normalizeCommandError(rawError: unknown, status?: number): CommandError {
  const errorRecord = isRecord(rawError) ? rawError : {};
  const rawCode = typeof errorRecord.code === 'string' ? errorRecord.code : undefined;
  const code = isKnownErrorCode(rawCode) ? rawCode : mapStatusToCommandErrorCode(status);
  const fieldErrors = isStringArrayRecord(errorRecord.fieldErrors) ? errorRecord.fieldErrors : undefined;

  return {
    code,
    message: mapCommandErrorMessage({
      code,
      message: typeof errorRecord.message === 'string' ? errorRecord.message : undefined
    }),
    ...(status ? { status } : {}),
    ...(fieldErrors ? { fieldErrors } : {})
  };
}

function isKnownErrorCode(code: string | undefined): code is CommandErrorCode {
  return knownErrorCodes.includes(code as CommandErrorCode);
}

function mapStatusToCommandErrorCode(status: number | undefined): CommandErrorCode {
  switch (status) {
    case 401:
      return 'UNAUTHENTICATED';
    case 403:
      return 'FORBIDDEN';
    case 404:
      return 'NOT_FOUND';
    case 429:
      return 'RATE_LIMITED';
    default:
      return status && status >= 500 ? 'SERVER_ERROR' : 'UNKNOWN_ERROR';
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isStringArrayRecord(value: unknown): value is Record<string, string[]> {
  if (!isRecord(value)) return false;

  return Object.values(value).every(
    (fieldValue) => Array.isArray(fieldValue) && fieldValue.every((message) => typeof message === 'string')
  );
}
