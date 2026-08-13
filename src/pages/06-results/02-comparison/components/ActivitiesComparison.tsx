import type {
  ActivityResponse,
  ActivityResponses,
} from "@/pages/05-questionnaire/02-activities";

import {
  ACTIVITY_LOOKUP,
} from "@/pages/05-questionnaire/02-activities";

interface ActivitiesComparisonProps {
  participantA?: ActivityResponses | null;
  participantB?: ActivityResponses | null;
}

interface ActivityRow {
  activityId: string;
  participantA?: ActivityResponse;
  participantB?: ActivityResponse;
}

function interestLabel(
  level: 1 | 2 | 3 | 4 | 5,
): string {
  switch (level) {
    case 1:
      return "No Interest";

    case 2:
      return "Little Interest";

    case 3:
      return "Some Interest";

    case 4:
      return "Interested";

    case 5:
      return "Very Interested";
  }
}

function experienceLabel(
  level: 1 | 2 | 3 | 4 | 5,
): string {
  switch (level) {
    case 1:
      return "No Experience";

    case 2:
      return "Little Experience";

    case 3:
      return "Some Experience";

    case 4:
      return "Experienced";

    case 5:
      return "Very Experienced";
  }
}

function hasResponse(
  response?: ActivityResponse,
): boolean {
  if (!response) {
    return false;
  }

  return (
    response.interest !== null ||
    response.experience !== null ||
    response.hasLimitsOrBoundaries ||
    response.hardLimit ||
    response.notes.trim().length > 0
  );
}

function responsesMatch(
  participantA?: ActivityResponse,
  participantB?: ActivityResponse,
): boolean {
  if (
    !hasResponse(participantA) ||
    !hasResponse(participantB)
  ) {
    return false;
  }

  return (
    participantA?.interest ===
      participantB?.interest &&
    participantA?.experience ===
      participantB?.experience &&
    participantA?.hasLimitsOrBoundaries ===
      participantB?.hasLimitsOrBoundaries &&
    participantA?.limitsOrBoundariesNotes.trim() ===
      participantB?.limitsOrBoundariesNotes.trim() &&
    participantA?.hardLimit ===
      participantB?.hardLimit &&
    participantA?.notes.trim() ===
      participantB?.notes.trim()
  );
}

function ActivityAnswer({
  response,
}: {
  response?: ActivityResponse;
}) {
  if (!hasResponse(response)) {
    return (
      <p className="comparison-summary-value comparison-summary-value--empty">
        No response
      </p>
    );
  }

  if (response?.hardLimit) {
    return (
      <div className="comparison-activity-answer">
        <p className="comparison-activity-preference">
          <strong>✕ Hard Limit</strong>
        </p>
      </div>
    );
  }

  const interest =
    response?.interest !== null &&
    response?.interest !== undefined
      ? interestLabel(response.interest)
      : "Not specified";

  const experience =
    response?.experience !== null &&
    response?.experience !== undefined
      ? experienceLabel(
          response.experience,
        )
      : "Not specified";

  const limitsOrBoundaries =
    response?.limitsOrBoundariesNotes.trim() ??
    "";

  const notes =
    response?.notes.trim() ?? "";

  return (
    <div className="comparison-activity-answer">
      <p className="comparison-activity-preference">
        <strong>Interest:</strong>{" "}
        {interest}
      </p>

      <p className="comparison-activity-preference">
        <strong>Experience:</strong>{" "}
        {experience}
      </p>

      {response?.hasLimitsOrBoundaries && (
        <div className="comparison-activity-notes">
          <strong>
            Limits / Boundaries
          </strong>

          {limitsOrBoundaries ? (
            limitsOrBoundaries
              .split("\n")
              .filter((line) =>
                line.trim(),
              )
              .map((line, index) => (
                <p key={index}>
                  {line}
                </p>
              ))
          ) : (
            <p>Specified</p>
          )}
        </div>
      )}

      {notes && (
        <div className="comparison-activity-notes">
          <strong>Notes</strong>

          {notes
            .split("\n")
            .filter((line) =>
              line.trim(),
            )
            .map((line, index) => (
              <p key={index}>
                {line}
              </p>
            ))}
        </div>
      )}
    </div>
  );
}

export default function ActivitiesComparison({
  participantA,
  participantB,
}: ActivitiesComparisonProps) {
  const responsesA =
    participantA ?? {};

  const responsesB =
    participantB ?? {};

  const allActivityIds =
    Array.from(
      new Set([
        ...Object.keys(responsesA),
        ...Object.keys(responsesB),
      ]),
    );

  const rows: ActivityRow[] =
    allActivityIds
      .map((activityId) => ({
        activityId,
        participantA:
          responsesA[activityId],
        participantB:
          responsesB[activityId],
      }))
      .filter(
        (row) =>
          hasResponse(
            row.participantA,
          ) ||
          hasResponse(
            row.participantB,
          ),
      );

  if (rows.length === 0) {
    return null;
  }

  const grouped = new Map<
    string,
    {
      icon: string;
      rows: ActivityRow[];
    }
  >();

  rows.forEach((row) => {
    const activity =
      ACTIVITY_LOOKUP[
        row.activityId
      ];

    if (!activity) {
      return;
    }

    if (
      !grouped.has(
        activity.category,
      )
    ) {
      grouped.set(
        activity.category,
        {
          icon: activity.icon,
          rows: [],
        },
      );
    }

    grouped
      .get(activity.category)
      ?.rows.push(row);
  });

  if (grouped.size === 0) {
    return null;
  }

  return (
    <section className="comparison-section">
      <h2>Activities</h2>

      <div className="comparison-activity-category-list">
        {[...grouped.entries()].map(
          ([category, group]) => (
            <section
              key={category}
              className="comparison-activity-category"
            >
              <h3 className="comparison-activity-category-title">
                <span aria-hidden="true">
                  {group.icon}
                </span>

                {category}
              </h3>

              <div className="comparison-summary-row-list">
                {group.rows.map(
                  (row) => {
                    const activity =
                      ACTIVITY_LOOKUP[
                        row.activityId
                      ];

                    if (!activity) {
                      return null;
                    }

                    const isMatch =
                      responsesMatch(
                        row.participantA,
                        row.participantB,
                      );

                    return (
                      <article
                        key={
                          row.activityId
                        }
                        className={[
                          "comparison-summary-row",
                          isMatch
                            ? "comparison-summary-row--match"
                            : "",
                        ]
                          .filter(
                            Boolean,
                          )
                          .join(" ")}
                      >
                        <div className="comparison-summary-topic">
                          <h3>
                            {
                              activity.label
                            }
                          </h3>

                          {isMatch && (
                            <span className="comparison-match-label">
                              Same response
                            </span>
                          )}
                        </div>

                        <section className="comparison-summary-column">
                          <ActivityAnswer
                            response={
                              row.participantA
                            }
                          />
                        </section>

                        <section className="comparison-summary-column">
                          <ActivityAnswer
                            response={
                              row.participantB
                            }
                          />
                        </section>
                      </article>
                    );
                  },
                )}
              </div>
            </section>
          ),
        )}
      </div>
    </section>
  );
}