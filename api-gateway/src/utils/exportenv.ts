import 'dotenv/config';
interface EnvFunction {
  (envKey: string, defaultVal?: string | null | number): string | null;
}

const env: EnvFunction = (envKey, defaultVal = null) =>
  process.env[envKey] || (defaultVal !== null ? String(defaultVal) : null);

export default env;
