import { useSyncExternalStore } from "react";
import type { BackendStatus, LogoState, StatePatch } from "shared";

export interface HmiState {
  logo: LogoState;
  status: BackendStatus;
  detail?: string;
  connected: boolean;
  lastError?: string;
}

const initialLogo: LogoState = {
  tankRequestFill: false,
  manualRunRequest: false,
  cisternaHasWater: false,
  pumpCommanded: false,
  pumpRunning: false,
  pumpManualMode: false,
};

let state: HmiState = {
  logo: initialLogo,
  status: "offline",
  connected: false,
};

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

function set(patch: Partial<HmiState>): void {
  state = { ...state, ...patch };
  emit();
}

export function applyHello(logo: LogoState): void {
  set({ logo });
}

export function applyPatch(patch: StatePatch): void {
  set({ logo: { ...state.logo, ...patch } });
}

export function setStatus(status: BackendStatus, detail?: string): void {
  set({ status, detail });
}

export function setConnected(connected: boolean): void {
  set({ connected });
}

export function setLastError(message?: string): void {
  set({ lastError: message });
}

function subscribe(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function getSnapshot(): HmiState {
  return state;
}

export function useHmiState(): HmiState {
  return useSyncExternalStore(subscribe, getSnapshot, getSnapshot);
}
