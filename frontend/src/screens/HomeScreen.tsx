import { useHmiState } from "../store/store.js";
import { Tank } from "../components/hmi/Tank.js";
import { Pump } from "../components/hmi/Pump.js";
import { Pipe } from "../components/hmi/Pipe.js";
import { Lamp } from "../components/hmi/Lamp.js";
import { Motor } from "../components/hmi/Motor.js";
import { Valve } from "../components/hmi/Valve.js";
import { Switch } from "../components/hmi/Switch.js";
import { Button } from "../components/hmi/Button.js";
import { NumberField } from "../components/hmi/Number.js";
import { Alarm } from "../components/hmi/Alarm.js";
import { colors } from "../styles/theme.js";
import { disable, enable, request, setNumber } from "../api/commands.js";

export function HomeScreen(): React.ReactNode {
  const { logo } = useHmiState();
  const pump = logo.pumpRunning;

  return (
    <div className="home">
      <div className="home__diagram">
        <div className="svg-wrap">
          <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
            <rect x={0} y={0} width={1000} height={560} fill={colors.bg} />

            <Pipe
              points={[
                { x: 280, y: 380 },
                { x: 390, y: 380 },
                { x: 390, y: 318 },
                { x: 436, y: 318 },
              ]}
              active={pump}
            />
            <Pipe
              points={[
                { x: 504, y: 282 },
                { x: 504, y: 130 },
                { x: 810, y: 130 },
                { x: 810, y: 170 },
              ]}
              active={pump}
            />

            <Valve x={390} y={350} open={pump} label="V1 succión" />

            <Tank
              x={70}
              y={300}
              w={210}
              h={200}
              label="Cisterna"
              variant="cistern"
              lowSensor={logo.cisternLow}
              rising={!pump}
              ratePerSec={6}
            />

            <Tank
              x={700}
              y={170}
              w={220}
              h={250}
              label="Tanque"
              highSensor={logo.tankHigh}
              rising={pump}
              ratePerSec={6}
            />

            <Pump x={470} y={316} r={36} running={pump} label="Bomba" />

            <Motor x={620} y={316} r={26} running={pump} label="Motor" />

            <Lamp x={470} y={420} on={logo.alarm} color="red" label="Alarma" />
            <Lamp x={520} y={420} on={logo.autoEnabled} color="green" label="Auto" />
            <Lamp x={570} y={420} on={logo.remoteEnabled} color="amber" label="Remoto" />

            <line x1={40} y1={520} x2={960} y2={520} stroke={colors.border} strokeWidth={2} />
            <text x={40} y={540} fill={colors.textMuted} fontSize={11}>
              Proceso: cisterna → bomba → tanque
            </text>
          </svg>
        </div>
      </div>

      <div className="home__panel">
        <Alarm
          active={logo.alarm}
          title={logo.alarm ? "Alarma activa" : "Sin alarmas"}
          sub={logo.alarm ? "Reconozca para silenciar" : undefined}
          onReset={() => request("resetAlarm")}
        />

        <div className="panel">
          <h3 className="panel__title">Modo</h3>
          <div className="row">
            <Switch
              label="Automático"
              on={logo.autoEnabled}
              onToggle={() => (logo.autoEnabled ? disable("autoEnabled") : enable("autoEnabled"))}
            />
          </div>
          <div className="row">
            <Switch
              label="Remoto"
              on={logo.remoteEnabled}
              onToggle={() =>
                logo.remoteEnabled ? disable("remoteEnabled") : enable("remoteEnabled")
              }
            />
          </div>
        </div>

        <div className="panel">
          <h3 className="panel__title">Comandos</h3>
          <div className="btn-grid">
            <Button variant="primary" onClick={() => request("manualStart")}>
              Arranque manual
            </Button>
            <Button onClick={() => request("testPump")}>Probar bomba</Button>
          </div>
        </div>

        <div className="panel">
          <h3 className="panel__title">Parámetros</h3>
          <NumberField
            label="Timeout bomba"
            value={logo.pumpTimeout}
            unit="s"
            editable
            min={0}
            max={3600}
            onCommit={(v) => setNumber("pumpTimeout", v)}
          />
        </div>
      </div>
    </div>
  );
}
