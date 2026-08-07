import { useHmiState } from "../store/store.js";
import { ROOMS } from "../ha/rooms.js";
import { OverviewBar } from "../components/ha/OverviewBar.js";
import { RoomCard } from "../components/ha/RoomCard.js";
import { EnergyPanel } from "../components/ha/EnergyPanel.js";
import { InfraPanel } from "../components/ha/InfraPanel.js";
import { ClimateCard } from "../components/ha/ClimateCard.js";
import { HaStatusBadge } from "../components/ha/HaStatusBadge.js";

export function CasaScreen(): React.ReactNode {
  const { ha } = useHmiState();
  const interior = ROOMS.filter((r) => r.zone !== "exterior" && r.zone !== "sistemas");
  const exterior = ROOMS.filter((r) => r.zone === "exterior");

  return (
    <div className="casa">
      <div className="casa__head">
        <h2 className="casa__title">Casa</h2>
        <HaStatusBadge />
      </div>

      <OverviewBar />

      <section className="panel">
        <h3 className="panel__title">Exterior</h3>
        <div className="rooms">
          {exterior.map((r) => (
            <RoomCard key={r.id} room={r} entities={ha} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">Interior</h3>
        <div className="rooms">
          {interior.map((r) => (
            <RoomCard key={r.id} room={r} entities={ha} />
          ))}
        </div>
      </section>

      <section className="panel">
        <h3 className="panel__title">Clima — Aire acondicionado</h3>
        <div className="casa__climate">
          <ClimateCard entityId="climate.aire_acondicionado" />
        </div>
      </section>

      <EnergyPanel />
      <InfraPanel />
    </div>
  );
}
