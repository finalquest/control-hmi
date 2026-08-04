import type { ClientMessage, Command, ServerMessage } from "shared";
import {
  applyHello,
  applyPatch,
  setConnected,
  setLastError,
  setStatus,
} from "../store/store.js";

let socket: WebSocket | null = null;
let retry = 0;
let booted = false;

function defaultUrl(): string {
  const env = import.meta.env.VITE_WS_URL as string | undefined;
  if (env) return env;
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${window.location.host}/ws`;
}

function scheduleReconnect(url: string): void {
  const delay = Math.min(1000 * 2 ** retry, 8000);
  retry += 1;
  window.setTimeout(() => connect(url), delay);
}

function handle(msg: ServerMessage): void {
  switch (msg.type) {
    case "hello":
      applyHello(msg.state);
      setStatus(msg.status);
      break;
    case "state":
      applyPatch(msg.patch);
      break;
    case "status":
      setStatus(msg.status, msg.detail);
      break;
    case "error":
      setLastError(`${msg.code}: ${msg.message}`);
      break;
    case "pong":
      break;
  }
}

export function connect(url: string = defaultUrl()): void {
  if (socket && (socket.readyState === WebSocket.OPEN || socket.readyState === WebSocket.CONNECTING)) {
    return;
  }
  socket = new WebSocket(url);

  socket.onopen = () => {
    retry = 0;
    setConnected(true);
    setLastError(undefined);
  };

  socket.onmessage = (event) => {
    try {
      handle(JSON.parse(event.data) as ServerMessage);
    } catch {
      /* ignore malformed frame */
    }
  };

  socket.onclose = () => {
    setConnected(false);
    socket = null;
    scheduleReconnect(url);
  };

  socket.onerror = () => {
    setLastError("conexion ws fallida");
  };
}

export function startWs(url?: string): void {
  if (booted) return;
  booted = true;
  connect(url);
}

export function sendCommand(command: Command): void {
  if (!socket || socket.readyState !== WebSocket.OPEN) return;
  const msg: ClientMessage = { type: "command", command };
  socket.send(JSON.stringify(msg));
}
