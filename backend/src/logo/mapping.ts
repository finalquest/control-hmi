import type {
  RequestKey,
  SwitchKey,
  VmMapping,
  WritableBitKey,
} from "shared";

export type VmBitAddress = string;
export type VmWordAddress = string;

export const mapping: VmMapping = {
  requests: {
    resetAlarm: "V0.0",
    manualStart: "V0.1",
    testPump: "V0.2",
  },
  switches: {
    autoEnabled: "V1.0",
    remoteEnabled: "V1.1",
  },
  states: {
    pumpRunning: "V20.0",
    tankHigh: "V20.1",
    cisternLow: "V20.2",
    alarm: "V20.3",
    autoEnabled: "V1.0",
    remoteEnabled: "V1.1",
  },
  numbers: {
    pumpTimeout: "VW20",
  },
};

export function bitAddressOf(key: WritableBitKey): VmBitAddress {
  if (key in mapping.requests) {
    return mapping.requests[key as RequestKey];
  }
  return mapping.switches[key as SwitchKey];
}
