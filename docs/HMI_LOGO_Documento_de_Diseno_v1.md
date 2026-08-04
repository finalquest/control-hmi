# HMI LOGO - Documento de Diseño v1

## Objetivo

Construir un HMI web simple para PLC Siemens LOGO! 8.

El HMI **no implementa lógica de control**. Toda la lógica permanece en
el PLC.

Responsabilidades del HMI:

-   Visualizar el proceso.
-   Enviar solicitudes.
-   Modificar parámetros.
-   Mostrar estados.

------------------------------------------------------------------------

# Arquitectura

``` text
                 ┌──────────────┐
                 │    LOGO 8    │
                 │              │
                 │  Ladder      │
                 │  VM          │
                 └──────┬───────┘
                        │
                    Modbus TCP
                        │
                 ┌──────▼───────┐
                 │   Backend    │
                 │              │
                 │ Modbus Driver│
                 │ Poller       │
                 │ State Cache  │
                 │ WebSocket    │
                 └──────┬───────┘
                        │
                  WebSocket
                        │
                 ┌──────▼───────┐
                 │ Frontend HMI │
                 │ React + Vite │
                 └──────────────┘
```

------------------------------------------------------------------------

# Responsabilidades

## LOGO

-   Automatización.
-   Timers.
-   Alarmas.
-   Interlocks.
-   Seguridad.
-   Decisiones.

Nunca depende del HMI.

## Backend

-   Comunicación Modbus.
-   Polling.
-   Cache.
-   Reconexión.
-   Traducción VM ↔ dominio.
-   Exposición WebSocket.

No contiene lógica del proceso.

## Frontend

-   Dibujar el proceso.
-   Mostrar estados.
-   Enviar comandos.
-   Configurar parámetros.

Nunca habla Modbus directamente.

------------------------------------------------------------------------

# Stack

## Backend

-   Node.js
-   TypeScript
-   Fastify
-   modbus-serial
-   WebSocket

## Frontend

-   React
-   Vite
-   TypeScript
-   CSS
-   SVG

------------------------------------------------------------------------

# Estructura

``` text
backend/
  src/
    logo/
      client.ts
      driver.ts
      poller.ts
      mapping.ts
      requests.ts
    websocket/
    server.ts

frontend/
  src/
    components/
    screens/
    assets/
    api/

shared/
  protocol.ts
```

------------------------------------------------------------------------

# Modelo de comunicación

## Estados

El backend realiza polling del PLC.

``` text
LOGO
  ↓
VM
  ↓
Backend Cache
  ↓
WebSocket
  ↓
Frontend
```

El frontend nunca hace polling.

## Requests

``` text
Button
  ↓
Backend
  ↓
Write Coil
  ↓
LOGO
  ↓
Consume Request
  ↓
Limpia Request
```

El frontend únicamente envía la solicitud.

## Parámetros

``` text
Frontend
  ↓
Backend
  ↓
Holding Register
  ↓
LOGO
```

------------------------------------------------------------------------

# Mapeo

El backend trabaja con nombres de dominio.

``` ts
export const mapping = {
  requests: {
    resetAlarm: "V0.0",
    manualStart: "V0.1",
    testPump: "V0.2",
  },

  switches: {
    autoEnabled: "V1.0",
    remoteEnabled: "V1.1",
  },

  states: {
    pumpRunning: "V20.0",
    tankHigh: "V20.1",
    cisternLow: "V20.2",
    alarm: "V20.3",
  },

  numbers: {
    pumpTimeout: "VW20",
  },
};
```

Toda la traducción a Modbus vive únicamente en el driver.

------------------------------------------------------------------------

# Driver

``` ts
logo.request("resetAlarm");

logo.set("pumpTimeout", 120);

logo.enable("autoEnabled");

logo.disable("remoteEnabled");

logo.state("pumpRunning");

logo.number("pumpTimeout");
```

------------------------------------------------------------------------

# Polling

-   Frecuencia inicial: **100 ms**.
-   Agrupar lecturas.
-   Evitar lecturas individuales de coils.

------------------------------------------------------------------------

# Cache

Mantener un snapshot completo del estado.

``` ts
interface LogoState {
  pumpRunning: boolean;
  cisternLow: boolean;
  tankHigh: boolean;
  alarm: boolean;
  timeout: number;
}
```

Emitir únicamente cambios.

------------------------------------------------------------------------

# Componentes HMI

-   Tank
-   Pump
-   Pipe
-   Valve
-   Motor
-   Lamp
-   Number
-   Gauge
-   Alarm
-   Status
-   Button
-   Switch

------------------------------------------------------------------------

# Pantallas

-   Home
-   Agua
-   Eléctrico
-   Configuración

Cada pantalla representa un proceso completo.

------------------------------------------------------------------------

# Filosofía visual

Inspiración:

-   Siemens WinCC
-   Weintek
-   FactoryTalk
-   Ignition

Principios:

-   Fondo neutro.
-   Verde = marcha.
-   Rojo = alarma.
-   Gris = detenido.
-   Azul = agua.
-   Animaciones mínimas.

------------------------------------------------------------------------

# Nivel estimado

No existen sensores continuos de nivel.

El frontend puede estimar visualmente el nivel usando:

-   Boya alta.
-   Boya baja.
-   Estado de la bomba.

Reglas:

-   Bomba encendida → subir nivel.
-   Bomba apagada → bajar nivel.
-   Boya alta → 100%.
-   Boya baja → 0%.

Siempre mostrar el texto:

> Nivel estimado

Nunca presentarlo como un valor medido.

------------------------------------------------------------------------

# Objetivos

-   El PLC controla.
-   El backend comunica.
-   El frontend representa.
-   Home Assistant únicamente embebe el HMI.

El resultado buscado es un HMI web liviano, desacoplado del protocolo
Modbus y preparado para crecer sin modificar la arquitectura base.
