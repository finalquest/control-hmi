import { mapping } from "./mapping.js";
import { parseVmBit } from "./address.js";
import type { ModbusClient } from "./client.js";
import type { RequestKey } from "shared";

const BIT_SIZE = 6808;
const WORD_SIZE = 851;
const LADDER_TICK_MS = 200;

type RequestEffect = () => void;

export class SimulatorModbusClient implements ModbusClient {
  private readonly bits = new Uint8Array(BIT_SIZE);
  private readonly words = new Uint16Array(WORD_SIZE);
  private readonly effects: Record<RequestKey, RequestEffect>;
  private ladder: ReturnType<typeof setInterval> | null = null;

  private pumpRunning = false;
  private tankLevel = 30;
  private cisternLevel = 80;
  private testOffTimer: ReturnType<typeof setTimeout> | null = null;

  constructor() {
    this.effects = {
      resetAlarm: () => {
        this.writeBit(parseVmBit(mapping.states.alarm), false);
      },
      manualStart: () => {
        this.pumpRunning = true;
      },
      testPump: () => {
        this.pumpRunning = true;
        if (this.testOffTimer) clearTimeout(this.testOffTimer);
        this.testOffTimer = setTimeout(() => {
          this.pumpRunning = false;
          this.testOffTimer = null;
        }, 2000);
      },
    };
    this.writeBit(parseVmBit(mapping.states.autoEnabled), true);
  }

  start(): void {
    if (this.ladder) return;
    this.ladder = setInterval(() => this.tick(), LADDER_TICK_MS);
  }

  stop(): void {
    if (this.ladder) {
      clearInterval(this.ladder);
      this.ladder = null;
    }
    if (this.testOffTimer) {
      clearTimeout(this.testOffTimer);
      this.testOffTimer = null;
    }
  }

  private tick(): void {
    this.consumeRequests();
    this.applyDynamics();
    this.flushStates();
  }

  private consumeRequests(): void {
    (Object.keys(mapping.requests) as RequestKey[]).forEach((key) => {
      const addr = parseVmBit(mapping.requests[key]);
      if (this.bits[addr]) {
        this.bits[addr] = 0;
        this.effects[key]();
      }
    });
  }

  private applyDynamics(): void {
    if (this.pumpRunning) {
      this.tankLevel = Math.min(100, this.tankLevel + 4);
      this.cisternLevel = Math.max(0, this.cisternLevel - 4);
    } else {
      this.tankLevel = Math.max(0, this.tankLevel - 2);
      this.cisternLevel = Math.min(100, this.cisternLevel + 2);
    }
  }

  private flushStates(): void {
    this.writeBit(parseVmBit(mapping.states.pumpRunning), this.pumpRunning);
    this.writeBit(parseVmBit(mapping.states.tankHigh), this.tankLevel >= 95);
    this.writeBit(parseVmBit(mapping.states.cisternLow), this.cisternLevel <= 10);
  }

  async connect(): Promise<void> {}
  isConnected(): boolean {
    return true;
  }

  async readCoils(addr: number, qty: number): Promise<boolean[]> {
    const out = new Array<boolean>(qty);
    for (let i = 0; i < qty; i++) out[i] = this.bits[addr + i] !== 0;
    return out;
  }

  async readHoldingRegisters(addr: number, qty: number): Promise<number[]> {
    const out = new Array<number>(qty);
    for (let i = 0; i < qty; i++) out[i] = this.words[addr + i];
    return out;
  }

  async writeCoil(addr: number, value: boolean): Promise<void> {
    this.bits[addr] = value ? 1 : 0;
  }

  async writeRegister(addr: number, value: number): Promise<void> {
    this.words[addr] = value & 0xffff;
  }

  async close(): Promise<void> {
    this.stop();
  }

  private writeBit(addr: number, value: boolean): void {
    this.bits[addr] = value ? 1 : 0;
  }
}
