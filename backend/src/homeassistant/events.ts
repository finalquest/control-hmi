import type { BooleanStateKey, LogoState, StatePatch } from "shared";
import type { StateCache } from "../logo/cache.js";
import type { HaAdapter } from "./adapter.js";

const NAMED: Partial<Record<BooleanStateKey, string>> = {
  pumpCommanded: "control_hmi.pump",
  pumpRunning: "control_hmi.pump",
  emergency: "control_hmi.emergency",
  cisternaHasWater: "control_hmi.cisterna",
  tankRequestFill: "control_hmi.tank",
  pumpManualMode: "control_hmi.mode",
  manualRunRequest: "control_hmi.manual_run",
};

const HEARTBEAT_MS = 30000;

export function attachHaEvents(
  cache: StateCache,
  adapter: HaAdapter,
): () => void {
  const prev: LogoState = { ...cache.get() };

  const fire = (type: string, data: Record<string, unknown>): void => {
    adapter.fireEvent(type, data).catch((err) => {
      console.error(`HA event ${type} fallo:`, err);
    });
  };

  const emitChange = (): void => {
    fire("control_hmi.change", { changes: [], state: cache.get() });
  };

  emitChange();
  const heartbeat = setInterval(emitChange, HEARTBEAT_MS);

  const off = cache.onChange((patch: StatePatch) => {
    const changes: Array<{ key: string; value: boolean; prev: boolean }> = [];
    for (const [k, v] of Object.entries(patch)) {
      const key = k as BooleanStateKey;
      const old = prev[key];
      changes.push({ key, value: v as boolean, prev: old });
      prev[key] = v as boolean;
      const named = NAMED[key];
      if (named) {
        fire(named, { entity: key, on: v as boolean, prev: old });
      }
    }
    fire("control_hmi.change", { changes, state: cache.get() });
  });

  return () => {
    clearInterval(heartbeat);
    off();
  };
}
