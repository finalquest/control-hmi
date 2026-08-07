import { useHaStatus } from "../../store/store.js";
import { colors } from "../../styles/theme.js";

const LABELS: Record<string, string> = {
  disconnected: "HA desconectado",
  connecting: "HA conectando",
  ready: "HA listo",
  error: "HA error",
};

const COLORS: Record<string, string> = {
  disconnected: colors.textMuted,
  connecting: colors.amber,
  ready: colors.greenBright,
  error: colors.redBright,
};

export function HaStatusBadge(): React.ReactNode {
  const { status, detail } = useHaStatus();
  const color = COLORS[status] ?? colors.textDim;
  const on = status === "ready";
  return (
    <div className="ha-status">
      <span className={`status-dot ${on ? "status-dot--online" : "status-dot--off"}`} style={{ background: color }} />
      <span style={{ color, fontSize: 12 }}>{LABELS[status] ?? status}</span>
      {detail && status === "error" && (
        <span style={{ color: colors.textMuted, fontSize: 11 }}>{detail}</span>
      )}
    </div>
  );
}
