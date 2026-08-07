import { useHaEntity } from "../../store/store.js";
import { lightToggle, switchToggle, inputBooleanToggle, fanToggle } from "../../api/ha.js";

export interface ToggleTileProps {
  entityId: string;
}

const HANDLERS: Record<string, (id: string, current: boolean) => void> = {
  light: lightToggle,
  switch: switchToggle,
  fan: fanToggle,
  input_boolean: inputBooleanToggle,
};

export function ToggleTile({ entityId }: ToggleTileProps): React.ReactNode {
  const entity = useHaEntity(entityId);
  const domain = entityId.split(".")[0];
  const handler = HANDLERS[domain];
  const on = entity?.state === "on";
  const name = (entity?.attributes?.friendly_name as string | undefined) ?? entityId;
  const unavailable = !entity || entity.state === "unavailable" || entity.state === "unknown";

  return (
    <button
      className={`ha-tile ${on ? "ha-tile--on" : ""} ${unavailable ? "ha-tile--off" : ""}`}
      disabled={unavailable || !handler}
      onClick={() => handler?.(entityId, on)}
    >
      <span className="ha-tile__name">{name}</span>
      <span className="ha-tile__state">{unavailable ? "—" : on ? "ON" : "OFF"}</span>
      <span className={`status-dot ${on ? "status-dot--online" : ""}`} />
    </button>
  );
}
