export interface LogoState {
  tankRequestFill: boolean;
  manualRunRequest: boolean;
  cisternaHasWater: boolean;
  pumpCommanded: boolean;
  pumpRunning: boolean;
  pumpManualMode: boolean;
  emergency: boolean;
}

export type StateKey = keyof LogoState;

type BooleanKeys<T> = {
  [K in keyof T]: T[K] extends boolean ? K : never;
}[keyof T];

export type BooleanStateKey = BooleanKeys<LogoState>;

export type StatePatch = Partial<LogoState>;

export type RequestKey =
  | "remoteManualRun"
  | "manualMode"
  | "autoMode"
  | "resetManualRun"
  | "emergencyStop"
  | "emergencyStopClean";

export const REQUEST_KEYS: readonly RequestKey[] = [
  "remoteManualRun",
  "manualMode",
  "autoMode",
  "resetManualRun",
  "emergencyStop",
  "emergencyStopClean",
];

export type SwitchKey = never;
export const SWITCH_KEYS: readonly SwitchKey[] = [];

export type NumberKey = never;

export type WritableBitKey = RequestKey | SwitchKey;

export interface VmMapping {
  requests: Record<RequestKey, string>;
  switches: Record<SwitchKey, string>;
  states: Record<BooleanStateKey, string>;
  numbers: Record<NumberKey, string>;
}

export type HaAttributes = Record<string, unknown>;

export interface HaEntity {
  entityId: string;
  state: string;
  attributes: HaAttributes;
}

export type HaStatus = "disconnected" | "connecting" | "ready" | "error";
