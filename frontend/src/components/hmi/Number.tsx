import { useEffect, useState } from "react";

export interface NumberFieldProps {
  label: string;
  value: number;
  unit?: string;
  editable?: boolean;
  onCommit?: (value: number) => void;
  min?: number;
  max?: number;
}

export function NumberField({ label, value, unit, editable, onCommit, min, max }: NumberFieldProps) {
  const [draft, setDraft] = useState(String(value));

  useEffect(() => {
    setDraft(String(value));
  }, [value]);

  const commit = (): void => {
    const n = globalThis.Number(draft);
    if (!globalThis.Number.isFinite(n)) {
      setDraft(String(value));
      return;
    }
    const clamped =
      max !== undefined && min !== undefined ? Math.max(min, Math.min(max, n)) : n;
    onCommit?.(clamped);
    setDraft(String(clamped));
  };

  return (
    <div className="row">
      <span className="row__label">{label}</span>
      {editable ? (
        <span style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            className="value-input"
            type="number"
            value={draft}
            min={min}
            max={max}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={commit}
            onKeyDown={(e) => {
              if (e.key === "Enter") (e.target as HTMLInputElement).blur();
            }}
          />
          {unit && <span className="row__label">{unit}</span>}
        </span>
      ) : (
        <span className="value">
          {value}
          {unit ? ` ${unit}` : ""}
        </span>
      )}
    </div>
  );
}
