import { useHmiState } from "../store/store.js";

export function ConfiguracionScreen(): React.ReactNode {
  const { logo } = useHmiState();
  const entries = Object.entries(logo) as Array<[string, boolean]>;
  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="panel">
        <h3 className="panel__title">Estado del PLC (en vivo)</h3>
        {entries.map(([k, v]) => (
          <div className="row" key={k}>
            <span className="row__label">{k}</span>
            <span className="value">{String(v)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
