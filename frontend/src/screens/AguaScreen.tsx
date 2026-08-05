import { useHmiState } from "../store/store.js";
import { Tank } from "../components/hmi/Tank.js";
import { Pump } from "../components/hmi/Pump.js";
import { Pipe } from "../components/hmi/Pipe.js";
import { Motor } from "../components/hmi/Motor.js";
import { colors } from "../styles/theme.js";
import { pulse } from "../api/commands.js";

const PULSE_MS = 250;

export function AguaScreen(): React.ReactNode {
  const { logo } = useHmiState();
  const auto = !logo.pumpManualMode;

  const toggleRun = (): void => {
    pulse(logo.manualRunRequest ? "resetManualRun" : "remoteManualRun", PULSE_MS);
  };
  const toggleMode = (): void => {
    pulse(logo.pumpManualMode ? "autoMode" : "manualMode", PULSE_MS);
  };
  const emergencyStop = (): void => {
    pulse("emergencyStop", PULSE_MS);
  };
  const emergencyClean = (): void => {
    pulse("emergencyStopClean", PULSE_MS);
  };

  return (
    <div className="agua">
      <div className="svg-wrap">
        <svg viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid meet">
          <rect x={0} y={0} width={1200} height={680} fill={colors.bg} />

          <text x={40} y={46} fill={colors.text} fontSize={20} fontWeight={700}>
            Proceso de Agua
          </text>
          <text x={40} y={68} fill={colors.textMuted} fontSize={12}>
            click en el modo o en la bomba para operar
          </text>

          <ModeBadge auto={auto} onClick={toggleMode} />

          <Pipe
            points={[
              { x: 320, y: 470 },
              { x: 496, y: 470 },
            ]}
            active={logo.pumpRunning}
          />
          <Pipe
            points={[
              { x: 540, y: 426 },
              { x: 540, y: 250 },
              { x: 880, y: 250 },
            ]}
            active={logo.pumpRunning}
          />

          <Tank
            x={80}
            y={340}
            w={240}
            h={290}
            label="Cisterna"
            variant="cistern"
            levelOverride={logo.cisternaHasWater ? 72 : 8}
            lowSensor={!logo.cisternaHasWater}
            sublabel={logo.cisternaHasWater ? "con agua" : "sin agua"}
            showEstimate={false}
          />

          <Tank
            x={880}
            y={150}
            w={260}
            h={330}
            label="Tanque"
            levelOverride={logo.tankRequestFill ? 15 : 85}
            lowSensor={logo.tankRequestFill}
            sublabel={logo.tankRequestFill ? "pide llenar" : "nivel ok"}
            showEstimate={false}
          />

          <g className="hmi-clickable" onClick={toggleRun}>
            <rect x={490} y={415} width={300} height={115} fill="transparent" />
            <Pump x={540} y={470} r={44} running={logo.pumpRunning} />
            <line x1={584} y1={470} x2={684} y2={470} stroke={colors.borderStrong} strokeWidth={10} />
            <Motor x={730} y={470} r={46} running={logo.pumpCommanded} />
            <text x={635} y={600} textAnchor="middle" fill={colors.textMuted} fontSize={12}>
              bomba — click para {logo.manualRunRequest ? "detener" : "arrancar"}
            </text>
          </g>

          <g
            className="hmi-clickable"
            onClick={emergencyStop}
            style={{
              filter: "drop-shadow(0 0 10px rgba(229,57,53,0.7))",
              animation: logo.emergency ? "pulse 0.8s ease-in-out infinite" : "none",
            }}
          >
            <circle cx={975} cy={605} r={56} fill={colors.red} stroke={colors.redBright} strokeWidth={5} />
            <text x={975} y={598} textAnchor="middle" fill="#ffffff" fontSize={15} fontWeight={800}>
              PARADA
            </text>
            <text x={975} y={620} textAnchor="middle" fill="#ffffff" fontSize={12} fontWeight={700}>
              EMERGENCIA
            </text>
          </g>

          <g
            className="hmi-clickable"
            onClick={emergencyClean}
            style={{
              filter: logo.emergency
                ? "drop-shadow(0 0 12px rgba(246,193,67,0.95))"
                : "none",
            }}
          >
            <circle cx={1115} cy={605} r={42} fill={colors.amber} stroke={colors.amberBright} strokeWidth={3} />
            <text x={1115} y={602} textAnchor="middle" fill="#1a1a1a" fontSize={12} fontWeight={800}>
              REARMAR
            </text>
            <text x={1115} y={618} textAnchor="middle" fill="#1a1a1a" fontSize={10}>
              emergencia
            </text>
          </g>
        </svg>
      </div>
    </div>
  );
}

function ModeBadge({ auto, onClick }: { auto: boolean; onClick: () => void }): React.ReactNode {
  const cx = 635;
  const cy = 95;
  const w = 180;
  const h = 46;
  const fill = auto ? colors.blue : colors.amber;
  return (
    <g className="hmi-clickable" onClick={onClick}>
      <rect x={cx - w / 2} y={cy - h / 2} width={w} height={h} rx={h / 2} fill={fill} />
      <text
        x={cx}
        y={cy + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill="#ffffff"
        fontSize={18}
        fontWeight={700}
        letterSpacing={2}
      >
        {auto ? "AUTO" : "MANUAL"}
      </text>
      <text x={cx} y={cy + h / 2 + 16} textAnchor="middle" fill={colors.textMuted} fontSize={11}>
        click para cambiar modo
      </text>
    </g>
  );
}
