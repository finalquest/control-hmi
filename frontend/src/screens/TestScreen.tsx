import { useState } from "react";
import { REQUEST_KEYS, SWITCH_KEYS, type WritableBitKey } from "shared";
import { Button } from "../components/hmi/Button.js";
import { NumberField } from "../components/hmi/Number.js";
import { VmMap } from "../components/hmi/VmMap.js";
import { pulse } from "../api/commands.js";
import { useHmiState } from "../store/store.js";

export function TestScreen(): React.ReactNode {
  const { logo } = useHmiState();
  const [key, setKey] = useState<WritableBitKey>("autoMode");
  const [duration, setDuration] = useState(500);

  const liveValue =
    key in logo ? String(logo[key as keyof typeof logo]) : "—";

  return (
    <div style={{ maxWidth: 480, margin: "0 auto" }}>
      <div className="panel">
        <h3 className="panel__title">Pulso</h3>
        <div className="row">
          <span className="row__label">Bit</span>
          <select
            className="value-input"
            style={{ width: "auto" }}
            value={key}
            onChange={(e) => setKey(e.target.value as WritableBitKey)}
          >
            <optgroup label="Requests">
              {REQUEST_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </optgroup>
            <optgroup label="Switches">
              {SWITCH_KEYS.map((k) => (
                <option key={k} value={k}>
                  {k}
                </option>
              ))}
            </optgroup>
          </select>
        </div>
        <NumberField
          label="Duración"
          value={duration}
          unit="ms"
          editable
          min={50}
          max={10000}
          onCommit={(v) => setDuration(v)}
        />
        <div className="row">
          <span className="row__label">Valor actual</span>
          <span className="value">{liveValue}</span>
        </div>
        <div style={{ marginTop: 12 }}>
          <Button variant="primary" full onClick={() => pulse(key, duration)}>
            Pulsar
          </Button>
        </div>
      </div>
      <div style={{ marginTop: 12 }}>
        <VmMap />
      </div>
    </div>
  );
}
