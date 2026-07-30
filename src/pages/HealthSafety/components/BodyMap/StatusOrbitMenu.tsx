import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";

import {
  BODY_REGION_STATUS_OPTIONS,
  type BodyRegionStatus,
} from "../../data/bodyMapOptions";

import "./StatusOrbitMenu.css";

interface StatusOrbitMenuProps {
  regionLabel: string;
  anchorX: number;
  anchorY: number;
  selectedStatus?: BodyRegionStatus;
  onSelect: (status?: BodyRegionStatus) => void;
  onClose: () => void;
}

interface OrbitPosition {
  left: number;
  top: number;
  originX: number;
  originY: number;
}

const MENU_WIDTH = 340;
const MENU_HEIGHT = 370;
const VIEWPORT_PADDING = 12;

const STATUS_DETAILS: Record<
  BodyRegionStatus,
  {
    icon: ReactNode;
    positionClass: string;
  }
> = {
  fine: {
    positionClass: "status-orbit-option--top",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),
  },

  "ask-first": {
    positionClass: "status-orbit-option--upper-right",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M21 15a4 4 0 0 1-4 4H9l-5 3v-3a4 4 0 0 1-2-4V7a4 4 0 0 1 4-4h11a4 4 0 0 1 4 4Z" />
        <path d="M8 9h8M8 13h5" />
      </svg>
    ),
  },

  sensitive: {
    positionClass: "status-orbit-option--lower-right",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M8 11V5a2 2 0 0 1 4 0v5" />
        <path d="M12 10V4a2 2 0 0 1 4 0v7" />
        <path d="M16 10V6a2 2 0 0 1 4 0v8c0 5-3 8-8 8h-1c-3 0-5-1-7-4l-2-3a2 2 0 0 1 3-2l3 2Z" />
      </svg>
    ),
  },

  avoid: {
    positionClass: "status-orbit-option--lower-left",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M6 6l12 12M18 6 6 18" />
      </svg>
    ),
  },

  "medical-consideration": {
    positionClass: "status-orbit-option--upper-left",
    icon: (
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path d="M9 3h6v6h6v6h-6v6H9v-6H3V9h6Z" />
      </svg>
    ),
  },
};

function clamp(
  value: number,
  minimum: number,
  maximum: number,
) {
  return Math.min(Math.max(value, minimum), maximum);
}

export default function StatusOrbitMenu({
  regionLabel,
  anchorX,
  anchorY,
  selectedStatus,
  onSelect,
  onClose,
}: StatusOrbitMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null);

  const [position, setPosition] = useState<OrbitPosition>({
    left: anchorX - MENU_WIDTH / 2,
    top: anchorY - MENU_HEIGHT / 2,
    originX: MENU_WIDTH / 2,
    originY: MENU_HEIGHT / 2,
  });

  useLayoutEffect(() => {
    function updatePosition() {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      const centeredLeft = anchorX - MENU_WIDTH / 2;
      const centeredTop = anchorY - MENU_HEIGHT / 2;

      const left = clamp(
        centeredLeft,
        VIEWPORT_PADDING,
        Math.max(
          VIEWPORT_PADDING,
          viewportWidth - MENU_WIDTH - VIEWPORT_PADDING,
        ),
      );

      const top = clamp(
        centeredTop,
        VIEWPORT_PADDING,
        Math.max(
          VIEWPORT_PADDING,
          viewportHeight - MENU_HEIGHT - VIEWPORT_PADDING,
        ),
      );

      setPosition({
        left,
        top,
        originX: clamp(anchorX - left, 20, MENU_WIDTH - 20),
        originY: clamp(anchorY - top, 20, MENU_HEIGHT - 20),
      });
    }

    updatePosition();

    window.addEventListener("resize", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
    };
  }, [anchorX, anchorY]);

  useEffect(() => {
    const selectedButton =
      menuRef.current?.querySelector<HTMLButtonElement>(
        '[aria-pressed="true"]',
      );

    const firstButton =
      menuRef.current?.querySelector<HTMLButtonElement>(
        ".status-orbit-option",
      );

    const focusTimer = window.setTimeout(() => {
      (selectedButton ?? firstButton)?.focus();
    }, 80);

    return () => {
      window.clearTimeout(focusTimer);
    };
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener(
        "keydown",
        handleKeyDown,
      );
    };
  }, [onClose]);

  const orbitStyle = {
    left: `${position.left}px`,
    top: `${position.top}px`,
    "--orbit-origin-x": `${position.originX}px`,
    "--orbit-origin-y": `${position.originY}px`,
  } as CSSProperties;

  return (
    <div
      ref={menuRef}
      className="status-orbit"
      style={orbitStyle}
      role="dialog"
      aria-modal="true"
      aria-label={`Choose a status for ${regionLabel}`}
    >
      <div className="status-orbit-title">
        {regionLabel}
      </div>

      <div
        className="status-orbit-ring"
        aria-hidden="true"
      >
        <span className="status-orbit-spark status-orbit-spark--one" />
        <span className="status-orbit-spark status-orbit-spark--two" />
        <span className="status-orbit-spark status-orbit-spark--three" />
        <span className="status-orbit-spark status-orbit-spark--four" />
      </div>

      {BODY_REGION_STATUS_OPTIONS.map((option) => {
        const details = STATUS_DETAILS[option.id];
        const isSelected = selectedStatus === option.id;

        return (
          <button
            key={option.id}
            type="button"
            className={[
              "status-orbit-option",
              details.positionClass,
              isSelected
                ? "status-orbit-option--selected"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            style={
              {
                "--status-color": option.color,
              } as CSSProperties
            }
            aria-label={`${option.label} for ${regionLabel}`}
            aria-pressed={isSelected}
            onClick={() => onSelect(option.id)}
          >
            <span className="status-orbit-icon">
              {details.icon}
            </span>

            <span className="status-orbit-label">
              {option.label}
            </span>
          </button>
        );
      })}

      <button
        type="button"
        className="status-orbit-clear"
        onClick={() => onSelect(undefined)}
        aria-label={`Clear status for ${regionLabel}`}
      >
        <span
          className="status-orbit-clear-icon"
          aria-hidden="true"
        >
          ×
        </span>

        <span className="status-orbit-clear-label">
          Clear
        </span>
      </button>
    </div>
  );
}