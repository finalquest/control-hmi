export interface SwitchProps {
  label: string;
  on: boolean;
  onToggle: () => void;
  disabled?: boolean;
}

export function Switch({ label, on, onToggle, disabled }: SwitchProps) {
  return (
    <button
      type="button"
      className={`switch ${on ? "switch--on" : ""}`}
      onClick={onToggle}
      disabled={disabled}
      aria-pressed={on}
      style={disabled ? { opacity: 0.5, cursor: "not-allowed" } : undefined}
    >
      <span className="switch__track" />
      <span className="switch__label">{label}</span>
    </button>
  );
}
