import { colors } from "../../styles/theme.js";

export interface PipeProps {
  points: Array<{ x: number; y: number }>;
  active?: boolean;
  width?: number;
}

export function Pipe({ points, active = false, width = 14 }: PipeProps) {
  if (points.length < 2) return null;
  const d = points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x} ${p.y}`).join(" ");

  return (
    <g>
      <path d={d} fill="none" stroke={colors.grayDark} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round" />
      <path d={d} fill="none" stroke={colors.bg} strokeWidth={width - 6} strokeLinecap="round" strokeLinejoin="round" />
      {active && (
        <path
          d={d}
          fill="none"
          stroke={colors.water}
          strokeWidth={width - 8}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="6 18"
          style={{ animation: "flow 0.7s linear infinite" }}
        />
      )}
    </g>
  );
}
