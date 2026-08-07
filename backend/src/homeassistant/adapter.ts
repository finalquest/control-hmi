import type { HaAttributes, HaStatus } from "shared";
import type { HaApiClient } from "./client.js";
import { HaCache } from "./cache.js";

export interface HaSink {
  sendHaSnapshot(entities: ReturnType<HaCache["snapshot"]>): void;
  sendHaChange(entity: {
    entityId: string;
    state: string;
    attributes: Record<string, unknown>;
  }): void;
  sendHaRemoved(entityId: string): void;
  setHaStatus(status: HaStatus, detail?: string): void;
}

export interface HaAdapterOptions {
  pollMs: number;
}

export class HaAdapter {
  private readonly client: HaApiClient;
  private readonly cache = new HaCache();
  private readonly sink: HaSink;
  private readonly opts: HaAdapterOptions;
  private timer: ReturnType<typeof setTimeout> | null = null;
  private running = false;
  private failure = false;
  private ready = false;

  constructor(
    client: HaApiClient,
    sink: HaSink,
    opts: HaAdapterOptions,
  ) {
    this.client = client;
    this.sink = sink;
    this.opts = opts;
  }

  start(): void {
    if (this.running) return;
    this.running = true;
    this.sink.setHaStatus("connecting");
    this.schedule(0);
  }

  stop(): void {
    this.running = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
  }

  async callService(
    domain: string,
    service: string,
    data?: HaAttributes,
  ): Promise<void> {
    await this.client.callService(domain, service, data);
    const entityId = (data?.entity_id as string | undefined) ?? "";
    if (entityId) {
      setTimeout(() => {
        this.refreshEntity(entityId).catch(() => {});
      }, 400);
    }
  }

  async fireEvent(eventType: string, eventData?: HaAttributes): Promise<void> {
    await this.client.fireEvent(eventType, eventData);
  }

  async setState(
    entityId: string,
    state: string,
    attributes?: HaAttributes,
  ): Promise<void> {
    await this.client.setState(entityId, state, attributes);
  }

  private async refreshEntity(entityId: string): Promise<void> {
    const real = await this.client.getState(entityId);
    if (!real || !this.running) return;
    this.cache.apply([real]);
    this.sink.sendHaChange(real);
  }

  private schedule(delayMs: number): void {
    if (!this.running) return;
    this.timer = setTimeout(() => {
      this.tick()
        .catch((err) => this.handleError(err))
        .finally(() => {
          if (this.running) this.schedule(this.opts.pollMs);
        });
    }, delayMs);
  }

  private async tick(): Promise<void> {
    const all = await this.client.getStates();
    const { changed, removed } = this.cache.apply(all);

    if (!this.ready) {
      this.ready = true;
      this.failure = false;
      this.sink.setHaStatus("ready");
      this.sink.sendHaSnapshot(this.cache.snapshot());
      return;
    }

    for (const entity of changed) this.sink.sendHaChange(entity);
    for (const id of removed) this.sink.sendHaRemoved(id);
  }

  private handleError(err: unknown): void {
    if (!this.failure) {
      this.failure = true;
      this.ready = false;
      this.cache.clear();
      this.sink.setHaStatus("error", String(err));
    }
  }
}
