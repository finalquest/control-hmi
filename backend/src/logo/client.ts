import { createRequire } from "node:module";

const require = createRequire(import.meta.url);

interface ModbusRTUInstance {
  connectTCP(host: string, opts: { port: number }): Promise<void>;
  setID(id: number): void;
  setTimeout(ms: number): void;
  readCoils(addr: number, qty: number): Promise<{ data: unknown }>;
  readHoldingRegisters(addr: number, qty: number): Promise<{ data: unknown }>;
  writeCoil(addr: number, value: boolean): Promise<unknown>;
  writeRegister(addr: number, value: number): Promise<unknown>;
  close(cb: (err?: Error) => void): void;
}

const ModbusRTU = require("modbus-serial") as {
  new (): ModbusRTUInstance;
};

export interface ModbusClient {
  readCoils(addr: number, qty: number): Promise<boolean[]>;
  readHoldingRegisters(addr: number, qty: number): Promise<number[]>;
  writeCoil(addr: number, value: boolean): Promise<void>;
  writeRegister(addr: number, value: number): Promise<void>;
  connect(): Promise<void>;
  close(): Promise<void>;
  isConnected(): boolean;
}

export interface RealClientOptions {
  host: string;
  port: number;
  unit: number;
  timeoutMs?: number;
}

export class RealModbusClient implements ModbusClient {
  private readonly opts: Required<RealClientOptions>;
  private readonly client: ModbusRTUInstance;
  private connected = false;

  constructor(opts: RealClientOptions) {
    this.opts = { timeoutMs: 2000, ...opts };
    this.client = new ModbusRTU();
  }

  async connect(): Promise<void> {
    await this.client.connectTCP(this.opts.host, {
      port: this.opts.port,
    });
    this.client.setID(this.opts.unit);
    this.client.setTimeout(this.opts.timeoutMs);
    this.connected = true;
  }

  isConnected(): boolean {
    return this.connected;
  }

  async readCoils(addr: number, qty: number): Promise<boolean[]> {
    const res = await this.client.readCoils(addr, qty);
    return normalizeBooleans(res.data, qty);
  }

  async readHoldingRegisters(addr: number, qty: number): Promise<number[]> {
    const res = await this.client.readHoldingRegisters(addr, qty);
    return normalizeNumbers(res.data, qty);
  }

  async writeCoil(addr: number, value: boolean): Promise<void> {
    await this.client.writeCoil(addr, value);
  }

  async writeRegister(addr: number, value: number): Promise<void> {
    await this.client.writeRegister(addr, value);
  }

  async close(): Promise<void> {
    this.connected = false;
    this.client.close(() => {});
  }
}

function normalizeBooleans(data: unknown, qty: number): boolean[] {
  if (!Array.isArray(data)) return new Array(qty).fill(false);
  return Array.from({ length: qty }, (_, i) => toBool(data[i]));
}

function normalizeNumbers(data: unknown, qty: number): number[] {
  if (!Array.isArray(data)) return new Array(qty).fill(0);
  return Array.from({ length: qty }, (_, i) => Number(data[i] ?? 0));
}

function toBool(v: unknown): boolean {
  if (typeof v === "boolean") return v;
  if (typeof v === "number") return v !== 0;
  return Boolean(v);
}
