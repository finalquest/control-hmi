import { useId } from "react";
import { colors } from "../../styles/theme.js";
import { useEstimatedLevel } from "../hooks.js";

export interface TankProps {
  x: number;
  y: number;
  w?: number;
  h?: number;
  label: string;
  sublabel?: string;
  highSensor?: boolean;
  lowSensor?: boolean;
  rising?: boolean;
  ratePerSec?: number;
  levelOverride?: number;
  showEstimate?: boolean;
  variant?: "upper" | "cistern";
}

export function Tank({
  x,
  y,
  w = 200,
  h = 240,
  label,
  sublabel,
  highSensor = false,
  lowSensor = false,
  rising = false,
  ratePerSec = 8,
  levelOverride,
  showEstimate = true,
  variant = "upper",
}: TankProps) {
  const clipId = useId();
  const estimated = useEstimatedLevel({
    highSensor,
    lowSensor,
    rising,
    ratePerSec,
    initial: variant === "cistern" ? 70 : 40,
  });
  const level = levelOverride ?? estimated;
  const waterH = (h * level) / 100;
  const waterY = y + h - waterH;

  const wallStroke = colors.borderStrong;
  const isCistern = variant === "cistern";

  return (
    <g>
      <clipPath id={clipId}>
        <rect x={x} y={y} width={w} height={h} rx={8} />
      </clipPath>

      <rect
        x={x}
        y={y}
        width={w}
        height={h}
        rx={8}
        fill={colors.bg}
        stroke={wallStroke}
        strokeWidth={3}
      />

      <g clipPath={`url(#${clipId})`}>
        {waterH > 0 && (
          <rect
            x={x}
            y={waterY}
            width={w}
            height={waterH}
            fill={isCistern ? colors.waterDeep : colors.water}
            opacity={0.9}
          />
        )}
        <rect
          x={x}
          y={waterY - 3}
          width={w}
          height={6}
          fill={colors.water}
          opacity={0.55}
        />
      </g>

      <BoyaSensor x={x + w - 18} y={y + 14} active={highSensor} color={colors.amber} />
      <BoyaSensor x={x + w - 18} y={y + h - 22} active={lowSensor} color={colors.red} />

      {[0.25, 0.5, 0.75].map((p) => (
        <line
          key={p}
          x1={x + 4}
          y1={y + h * p}
          x2={x + 16}
          y2={y + h * p}
          stroke={colors.textMuted}
          strokeWidth={1}
        />
      ))}

      <text
        x={x + w / 2}
        y={y - 12}
        textAnchor="middle"
        fill={colors.text}
        fontSize={15}
        fontWeight={600}
      >
        {label}
      </text>
      {sublabel && (
        <text
          x={x + w / 2}
          y={y + h + 38}
          textAnchor="middle"
          fill={colors.textDim}
          fontSize={11}
        >
          {sublabel}
        </text>
      )}
      <text
        x={x + w / 2}
        y={y + h + 20}
        textAnchor="middle"
        fill={colors.text}
        fontSize={16}
        fontWeight={700}
        style={{ fontVariantNumeric: "tabular-nums" }}
      >
        {Math.round(level)}%
      </text>
      {showEstimate && (
        <text
          x={x + w / 2}
          y={y + h + 52}
          textAnchor="middle"
          fill={colors.textMuted}
          fontSize={10}
          fontStyle="italic"
        >
          nivel estimado
        </text>
      )}
    </g>
  );
}

function BoyaSensor({
  x,
  y,
  active,
  color,
}: {
  x: number;
  y: number;
  active: boolean;
  color: string;
}) {
  return (
    <g>
      <circle cx={x} cy={y} r={7} fill={active ? color : colors.grayDark} stroke={colors.borderStrong} strokeWidth={1.5} />
      {active && (
        <circle cx={x} cy={y} r={11} fill="none" stroke={color} strokeWidth={1.5} opacity={0.5} />
      )}
    </g>
  );
}
