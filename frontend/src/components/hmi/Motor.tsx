import { colors } from "../../styles/theme.js";

export interface MotorProps {
  x: number;
  y: number;
  r?: number;
  running: boolean;
  label?: string;
}

export function Motor({ x, y, r = 28, running, label }: MotorProps) {
  const body = running ? colors.green : colors.gray;
  return (
    <g>
      <circle cx={x} cy={y} r={r} fill={body} stroke={colors.bg} strokeWidth={2} />
      <text x={x} y={y + 1} textAnchor="middle" dominantBaseline="middle" fill={colors.text} fontSize={r * 0.9} fontWeight={700} fontStyle="italic">
        M
      </text>
      <circle cx={x} cy={y} r={r + 4} fill="none" stroke={running ? colors.greenBright : "transparent"} strokeWidth={2} opacity={0.6} />
      {label && (
        <text x={x} y={y + r + 18} textAnchor="middle" fill={colors.textDim} fontSize={11}>
          {label}
        </text>
      )}
    </g>
  );
}
