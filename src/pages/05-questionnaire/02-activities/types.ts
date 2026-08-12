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

export type InterestLevel = 1 | 2 | 3 | 4;

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
  interest: InterestLevel | null;
  discussFurther: boolean;
  hardLimit: boolean;
  notes: string;
}

export type ActivityResponses = Record<
  string,
  ActivityResponse
>;

