import { AcCycle } from "../components/ha/AcCycle.js";
import { FansPanel } from "../components/ha/FansPanel.js";
import { HaStatusBadge } from "../components/ha/HaStatusBadge.js";

export function ClimaScreen(): React.ReactNode {
  return (
    <div className="casa">
      <div className="casa__head">
        <h2 className="casa__title">Climatización</h2>
        <HaStatusBadge />
      </div>
      <section className="panel">
        <h3 className="panel__title">Aire acondicionado</h3>
        <AcCycle />
      </section>
      <section className="panel">
        <h3 className="panel__title">Ventiladores de techo</h3>
        <FansPanel />
      </section>
    </div>
  );
}
