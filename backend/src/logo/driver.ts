import { parseBitAddress, parseWordAddress } from "./address.js";
import type { ModbusClient } from "./client.js";
import type { StateCache } from "./cache.js";
import { bitAddressOf, mapping } from "./mapping.js";
import type {
  BooleanStateKey,
  NumberKey,
  RequestKey,
  SwitchKey,
  WritableBitKey,
} from "shared";

const DEFAULT_PULSE_MS = 500;
const MIN_PULSE_MS = 50;
const MAX_PULSE_MS = 10_000;

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export class LogoDriver {
  constructor(
    private readonly client: ModbusClient,
    private readonly cache: StateCache,
  ) {}

  async request(key: RequestKey): Promise<void> {
    await this.client.writeCoil(parseBitAddress(mapping.requests[key]), true);
  }

  async enable(key: SwitchKey): Promise<void> {
    await this.client.writeCoil(parseBitAddress(mapping.switches[key]), true);
  }

  async disable(key: SwitchKey): Promise<void> {
    await this.client.writeCoil(parseBitAddress(mapping.switches[key]), false);
  }

  async set(key: NumberKey, value: number): Promise<void> {
    await this.client.writeRegister(parseWordAddress(mapping.numbers[key]), value);
  }

  async pulse(key: WritableBitKey, durationMs: number = DEFAULT_PULSE_MS): Promise<void> {
    const addr = parseBitAddress(bitAddressOf(key));
    const dur = Math.max(MIN_PULSE_MS, Math.min(durationMs, MAX_PULSE_MS));
    await this.client.writeCoil(addr, true);
    await sleep(dur);
    await this.client.writeCoil(addr, false);
  }

  state(key: BooleanStateKey): boolean {
    return this.cache.get()[key];
  }

  number(key: NumberKey): number {
    return this.cache.get()[key];
  }
}
