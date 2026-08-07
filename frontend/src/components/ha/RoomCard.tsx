import { useHaEntity } from "../../store/store.js";
import { colors } from "../../styles/theme.js";
import { runScene } from "../../api/ha.js";
import { DeviceLamp } from "./DeviceLamp.js";
import type { RoomDef } from "../../ha/rooms.js";

function Readout({
  entityId,
  label,
  unit,
}: {
  entityId: string;
  label: string;
  unit?: string;
}): React.ReactNode {
  const entity = useHaEntity(entityId);
  const value = entity?.state ?? "—";
  const u = unit ?? (entity?.attributes?.unit_of_measurement as string | undefined) ?? "";
  return (
    <div className="readout">
      <span className="readout__label">{label}</span>
      <span className="readout__value">
        {value}
        {u && <span className="readout__unit"> {u}</span>}
      </span>
    </div>
  );
}

function SceneButton({
  entityId,
  roomName,
}: {
  entityId: string;
  roomName: string;
}): React.ReactNode {
  const entity = useHaEntity(entityId);
  const name =
    (entity?.attributes?.friendly_name as string | undefined)?.replace(roomName, "").trim() ||
    entityId;
  return (
    <button className="btn btn--sm btn--scene" onClick={() => runScene(entityId)}>
      {name}
    </button>
  );
}

function PresenceIndicator({
  entityId,
  label,
}: {
  entityId: string;
  label: string;
}): React.ReactNode {
  const entity = useHaEntity(entityId);
  const on = entity?.state === "on";
  return (
    <span className={`presence ${on ? "presence--on" : ""}`} title={entityId}>
      <span
        className="presence__dot"
        style={{ background: on ? colors.redBright : colors.grayDark }}
      />
      {label}
    </span>
  );
}

function isOn(entityId: string, entities: Record<string, { state: string }>): boolean {
  return entities[entityId]?.state === "on";
}

export function RoomCard({
  room,
  entities,
}: {
  room: RoomDef;
  entities: Record<string, { state: string }>;
}): React.ReactNode {
  const activeLights = room.lights?.filter((id) => isOn(id, entities)).length ?? 0;
  const totalLights = room.lights?.length ?? 0;

  return (
    <section className="room">
      <header className="room__head">
        <h3 className="room__name">{room.name}</h3>
        <div className="room__indicators">
          {room.motion && (
            <PresenceIndicator entityId={room.motion} label="Movimiento" />
          )}
          {room.contact && (
            <PresenceIndicator entityId={room.contact} label="Puerta" />
          )}
          {totalLights > 0 && (
            <span className="room__count">
              {activeLights}/{totalLights} luces
            </span>
          )}
        </div>
      </header>

      {(room.climate?.temp || room.climate?.humidity || room.illumination) && (
        <div className="room__climate">
          {room.climate?.temp && (
            <Readout entityId={room.climate.temp} label="Temp" />
          )}
          {room.climate?.humidity && (
            <Readout entityId={room.climate.humidity} label="Hum" />
          )}
          {room.illumination && (
            <Readout entityId={room.illumination} label="Luz" />
          )}
          {room.climate?.battery && (
            <Readout entityId={room.climate.battery} label="Batt" />
          )}
        </div>
      )}

      {(room.lights?.length || room.switches?.length) && (
        <div className="room__devices">
          {room.lights?.map((id) => <DeviceLamp key={id} entityId={id} />)}
          {room.switches?.map((id) => <DeviceLamp key={id} entityId={id} />)}
        </div>
      )}

      {room.scenes && room.scenes.length > 0 && (
        <div className="room__scenes">
          {room.scenes.map((id) => (
            <SceneButton key={id} entityId={id} roomName={room.name} />
          ))}
        </div>
      )}
    </section>
  );
}
