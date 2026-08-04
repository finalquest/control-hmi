import { colors } from "../../styles/theme.js";

export interface GaugeProps {
  x: number;
  y: number;
  r?: number;
  value: number;
  min?: number;
  max?: number;
  label?: string;
  unit?: string;
  warnAt?: number;
}

export function Gauge({
  x,
  y,
  r = 46,
  value,
  min = 0,
  max = 100,
  label,
  unit,
  warnAt,
}: GaugeProps) {
  const clamped = Math.max(min, Math.min(max, value));
  const ratio = (clamped - min) / (max - min || 1);
  const startAngle = 150;
  const endAngle = 390;
  const angle = startAngle + (endAngle - startAngle) * ratio;
  const needleX = x + Math.cos((angle * Math.PI) / 180) * (r - 8);
  const needleY = y + Math.sin((angle * Math.PI) / 180) * (r - 8);

  const arc = describeArc(x, y, r, startAngle, endAngle);
  const valueArc = describeArc(x, y, r, startAngle, Math.max(startAngle + 0.1, angle));
  const overWarn = warnAt !== undefined && value >= warnAt;
  const valColor = overWarn ? colors.amber : colors.blue;

  return (
    <g>
      <path d={arc} fill="none" stroke={colors.grayDark} strokeWidth={8} strokeLinecap="round" />
      <path d={valueArc} fill="none" stroke={valColor} strokeWidth={8} strokeLinecap="round" />
      <line x1={x} y1={y} x2={needleX} y2={needleY} stroke={colors.text} strokeWidth={3} strokeLinecap="round" />
      <circle cx={x} cy={y} r={5} fill={colors.text} />
      <text x={x} y={y - 4} textAnchor="middle" fill={colors.text} fontSize={16} fontWeight={700} style={{ fontVariantNumeric: "tabular-nums" }}>
        {Math.round(value)}
      </text>
      {unit && (
        <text x={x} y={y + 12} textAnchor="middle" fill={colors.textDim} fontSize={10}>
          {unit}
        </text>
      )}
      {label && (
        <text x={x} y={y + r + 16} textAnchor="middle" fill={colors.textDim} fontSize={12}>
          {label}
        </text>
      )}
    </g>
  );
}

function polar(cx: number, cy: number, r: number, angle: number): { x: number; y: number } {
  const a = (angle * Math.PI) / 180;
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function describeArc(cx: number, cy: number, r: number, start: number, end: number): string {
  const s = polar(cx, cy, r, end);
  const e = polar(cx, cy, r, start);
  const large = end - start <= 180 ? 0 : 1;
  return `M ${s.x} ${s.y} A ${r} ${r} 0 ${large} 0 ${e.x} ${e.y}`;
}
