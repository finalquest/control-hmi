import { useHaByDomain } from "../store/store.js";
import { ToggleTile } from "../components/ha/ToggleTile.js";
import { ActionTile } from "../components/ha/ActionTile.js";
import { ClimateCard } from "../components/ha/ClimateCard.js";
import { FanCard } from "../components/ha/FanCard.js";
import { HaStatusBadge } from "../components/ha/HaStatusBadge.js";

const SWITCH_BLACKLIST = /child lock|do not disturb|permit join|automation|^hue bridge/i;

function isMainSwitch(friendlyName: string): boolean {
  return !SWITCH_BLACKLIST.test(friendlyName.toLowerCase());
}

export function CasaScreen(): React.ReactNode {
  const lights = useHaByDomain("light");
  const scenes = useHaByDomain("scene");
  const switches = useHaByDomain("switch").filter((e) =>
    isMainSwitch((e.attributes?.friendly_name as string | undefined) ?? e.entityId),
  );

  return (
    <div className="ha-screen">
      <div className="ha-screen__head">
        <h2 className="ha-screen__title">Casa</h2>
        <HaStatusBadge />
      </div>

      <section className="panel">
        <h3 className="panel__title">Luces ({lights.length})</h3>
        <div className="ha-grid">
          {lights.map((e) => (
            <ToggleTile key={e.entityId} entityId={e.entityId} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">Clima</h3>
        <div className="ha-climate-row">
          <ClimateCard entityId="climate.aire_acondicionado" />
        </div>
        <div className="ha-fans">
          <FanCard
            label="Oficina"
            fanId="fan.ventilador_oficina"
            lightBooleanId="input_boolean.fan_oficina_light"
            scriptPrefix="script.fan_oficina"
          />
          <FanCard
            label="Pintura"
            fanId="fan.ventilador_pintura"
            lightBooleanId="input_boolean.fan_pintura_light"
            scriptPrefix="script.fan_pintura"
          />
          <FanCard
            label="Habitación"
            fanId="fan.ventilador_habitacion"
            lightBooleanId="input_boolean.fan_habitacion_light"
            scriptPrefix="script.fan_habitacion"
          />
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">Escenas ({scenes.length})</h3>
        <div className="ha-grid ha-grid--scene">
          {scenes.map((e) => (
            <ActionTile key={e.entityId} entityId={e.entityId} variant="scene" />
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">Switches y tomas ({switches.length})</h3>
        <div className="ha-grid">
          {switches.map((e) => (
            <ToggleTile key={e.entityId} entityId={e.entityId} />
          ))}
        </div>
      </section>
    </div>
  );
}
