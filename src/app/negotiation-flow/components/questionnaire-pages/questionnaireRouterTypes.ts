import type {
  SceneGoalsData,
} from "../../../../pages/05-questionnaire/01-scene-goals";
import type {
  ActivityResponses,
} from "../../../../pages/05-questionnaire/02-activities";
import type {
  HealthSafetyResponses,
} from "../../../../pages/05-questionnaire/03-health-safety";
import type {
  CommunicationFormData,
} from "../../../../pages/05-questionnaire/04-communication-boundaries";
import type {
  AftercareResponses,
} from "../../../../pages/05-questionnaire/05-aftercare";
import type {
  OnboardingData,
} from "../../../../pages/04-onboarding/shared";
import type { SummaryEditSection } from "../../../../pages/06-results/01-summary";

import type {
  ProgressOverrides,
  QuestionnairePage,
} from "../../types";

export interface QuestionnaireRouterProps {
  page: QuestionnairePage;
  recoveryCredential: string;
  saveError: string;
  editingSection: SummaryEditSection | null;

  onboardingData: OnboardingData | null;
  sceneGoals: SceneGoalsData;
  activityResponses: ActivityResponses;

  healthSafetyResponses:
    | HealthSafetyResponses
    | null;

  communicationResponses:
    | CommunicationFormData
    | null;

  aftercareResponses:
    | AftercareResponses
    | null;

  updateSceneGoals: (
    updates: Partial<SceneGoalsData>,
  ) => void;

  setHasStarted: (
    value: boolean,
  ) => void;

  setOnboardingStartPage: (
    page:
      | "welcome"
      | "about-you"
      | "experience"
      | "ready",
  ) => void;

  saveAndMove: (
    nextPage: QuestionnairePage,
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  returnToSummary: (
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  displayPage: (
    nextPage: QuestionnairePage,
  ) => void;

  saveActivitiesLocally: (
    responses: ActivityResponses,
  ) => void;

  saveHealthSafetyLocally: (
    responses: HealthSafetyResponses,
  ) => void;

  saveCommunicationLocally: (
    responses: CommunicationFormData,
  ) => void;

  saveAftercareLocally: (
    responses: AftercareResponses,
  ) => void;

  beginEditingSection: (
    section: SummaryEditSection,
  ) => void;

  readBodyMap: () => {
    statuses: Record<string, string>;
    notes: Record<string, string>;
  } | null;
}