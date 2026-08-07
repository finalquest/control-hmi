import type { BooleanStateKey, HaAttributes, LogoState, StatePatch } from "shared";
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

function publishSensors(
  state: LogoState,
  setState: (id: string, state: string, attr?: HaAttributes) => Promise<void>,
): void {
  const bin = (on: boolean): string => (on ? "on" : "off");
  setState("binary_sensor.hmi_motor", bin(state.pumpCommanded), {
    friendly_name: "HMI Motor",
    device_class: "running",
  }).catch(() => {});
  setState("binary_sensor.hmi_emergencia", bin(state.emergency), {
    friendly_name: "HMI Emergencia",
    device_class: "problem",
  }).catch(() => {});
  setState("binary_sensor.hmi_cisterna_sin_agua", bin(!state.cisternaHasWater), {
    friendly_name: "HMI Cisterna sin agua",
    device_class: "problem",
  }).catch(() => {});
  setState("binary_sensor.hmi_tanque_pide_llenar", bin(state.tankRequestFill), {
    friendly_name: "HMI Tanque pide llenar",
    device_class: "running",
  }).catch(() => {});
  setState("sensor.hmi_modo", state.pumpManualMode ? "manual" : "auto", {
    friendly_name: "HMI Modo",
  }).catch(() => {});
}

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

  publishSensors(cache.get(), (id, st, attr) => adapter.setState(id, st, attr));

  return cache.onChange((patch: StatePatch) => {
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
    const state = cache.get();
    publishSensors(state, (id, st, attr) => adapter.setState(id, st, attr));
    fire("control_hmi.change", { changes, state });
  });
}

