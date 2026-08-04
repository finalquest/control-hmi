export interface LogoState {
  autoEnabled: boolean;
  remoteEnabled: boolean;
  pumpRunning: boolean;
  tankHigh: boolean;
  cisternLow: boolean;
  alarm: boolean;
  pumpTimeout: number;
}

export type StateKey = keyof LogoState;

export type StatePatch = Partial<LogoState>;

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export type BooleanStateKey = BooleanKeys<LogoState>;

export type RequestKey = "resetAlarm" | "manualStart" | "testPump";

export const REQUEST_KEYS: readonly RequestKey[] = [
  "resetAlarm",
  "manualStart",
  "testPump",
];

export type SwitchKey = "autoEnabled" | "remoteEnabled";

export const SWITCH_KEYS: readonly SwitchKey[] = ["autoEnabled", "remoteEnabled"];

export type WritableBitKey = RequestKey | SwitchKey;

export interface VmMapping {
  requests: Record<RequestKey, string>;
  switches: Record<SwitchKey, string>;
  states: Record<BooleanStateKey, string>;
  numbers: Record<NumberKey, string>;
}

export type NumberKey = "pumpTimeout";
