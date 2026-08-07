import { useHaEntity } from "../../store/store.js";
import { colors } from "../../styles/theme.js";
import { ENERGY_SONOFF } from "../../ha/rooms.js";

function Metric({
  label,
  value,
  unit,
  color,
}: {
  label: string;
  value: string;
  unit?: string;
  color?: string;
}): React.ReactNode {
  return (
    <div className="metric">
      <span className="metric__label">{label}</span>
      <span className="metric__value" style={{ color: color ?? colors.text }}>
        {value}
        {unit && <span className="metric__unit"> {unit}</span>}
      </span>
    </div>
  );
}

function fmtTime(iso: string | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
}

export function OverviewBar(): React.ReactNode {
  const pb = useHaEntity(ENERGY_SONOFF[0].power);
  const pa = useHaEntity(ENERGY_SONOFF[1].power);
  const total = Math.round(Number(pb?.state ?? 0) + Number(pa?.state ?? 0));
  const setting = useHaEntity("sensor.sun_next_setting");
  const alarm = useHaEntity("alarm_control_panel.network_terminal_dogma_alarm_manager");

  const alarmState = alarm?.state ?? "unavailable";
  const alarmColor =
    alarmState === "armed_away" || alarmState === "armed_home"
      ? colors.redBright
      : alarmState === "disarmed"
        ? colors.greenBright
        : colors.textMuted;

  return (
    <section className="overview">
      <Metric label="Potencia total" value={String(total)} unit="W" color={colors.blue} />
      <Metric label="Atardecer" value={fmtTime(setting?.state)} color={colors.amberBright} />
      <Metric
        label="Alarma"
        value={alarmState === "unavailable" ? "—" : alarmState}
        color={alarmColor}
      />
    </section>
  );
}
