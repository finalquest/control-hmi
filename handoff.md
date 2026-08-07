# Handoff

## Objective
HMI web para PLC Siemens LOGO! 8 (proceso de agua/bomba). El PLC controla; el backend comunica (Modbus); el frontend representa. Embebible en Home Assistant.

## Stack / estructura (monorepo npm workspaces)
- `shared/` — tipos + protocolo WS (`src/types.ts`, `src/protocol.ts`).
- `backend/` — Node + Fastify + modbus-serial + WebSocket.
- `frontend/` — React + Vite + TypeScript + SVG.
- `docs/HMI_LOGO_Documento_de_Diseno_v1.md` — doc de diseño.

## Archivos clave
- `backend/src/logo/mapping.ts` — ** fuente única ** de direcciones: requests (V0.x), states (Mx). Editar al cambiar el ladder.
- `backend/src/logo/address.ts` — parser V / M. `M_n = 8256 + (n-1)` (1-indexado). `V0.0` = coil 0.
- `backend/src/logo/{client,simulator,poller,cache,driver}.ts`
- `backend/src/websocket/hub.ts`, `backend/src/server.ts` (rutas `/ws`, `/health`, `/api/mapping`), `backend/src/config.ts` (lee `.env`).
- `frontend/src/screens/AguaScreen.tsx` — panel HMI integrado (SVG, sin barra lateral).
- `frontend/src/screens/{HomeScreen,TestScreen,ConfiguracionScreen}.tsx`
- `.env` (gitignored) — `SIM`, `LOGO_HOST`, `LOGO_PORT`, `MODBUS_UNIT`, `POLL_MS`, `PORT`.

## Mapping actual (proceso agua)
- **Requests (pulse, edge):** `remoteManualRun` V0.0, `manualMode` V0.1, `autoMode` V0.2, `resetManualRun` V0.3, `emergencyStop` V0.4, `emergencyStopClean` V0.5.
- **States (lectura):** `tankRequestFill` M1, `manualRunRequest` M2, `cisternaHasWater` M3, `pumpCommanded` M4, `pumpRunning` M5, `pumpManualMode` M7, `emergency` M9.

## Decisiones
- LOGO! admite **un solo cliente Modbus TCP**: HA u otra integración Modbus debe estar desactivada; el backend del HMI es el único cliente.
- Puerto Modbus: **502** (en `.env`).
- Comandos son **pulse** (write 1 → ~250ms → write 0): el ladder usa edge detection (network inputs son read-only en el ladder).
- **Modo invertido:** `pumpManualMode` (M7=1 → Manual). Antes `pumpAutoMode`, renombrado por lógica inversa.
- Polling 250ms agrupado por bloques contiguos; cache con diff → WS emite solo cambios.
- `/api/mapping` expone el mapping al frontend (no se duplica en el cliente).
- Simulador en memoria para dev sin PLC (`SIM=1`).

## Estado actual
- Commit HEAD: `5ef4a8a` (panel Agua: HMI integrado + parada de emergencia).
- `npm run dev` levanta backend+frontend (usa `.env`, PLC real). `dev:sim` fuerza simulador.
- `npm run typecheck` pasa (shared + backend + frontend).
- Pantalla Agua: diagrama SVG integrado, bomba/motor y badge AUTO/MANUAL clickeables, boyas y nivel en tanques, PARADA EMERGENCIA (pulsea si M9 activa) + REARMAR.

## Integración Home Assistant (proxy backend)
- Backend consulta HA por REST (`GET /api/states`, `POST /api/services/<domain>/<service>`) y expone todo por el WS existente. No hay nuevo paquete: usa `fetch` nativo (Node 24).
- `backend/src/homeassistant/`: `client.ts` (REST), `cache.ts` (diff por digest), `adapter.ts` (poll loop + status), `tracking.ts` (allowlist de dominios + sensores curados).
- Dominios trackeados (control): light, switch, climate, fan, scene, script, input_boolean, input_button, button, input_select, select, number, alarm_control_panel, media_player, cover. Sensores curados: Sonoff PB/PA (W/V/kWh), temp/humedad ambientes, homelab (Proxmox VMs/LXC, discos, CPU), K1Max, puerta/movimiento.
- Protocolo (`shared`): `ha_snapshot` (full, al conectar y recovery), `ha_change` (incremental), `ha_status`, comando `ha_call` {domain, service, data}.
- Frontend: store con mapa `ha` + selectores `useHaEntity`/`useHaByDomain`/`useHaStatus`. Pantalla **Casa** (luces/escenas/climate/fans/switches) y **Eléctrico** completada (Sonoff, temp, aire, cafetera, homelab, K1Max). Componentes en `frontend/src/components/ha/`.
- `.env`: `HA_URL`, `HA_TOKEN`, `HA_POLL_MS` (2000ms), `HA_ENABLED` (auto si hay token).
- Validado: 353 entidades trackeadas, cambios en vivo, comando round-trip OK.
- Cámaras NO incluidas (requieren camera proxy/streaming). Pendiente si se pide.

## Riesgos / bloqueques
- `pumpRunning` (M5) no responde aún en el PLC real → toggle de la bomba se basa en `manualRunRequest` (M2) mientras tanto.
- `.env` es local (gitignored); IP/puerto del PLC no viven en el repo.
- Single-client Modbus: si HA se reconecta, el backend timeoutea (síntoma: status pasa a offline/conectando).
- Lectura de markers confirmada empíricamente (M7=8262); si el ladder cambia la numeración, actualizar `mapping.ts`.
