import { useHmiState } from "../store/store.js";
import { Tank } from "../components/hmi/Tank.js";
import { Pump } from "../components/hmi/Pump.js";
import { Pipe } from "../components/hmi/Pipe.js";
import { Motor } from "../components/hmi/Motor.js";
import { Button } from "../components/hmi/Button.js";
import { colors } from "../styles/theme.js";
import { pulse } from "../api/commands.js";

const PULSE_MS = 250;

export function AguaScreen(): React.ReactNode {
  const { logo } = useHmiState();

  return (
    <div className="home">
      <div className="home__diagram">
        <div className="svg-wrap">
          <svg viewBox="0 0 1000 560" preserveAspectRatio="xMidYMid meet">
            <rect x={0} y={0} width={1000} height={560} fill={colors.bg} />

            <Pipe
              points={[
                { x: 260, y: 400 },
                { x: 390, y: 400 },
                { x: 390, y: 330 },
                { x: 436, y: 330 },
              ]}
              active={logo.pumpRunning}
            />
            <Pipe
              points={[
                { x: 504, y: 290 },
                { x: 504, y: 150 },
                { x: 810, y: 150 },
                { x: 810, y: 190 },
              ]}
              active={logo.pumpRunning}
            />

            <Tank
              x={60}
              y={300}
              w={200}
              h={200}
              label="Cisterna"
              variant="cistern"
              levelOverride={logo.cisternaHasWater ? 75 : 6}
              sublabel={logo.cisternaHasWater ? "con agua" : "sin agua"}
              showEstimate={false}
            />

            <Tank
              x={700}
              y={190}
              w={220}
              h={280}
              label="Tanque"
              levelOverride={logo.tankRequestFill ? 15 : 85}
              sublabel={logo.tankRequestFill ? "pide llenar" : "nivel ok"}
              showEstimate={false}
            />

            <Pump x={470} y={330} r={36} running={logo.pumpRunning} label="Bomba" />
            <Motor x={620} y={330} r={26} running={logo.pumpCommanded} label="Motor" />

            <line x1={40} y1={520} x2={960} y2={520} stroke={colors.border} strokeWidth={2} />
            <text x={40} y={540} fill={colors.textMuted} fontSize={11}>
              Proceso agua: cisterna → bomba → tanque
            </text>
          </svg>
        </div>
      </div>

      <div className="home__panel">
        <div className="panel">
          <h3 className="panel__title">Modo</h3>
          <div className="btn-grid">
            <Button active={!logo.pumpManualMode} onClick={() => pulse("autoMode", PULSE_MS)}>
              Auto
            </Button>
            <Button active={logo.pumpManualMode} onClick={() => pulse("manualMode", PULSE_MS)}>
              Manual
            </Button>
          </div>
        </div>

        <div className="panel">
          <h3 className="panel__title">Marcha manual</h3>
          <div className="btn-grid">
            <Button
              variant="primary"
              active={logo.manualRunRequest}
              onClick={() => pulse("remoteManualRun", PULSE_MS)}
            >
              Arrancar
            </Button>
            <Button
              variant="danger"
              onClick={() => pulse("resetManualRun", PULSE_MS)}
            >
              Detener
            </Button>
          </div>
        </div>

        <div className="panel">
          <h3 className="panel__title">Estado</h3>
          <StatusRow label="Bomba en marcha" on={logo.pumpRunning} onText="Sí" offText="No" />
          <StatusRow label="Bomba comandada" on={logo.pumpCommanded} onText="Sí" offText="No" />
          <StatusRow label="Marcha manual" on={logo.manualRunRequest} onText="Activa" offText="Inactiva" />
          <StatusRow label="Cisterna" on={logo.cisternaHasWater} onText="Con agua" offText="Sin agua" />
          <StatusRow label="Tanque" on={logo.tankRequestFill} onText="Pide llenar" offText="OK" />
          <StatusRow label="Modo" on={!logo.pumpManualMode} onText="Auto" offText="Manual" />
        </div>
      </div>
    </div>
  );
}

function StatusRow({
  label,
  on,
  onText,
  offText,
}: {
  label: string;
  on: boolean;
  onText: string;
  offText: string;
}): React.ReactNode {
  return (
    <div className="row">
      <span className="row__label">{label}</span>
      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span className={on ? "status-dot status-dot--online" : "status-dot"} />
        <span className="value" style={{ color: on ? colors.greenBright : colors.textDim }}>
          {on ? onText : offText}
        </span>
      </span>
    </div>
  );
}
