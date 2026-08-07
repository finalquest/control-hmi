import { callHa } from "./ws.js";

function turn(domain: string, entityId: string, on: boolean): void {
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
  callHa({ domain: "climate", service: "set_hvac_mode" in data ? "set_hvac_mode" : "set_temperature", data: { entity_id: entityId, ...data } });
}

export function fanToggle(entityId: string, current: boolean): void {
  toggle("fan", entityId, current);
}

export function mediaToggle(entityId: string, current: boolean): void {
  callHa({ domain: "media_player", service: current ? "media_play_pause" : "media_play", data: { entity_id: entityId } });
}
