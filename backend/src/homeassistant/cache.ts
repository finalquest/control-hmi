import type { HaEntity } from "shared";
import { isTracked } from "./tracking.js";

interface Entry {
  entityId: string;
  state: string;
  attributes: Record<string, unknown>;
  digest: string;
}

function digest(state: string, attributes: Record<string, unknown>): string {
  return `${state}|${JSON.stringify(attributes)}`;
}

export class HaCache {
  private readonly entries = new Map<string, Entry>();

  snapshot(): HaEntity[] {
    return Array.from(this.entries.values(), (e) => ({
      entityId: e.entityId,
      state: e.state,
      attributes: e.attributes,
    }));
  }

  apply(next: HaEntity[]): { changed: HaEntity[]; removed: string[] } {
    const changed: HaEntity[] = [];
    const seen = new Set<string>();

    for (const entity of next) {
      if (!isTracked(entity.entityId)) continue;
      seen.add(entity.entityId);
      const dg = digest(entity.state, entity.attributes);
      const prev = this.entries.get(entity.entityId);
      if (!prev || prev.digest !== dg) {
        this.entries.set(entity.entityId, {
          entityId: entity.entityId,
          state: entity.state,
          attributes: entity.attributes,
          digest: dg,
        });
        changed.push(entity);
      }
    }

    const removed: string[] = [];
    for (const id of this.entries.keys()) {
      if (!seen.has(id)) {
        this.entries.delete(id);
        removed.push(id);
      }
    }

    return { changed, removed };
  }

  clear(): void {
    this.entries.clear();
  }
}
