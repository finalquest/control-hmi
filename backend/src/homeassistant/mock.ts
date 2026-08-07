import type { HaAttributes, HaEntity } from "shared";
import type { HaApiClient } from "./client.js";
import { fixture, type FixtureEntry } from "./mock-fixture.js";

export class MockHaClient implements HaApiClient {
  private readonly entries: Map<string, FixtureEntry>;

  constructor() {
    this.entries = new Map(Object.entries(structuredClone(fixture)));
  }

  async getStates(): Promise<HaEntity[]> {
    return Array.from(this.entries.values(), (e) => ({
      entityId: e.entity_id,
      state: e.state,
      attributes: structuredClone(e.attributes),
    }));
  }

  async callService(
    domain: string,
    service: string,
    data?: HaAttributes,
  ): Promise<void> {
    const id = (data?.entity_id as string | undefined) ?? "";
    const entry = this.entries.get(id);
    if (entry) {
      this.apply(entry, domain, service, data ?? {});
    }
  }

  async ping(): Promise<boolean> {
    return true;
  }

  private apply(
    entry: FixtureEntry,
    domain: string,
    service: string,
    data: HaAttributes,
  ): void {
    switch (service) {
      case "turn_on":
        entry.state = domain === "scene" || domain === "script" ? entry.state : "on";
        return;
      case "turn_off":
        entry.state = "off";
        return;
      case "toggle":
        entry.state = entry.state === "on" ? "off" : "on";
        return;
      case "set_hvac_mode":
        entry.state = (data.hvac_mode as string) ?? entry.state;
        return;
      case "set_temperature": {
        const t = data.temperature as number | undefined;
        if (t !== undefined) entry.attributes.temperature = t;
        if (data.hvac_mode) entry.state = data.hvac_mode as string;
        return;
      }
      case "set_fan_mode":
        entry.attributes.fan_mode = data.fan_mode;
        return;
      case "press":
      case "trigger":
        return;
      case "select_option":
        entry.state = (data.option as string) ?? entry.state;
        return;
      case "set_value":
        entry.state = String(data.value ?? entry.state);
        return;
      case "select_source":
        entry.state = (data.source as string) ?? entry.state;
        return;
      default:
        return;
    }
  }
}
