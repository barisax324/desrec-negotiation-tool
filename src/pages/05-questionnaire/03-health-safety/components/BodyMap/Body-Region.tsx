import {
  type CSSProperties,
  useRef,
} from "react";

import type { BodyRegionStatus } from "../../data/bodyMapOptions";
import type { BodyRegionSelection } from "./BodyMap";

import "./Body-Region.css";

interface BodyRegionProps {
  id: string;
  label: string;
  d: string;
  hitD?: string;
  markerX: number;
  markerY: number;
  glowRadius: number;
  labelOffsetX?: number;
  labelOffsetY?: number;
  status?: BodyRegionStatus;
  isActive?: boolean;
  onOpen: (
    selection: BodyRegionSelection,
  ) => void;
}

const STATUS_COLORS: Record<
  BodyRegionStatus,
  string
> = {
  fine: "#09c832",
  "ask-first": "#eace17",
  sensitive: "#1d0ef0",
  avoid: "#e90e0e",
  "medical-consideration": "#e205f6",
};

export default function BodyRegion({
  id,
  label,
  d,
  hitD,
  markerX,
  markerY,
  glowRadius,
  labelOffsetX = 0,
  labelOffsetY = -34,
  status,
  isActive = false,
  onOpen,
}: BodyRegionProps) {
  const markerRef =
    useRef<SVGCircleElement | null>(null);

  const selected = Boolean(status);

  const markerColor = status
    ? STATUS_COLORS[status]
    : "#52799f";

  const markerStyle = {
    "--marker-color": markerColor,
  } as CSSProperties;

  function openRegion() {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    const rect =
      marker.getBoundingClientRect();

    onOpen({
      id,
      label,
      anchorX:
        rect.left +
        rect.width / 2,
      anchorY:
        rect.top +
        rect.height / 2,
    });
  }

  return (
    <g
      className={[
        "body-region",
        selected
          ? "body-region--selected"
          : "",
        isActive
          ? "body-region--active"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-region-id={id}
      data-status={status ?? "unset"}
      role="button"
      tabIndex={0}
      aria-label={`${label}${
        status ? `: ${status}` : ""
      }`}
      onClick={(event) => {
        event.preventDefault();
        event.stopPropagation();

        openRegion();
      }}
      onKeyDown={(event) => {
        if (
          event.key === "Enter" ||
          event.key === " "
        ) {
          event.preventDefault();
          event.stopPropagation();

          openRegion();
        }
      }}
    >
      <path
        className="body-region-hit"
        d={hitD ?? d}
        fill="transparent"
        stroke="transparent"
        strokeWidth="18"
        pointerEvents="all"
      />

      {selected && (
        <circle
          className="body-region-status-bloom"
          cx={markerX}
          cy={markerY}
          r={glowRadius}
          style={markerStyle}
          aria-hidden="true"
        />
      )}

      <circle
        ref={markerRef}
        className="body-region-marker-hit"
        cx={markerX}
        cy={markerY}
        r="52"
        aria-hidden="true"
      />

      <g
        className="body-region-marker"
        style={markerStyle}
        aria-hidden="true"
      >
        <circle
          className="body-region-marker-halo"
          cx={markerX}
          cy={markerY}
          r="25"
        />

        <circle
          className="body-region-marker-ring"
          cx={markerX}
          cy={markerY}
          r="16"
        />

        <circle
          className="body-region-marker-core"
          cx={markerX}
          cy={markerY}
          r="4.5"
        />
      </g>

      <g
        className="body-region-tooltip"
        transform={`translate(${
          markerX + labelOffsetX
        } ${
          markerY + labelOffsetY
        })`}
        pointerEvents="none"
        aria-hidden="true"
      >
        <rect
          className="body-region-tooltip-background"
          x="-105"
          y="-31"
          width="210"
          height="48"
          rx="24"
        />

        <text
          className="body-region-tooltip-text"
          x="0"
          y="-6"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {label}
        </text>
      </g>
    </g>
  );
}

