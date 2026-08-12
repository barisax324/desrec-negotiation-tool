import ActivityItem from "./ActivityItem";
import type {
  ActivityCategoryDefinition,
  ActivityResponse,
  ActivityResponses,
} from "./types";

interface ActivityCategoryProps {
  category: ActivityCategoryDefinition;
  isExpanded: boolean;
  responses: ActivityResponses;
  onToggle: () => void;
  onResponseChange: (
    response: ActivityResponse,
  ) => void;
}

function ActivityCategory({
  category,
  isExpanded,
  responses,
  onToggle,
  onResponseChange,
}: ActivityCategoryProps) {
  const activeActivities =
    category.activities
      .filter((activity) => activity.active)
      .sort(
        (first, second) =>
          first.order - second.order,
      );

  const panelId =
    `activity-category-${category.id}`;

  return (
    <article
      className={`activity-category-card${
        isExpanded
          ? " activity-category-card--expanded"
          : ""
      }`}
    >
      <button
        type="button"
        className="activity-category-header"
        aria-expanded={isExpanded}
        aria-controls={panelId}
        onClick={onToggle}
      >
        <span
          className="activity-category-icon"
          aria-hidden="true"
        >
          {category.icon}
        </span>

        <span className="activity-category-content">
          <span className="activity-category-title-row">
            <span className="activity-category-title">
              {category.title}
            </span>

            <span className="activity-category-count">
              {activeActivities.length}{" "}
              {activeActivities.length === 1
                ? "item"
                : "items"}
            </span>
          </span>

          <span className="activity-category-description">
            {category.description}
          </span>
        </span>

        <span
          className="activity-category-chevron"
          aria-hidden="true"
        >
          {isExpanded ? "⌃" : "⌄"}
        </span>
      </button>

      {isExpanded && (
        <div
          id={panelId}
          className="activity-category-panel"
        >
          <div className="activity-list">
            {activeActivities.map((activity) => {
              const response =
                responses[activity.id] ?? {
                  activityId: activity.id,
                  interest: null,
                  discussFurther: false,
                  hardLimit: false,
                  notes: "",
                };

              return (
                <ActivityItem
                  key={activity.id}
                  activity={activity}
                  response={response}
                  onChange={
                    onResponseChange
                  }
                />
              );
            })}
          </div>
        </div>
      )}
    </article>
  );
}

export default ActivityCategory;

