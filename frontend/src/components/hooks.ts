import { useEffect, useRef, useState } from "react";

export interface EstimateOptions {
  highSensor: boolean;
  lowSensor: boolean;
  rising: boolean;
  ratePerSec: number;
  initial?: number;
}

export function useEstimatedLevel(opts: EstimateOptions): number {
  const { highSensor, lowSensor, rising, ratePerSec, initial = 50 } = opts;
  const [level, setLevel] = useState(initial);
  const ref = useRef(initial);

  useEffect(() => {
    let raf = 0;
    let last = performance.now();
    const loop = (now: number): void => {
      const dt = (now - last) / 1000;
      last = now;
      let next: number;
      if (highSensor) next = 100;
      else if (lowSensor) next = 0;
      else {
        const dir = rising ? 1 : -1;
        next = Math.max(0, Math.min(100, ref.current + dir * ratePerSec * dt));
      }
      if (Math.abs(next - ref.current) > 0.05) {
        ref.current = next;
        setLevel(next);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [highSensor, lowSensor, rising, ratePerSec]);

  return level;
}
