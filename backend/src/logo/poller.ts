import { parseVmBit, parseVmWord } from "./address.js";
import type { ModbusClient } from "./client.js";
import type { StateCache } from "./cache.js";
import { mapping } from "./mapping.js";
import type { BooleanStateKey, NumberKey } from "shared";

interface BitEntry {
  key: BooleanStateKey;
  addr: number;
}

interface WordEntry {
  key: NumberKey;
  addr: number;
}

interface BitRange {
  start: number;
  qty: number;
  entries: BitEntry[];
}

interface WordRange {
  start: number;
  qty: number;
  entries: WordEntry[];
}

function groupBits(entries: BitEntry[]): BitRange[] {
  const sorted = [...entries].sort((a, b) => a.addr - b.addr);
  const ranges: BitRange[] = [];
  let current: BitRange | null = null;
  for (const e of sorted) {
    if (current && e.addr === current.start + current.qty) {
      current.qty++;
      current.entries.push(e);
    } else {
      current = { start: e.addr, qty: 1, entries: [e] };
      ranges.push(current);
    }
  }
  return ranges;
}

function groupWords(entries: WordEntry[]): WordRange[] {
  const sorted = [...entries].sort((a, b) => a.addr - b.addr);
  const ranges: WordRange[] = [];
  let current: WordRange | null = null;
  for (const e of sorted) {
    if (current && e.addr === current.start + current.qty) {
      current.qty++;
      current.entries.push(e);
    } else {
      current = { start: e.addr, qty: 1, entries: [e] };
      ranges.push(current);
    }
  }
  return ranges;
}

export interface PollerOptions {
  pollMs: number;
  onError?: (err: unknown) => void;
  onRecover?: () => void;
}

export class Poller {
  private readonly bitRanges: BitRange[];
  private readonly wordRanges: WordRange[];
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private failure = false;

  constructor(
    private readonly client: ModbusClient,
    private readonly cache: StateCache,
    private readonly opts: PollerOptions,
  ) {
    const bitEntries = (Object.keys(mapping.states) as BooleanStateKey[]).map(
      (k) => ({ key: k, addr: parseVmBit(mapping.states[k]) }),
    );
    const wordEntries = (Object.keys(mapping.numbers) as NumberKey[]).map(
      (k) => ({ key: k, addr: parseVmWord(mapping.numbers[k]) }),
    );
    this.bitRanges = groupBits(bitEntries);
    this.wordRanges = groupWords(wordEntries);
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.schedule(0);
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  private schedule(delayMs: number): void {
    if (!this.running) return;
    this.timer = setTimeout(() => {
      this.tick()
        .catch((err) => this.handleError(err))
        .finally(() => {
          if (this.running) this.schedule(this.opts.pollMs);
        });
    }, delayMs);
  }

  private async tick(): Promise<void> {
    for (const range of this.bitRanges) {
      const values = await this.client.readCoils(range.start, range.qty);
      range.entries.forEach((e, i) => this.cache.setBoolean(e.key, values[i]));
    }
    for (const range of this.wordRanges) {
      const values = await this.client.readHoldingRegisters(range.start, range.qty);
      range.entries.forEach((e, i) => this.cache.setNumber(e.key, values[i]));
    }
    this.cache.commit();
    if (this.failure) {
      this.failure = false;
      this.opts.onRecover?.();
    }
  }

  private handleError(err: unknown): void {
    if (!this.failure) {
      this.failure = true;
      this.opts.onError?.(err);
    }
  }
}
