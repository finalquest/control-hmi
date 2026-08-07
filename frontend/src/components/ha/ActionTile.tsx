import { useHaEntity } from "../../store/store.js";
import { runScene, runScript, pressButton } from "../../api/ha.js";

export interface ActionTileProps {
  entityId: string;
  label?: string;
  variant?: "scene" | "script" | "button";
}

const FIRE: Record<string, (id: string) => void> = {
  scene: runScene,
  script: runScript,
  button: pressButton,
};

export function ActionTile({
  entityId,
  label,
  variant = "scene",
}: ActionTileProps): React.ReactNode {
  const entity = useHaEntity(entityId);
  const fire = FIRE[variant];
  const name = label ?? (entity?.attributes?.friendly_name as string | undefined) ?? entityId;

  return (
    <button
      className={`btn ha-action ha-action--${variant}`}
      onClick={() => fire(entityId)}
    >
      {name}
    </button>
  );
}
