import { Button } from "./Button.js";

export interface AlarmProps {
  active: boolean;
  title: string;
  sub?: string;
  onReset?: () => void;
}

export function Alarm({ active, title, sub, onReset }: AlarmProps) {
  return (
    <div className={`alarm ${active ? "alarm--active" : "alarm--idle"}`}>
      <div className="alarm__text">
        <span className="alarm__title">{active ? title : "Sin alarmas"}</span>
        {sub && <span className="alarm__sub">{sub}</span>}
      </div>
      {onReset && (
        <Button variant="danger" onClick={onReset} disabled={!active}>
          Reconocer
        </Button>
      )}
    </div>
  );
}
