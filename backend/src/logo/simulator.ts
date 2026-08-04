import { mapping } from "./mapping.js";
import { parseBitAddress } from "./address.js";
import type { ModbusClient } from "./client.js";
import type { RequestKey } from "shared";

const BIT_SIZE = 16384;
const WORD_SIZE = 1024;
const LADDER_TICK_MS = 100;
const TANK_LOW_THRESHOLD = 30;

type RequestEffect = () => void;

export class SimulatorModbusClient implements ModbusClient {
  private readonly bits = new Uint8Array(BIT_SIZE);
  private readonly words = new Uint16Array(WORD_SIZE);
  private readonly effects: Record<RequestKey, RequestEffect>;
  private ladder: ReturnType<typeof setInterval> | null = null;

  private pumpManualMode = false;
  private manualRunRequest = false;
  private tankLevel = 25;
  private pumpCommanded = false;

  constructor() {
    this.effects = {
      autoMode: () => {
        this.pumpManualMode = false;
      },
      manualMode: () => {
        this.pumpManualMode = true;
      },
      remoteManualRun: () => {
        this.manualRunRequest = true;
      },
      resetManualRun: () => {
        this.manualRunRequest = false;
      },
    };
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
  }

  private tick(): void {
    this.consumeRequests();
    this.applyDynamics();
    this.flushStates();
  }

  private consumeRequests(): void {
    (Object.keys(mapping.requests) as RequestKey[]).forEach((key) => {
      const addr = parseBitAddress(mapping.requests[key]);
      if (this.bits[addr]) {
        this.bits[addr] = 0;
        this.effects[key]();
      }
    });
  }

  private applyDynamics(): void {
    const tankRequestFill = this.tankLevel < TANK_LOW_THRESHOLD;
    this.pumpCommanded =
      (!this.pumpManualMode && tankRequestFill) || this.manualRunRequest;

    if (this.pumpCommanded) {
      this.tankLevel = Math.min(100, this.tankLevel + 3);
    } else {
      this.tankLevel = Math.max(0, this.tankLevel - 2);
    }
  }

  private flushStates(): void {
    this.writeBit(parseBitAddress(mapping.states.tankRequestFill), this.tankLevel < TANK_LOW_THRESHOLD);
    this.writeBit(parseBitAddress(mapping.states.manualRunRequest), this.manualRunRequest);
    this.writeBit(parseBitAddress(mapping.states.cisternaHasWater), true);
    this.writeBit(parseBitAddress(mapping.states.pumpCommanded), this.pumpCommanded);
    this.writeBit(parseBitAddress(mapping.states.pumpRunning), this.pumpCommanded);
    this.writeBit(parseBitAddress(mapping.states.pumpManualMode), this.pumpManualMode);
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
