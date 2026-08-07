import type {
  HaAttributes,
  HaEntity,
  HaStatus,
  LogoState,
  NumberKey,
  RequestKey,
  StatePatch,
  SwitchKey,
  WritableBitKey,
} from "./types.js";

export type BackendStatus =
  | "simulating"
  | "connecting"
  | "online"
  | "offline"
  | "error";

export type Command =
  | { kind: "request"; key: RequestKey }
  | { kind: "enable"; key: SwitchKey }
  | { kind: "disable"; key: SwitchKey }
  | { kind: "set"; key: NumberKey; value: number }
  | { kind: "pulse"; key: WritableBitKey; durationMs?: number };

export type ServerMessage =
  | { type: "hello"; state: LogoState; status: BackendStatus; ts: number }
  | { type: "state"; patch: StatePatch; ts: number }
  | { type: "status"; status: BackendStatus; detail?: string; ts: number }
  | { type: "pong"; ts: number }
  | { type: "error"; code: string; message: string; ts: number }
  | {
      type: "ha_snapshot";
      entities: HaEntity[];
      status: HaStatus;
      detail?: string;
      ts: number;
    }
  | { type: "ha_change"; entity: HaEntity; ts: number }
  | { type: "ha_status"; status: HaStatus; detail?: string; ts: number };

export type HaCall = {
  domain: string;
  service: string;
  data?: HaAttributes;
};

export type ClientMessage =
  | { type: "command"; command: Command }
  | { type: "ha_call"; call: HaCall }
  | { type: "ping" };
