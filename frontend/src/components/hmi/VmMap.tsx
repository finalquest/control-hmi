import { useEffect, useState } from "react";
import type { VmMapping } from "shared";
import { fetchVmMapping } from "../../api/mapping.js";
import { useHmiState } from "../../store/store.js";

const SECTION_LABELS: Record<keyof VmMapping, string> = {
  requests: "Requests (write 1, el PLC limpia)",
  switches: "Switches (write 1 / 0)",
  states: "States (solo lectura, polleados)",
  numbers: "Numbers (holding registers)",
};

export function VmMap(): React.ReactNode {
  const { logo } = useHmiState();
  const [mapping, setMapping] = useState<VmMapping | null>(null);
  const [error, setError] = useState<string>();

  useEffect(() => {
    fetchVmMapping()
      .then(setMapping)
      .catch((e) => setError(String(e)));
  }, []);

  if (error) {
    return (
      <div className="panel">
        <h3 className="panel__title">Mapa VM</h3>
        <p className="row__label">Error: {error}</p>
      </div>
    );
  }
  if (!mapping) {
    return (
      <div className="panel">
        <h3 className="panel__title">Mapa VM</h3>
        <p className="row__label">Cargando…</p>
      </div>
    );
  }

  return (
    <div className="panel">
      <h3 className="panel__title">Mapa VM</h3>
      {(Object.keys(SECTION_LABELS) as Array<keyof VmMapping>).map((section) => (
        <div key={section} style={{ marginTop: 8 }}>
          <div className="vm-group">{SECTION_LABELS[section]}</div>
          {Object.entries(mapping[section]).map(([key, addr]) => {
            const value = section === "requests" ? undefined : logo[key as keyof typeof logo];
            return (
              <div className="row vm-row" key={key}>
                <span className="row__label">{key}</span>
                <span className="vm-addr">{addr}</span>
                {value !== undefined && (
                  <span className={`vm-live vm-live--${typeof value}`}>{String(value)}</span>
                )}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}
