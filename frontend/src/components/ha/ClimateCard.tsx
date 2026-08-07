import { useState } from "react";
import { useHaEntity } from "../../store/store.js";
import { climateSet } from "../../api/ha.js";

export interface ClimateCardProps {
  entityId: string;
}

const MODE_LABELS: Record<string, string> = {
  off: "Off",
  cool: "Frío",
  heat: "Calor",
  auto: "Auto",
  dry: "Seco",
  fan_only: "Vent",
};

export function ClimateCard({ entityId }: ClimateCardProps): React.ReactNode {
  const entity = useHaEntity(entityId);
  const attr = entity?.attributes ?? {};
  const name = (attr.friendly_name as string | undefined) ?? entityId;
  const modes = (attr.hvac_modes as string[] | undefined) ?? ["off"];
  const mode = entity?.state ?? "off";
  const current = attr.current_temperature as number | undefined;
  const target = (attr.temperature as number | null) ?? 24;
  const [setpoint, setSetpoint] = useState<number>(target);
  const unavailable = !entity || entity.state === "unavailable";

  return (
    <div className="climate">
      <div className="climate__head">
        <span className="climate__name">{name}</span>
        <span className="climate__current">
          {current ?? "—"}°<span className="climate__current-unit">C</span>
        </span>
      </div>
      <div className="climate__modes">
        {modes.map((m) => (
          <button
            key={m}
            className={`btn btn--sm ${mode === m ? "btn--active" : ""}`}
            disabled={unavailable}
            onClick={() => climateSet(entityId, { hvac_mode: m })}
          >
            {MODE_LABELS[m] ?? m}
          </button>
        ))}
      </div>
      <div className="climate__setpoint">
        <span className="row__label">Setpoint</span>
        <div className="stepper">
          <button className="btn btn--sm" disabled={unavailable} onClick={() => setSetpoint((s) => Math.max(7, +(s - 0.5).toFixed(1)))}>−</button>
          <span className="value">{setpoint.toFixed(1)}°C</span>
          <button className="btn btn--sm" disabled={unavailable} onClick={() => setSetpoint((s) => Math.min(35, +(s + 0.5).toFixed(1)))}>+</button>
          <button
            className="btn btn--sm btn--primary"
            disabled={unavailable}
            onClick={() => climateSet(entityId, { temperature: setpoint })}
          >
            Aplicar
          </button>
        </div>
      </div>
    </div>
  );
}
