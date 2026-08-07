import { FANS } from "../../ha/rooms.js";
import { FanUnit } from "./FanUnit.js";

export function FansPanel(): React.ReactNode {
  return (
    <div className="fans-panel">
      {FANS.map((f) => (
        <FanUnit key={f.id} name={f.name} fanId={f.fanId} lightId={f.lightId} />
      ))}
    </div>
  );
}
