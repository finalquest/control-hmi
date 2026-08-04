import { sendCommand } from "./ws.js";
import type { NumberKey, RequestKey, SwitchKey, WritableBitKey } from "shared";

export function request(key: RequestKey): void {
  sendCommand({ kind: "request", key });
}

export function enable(key: SwitchKey): void {
  sendCommand({ kind: "enable", key });
}

export function disable(key: SwitchKey): void {
  sendCommand({ kind: "disable", key });
}

export function toggle(key: SwitchKey, current: boolean): void {
  sendCommand(current ? { kind: "disable", key } : { kind: "enable", key });
}

export function setNumber(key: NumberKey, value: number): void {
  sendCommand({ kind: "set", key, value });
}

export function pulse(key: WritableBitKey, durationMs?: number): void {
  sendCommand({ kind: "pulse", key, durationMs });
}
