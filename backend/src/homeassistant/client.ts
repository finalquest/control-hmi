import type { HaAttributes, HaEntity } from "shared";

export interface HaApiClient {
  getStates(): Promise<HaEntity[]>;
  getState(entityId: string): Promise<HaEntity | null>;
  callService(domain: string, service: string, data?: HaAttributes): Promise<void>;
  ping(): Promise<boolean>;
}

export interface HaClientOptions {
  baseUrl: string;
  token: string;
  timeoutMs?: number;
}

interface RawEntity {
  entity_id: string;
  state: string;
  attributes: HaAttributes;
}

export class HaClient implements HaApiClient {
  private readonly opts: Required<HaClientOptions>;

  constructor(opts: HaClientOptions) {
    this.opts = { timeoutMs: 5000, ...opts };
  }

  private headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.opts.token}`,
      "Content-Type": "application/json",
    };
  }

  private url(path: string): string {
    return `${this.opts.baseUrl.replace(/\/$/, "")}${path}`;
  }

  async getStates(): Promise<HaEntity[]> {
    const res = await this.fetch(this.url("/api/states"), {
      method: "GET",
      headers: this.headers(),
    });
    const body = (await res.json()) as RawEntity[];
    return body.map((e) => ({
      entityId: e.entity_id,
      state: e.state,
      attributes: e.attributes ?? {},
    }));
  }

  async getState(entityId: string): Promise<HaEntity | null> {
    try {
      const res = await this.fetch(
        this.url(`/api/states/${encodeURIComponent(entityId)}`),
        { method: "GET", headers: this.headers() },
      );
      const body = (await res.json()) as RawEntity;
      return { entityId: body.entity_id, state: body.state, attributes: body.attributes ?? {} };
    } catch {
      return null;
    }
  }

  async callService(
    domain: string,
    service: string,
    data?: HaAttributes,
  ): Promise<void> {
    const res = await this.fetch(
      this.url(`/api/services/${domain}/${service}`),
      {
        method: "POST",
        headers: this.headers(),
        body: JSON.stringify(data ?? {}),
      },
    );
    if (!res.ok) {
      throw new Error(`HA service ${domain}.${service} HTTP ${res.status}`);
    }
  }

  async ping(): Promise<boolean> {
    try {
      const res = await this.fetch(this.url("/api/"), {
        method: "GET",
        headers: this.headers(),
      });
      return res.ok;
    } catch {
      return false;
    }
  }

  private async fetch(
    input: string,
    init: RequestInit,
  ): Promise<Response> {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), this.opts.timeoutMs);
    try {
      const res = await fetch(input, { ...init, signal: ctrl.signal });
      if (!res.ok) {
        throw new Error(`HA HTTP ${res.status} en ${input}`);
      }
      return res;
    } finally {
      clearTimeout(timer);
    }
  }
}
