import { AcCycle } from "../components/ha/AcCycle.js";
import { HaStatusBadge } from "../components/ha/HaStatusBadge.js";

export function ClimaScreen(): React.ReactNode {
  return (
    <div className="casa">
      <div className="casa__head">
        <h2 className="casa__title">Climatización</h2>
        <HaStatusBadge />
      </div>
      <section className="panel">
        <AcCycle />
      </section>
    </div>
  );
}
