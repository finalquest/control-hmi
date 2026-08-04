import { colors } from "../../styles/theme.js";

export interface LampProps {
  x: number;
  y: number;
  on: boolean;
  color?: "green" | "red" | "amber" | "blue";
  r?: number;
  label?: string;
}

const colorMap = {
  green: { on: colors.greenBright, off: colors.grayDark, glow: colors.green },
  red: { on: colors.redBright, off: colors.grayDark, glow: colors.red },
  amber: { on: colors.amberBright, off: colors.grayDark, glow: colors.amber },
  blue: { on: "#5aa8ff", off: colors.grayDark, glow: colors.blue },
};

export function Lamp({ x, y, on, color = "green", r = 14, label }: LampProps) {
  const c = colorMap[color];
  return (
    <g>
      {on && <circle cx={x} cy={y} r={r + 8} fill={c.glow} opacity={0.25} />}
      <circle cx={x} cy={y} r={r} fill={on ? c.on : c.off} stroke={colors.borderStrong} strokeWidth={2} />
      <circle cx={x - r / 3} cy={y - r / 3} r={r / 3.5} fill="#ffffff" opacity={on ? 0.5 : 0.12} />
      {label && (
        <text x={x + r + 8} y={y + 4} fill={colors.text} fontSize={12}>
          {label}
        </text>
      )}
    </g>
  );
}
