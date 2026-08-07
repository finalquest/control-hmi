import { useHaEntity } from "../../store/store.js";
import { colors } from "../../styles/theme.js";
import { lightToggle, switchToggle, inputBooleanToggle } from "../../api/ha.js";

export interface DeviceLampProps {
  entityId: string;
  label?: string;
  size?: number;
}

const TOGGLERS: Record<string, (id: string, on: boolean) => void> = {
  light: lightToggle,
  switch: switchToggle,
  input_boolean: inputBooleanToggle,
};

export function DeviceLamp({
  entityId,
  label,
  size = 34,
}: DeviceLampProps): React.ReactNode {
  const entity = useHaEntity(entityId);
  const domain = entityId.split(".")[0];
  const name =
    label ??
    (entity?.attributes?.friendly_name as string | undefined) ??
    entityId.split(".")[1];
  const on = entity?.state === "on";
  const active = entity?.state === "on";
  const unavailable = !entity || entity.state === "unavailable" || entity.state === "unknown";
  const togglable = domain in TOGGLERS && !unavailable;

  const fill = on ? colors.greenBright : unavailable ? colors.grayDark : colors.grayDark;
  const glow = on ? colors.green : "transparent";

  return (
    <button
      type="button"
      className={`dev-lamp ${on ? "dev-lamp--on" : ""} ${togglable ? "dev-lamp--toggle" : ""}`}
      title={entityId}
      disabled={!togglable}
      onClick={() => togglable && TOGGLERS[domain](entityId, on)}
    >
      <svg width={size} height={size} viewBox="0 0 34 34" className="dev-lamp__svg">
        {on && <circle cx={17} cy={17} r={15} fill={glow} opacity={0.3} />}
        <circle
          cx={17}
          cy={17}
          r={10}
          fill={fill}
          stroke={on ? colors.green : colors.borderStrong}
          strokeWidth={2}
        />
        <circle cx={14} cy={14} r={3.2} fill="#ffffff" opacity={on ? 0.55 : 0.12} />
      </svg>
      <span className="dev-lamp__name">{name}</span>
      {active && <span className="dev-lamp__state">ON</span>}
    </button>
  );
}
