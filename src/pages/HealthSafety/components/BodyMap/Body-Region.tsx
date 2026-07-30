import {
  type CSSProperties,
  type PointerEvent,
  useEffect,
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
  onOpen: (selection: BodyRegionSelection) => void;
}

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
  onOpen: (selection: BodyRegionSelection) => void;
}

const STATUS_COLORS: Record<BodyRegionStatus, string> = {
  fine: "#09c832",
  "ask-first": "#eace17",
  sensitive: "#1d0ef0",
  avoid: "#e90e0e",
  "medical-consideration": "#e205f6",
};

const LONG_PRESS_DURATION = 320;
const MOVEMENT_CANCEL_DISTANCE = 12;

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
}: BodyRegionProps) {  const groupRef = useRef<SVGGElement | null>(null);
  const markerRef = useRef<SVGCircleElement | null>(null);

  const longPressTimerRef =
    useRef<ReturnType<typeof setTimeout> | null>(null);

  const pointerStartRef = useRef<{
    x: number;
    y: number;
  } | null>(null);

  const longPressTriggeredRef = useRef(false);
  const activePointerTypeRef = useRef<string | null>(null);

  const selected = Boolean(status);
  const markerColor = status
    ? STATUS_COLORS[status]
    : "#52799f";

  const markerStyle = {
    "--marker-color": markerColor,
  } as CSSProperties;

  useEffect(() => {
    return () => {
      if (longPressTimerRef.current) {
        clearTimeout(longPressTimerRef.current);
      }
    };
  }, []);

  function clearLongPressTimer() {
    if (!longPressTimerRef.current) {
      return;
    }

    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }

  function openRegion() {
    const marker = markerRef.current;

    if (!marker) {
      return;
    }

    const rect = marker.getBoundingClientRect();

    onOpen({
      id,
      label,
      anchorX: rect.left + rect.width / 2,
      anchorY: rect.top + rect.height / 2,
    });
  }

  function handlePointerDown(
    event: PointerEvent<SVGGElement>,
  ) {
    activePointerTypeRef.current = event.pointerType;
    longPressTriggeredRef.current = false;

    if (event.pointerType !== "touch") {
      return;
    }

    pointerStartRef.current = {
      x: event.clientX,
      y: event.clientY,
    };

    groupRef.current?.focus({
      preventScroll: true,
    });

    clearLongPressTimer();

    longPressTimerRef.current = setTimeout(() => {
      longPressTriggeredRef.current = true;

      if ("vibrate" in navigator) {
        navigator.vibrate(20);
      }

      openRegion();
    }, LONG_PRESS_DURATION);
  }

  function handlePointerMove(
    event: PointerEvent<SVGGElement>,
  ) {
    if (
      event.pointerType !== "touch" ||
      !pointerStartRef.current
    ) {
      return;
    }

    const distanceX = Math.abs(
      event.clientX - pointerStartRef.current.x,
    );

    const distanceY = Math.abs(
      event.clientY - pointerStartRef.current.y,
    );

    if (
      distanceX > MOVEMENT_CANCEL_DISTANCE ||
      distanceY > MOVEMENT_CANCEL_DISTANCE
    ) {
      clearLongPressTimer();
    }
  }

  function handlePointerEnd() {
    clearLongPressTimer();
    pointerStartRef.current = null;
  }

  return (
    <g
      ref={groupRef}
className={[
  "body-region",
  selected ? "body-region--selected" : "",
  isActive ? "body-region--active" : "",
]
  .filter(Boolean)
  .join(" ")}      data-region-id={id}
      data-status={status ?? "unset"}
      role="button"
      tabIndex={0}
      aria-label={`${label}${status ? `: ${status}` : ""}`}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerEnd}
      onPointerCancel={handlePointerEnd}
      onPointerLeave={handlePointerEnd}
      onClick={(event) => {
        if (
          activePointerTypeRef.current === "touch" ||
          longPressTriggeredRef.current
        ) {
          event.preventDefault();
          longPressTriggeredRef.current = false;
          return;
        }

        openRegion();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
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
  transform={`translate(${markerX + labelOffsetX} ${
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
</g>    </g>
  );
}