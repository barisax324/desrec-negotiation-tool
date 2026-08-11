import type {
  OnboardingData,
} from "../../pages/04-onboarding/shared";
import type {
  HealthSafetyResponses,
} from "../../pages/05-questionnaire/03-health-safety";
import type {
  CommunicationFormData,
} from "../../pages/05-questionnaire/04-communication-boundaries";
import type {
  SceneGoalsData,
} from "../../pages/05-questionnaire/01-scene-goals";
import type {
  AftercareResponses,
} from "../../pages/05-questionnaire/05-aftercare";
import type {
  ActivityResponses,
} from "../../pages/05-questionnaire/02-activities";

export type QuestionnairePage =
  | "scene-goals"
  | "activities"
  | "health-safety"
  | "communication"
  | "aftercare"
  | "summary"
  | "comparison";

export interface BodyMapData {
  statuses: Record<string, string>;
  notes: Record<string, string>;
}

export interface NegotiationInfo {
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  plannedActivities: string | null;
}

export interface ParticipantProgressResponses {
  onboardingCompleted: boolean;
  onboardingData: OnboardingData | null;
  sceneGoals: SceneGoalsData;
  activities: ActivityResponses;
  healthSafety: HealthSafetyResponses | null;
  communication: CommunicationFormData | null;
  aftercare: AftercareResponses | null;
  bodyMap: BodyMapData | null;
}

export interface ParticipantProgressRow {
  current_page: string;
  responses: Partial<ParticipantProgressResponses> | null;
  responses_version: number;
}

export interface ProgressOverrides {
  onboardingCompleted?: boolean;
  onboardingData?: OnboardingData | null;
  sceneGoals?: SceneGoalsData;
  activities?: ActivityResponses;
  healthSafety?: HealthSafetyResponses | null;
  communication?: CommunicationFormData | null;
  aftercare?: AftercareResponses | null;
  bodyMap?: BodyMapData | null;
}

export const BODY_MAP_STORAGE_KEY =
  "desrec.bodyMap";

export const DEFAULT_SCENE_GOALS: SceneGoalsData = {
  goals: [],
  customGoals: [],
  notes: "",
};

export function isQuestionnairePage(
  value: string | null | undefined,
): value is QuestionnairePage {
  return (
    value === "scene-goals" ||
    value === "activities" ||
    value === "health-safety" ||
    value === "communication" ||
    value === "aftercare" ||
    value === "summary" ||
    value === "comparison"
  );
}

export function readBodyMap(): BodyMapData | null {
  const savedBodyMap =
    sessionStorage.getItem(
      BODY_MAP_STORAGE_KEY,
    );

  if (!savedBodyMap) {
    return null;
  }

  try {
    const parsedBodyMap =
      JSON.parse(
        savedBodyMap,
      ) as Partial<BodyMapData>;

    return {
      statuses:
        parsedBodyMap.statuses ?? {},
      notes:
        parsedBodyMap.notes ?? {},
    };
  } catch {
    return null;
  }
}