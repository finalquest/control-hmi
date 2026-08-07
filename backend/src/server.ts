import Fastify from "fastify";
import cors from "@fastify/cors";
import websocket from "@fastify/websocket";
import { loadConfig } from "./config.js";
import { StateCache } from "./logo/cache.js";
import { LogoDriver } from "./logo/driver.js";
import { mapping } from "./logo/mapping.js";
import { Poller } from "./logo/poller.js";
import {
  RealModbusClient,
  type ModbusClient,
} from "./logo/client.js";
import { SimulatorModbusClient } from "./logo/simulator.js";
import { WsHub } from "./websocket/hub.js";
import { HaAdapter } from "./homeassistant/adapter.js";
import { HaClient } from "./homeassistant/client.js";
import { MockHaClient } from "./homeassistant/mock.js";
import type { LogoState } from "shared";

function initialState(): LogoState {
  return {
    tankRequestFill: false,
    manualRunRequest: false,
    cisternaHasWater: false,
    pumpCommanded: false,
    pumpRunning: false,
    pumpManualMode: false,
    emergency: false,
  };
}

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function main(): Promise<void> {
  const config = loadConfig();
  const cache = new StateCache(initialState());

  let client: ModbusClient;
  if (config.sim) {
    const sim = new SimulatorModbusClient();
    sim.start();
    client = sim;
  } else {
    client = new RealModbusClient({
      host: config.logoHost,
      port: config.logoPort,
      unit: config.modbusUnit,
    });
  }

  const driver = new LogoDriver(client, cache);
  const hub = new WsHub(cache, driver);

  let reconnecting = false;
  const reconnect = async (): Promise<void> => {
    if (reconnecting || config.sim) return;
    reconnecting = true;
    hub.setStatus("connecting");
    try {
      while (true) {
        try {
          await client.close();
          await client.connect();
          break;
        } catch (err) {
          console.error("reconnect intento fallido:", err);
          hub.setStatus("offline", String(err));
          await sleep(2000);
        }
      }
      hub.setStatus("online");
    } finally {
      reconnecting = false;
    }
  };

  const poller = new Poller(client, cache, {
    pollMs: config.pollMs,
    onError: (err) => {
      console.error("poller error:", err);
      void reconnect();
    },
    onRecover: () => {
      hub.setStatus(config.sim ? "simulating" : "online");
    },
  });

  if (config.sim) {
    hub.setStatus("simulating");
  } else {
    hub.setStatus("connecting");
    void reconnect();
  }

  poller.start();

  let haAdapter: HaAdapter | null = null;
  if (config.haEnabled) {
    const client = config.haMock
      ? new MockHaClient()
      : new HaClient({ baseUrl: config.haUrl, token: config.haToken });
    haAdapter = new HaAdapter(client, hub, { pollMs: config.haPollMs });
    hub.setHaAdapter(haAdapter);
    haAdapter.start();
  }

  const app = Fastify({ logger: true });
  await app.register(cors, { origin: config.corsOrigin });
  await app.register(websocket);
  hub.attach(app);

  app.get("/health", async () => ({ ok: true, sim: config.sim, haMock: config.haMock }));
  app.get("/api/mapping", async () => mapping);

  const shutdown = async (): Promise<void> => {
    poller.stop();
    haAdapter?.stop();
    await client.close();
    await app.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);

  await app.listen({ host: "0.0.0.0", port: config.httpPort });
  console.log(
    `backend listo en :${config.httpPort} (sim=${config.sim} haMock=${config.haMock})`,
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
