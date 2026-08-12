import SummaryPage from "@/pages/06-results/01-summary";

import type {
  SceneGoalsData,
} from "@/pages/05-questionnaire/01-scene-goals";
import type {
  ActivityResponses,
} from "@/pages/05-questionnaire/02-activities";
import type {
  HealthSafetyResponses,
} from "@/pages/05-questionnaire/03-health-safety";
import type {
  CommunicationFormData,
} from "@/pages/05-questionnaire/04-communication-boundaries";
import type {
  AftercareResponses,
} from "@/pages/05-questionnaire/05-aftercare";
import type {
  OnboardingData,
} from "@/pages/04-onboarding/shared";
import type { SummaryEditSection } from "@/pages/06-results/01-summary";

interface SummaryRouterPageProps {
  savingMessage: React.ReactNode;

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

  beginEditingSection: (
    section: SummaryEditSection,
  ) => void;

  onViewComparison: () => void;
}

function SummaryRouterPage({
  savingMessage,

  onboardingData,
  sceneGoals,
  activityResponses,
  healthSafetyResponses,
  communicationResponses,
  aftercareResponses,

  beginEditingSection,
  onViewComparison,
}: SummaryRouterPageProps) {
  return (
    <>
      {savingMessage}

      <SummaryPage
        onboardingData={
          onboardingData
        }
        sceneGoals={
          sceneGoals
        }
        activityResponses={
          activityResponses
        }
        healthSafetyResponses={
          healthSafetyResponses
        }
        communicationResponses={
          communicationResponses
        }
        aftercareResponses={
          aftercareResponses
        }
        onEditSection={
          beginEditingSection
        }
        onViewComparison={
          onViewComparison
        }
      />
    </>
  );
}

export default SummaryRouterPage;

