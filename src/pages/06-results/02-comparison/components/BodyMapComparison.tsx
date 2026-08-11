import type {
  BodyRegionStatus,
} from "@/pages/05-questionnaire/03-health-safety";

interface BodyMapData {
  statuses: Record<string, BodyRegionStatus>;
  notes: Record<string, string>;
}

interface BodyMapComparisonProps {
  participantA?: BodyMapData | null;
  participantB?: BodyMapData | null;
}

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

const STATUS_LABELS: Record<
  BodyRegionStatus,
  string
> = {
  fine: "Fine",
  "ask-first": "Ask First",
  sensitive: "Sensitive",
  avoid: "Avoid",
  "medical-consideration":
    "Medical Consideration",
};

const STATUS_ORDER: BodyRegionStatus[] = [
  "avoid",
  "medical-consideration",
  "sensitive",
  "ask-first",
  "fine",
];

function hasMarkedRegion(
  bodyMap: BodyMapData | null | undefined,
  regionId: string,
): boolean {
  const status =
    bodyMap?.statuses[regionId];

  const note =
    bodyMap?.notes[regionId]?.trim();

  return Boolean(
    (status && status !== "fine") ||
      note,
  );
}

function regionsMatch(
  participantA: BodyMapData | null | undefined,
  participantB: BodyMapData | null | undefined,
  regionId: string,
): boolean {
  const statusA =
    participantA?.statuses[regionId];

  const statusB =
    participantB?.statuses[regionId];

  const noteA =
    participantA?.notes[regionId]?.trim() ??
    "";

  const noteB =
    participantB?.notes[regionId]?.trim() ??
    "";

  if (
    !hasMarkedRegion(
      participantA,
      regionId,
    ) ||
    !hasMarkedRegion(
      participantB,
      regionId,
    )
  ) {
    return false;
  }

  return (
    statusA === statusB &&
    noteA === noteB
  );
}

function BodyMapAnswer({
  bodyMap,
  regionId,
}: {
  bodyMap?: BodyMapData | null;
  regionId: string;
}) {
  const status =
    bodyMap?.statuses[regionId];

  const note =
    bodyMap?.notes[regionId]?.trim() ??
    "";

  if (
    !status ||
    status === "fine"
  ) {
    if (!note) {
      return (
        <p className="comparison-summary-value comparison-summary-value--empty">
          No response
        </p>
      );
    }
  }

  return (
    <div className="comparison-body-map-answer">
      {status &&
        status !== "fine" && (
          <span
            className={[
              "body-map-summary__status",
              `status-${status}`,
            ].join(" ")}
          >
            {STATUS_LABELS[status]}
          </span>
        )}

      {note && (
        <p className="summary-written-response">
          {note}
        </p>
      )}
    </div>
  );
}

export default function BodyMapComparison({
  participantA,
  participantB,
}: BodyMapComparisonProps) {
  const regionIds = Array.from(
    new Set([
      ...Object.keys(
        participantA?.statuses ?? {},
      ),
      ...Object.keys(
        participantB?.statuses ?? {},
      ),
      ...Object.keys(
        participantA?.notes ?? {},
      ),
      ...Object.keys(
        participantB?.notes ?? {},
      ),
    ]),
  )
    .filter(
      (regionId) =>
        hasMarkedRegion(
          participantA,
          regionId,
        ) ||
        hasMarkedRegion(
          participantB,
          regionId,
        ),
    )
    .sort((firstRegionId, secondRegionId) => {
      const firstStatus =
        participantA?.statuses[
          firstRegionId
        ] ??
        participantB?.statuses[
          firstRegionId
        ] ??
        "fine";

      const secondStatus =
        participantA?.statuses[
          secondRegionId
        ] ??
        participantB?.statuses[
          secondRegionId
        ] ??
        "fine";

      return (
        STATUS_ORDER.indexOf(
          firstStatus,
        ) -
        STATUS_ORDER.indexOf(
          secondStatus,
        )
      );
    });

  if (regionIds.length === 0) {
    return null;
  }

  return (
    <section className="comparison-section">
      <h2>Body Map</h2>

      <div className="comparison-summary-row-list">
        {regionIds.map(
          (regionId) => {
            const isMatch =
              regionsMatch(
                participantA,
                participantB,
                regionId,
              );

            return (
              <article
                key={regionId}
                className={[
                  "comparison-summary-row",
                  isMatch
                    ? "comparison-summary-row--match"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
              >
                <div className="comparison-summary-topic">
                  <h3>
                    {REGION_LABELS[
                      regionId
                    ] ?? regionId}
                  </h3>

                  {isMatch && (
                    <span className="comparison-match-label">
                      Same response
                    </span>
                  )}
                </div>

                <section className="comparison-summary-column">

                  <BodyMapAnswer
                    bodyMap={
                      participantA
                    }
                    regionId={
                      regionId
                    }
                  />
                </section>

                <section className="comparison-summary-column">

                  <BodyMapAnswer
                    bodyMap={
                      participantB
                    }
                    regionId={
                      regionId
                    }
                  />
                </section>
              </article>
            );
          },
        )}
      </div>
    </section>
  );
}