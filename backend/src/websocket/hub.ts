import type { FastifyInstance } from "fastify";
import type { WebSocket } from "ws";
import type { LogoDriver } from "../logo/driver.js";
import type { StateCache } from "../logo/cache.js";
import type {
  BackendStatus,
  ClientMessage,
  Command,
  ServerMessage,
} from "shared";

export class WsHub {
  private readonly clients = new Set<WebSocket>();
  private lastStatus: BackendStatus = "simulating";

  constructor(
    private readonly cache: StateCache,
    private readonly driver: LogoDriver,
  ) {}

  attach(app: FastifyInstance): void {
    app.get("/ws", { websocket: true }, (socket) => {
      this.add(socket);
    });

    this.cache.onChange((patch) => {
      this.send({ type: "state", patch, ts: Date.now() });
    });
  }

  setStatus(status: BackendStatus, detail?: string): void {
    this.lastStatus = status;
    this.send({ type: "status", status, detail, ts: Date.now() });
  }

  private add(socket: WebSocket): void {
    this.clients.add(socket);
    this.sendTo(socket, {
      type: "hello",
      state: this.cache.get(),
      status: this.lastStatus,
      ts: Date.now(),
    });
    socket.on("message", (raw) => {
      this.handleMessage(socket, raw.toString()).catch((err) => {
        this.send({
          type: "error",
          code: "command_failed",
          message: String(err),
          ts: Date.now(),
        });
      });
    });
    socket.on("close", () => this.clients.delete(socket));
    socket.on("error", () => this.clients.delete(socket));
  }

  private async handleMessage(socket: WebSocket, data: string): Promise<void> {
    let msg: ClientMessage;
    try {
      msg = JSON.parse(data) as ClientMessage;
    } catch {
      return;
    }
    switch (msg.type) {
      case "ping":
        this.sendTo(socket, { type: "pong", ts: Date.now() });
        return;
      case "command":
        await this.runCommand(msg.command);
        return;
    }
  }

  private async runCommand(cmd: Command): Promise<void> {
    switch (cmd.kind) {
      case "request":
        await this.driver.request(cmd.key);
        return;
      case "enable":
        await this.driver.enable(cmd.key);
        return;
      case "disable":
        await this.driver.disable(cmd.key);
        return;
      case "set":
        await this.driver.set(cmd.key, cmd.value);
        return;
      case "pulse":
        void this.driver.pulse(cmd.key, cmd.durationMs).catch((err) => {
          this.send({
            type: "error",
            code: "pulse_failed",
            message: String(err),
            ts: Date.now(),
          });
        });
        return;
    }
  }

  private send(msg: ServerMessage): void {
    const data = JSON.stringify(msg);
    this.clients.forEach((c) => this.safeSend(c, data));
  }

  private sendTo(socket: WebSocket, msg: ServerMessage): void {
    this.safeSend(socket, JSON.stringify(msg));
  }

  private safeSend(socket: WebSocket, data: string): void {
    if (socket.readyState === 1) {
      socket.send(data, (err) => {
        if (err) this.clients.delete(socket);
      });
    }
  }
}
