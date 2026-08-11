import type {
  BodyRegionStatus,
} from "@/pages/05-questionnaire/03-health-safety";

interface BodyMapData {
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

const STATUS_ORDER: BodyRegionStatus[] = [
  "avoid",
  "medical-consideration",
  "sensitive",
  "ask-first",
];

const STATUS_LABELS: Record<BodyRegionStatus, string> = {
  fine: "Fine",
  "ask-first": "Ask First",
  sensitive: "Sensitive",
  avoid: "Avoid",
  "medical-consideration": "Medical Consideration",
};

function readBodyMap(): BodyMapData {
  const saved = sessionStorage.getItem(
    BODY_MAP_STORAGE_KEY,
  );

  if (!saved) {
    return {
      statuses: {},
      notes: {},
    };
  }

  try {
    const parsed = JSON.parse(
      saved,
    ) as Partial<BodyMapData>;

    return {
      statuses: parsed.statuses ?? {},
      notes: parsed.notes ?? {},
    };
  } catch {
    return {
      statuses: {},
      notes: {},
    };
  }
}

export default function BodyMapSummary() {
  const bodyMap = readBodyMap();

  const markedRegions = Object.entries(
    bodyMap.statuses,
  )
    .filter(
      ([, status]) =>
        status && status !== "fine",
    )
    .sort(
      ([, firstStatus], [, secondStatus]) =>
        STATUS_ORDER.indexOf(firstStatus) -
        STATUS_ORDER.indexOf(secondStatus),
    );

  if (markedRegions.length === 0) {
    return (
      <p className="summary-empty-response">
        No body areas marked.
      </p>
    );
  }

  return (
    <div className="body-map-summary">
      {markedRegions.map(
        ([regionId, status]) => {
          const note =
            bodyMap.notes[regionId]?.trim();

          return (
            <article
              key={regionId}
              className="body-map-summary__region"
            >
              <div className="body-map-summary__header">
                <strong>
                  {REGION_LABELS[regionId] ??
                    regionId}
                </strong>

                <span
                  className={[
                    "body-map-summary__status",
                    `status-${status}`,
                  ].join(" ")}
                >
                  {STATUS_LABELS[status]}
                </span>
              </div>

              {note && (
                <p className="summary-written-response">
                  {note}
                </p>
              )}
            </article>
          );
        },
      )}
    </div>
  );
}