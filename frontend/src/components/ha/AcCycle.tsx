import { useState } from "react";
import { useHaEntity } from "../../store/store.js";
import { colors } from "../../styles/theme.js";
import { climateSet } from "../../api/ha.js";

const ENTITY = "climate.aire_acondicionado";

const MODES: Array<{ key: string; label: string }> = [
  { key: "off", label: "Off" },
  { key: "cool", label: "Frío" },
  { key: "heat", label: "Calor" },
  { key: "auto", label: "Auto" },
  { key: "dry", label: "Seco" },
  { key: "fan_only", label: "Vent" },
];

function Coil({
  x,
  y,
  w,
  h,
  tint,
  hot,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  tint: string;
  hot: boolean;
}): React.ReactNode {
  const fins = Array.from({ length: Math.floor(w / 10) }, (_, i) => x + 6 + i * 10);
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={tint}
        stroke={hot ? colors.red : colors.blue}
        strokeWidth={2}
        opacity={0.5}
      />
      {fins.map((fx) => (
        <line
          key={fx}
          x1={fx}
          y1={y + 6}
          x2={fx}
          y2={y + h - 6}
          stroke={hot ? colors.redBright : colors.water}
          strokeWidth={2}
          opacity={0.7}
        />
      ))}
    </g>
  );
}

function Pipe({
  d,
  color,
  active,
}: {
  d: string;
  color: string;
  active: boolean;
}): React.ReactNode {
  return (
    <g>
      <path d={d} fill="none" stroke={colors.grayDark} strokeWidth={12} strokeLinecap="round" />
      <path
        d={d}
        fill="none"
        stroke={active ? color : colors.grayDark}
        strokeWidth={8}
        strokeLinecap="round"
        strokeDasharray="10 8"
        className={active ? "ref-flow" : ""}
      />
    </g>
  );
}

