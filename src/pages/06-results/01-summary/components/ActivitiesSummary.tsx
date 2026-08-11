import {
  ACTIVITY_LOOKUP,
} from "@/pages/05-questionnaire/02-activities";

import type {
  ActivityResponses,
} from "@/pages/05-questionnaire/02-activities";
interface ActivitiesSummaryProps {
  responses: ActivityResponses;
}

function interestLabel(level: 1 | 2 | 3 | 4) {
  switch (level) {
    case 1:
      return "Hard Limit";
    case 2:
      return "Ask First";
    case 3:
      return "Interested";
    case 4:
      return "Very Interested";
  }
}

export default function ActivitiesSummary({
  responses,
}: ActivitiesSummaryProps) {
  const answeredActivities = Object.values(responses);

  if (answeredActivities.length === 0) {
    return (
      <p className="summary-empty-response">
        No activity responses provided.
      </p>
    );
  }

  const grouped = new Map<
    string,
    {
      icon: string;
      activities: typeof answeredActivities;
    }
  >();

  answeredActivities.forEach((response) => {
    const activity = ACTIVITY_LOOKUP[response.activityId];

    if (!activity) return;

    if (!grouped.has(activity.category)) {
      grouped.set(activity.category, {
        icon: activity.icon,
        activities: [],
      });
    }

    grouped.get(activity.category)!.activities.push(response);
  });

  return (
    <div className="summary-response-group">
      {[...grouped.entries()].map(([category, group]) => (
        <div
          key={category}
          className="summary-response-block"
        >
          <h3>
            {group.icon} {category}
          </h3>

          <table className="summary-table">
            <thead>
              <tr>
                <th style={{ width: "35%" }}>Activity</th>
                <th style={{ width: "25%" }}>Preference</th>
                <th>Notes</th>
              </tr>
            </thead>

            <tbody>
              {group.activities.map((response) => {
                const activity =
                  ACTIVITY_LOOKUP[response.activityId];

                let preference = "Not specified";

                if (response.hardLimit) {
                  preference = "⛔ Hard Limit";
                } else if (response.interest) {
                  preference = interestLabel(
                    response.interest,
                  );
                }

                if (response.discussFurther) {
                  preference += " • 💬 Discuss";
                }

                return (
                  <tr key={response.activityId}>
                    <td>
                      <strong>{activity.label}</strong>
                    </td>

                    <td>{preference}</td>

                    <td>
                      {response.notes?.trim() ? (
                        response.notes
                          .split("\n")
                          .filter((line) => line.trim())
                          .map((line, index) => (
                            <div key={index}>
                              {line}
                            </div>
                          ))
                      ) : (
                        <span
                          className="summary-empty-response"
                        >
                          —
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
}