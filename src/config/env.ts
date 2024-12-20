export interface Env {
  GITHUB_CLIENT_ID: string;
  GITHUB_CLIENT_SECRET: string;
  JWT_SECRET: string;
  DATABASE_URL: string;
  DATABASE_AUTH_TOKEN: string;
}

export const getEnv = (): Env => {
  const requiredEnvVars = ["GITHUB_CLIENT_ID", "GITHUB_CLIENT_SECRET", "JWT_SECRET", "DATABASE_URL", "DATABASE_AUTH_TOKEN"] as const;

  const env = {} as Env;

  for (const key of requiredEnvVars) {
    const value = Deno.env.get(key);
    if (!value) {
      throw new Error(`Missing required environment variable: ${key}`);
    }
    env[key] = value;
  }
  return env;
};

export default getEnv();
