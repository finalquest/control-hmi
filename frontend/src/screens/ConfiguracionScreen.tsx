import { useHmiState } from "../store/store.js";
import { NumberField } from "../components/hmi/Number.js";
import { setNumber } from "../api/commands.js";

export function ConfiguracionScreen(): React.ReactNode {
  const { logo } = useHmiState();
  return (
    <div style={{ maxWidth: 560, margin: "0 auto", display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="panel">
        <h3 className="panel__title">Parámetros</h3>
        <NumberField
          label="Timeout bomba"
          value={logo.pumpTimeout}
          unit="s"
          editable
          min={0}
          max={3600}
          onCommit={(v) => setNumber("pumpTimeout", v)}
        />
      </div>
      <div className="panel">
        <h3 className="panel__title">Estado actual (solo lectura)</h3>
        <div className="row"><span className="row__label">autoEnabled</span><span className="value">{String(logo.autoEnabled)}</span></div>
        <div className="row"><span className="row__label">remoteEnabled</span><span className="value">{String(logo.remoteEnabled)}</span></div>
        <div className="row"><span className="row__label">pumpRunning</span><span className="value">{String(logo.pumpRunning)}</span></div>
        <div className="row"><span className="row__label">tankHigh</span><span className="value">{String(logo.tankHigh)}</span></div>
        <div className="row"><span className="row__label">cisternLow</span><span className="value">{String(logo.cisternLow)}</span></div>
        <div className="row"><span className="row__label">alarm</span><span className="value">{String(logo.alarm)}</span></div>
        <div className="row"><span className="row__label">pumpTimeout</span><span className="value">{logo.pumpTimeout}</span></div>
      </div>
    </div>
  );
}
