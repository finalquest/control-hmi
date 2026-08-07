import { callHa } from "./ws.js";
import { optimisticEntity } from "../store/store.js";

function turn(domain: string, entityId: string, on: boolean): void {
  optimisticEntity(entityId, (e) => ({ ...e, state: on ? "on" : "off" }));
  callHa({ domain, service: on ? "turn_on" : "turn_off", data: { entity_id: entityId } });
}

function toggle(domain: string, entityId: string, current: boolean): void {
  turn(domain, entityId, !current);
}

export function lightToggle(entityId: string, current: boolean): void {
  toggle("light", entityId, current);
}

export function lightSet(entityId: string, on: boolean): void {
  turn("light", entityId, on);
}

export function switchToggle(entityId: string, current: boolean): void {
  toggle("switch", entityId, current);
}

export function switchSet(entityId: string, on: boolean): void {
  turn("switch", entityId, on);
}

export function inputBooleanToggle(entityId: string, current: boolean): void {
  toggle("input_boolean", entityId, current);
}

export function runScene(entityId: string): void {
  callHa({ domain: "scene", service: "turn_on", data: { entity_id: entityId } });
}

export function runScript(entityId: string): void {
  callHa({ domain: "script", service: "turn_on", data: { entity_id: entityId } });
}

export function pressButton(entityId: string): void {
  callHa({ domain: "button", service: "press", data: { entity_id: entityId } });
}

export function climateSet(
  entityId: string,
  data: { hvac_mode?: string; temperature?: number },
): void {
  optimisticEntity(entityId, (e) => ({
    ...e,
    state: data.hvac_mode ?? e.state,
    attributes: { ...e.attributes, ...(data.temperature !== undefined ? { temperature: data.temperature } : {}) },
  }));
  callHa({ domain: "climate", service: "set_hvac_mode" in data ? "set_hvac_mode" : "set_temperature", data: { entity_id: entityId, ...data } });
}

export function climateSetFanMode(entityId: string, fanMode: string): void {
  optimisticEntity(entityId, (e) => ({ ...e, attributes: { ...e.attributes, fan_mode: fanMode } }));
  callHa({ domain: "climate", service: "set_fan_mode", data: { entity_id: entityId, fan_mode: fanMode } });
}

export function fanToggle(entityId: string, current: boolean): void {
  toggle("fan", entityId, current);
}

export function fanSetPercentage(entityId: string, percentage: number): void {
  optimisticEntity(entityId, (e) => ({
    ...e,
    state: percentage > 0 ? "on" : "off",
    attributes: { ...e.attributes, percentage },
  }));
  callHa({ domain: "fan", service: "set_percentage", data: { entity_id: entityId, percentage } });
}

export function fanSetDirection(entityId: string, direction: "forward" | "reverse"): void {
  optimisticEntity(entityId, (e) => ({ ...e, attributes: { ...e.attributes, direction } }));
  callHa({ domain: "fan", service: "set_direction", data: { entity_id: entityId, direction } });
}

export function mediaToggle(entityId: string, current: boolean): void {
  callHa({ domain: "media_player", service: current ? "media_play_pause" : "media_play", data: { entity_id: entityId } });
}
