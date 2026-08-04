import { fileURLToPath } from "node:url";

try {
  process.loadEnvFile(fileURLToPath(new URL("../../.env", import.meta.url)));
} catch {
  // sin archivo .env: se usan las variables de entorno del proceso
}

export interface Config {
  sim: boolean;
  logoHost: string;
  logoPort: number;
  modbusUnit: number;
  pollMs: number;
  httpPort: number;
  corsOrigin: string;
}

function boolEnv(name: string, fallback: boolean): boolean {
  const v = process.env[name];
  if (v === undefined) return fallback;
  return v === "1" || v.toLowerCase() === "true";
}

function intEnv(name: string, fallback: number): number {
  const v = process.env[name];
  if (v === undefined) return fallback;
  const n = Number(v);
  return Number.isFinite(n) ? n : fallback;
}

export function loadConfig(): Config {
  return {
    sim: boolEnv("SIM", true),
    logoHost: process.env.LOGO_HOST ?? "192.168.0.10",
    logoPort: intEnv("LOGO_PORT", 502),
    modbusUnit: intEnv("MODBUS_UNIT", 1),
    pollMs: intEnv("POLL_MS", 250),
    httpPort: intEnv("PORT", 3001),
    corsOrigin: process.env.CORS_ORIGIN ?? "*",
  };
}
