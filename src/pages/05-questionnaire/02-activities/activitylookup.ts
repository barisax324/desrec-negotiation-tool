import { ACTIVITY_CATEGORIES } from "./activityData";

export const ACTIVITY_LOOKUP = Object.fromEntries(
  ACTIVITY_CATEGORIES.flatMap((category) =>
    category.activities.map((activity) => [
      activity.id,
      {
        label: activity.label,
        category: category.title,
        icon: category.icon,
      },
    ]),
  ),
);

