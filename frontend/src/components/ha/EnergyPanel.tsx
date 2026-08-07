import { useHaEntity } from "../../store/store.js";
import { colors } from "../../styles/theme.js";
import { switchToggle } from "../../api/ha.js";
import { ENERGY_SONOFF } from "../../ha/rooms.js";

function EnergyUnit(props: {
  name: string;
  switchId: string;
  power: string;
  voltage: string;
  energyDay: string;
  energyMonth: string;
}): React.ReactNode {
  const sw = useHaEntity(props.switchId);
  const power = useHaEntity(props.power);
  const volt = useHaEntity(props.voltage);
  const day = useHaEntity(props.energyDay);
  const month = useHaEntity(props.energyMonth);

  const powerVal = Number(power?.state ?? 0);
  const powerMax = 4000;
  const ratio = Math.min(1, powerVal / powerMax);
  const start = 150;
  const end = 390;
  const angle = start + (end - start) * ratio;

  const swOn = sw?.state === "on";

  return (
    <div className="energy-unit">
      <div className="energy-unit__head">
        <span className="energy-unit__name">{props.name}</span>
        <button
          className={`btn btn--sm ${swOn ? "btn--active" : ""}`}
          onClick={() => switchToggle(props.switchId, swOn)}
        >
          {swOn ? "ON" : "OFF"}
        </button>
      </div>
      <svg viewBox="0 0 120 90" className="energy-unit__gauge">
        <path
          d={arc(60, 50, 42, start, end)}
          fill="none"
          stroke={colors.grayDark}
          strokeWidth={7}
          strokeLinecap="round"
        />
        <path
          d={arc(60, 50, 42, start, Math.max(start + 0.1, angle))}
          fill="none"
          stroke={powerVal > 2000 ? colors.amber : colors.blue}
          strokeWidth={7}
          strokeLinecap="round"
        />
        <text x={60} y={48} textAnchor="middle" fill={colors.text} fontSize={20} fontWeight={700}>
          {Math.round(powerVal)}
        </text>
        <text x={60} y={62} textAnchor="middle" fill={colors.textDim} fontSize={9}>
          W
        </text>
      </svg>
      <div className="energy-unit__stats">
        <div className="readout">
          <span className="readout__label">Voltaje</span>
          <span className="readout__value">{volt?.state ?? "—"} V</span>
        </div>
        <div className="readout">
          <span className="readout__label">Hoy</span>
          <span className="readout__value">{day?.state ?? "—"} kWh</span>
        </div>
        <div className="readout">
          <span className="readout__label">Mes</span>
          <span className="readout__value">{month?.state ?? "—"} kWh</span>
        </div>
      </div>
    </div>
  );
}

function polar(cx: number, cy: number, r: number, a: number): { x: number; y: number } {
  const rad = (a * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function arc(cx: number, cy: number, r: number, start: number, end: number): string {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}

export function EnergyPanel(): React.ReactNode {
  const pb = useHaEntity(ENERGY_SONOFF[0].power);
  const pa = useHaEntity(ENERGY_SONOFF[1].power);
  const total = Number(pb?.state ?? 0) + Number(pa?.state ?? 0);

  return (
    <section className="panel">
      <h3 className="panel__title">
        Energía <span className="panel__hint">total: {Math.round(total)} W</span>
      </h3>
      <div className="energy-grid">
        {ENERGY_SONOFF.map((u) => (
          <EnergyUnit key={u.id} {...u} />
        ))}
      </div>
    </section>
  );
}
