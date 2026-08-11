import type { SceneGoalsData } from "../../../Questionnaire/SceneGoals/SceneGoals";
import type { ActivityResponses } from "../../../Questionnaire/Activities/types";
import type { HealthSafetyResponses } from "../../../HealthSafety/types";
import type { CommunicationFormData } from "../../../Communication/CommunicationPage";
import type { AftercareResponses } from "../../../../components/Aftercare/AftercarePage";
import type { OnboardingData } from "../../../Onboarding/types";
import type { SummaryEditSection } from "../../../Summary/SummaryPage";

import type {
  ProgressOverrides,
  QuestionnairePage,
} from "../../startTypes";

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