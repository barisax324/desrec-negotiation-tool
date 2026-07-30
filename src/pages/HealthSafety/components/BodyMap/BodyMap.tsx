import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import type { BodyRegionStatus } from "../../data/bodyMapOptions";

import BackBody from "./Back-Body";
import FrontBody from "./Front-Body";
import StatusOrbitMenu from "./StatusOrbitMenu";

import "./Body-Map.css";

export interface BodyRegionSelection {
  id: string;
  label: string;
  anchorX: number;
  anchorY: number;
}

export interface BodyMapData {
  statuses: Record<string, BodyRegionStatus>;
  notes: Record<string, string>;
}

const BODY_MAP_STORAGE_KEY = "desrec.bodyMap";

const REGION_LABELS: Record<string, string> = {
  "front-head": "Head",
  "front-neck": "Neck",
  "front-chest": "Chest",
  "front-abdomen": "Abdomen",
  "front-pelvis": "Pelvis",
  "front-left-upper-arm": "Left Upper Arm",
  "front-right-upper-arm": "Right Upper Arm",
  "front-left-forearm": "Left Forearm",
  "front-right-forearm": "Right Forearm",
  "front-left-hand": "Left Hand",
  "front-right-hand": "Right Hand",
  "front-left-thigh": "Left Thigh",
  "front-right-thigh": "Right Thigh",
  "front-left-lower-leg": "Left Lower Leg",
  "front-right-lower-leg": "Right Lower Leg",
  "front-left-foot": "Left Foot",
  "front-right-foot": "Right Foot",

  "back-head": "Back of Head",
  "back-neck": "Back of Neck",
  "back-upper-back": "Upper Back",
  "back-lower-back": "Lower Back",
  "back-pelvis": "Pelvis",
  "back-left-upper-arm": "Left Upper Arm",
  "back-right-upper-arm": "Right Upper Arm",
  "back-left-forearm": "Left Forearm",
  "back-right-forearm": "Right Forearm",
  "back-left-hand": "Left Hand",
  "back-right-hand": "Right Hand",
  "back-left-thigh": "Left Thigh",
  "back-right-thigh": "Right Thigh",
  "back-left-lower-leg": "Left Lower Leg",
  "back-right-lower-leg": "Right Lower Leg",
  "back-left-foot": "Left Foot",
  "back-right-foot": "Right Foot",
};

function formatStatusLabel(status: BodyRegionStatus) {
  return status
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function getSavedBodyMap(): BodyMapData {
  const savedData = sessionStorage.getItem(BODY_MAP_STORAGE_KEY);

  if (!savedData) {
    return {
      statuses: {},
      notes: {},
    };
  }

  try {
    const parsedData = JSON.parse(savedData) as Partial<BodyMapData>;

    return {
      statuses: parsedData.statuses ?? {},
      notes: parsedData.notes ?? {},
    };
  } catch {
    return {
      statuses: {},
      notes: {},
    };
  }
}

export default function BodyMap() {
  const navigate = useNavigate();

  const [savedBodyMap] = useState<BodyMapData>(getSavedBodyMap);

  const [selectedRegion, setSelectedRegion] =
    useState<BodyRegionSelection | null>(null);

  const [statuses, setStatuses] = useState<
    Record<string, BodyRegionStatus>
  >(savedBodyMap.statuses);

  const [notes, setNotes] = useState<Record<string, string>>(
    savedBodyMap.notes,
  );

  useEffect(() => {
    if (!selectedRegion) {
      return;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [selectedRegion]);

  useEffect(() => {
    const bodyMapData: BodyMapData = {
      statuses,
      notes,
    };

    sessionStorage.setItem(
      BODY_MAP_STORAGE_KEY,
      JSON.stringify(bodyMapData),
    );
  }, [statuses, notes]);

  function handleRegionOpen(selection: BodyRegionSelection) {
    setSelectedRegion(selection);
  }

  function handleStatusSelect(status?: BodyRegionStatus) {
    if (!selectedRegion) {
      return;
    }

    const regionId = selectedRegion.id;

    setStatuses((current) => {
      const updated = { ...current };

      if (status) {
        updated[regionId] = status;
      } else {
        delete updated[regionId];
      }

      return updated;
    });

    if (!status || status === "fine") {
      setNotes((current) => {
        const updated = { ...current };
        delete updated[regionId];
        return updated;
      });
    }

    setSelectedRegion(null);
  }

  function handleNoteChange(regionId: string, value: string) {
    setNotes((current) => ({
      ...current,
      [regionId]: value,
    }));
  }

  function closeOrbit() {
    setSelectedRegion(null);
  }

  function handleContinue() {
    const bodyMapData: BodyMapData = {
      statuses,
      notes,
    };

    sessionStorage.setItem(
      BODY_MAP_STORAGE_KEY,
      JSON.stringify(bodyMapData),
    );

    navigate("/communication-boundaries");
  }

  const markedRegions = Object.entries(statuses).filter(
    ([, status]) => status !== "fine",
  );

  return (
    <section
      className={[
        "health-body-map",
        selectedRegion ? "health-body-map--orbit-open" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <h3>Interactive Body Map</h3>

      <p>
        Select an area to mark any boundaries, sensitivities, or
        medical considerations your partner should know about.
      </p>

      <div className="body-map-container">
        <FrontBody
          statuses={statuses}
          activeRegionId={selectedRegion?.id}
          onRegionOpen={handleRegionOpen}
        />

        <BackBody
          statuses={statuses}
          activeRegionId={selectedRegion?.id}
          onRegionOpen={handleRegionOpen}
        />
      </div>

      {markedRegions.length > 0 && (
        <section
          className="body-map-notes"
          aria-labelledby="body-map-notes-heading"
        >
          <h3 id="body-map-notes-heading">
            Notes for marked areas
          </h3>

          <p>
            Add anything your partner should know about the areas
            you marked.
          </p>

          <div className="body-map-notes-list">
            {markedRegions.map(([regionId, status]) => {
              const note = notes[regionId] ?? "";

              return (
                <article className="body-note-card" key={regionId}>
                  <div className="body-note-header">
                    <strong>
                      {REGION_LABELS[regionId] ?? regionId}
                    </strong>

                    <span
                      className={`status-pill status-${status}`}
                    >
                      {formatStatusLabel(status)}
                    </span>
                  </div>

                  <label
                    className="body-note-label"
                    htmlFor={`body-note-${regionId}`}
                  >
                    Anything your partner should know about this
                    area?
                  </label>

                  <textarea
                    id={`body-note-${regionId}`}
                    maxLength={300}
                    rows={4}
                    value={note}
                    placeholder="Examples: pressure limits, injuries, preferred touch, things to avoid, or how to check in..."
                    onChange={(event) =>
                      handleNoteChange(
                        regionId,
                        event.target.value,
                      )
                    }
                  />

                  <div className="note-counter">
                    {note.length}/300
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      <div className="body-map-actions">
        <button
          type="button"
          className="body-map-continue-button"
          onClick={handleContinue}
        >
          Continue to Communication
          <span aria-hidden="true">→</span>
        </button>
      </div>

      {selectedRegion && (
        <>
          <button
            type="button"
            className="body-map-focus-overlay"
            aria-label="Close body-region status menu"
            onClick={closeOrbit}
          />

          <StatusOrbitMenu
            regionLabel={selectedRegion.label}
            anchorX={selectedRegion.anchorX}
            anchorY={selectedRegion.anchorY}
            selectedStatus={statuses[selectedRegion.id]}
            onSelect={handleStatusSelect}
            onClose={closeOrbit}
          />
        </>
      )}
    </section>
  );
}