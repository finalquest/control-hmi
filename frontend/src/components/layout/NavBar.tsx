import type { ReactNode } from "react";
import { useHmiState } from "../../store/store.js";
import { Status } from "../hmi/Status.js";

export type ScreenId = "home" | "test" | "agua" | "electrico" | "config";

interface NavBarProps {
  current: ScreenId;
  onSelect: (id: ScreenId) => void;
}

const tabs: Array<{ id: ScreenId; label: string }> = [
  { id: "home", label: "Home" },
  { id: "test", label: "Test" },
  { id: "agua", label: "Agua" },
  { id: "electrico", label: "Eléctrico" },
  { id: "config", label: "Configuración" },
];

export function NavBar({ current, onSelect }: NavBarProps): ReactNode {
  const { status, connected } = useHmiState();
  return (
    <nav className="navbar">
      <div className="navbar__brand">HMI Control</div>
      <div className="navbar__tabs">
        {tabs.map((t) => (
          <button
            key={t.id}
            className={`nav-tab ${current === t.id ? "nav-tab--active" : ""}`}
            onClick={() => onSelect(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>
      <Status status={status} connected={connected} />
    </nav>
  );
}
