import { useHaEntity } from "../../store/store.js";
import { colors } from "../../styles/theme.js";
import { fanSetPercentage, fanSetDirection } from "../../api/ha.js";
import { DeviceLamp } from "./DeviceLamp.js";

export interface FanUnitProps {
  name: string;
  fanId: string;
  lightId: string;
}

const SPEEDS = [1, 2, 3, 4, 5, 6];

function pctToSpeed(pct: number): number {
  if (pct <= 0) return 0;
  return Math.round((pct / 100) * 6);
}

function speedToPct(speed: number): number {
  return Math.round((speed / 6) * 100);
}

function FanBlades({
  running,
  speed,
  direction,
}: {
  running: boolean;
  speed: number;
  direction: string;
}): React.ReactNode {
  const duration = speed > 0 ? Math.max(0.4, 2.2 - speed * 0.32) : 2;
  const reverse = direction === "reverse";
  return (
    <g
      className={running ? "fan-spin" : ""}
      style={{
        transformOrigin: "60px 60px",
        animationDuration: `${duration}s`,
        animationDirection: reverse ? "reverse" : "normal",
      }}
    >
      {[0, 120, 240].map((deg) => (
        <ellipse
          key={deg}
          cx={60}
          cy={26}
          rx={12}
          ry={30}
          fill={running ? colors.water : colors.grayDark}
          opacity={0.85}
          transform={`rotate(${deg} 60 60)`}
        />
      ))}
    </g>
  );
}

export function FanUnit({ name, fanId, lightId }: FanUnitProps): React.ReactNode {
  const fan = useHaEntity(fanId);
  const on = fan?.state === "on";
  const pct = Number(fan?.attributes?.percentage ?? 0);
  const speed = pctToSpeed(pct);
  const direction = (fan?.attributes?.direction as string | undefined) ?? "forward";

  return (
    <div className={`fan-unit ${on ? "fan-unit--on" : ""}`}>
      <div className="fan-unit__head">
        <span className="fan-unit__name">{name}</span>
        <DeviceLamp entityId={lightId} label="Luz" size={26} />
      </div>

      <div className="fan-unit__viz">
        <svg viewBox="0 0 120 120" className="fan-unit__svg">
          <FanBlades running={on} speed={speed} direction={direction} />
          <circle cx={60} cy={60} r={14} fill={on ? colors.blue : colors.panelAlt} stroke={colors.borderStrong} strokeWidth={2} />
          <circle cx={60} cy={60} r={5} fill={on ? colors.greenBright : colors.gray} />
        </svg>
        <span className="fan-unit__state">
          {on ? `Velocidad ${speed}` : "Detenido"}
        </span>
      </div>

      <div className="fan-unit__speeds">
        <button
          className={`fan-unit__btn ${!on ? "fan-unit__btn--active" : ""}`}
          onClick={() => fanSetPercentage(fanId, 0)}
        >
          Off
        </button>
        {SPEEDS.map((n) => (
          <button
            key={n}
            className={`fan-unit__btn ${on && speed === n ? "fan-unit__btn--active" : ""}`}
            onClick={() => fanSetPercentage(fanId, speedToPct(n))}
          >
            {n}
          </button>
        ))}
      </div>

      <div className="fan-unit__dir">
        <button
          className={`fan-unit__dirbtn ${direction === "forward" ? "fan-unit__dirbtn--active" : ""}`}
          onClick={() => fanSetDirection(fanId, "forward")}
        >
          Verano
        </button>
        <button
          className={`fan-unit__dirbtn ${direction === "reverse" ? "fan-unit__dirbtn--active" : ""}`}
          onClick={() => fanSetDirection(fanId, "reverse")}
        >
          Invierno
        </button>
      </div>
    </div>
  );
}
