# Control HMI - Convenciones del proyecto

## Estructura

Monorepo npm workspaces:

- `shared/` - tipos y contrato WS compartidos entre backend y frontend.
- `backend/` - Node.js + Fastify + modbus-serial + WebSocket.
- `frontend/` - React + Vite + TypeScript + SVG.

## Comandos

- `npm run dev` - levanta backend + frontend juntos (logs prefijados `[be]`/`[fe]`). Lee `.env` de la raíz.
- `npm run dev:sim` - idem pero fuerza simulador (pisa el `SIM` del `.env`).
- `npm run dev:plc` - idem pero fuerza conexión al PLC real (pisa el `SIM` del `.env`).
- `npm run dev:backend` - levanta el backend solo.
- `npm run dev:frontend` - levanta Vite dev server solo.
- `npm run typecheck` - typecheck de shared + backend + frontend.
- `npm run build` - build de producción.

## Configuración (`.env` en la raíz)

El backend carga automáticamente `.env`. Variables:

- `SIM` - `1` simulador en memoria, `0` PLC real.
- `LOGO_HOST` / `LOGO_PORT` / `MODBUS_UNIT` - conexión Modbus TCP.
- `POLL_MS` - período de polling (ms).
- `PORT` - puerto HTTP/WS del backend.

Inline env pisa al `.env`: `SIM=1 npm run dev` fuerza simulador aunque el `.env` diga `SIM=0`.

## Reglas

- El backend nunca contiene lógica de proceso. Solo comunica.
- El frontend nunca habla Modbus.
- Toda traducción VM vive en `backend/src/logo/mapping.ts`.
- Sin comentarios en código salvo que se pida explícitamente.
