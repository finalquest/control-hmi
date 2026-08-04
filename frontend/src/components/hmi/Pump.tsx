import { colors } from "../../styles/theme.js";

export interface PumpProps {
  x: number;
  y: number;
  r?: number;
  running: boolean;
  label?: string;
}

export function Pump({ x, y, r = 34, running, label }: PumpProps) {
  const body = running ? colors.green : colors.gray;
  return (
    <g>
      <circle cx={x} cy={y} r={r + 4} fill={colors.panelAlt} stroke={colors.borderStrong} strokeWidth={2} />
      <circle cx={x} cy={y} r={r} fill={body} stroke={colors.bg} strokeWidth={2} />
      <g
        style={{
          transformOrigin: `${x}px ${y}px`,
          animation: running ? "spin 0.8s linear infinite" : "none",
        }}
      >
        <path
          d={`M ${x} ${y - r + 6} A ${r - 6} ${r - 6} 0 0 1 ${x + r - 6} ${y} L ${x} ${y} Z`}
          fill={colors.bg}
          opacity={0.85}
        />
        <path
          d={`M ${x + r - 6} ${y} A ${r - 6} ${r - 6} 0 0 1 ${x} ${y + r - 6} L ${x} ${y} Z`}
          fill={colors.bg}
          opacity={0.55}
        />
        <path
          d={`M ${x} ${y + r - 6} A ${r - 6} ${r - 6} 0 0 1 ${x - r + 6} ${y} L ${x} ${y} Z`}
          fill={colors.bg}
          opacity={0.85}
        />
        <path
          d={`M ${x - r + 6} ${y} A ${r - 6} ${r - 6} 0 0 1 ${x} ${y - r + 6} L ${x} ${y} Z`}
          fill={colors.bg}
          opacity={0.55}
        />
        <circle cx={x} cy={y} r={5} fill={colors.text} />
      </g>
      {label && (
        <text x={x} y={y + r + 22} textAnchor="middle" fill={colors.text} fontSize={13} fontWeight={600}>
          {label}
        </text>
      )}
      <text
        x={x}
        y={y + r + (label ? 40 : 22)}
        textAnchor="middle"
        fill={running ? colors.greenBright : colors.textDim}
        fontSize={11}
        fontWeight={600}
      >
        {running ? "EN MARCHA" : "DETENIDA"}
      </text>
    </g>
  );
}