export function AcCycle(): React.ReactNode {
  const e = useHaEntity(ENTITY);
  const attr = e?.attributes ?? {};
  const mode = e?.state ?? "off";
  const running = mode !== "off" && mode !== "unavailable" && mode !== "unknown";
  const indoor = attr.current_temperature as number | undefined;
  const target = (attr.temperature as number | null) ?? 24;
  const [setpoint, setSetpoint] = useState<number>(target);
  const fanMode = (attr.fan_mode as string | undefined) ?? "—";

  const setMode = (m: string): void => {
    climateSet(ENTITY, { hvac_mode: m });
  };

  const COMP = { x: 200, y: 130 };
  const COND = { x: 520, y: 95, w: 110, h: 80 };
  const EXP = { x: 520, y: 350 };
  const EVAP = { x: 90, y: 320, w: 110, h: 80 };

  const hot = colors.redBright;
  const liquid = colors.amber;
  const coldLiquid = colors.water;
  const coldGas = colors.blue;

  const dec = (): void => setSetpoint((s) => Math.max(7, +(s - 0.5).toFixed(1)));
  const inc = (): void => setSetpoint((s) => Math.min(35, +(s + 0.5).toFixed(1)));
  const apply = (): void => climateSet(ENTITY, { temperature: setpoint });

  return (
    <div className="ac">
      <div className="ac__layout">
        <div className="ac__diagram">
          <svg viewBox="0 0 720 470" className="ac__svg">
            <text x={360} y={30} textAnchor="middle" fill={colors.text} fontSize={18} fontWeight={700}>
              Ciclo de refrigeración
            </text>
            <text x={360} y={50} textAnchor="middle" fill={colors.textMuted} fontSize={11}>
              {running ? `en marcha · ${mode}` : "detenido"}
            </text>

            <Pipe d={`M ${COMP.x + 34} ${COMP.y} L ${COND.x} ${COMP.y}`} color={hot} active={running} />
            <Pipe d={`M ${COND.x + COND.w / 2} ${COND.y + COND.h} L ${EXP.x} ${EXP.y - 16}`} color={liquid} active={running} />
            <Pipe d={`M ${EXP.x - 16} ${EXP.y} L ${EVAP.x + EVAP.w} ${EVAP.y + EVAP.h / 2}`} color={coldLiquid} active={running} />
            <Pipe d={`M ${EVAP.x} ${EVAP.y + EVAP.h / 2} L ${COMP.x} ${COMP.y}`} color={coldGas} active={running} />

            <Coil x={COND.x} y={COND.y} w={COND.w} h={COND.h} tint="rgba(229,57,53,0.15)" hot />
            <text x={COND.x + COND.w / 2} y={COND.y - 8} textAnchor="middle" fill={colors.redBright} fontSize={12} fontWeight={700}>
              Condensador
            </text>
            <text x={COND.x + COND.w / 2} y={COND.y + COND.h + 16} textAnchor="middle" fill={colors.textMuted} fontSize={10}>
              unidad exterior
            </text>

            <Coil x={EVAP.x} y={EVAP.y} w={EVAP.w} h={EVAP.h} tint="rgba(58,160,255,0.15)" hot={false} />
            <text x={EVAP.x + EVAP.w / 2} y={EVAP.y - 8} textAnchor="middle" fill={colors.water} fontSize={12} fontWeight={700}>
              Evaporador
            </text>
            <text x={EVAP.x + EVAP.w / 2} y={EVAP.y + EVAP.h / 2 + 2} textAnchor="middle" fill={colors.text} fontSize={22} fontWeight={800}>
              {indoor ?? "—"}°
            </text>
            <text x={EVAP.x + EVAP.w / 2} y={EVAP.y + EVAP.h + 16} textAnchor="middle" fill={colors.textMuted} fontSize={10}>
              unidad interior
            </text>

            <g style={{ opacity: running ? 1 : 0.45 }}>
              <circle cx={COMP.x} cy={COMP.y} r={34} fill={colors.panelAlt} stroke={running ? colors.green : colors.borderStrong} strokeWidth={3} />
              <g className={running ? "ref-spin" : ""} style={{ transformOrigin: `${COMP.x}px ${COMP.y}px` }}>
                <circle cx={COMP.x} cy={COMP.y} r={20} fill="none" stroke={running ? colors.greenBright : colors.gray} strokeWidth={4} strokeDasharray="22 12" />
              </g>
              <circle cx={COMP.x} cy={COMP.y} r={6} fill={running ? colors.greenBright : colors.gray} />
            </g>
            <text x={COMP.x} y={COMP.y - 44} textAnchor="middle" fill={colors.text} fontSize={12} fontWeight={700}>
              Compresor
            </text>

            <g style={{ opacity: running ? 1 : 0.45 }}>
              <polygon
                points={`${EXP.x},${EXP.y - 16} ${EXP.x + 16},${EXP.y} ${EXP.x},${EXP.y + 16} ${EXP.x - 16},${EXP.y}`}
                fill={colors.panelAlt}
                stroke={running ? colors.amberBright : colors.borderStrong}
                strokeWidth={2}
              />
              <line x1={EXP.x - 10} y1={EXP.y} x2={EXP.x + 10} y2={EXP.y} stroke={running ? colors.amberBright : colors.gray} strokeWidth={2} />
            </g>
            <text x={EXP.x + 26} y={EXP.y + 4} fill={colors.textMuted} fontSize={11}>
              válvula expansión
            </text>
          </svg>
        </div>

        <div className="ac__controls">
          <div className="ac__readouts">
            <div className="ac__readout">
              <span className="ac__readout-label">Temperatura actual</span>
              <span className="ac__readout-value ac__readout-value--actual">
                {indoor ?? "—"}<span className="ac__deg">°C</span>
              </span>
            </div>
            <div className="ac__readout">
              <span className="ac__readout-label">Temperatura pedida</span>
              <div className="ac__setpoint-ctrl">
                <button className="ac__arrow" onClick={dec} aria-label="bajar">▼</button>
                <span className="ac__readout-value ac__readout-value--target">
                  {setpoint.toFixed(1)}<span className="ac__deg">°C</span>
                </span>
                <button className="ac__arrow ac__arrow--up" onClick={inc} aria-label="subir">▲</button>
              </div>
              <button className="btn btn--primary ac__apply" onClick={apply}>Aplicar {setpoint.toFixed(1)}°</button>
            </div>
          </div>

          <div className="ac__modes-hmi">
            <span className="ac__section-label">Modo</span>
            <div className="ac__mode-grid">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  className={`ac__mode ac__mode--${m.key} ${mode === m.key ? "ac__mode--active" : ""}`}
                  onClick={() => setMode(m.key)}
                >
                  {m.label}
                </button>
              ))}
            </div>
            <span className="ac__fan">Ventilador: <strong>{fanMode}</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
}
