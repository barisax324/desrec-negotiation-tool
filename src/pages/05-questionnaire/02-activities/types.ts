export type ActivityCategoryId =
  | "rope"
  | "impact"
  | "power-exchange"
  | "sensation"
  | "restraint"
  | "roleplay"
  | "service"
  | "exposure"
  | "intimacy"
  | "medical-play"
  | "other-notes";

export type ActivityScaleLevel =
  | 1
  | 2
  | 3
  | 4
  | 5;

export interface ActivityDefinition {
  id: string;
  label: string;
  order: number;
  active: boolean;
  isOther?: boolean;
}

export interface ActivityCategoryDefinition {
  id: ActivityCategoryId;
  icon: string;
  title: string;
  description: string;
  order: number;
  active: boolean;
  activities: ActivityDefinition[];
}

export interface ActivityResponse {
  activityId: string;

  interest:
    | ActivityScaleLevel
    | null;

  experience:
    | ActivityScaleLevel
    | null;

  hasLimitsOrBoundaries: boolean;

  limitsOrBoundariesNotes: string;

  hardLimit: boolean;

  notes: string;
}

export type ActivityResponses = Record<
  string,
  ActivityResponse
>;

