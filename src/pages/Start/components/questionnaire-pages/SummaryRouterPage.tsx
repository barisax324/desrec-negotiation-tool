import SummaryPage from "../../../Summary/SummaryPage";

import type { SceneGoalsData } from "../../../Questionnaire/SceneGoals/SceneGoals";
import type { ActivityResponses } from "../../../Questionnaire/Activities/types";
import type { HealthSafetyResponses } from "../../../HealthSafety/types";
import type { CommunicationFormData } from "../../../Communication/CommunicationPage";
import type { AftercareResponses } from "../../../../components/Aftercare/AftercarePage";
import type { OnboardingData } from "../../../Onboarding/types";
import type { SummaryEditSection } from "../../../Summary/SummaryPage";

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