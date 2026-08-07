import { useHaEntity } from "../../store/store.js";

export interface SensorTileProps {
  entityId: string;
  label?: string;
  icon?: string;
  warn?: (state: string) => boolean;
}

export function SensorTile({
  entityId,
  label,
  icon,
  warn,
}: SensorTileProps): React.ReactNode {
  const entity = useHaEntity(entityId);
  const name = label ?? (entity?.attributes?.friendly_name as string | undefined) ?? entityId;
  const unit = (entity?.attributes?.unit_of_measurement as string | undefined) ?? "";
  const value = entity?.state ?? "—";
  const isWarn = warn?.(value) ?? false;

  return (
    <div className={`sensor-tile ${isWarn ? "sensor-tile--warn" : ""}`}>
      {icon && <span className="sensor-tile__icon">{icon}</span>}
      <div className="sensor-tile__body">
        <span className="sensor-tile__label">{name}</span>
        <span className="sensor-tile__value">
          {value}
          {unit && <span className="sensor-tile__unit"> {unit}</span>}
        </span>
      </div>
    </div>
  );
}
