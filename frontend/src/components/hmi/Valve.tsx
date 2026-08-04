import { colors } from "../../styles/theme.js";

export interface ValveProps {
  x: number;
  y: number;
  open: boolean;
  size?: number;
  label?: string;
}

export function Valve({ x, y, open, size = 26, label }: ValveProps) {
  const s = size;
  const color = open ? colors.green : colors.red;
  return (
    <g>
      <rect x={x - s / 2} y={y - s / 2} width={s} height={s} rx={3} fill={colors.panelAlt} stroke={colors.borderStrong} strokeWidth={2} />
      {open ? (
        <line x1={x - s / 2 + 4} y1={y} x2={x + s / 2 - 4} y2={y} stroke={color} strokeWidth={4} strokeLinecap="round" />
      ) : (
        <line x1={x} y1={y - s / 2 + 4} x2={x} y2={y + s / 2 - 4} stroke={color} strokeWidth={4} strokeLinecap="round" />
      )}
      <rect x={x - 5} y={y - s / 2 - 8} width={10} height={8} rx={2} fill={colors.grayDark} />
      {label && (
        <text x={x} y={y + s / 2 + 16} textAnchor="middle" fill={colors.textDim} fontSize={11}>
          {label}
        </text>
      )}
    </g>
  );
}
