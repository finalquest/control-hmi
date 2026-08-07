import { useHaEntity } from "../../store/store.js";
import { colors } from "../../styles/theme.js";
import { DeviceLamp } from "./DeviceLamp.js";
import { INFRA } from "../../ha/rooms.js";

function StatusRow({
  title,
  ids,
}: {
  title: string;
  ids: readonly string[];
}): React.ReactNode {
  return (
    <div className="infra-block">
      <span className="infra-block__title">{title}</span>
      <div className="infra-block__row">
        {ids.map((id) => (
          <DeviceLamp key={id} entityId={id} size={26} />
        ))}
      </div>
    </div>
  );
}

function TempReadout({ entityId, label }: { entityId: string; label: string }): React.ReactNode {
  const e = useHaEntity(entityId);
  const v = e?.state ?? "—";
  const num = Number(v);
  const hot = !Number.isNaN(num) && num >= 60;
  const unit = (e?.attributes?.unit_of_measurement as string | undefined) ?? (Number.isNaN(num) ? "" : "°C");
  return (
    <div className="readout">
      <span className="readout__label">{label}</span>
      <span className="readout__value" style={{ color: hot ? colors.amberBright : colors.text }}>
        {v}
        {unit}
      </span>
    </div>
  );
}

function WanReadout({
  entityId,
  label,
  unit,
  highlight,
}: {
  entityId: string;
  label: string;
  unit: string;
  highlight?: boolean;
}): React.ReactNode {
  const e = useHaEntity(entityId);
  const raw = e?.state ?? "—";
  const num = Number(raw);
  const v = Number.isFinite(num) ? (num >= 100 ? num.toFixed(0) : num.toFixed(2)) : raw;
  return (
    <div className={`readout ${highlight ? "readout--accent" : ""}`}>
      <span className="readout__label">{label}</span>
      <span className="readout__value">
        {v}
        <span className="readout__unit"> {unit}</span>
      </span>
    </div>
  );
}

export function InfraPanel(): React.ReactNode {
  return (
    <section className="panel">
      <h3 className="panel__title">Infraestructura</h3>
      <div className="infra-grid">
        <StatusRow title="Proxmox / VMs" ids={INFRA.proxmox} />
        <StatusRow title="Networking" ids={INFRA.network} />
        <StatusRow title="Control" ids={INFRA.control} />
      </div>
      <div className="wan">
        <span className="wan__title">WAN · Terminal Dogma (puerto 9)</span>
        <div className="wan__grid">
          <WanReadout entityId={INFRA.wan.down} label="Download" unit="Mbit/s" highlight />
          <WanReadout entityId={INFRA.wan.up} label="Upload" unit="Mbit/s" highlight />
          <WanReadout entityId={INFRA.wan.latencyCloudflare} label="Latencia Cloudflare" unit="ms" />
          <WanReadout entityId={INFRA.wan.latencyGoogle} label="Latencia Google" unit="ms" />
        </div>
      </div>
      <div className="infra-temps">
        {INFRA.temps.map((id) => (
          <TempReadout key={id} entityId={id} label="CPU" />
        ))}
        <TempReadout entityId={INFRA.k1max.bed} label="K1Max cama" />
        <TempReadout entityId={INFRA.k1max.extruder} label="K1Max extrusor" />
      </div>
    </section>
  );
}
