import { mapCommandErrorMessage } from '../api/commandErrors';

export interface CommandRuntimeEnv {
  VITE_SUPABASE_FUNCTIONS_URL?: string;
  VITE_SUPABASE_ANON_KEY?: string;
}

export interface CommandConfig {
  functionsUrl: string;
  anonKey?: string;
}

export type CommandConfigResult =
  | { ok: true; config: CommandConfig }
  | {
      ok: false;
      error: {
        code: 'CONFIG_MISSING';
        message: string;
        missingKeys: string[];
      };
    };

export function readCommandConfig(env: CommandRuntimeEnv = import.meta.env as unknown as CommandRuntimeEnv): CommandConfigResult {
  const functionsUrl = env.VITE_SUPABASE_FUNCTIONS_URL?.trim();

  if (!functionsUrl) {
    return {
      ok: false,
      error: {
        code: 'CONFIG_MISSING',
        message: mapCommandErrorMessage({ code: 'CONFIG_MISSING' }),
        missingKeys: ['VITE_SUPABASE_FUNCTIONS_URL']
      }
    };
  }

  return {
    ok: true,
    config: {
      functionsUrl,
      ...(env.VITE_SUPABASE_ANON_KEY?.trim() ? { anonKey: env.VITE_SUPABASE_ANON_KEY.trim() } : {})
    }
  };
}
