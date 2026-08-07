import { useSyncExternalStore } from "react";
import type { BackendStatus, HaEntity, HaStatus, LogoState, StatePatch } from "shared";

export interface HmiState {
  logo: LogoState;
  status: BackendStatus;
  detail?: string;
  connected: boolean;
  lastError?: string;
  ha: Record<string, HaEntity>;
  haStatus: HaStatus;
  haDetail?: string;
}

const initialLogo: LogoState = {
  tankRequestFill: false,
  manualRunRequest: false,
  cisternaHasWater: false,
  pumpCommanded: false,
  pumpRunning: false,
  pumpManualMode: false,
  emergency: false,
};

let state: HmiState = {
  logo: initialLogo,
  status: "offline",
  connected: false,
  ha: {},
  haStatus: "disconnected",
};

const listeners = new Set<() => void>();

function emit(): void {
  listeners.forEach((l) => l());
}

let haStatusCache: { status: HaStatus; detail?: string } = {
  status: "disconnected",
};

function refreshHaStatusCache(): void {
  if (
    haStatusCache.status !== state.haStatus ||
    haStatusCache.detail !== state.haDetail
  ) {
    haStatusCache = { status: state.haStatus, detail: state.haDetail };
  }
}

function set(patch: Partial<HmiState>): void {
  state = { ...state, ...patch };
  refreshHaStatusCache();
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

export function setHaSnapshot(entities: HaEntity[]): void {
  const ha: Record<string, HaEntity> = {};
  for (const e of entities) ha[e.entityId] = e;
  set({ ha });
}

export function setHaChange(entity: HaEntity): void {
  if (state.ha[entity.entityId]?.state === entity.state &&
    sameAttributes(state.ha[entity.entityId]?.attributes, entity.attributes)) {
    return;
  }
  set({ ha: { ...state.ha, [entity.entityId]: entity } });
}

export function setHaStatus(status: HaStatus, detail?: string): void {
  set({ haStatus: status, haDetail: detail });
}

function sameAttributes(
  a: Record<string, unknown> | undefined,
  b: Record<string, unknown>,
): boolean {
  if (!a) return false;
  return JSON.stringify(a) === JSON.stringify(b);
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

export function useHaEntity(entityId: string): HaEntity | undefined {
  return useSyncExternalStore(
    subscribe,
    () => state.ha[entityId],
    () => state.ha[entityId],
  );
}

let haByDomainCache: { src: Record<string, HaEntity>; domain: string; list: HaEntity[] } | null = null;

export function useHaByDomain(domain: string): HaEntity[] {
  return useSyncExternalStore(
    subscribe,
    () => {
      if (
        haByDomainCache &&
        haByDomainCache.src === state.ha &&
        haByDomainCache.domain === domain
      ) {
        return haByDomainCache.list;
      }
      const list = Object.values(state.ha).filter((e) =>
        e.entityId.startsWith(`${domain}.`),
      );
      haByDomainCache = { src: state.ha, domain, list };
      return list;
    },
    () => [],
  );
}

export function useHaStatus(): { status: HaStatus; detail?: string } {
  return useSyncExternalStore(
    subscribe,
    () => haStatusCache,
    () => haStatusCache,
  );
}
