import { useHmiState } from "../store/store.js";
import { colors } from "../styles/theme.js";

export function HomeScreen(): React.ReactNode {
  const { logo } = useHmiState();
  return (
    <div className="cards">
      <Card
        label="Modo"
        value={logo.pumpManualMode ? "Manual" : "Auto"}
        on={!logo.pumpManualMode}
      />
      <Card
        label="Bomba"
        value={logo.pumpRunning ? "En marcha" : "Detenida"}
        on={logo.pumpRunning}
      />
      <Card
        label="Cisterna"
        value={logo.cisternaHasWater ? "Con agua" : "Sin agua"}
        on={logo.cisternaHasWater}
        warn={!logo.cisternaHasWater}
      />
      <Card
        label="Tanque"
        value={logo.tankRequestFill ? "Pide llenar" : "Nivel OK"}
        on={!logo.tankRequestFill}
        warn={logo.tankRequestFill}
      />
    </div>
  );
}

function Card({
  label,
  value,
  on,
  warn = false,
}: {
  label: string;
  value: string;
  on: boolean;
  warn?: boolean;
}): React.ReactNode {
  const color = warn ? colors.amber : on ? colors.greenBright : colors.textDim;
  return (
    <div className="card">
      <span className="card__label">{label}</span>
      <span className="card__value" style={{ color }}>
        {value}
      </span>
      <span className={on ? "status-dot status-dot--online" : "status-dot"} />
    </div>
  );
}
