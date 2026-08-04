import type {
  BooleanStateKey,
  LogoState,
  NumberKey,
  StateKey,
  StatePatch,
} from "shared";

export class StateCache {
  private state: LogoState;
  private pending: StatePatch | null = null;
  private readonly listeners = new Set<(patch: StatePatch) => void>();

  constructor(initial: LogoState) {
    this.state = { ...initial };
  }

  get(): LogoState {
    return { ...this.state };
  }

  setBoolean(key: BooleanStateKey, value: boolean): void {
    if (this.state[key] === value) return;
    (this.state[key] as boolean) = value;
    this.pending = this.pending ?? {};
    (this.pending as Record<string, unknown>)[key] = value;
  }

  setNumber(key: NumberKey, value: number): void {
    if (this.state[key] === value) return;
    (this.state[key] as number) = value;
    this.pending = this.pending ?? {};
    (this.pending as Record<string, unknown>)[key] = value;
  }

  commit(): StatePatch | null {
    const patch = this.pending;
    this.pending = null;
    if (patch) this.emit(patch);
    return patch;
  }

  resetAll(next: LogoState): StatePatch {
    const patch: StatePatch = {};
    (Object.keys(next) as StateKey[]).forEach((k) => {
      if (next[k] !== this.state[k]) {
        (patch as Record<string, unknown>)[k] = next[k];
      }
    });
    this.state = { ...next };
    if (Object.keys(patch).length > 0) this.emit(patch);
    return patch;
  }

  onChange(listener: (patch: StatePatch) => void): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private emit(patch: StatePatch): void {
    this.listeners.forEach((l) => l(patch));
  }
}
