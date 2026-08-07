import { useEffect, useRef, useState } from "react";
import { colors } from "../../styles/theme.js";

export interface GuardedToggleProps {
  entityId: string;
  on: boolean;
  onToggle: () => void;
  label?: string;
  lockMs?: number;
}

export function GuardedToggle({
  entityId,
  on,
  onToggle,
  label,
  lockMs = 4000,
}: GuardedToggleProps): React.ReactNode {
  const [armed, setArmed] = useState(false);
  const [remaining, setRemaining] = useState(0);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  const disarm = (): void => {
    setArmed(false);
    setRemaining(0);
    if (timer.current) {
      clearInterval(timer.current);
      timer.current = null;
    }
  };

  const arm = (): void => {
    setArmed(true);
    setRemaining(Math.round(lockMs / 1000));
    if (timer.current) clearInterval(timer.current);
    const start = Date.now();
    timer.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const left = Math.max(0, lockMs - elapsed);
      setRemaining(Math.ceil(left / 1000));
      if (left <= 0) disarm();
    }, 200);
  };

  const fire = (): void => {
    onToggle();
    disarm();
  };

  if (!armed) {
    return (
      <div className="guard">
        <button
          type="button"
          className={`guard__cover ${on ? "guard__cover--on" : "guard__cover--off"}`}
          title={`${entityId}\nClick para desbloquear`}
          onClick={arm}
        >
          <span className="guard__state-dot" />
          <span className="guard__label">{label ?? (on ? "ON" : "OFF")}</span>
          <span className="guard__lock">🔒</span>
          <span className="guard__hint">protegido · click para habilitar</span>
        </button>
      </div>
    );
  }

  return (
    <div className="guard guard--armed">
      <button
        type="button"
        className={`btn btn--sm guard__action ${on ? "btn--danger" : "btn--primary"}`}
        onClick={fire}
        style={{ borderColor: colors.amber }}
      >
        {on ? "APAGAR" : "ENCENDER"}
      </button>
      <span className="guard__countdown" style={{ color: colors.amberBright }}>
        desbloqueado {remaining}s
      </span>
    </div>
  );
}
