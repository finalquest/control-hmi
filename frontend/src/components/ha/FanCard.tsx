import { useHaEntity } from "../../store/store.js";
import { fanToggle, runScript, inputBooleanToggle } from "../../api/ha.js";

export interface FanCardProps {
  fanId: string;
  lightBooleanId: string;
  scriptPrefix: string;
  label: string;
}

export function FanCard({
  fanId,
  lightBooleanId,
  scriptPrefix,
  label,
}: FanCardProps): React.ReactNode {
  const fan = useHaEntity(fanId);
  const light = useHaEntity(lightBooleanId);
  const on = fan?.state === "on";
  const lightOn = light?.state === "on";

  return (
    <div className="fan">
      <div className="fan__head">
        <span className="fan__name">{label}</span>
        <button
          className={`btn btn--sm ${on ? "btn--active" : ""}`}
          onClick={() => fanToggle(fanId, on)}
        >
          {on ? "ON" : "OFF"}
        </button>
      </div>
      <div className="fan__speeds">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            className="btn btn--sm"
            onClick={() => runScript(`${scriptPrefix}_speed_${n}`)}
          >
            {n}
          </button>
        ))}
        <button className="btn btn--sm" onClick={() => runScript(`${scriptPrefix}_off`)}>
          Off
        </button>
      </div>
      <button
        className={`btn btn--sm btn--full ${lightOn ? "btn--active" : ""}`}
        onClick={() => inputBooleanToggle(lightBooleanId, lightOn)}
      >
        Luz {lightOn ? "ON" : "OFF"}
      </button>
    </div>
  );
}
