import type {
  RequestKey,
  SwitchKey,
  VmMapping,
  WritableBitKey,
} from "shared";

export type BitAddress = string;
export type WordAddress = string;

export const mapping: VmMapping = {
  requests: {
    remoteManualRun: "V0.0",
    manualMode: "V0.1",
    autoMode: "V0.2",
    resetManualRun: "V0.3",
  },
  switches: {},
  states: {
    tankRequestFill: "M1",
    manualRunRequest: "M2",
    cisternaHasWater: "M3",
    pumpCommanded: "M4",
    pumpRunning: "M5",
    pumpManualMode: "M7",
  },
  numbers: {},
};

export function bitAddressOf(key: WritableBitKey): BitAddress {
  if (key in mapping.requests) {
    return mapping.requests[key as RequestKey];
  }
  return mapping.switches[key as SwitchKey];
}
