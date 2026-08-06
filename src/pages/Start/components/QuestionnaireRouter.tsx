import Activities from "../../Questionnaire/Activities/Activities";
import SceneGoals from "../../Questionnaire/SceneGoals/SceneGoals";
import HealthSafety from "../../HealthSafety/HealthSafety";
import CommunicationPage from "../../Communication/CommunicationPage";
import AftercarePage from "../../../components/Aftercare/AftercarePage";
import SummaryPage from "../../Summary/SummaryPage";
import ComparisonPage from "../../Comparison/ComparisonPage";

import type { SceneGoalsData } from "../../Questionnaire/SceneGoals/SceneGoals";
import type { ActivityResponses } from "../../Questionnaire/Activities/types";
import type { HealthSafetyResponses } from "../../HealthSafety/types";
import type { CommunicationFormData } from "../../Communication/CommunicationPage";
import type { AftercareResponses } from "../../../components/Aftercare/AftercarePage";
import type { OnboardingData } from "../../Onboarding/types";
import type { SummaryEditSection } from "../../Summary/SummaryPage";
import type {
  ProgressOverrides,
  QuestionnairePage,
} from "../startTypes";

interface QuestionnaireRouterProps {
  page: QuestionnairePage;
  recoveryCredential: string;
  saveError: string;
  editingSection: SummaryEditSection | null;

  onboardingData: OnboardingData | null;
  sceneGoals: SceneGoalsData;
  activityResponses: ActivityResponses;
  healthSafetyResponses: HealthSafetyResponses | null;
  communicationResponses: CommunicationFormData | null;
  aftercareResponses: AftercareResponses | null;

  updateSceneGoals: (
    updates: Partial<SceneGoalsData>,
  ) => void;

  setHasStarted: (
    value: boolean,
  ) => void;

  setOnboardingStartPage: (
    page: "welcome" | "about-you" | "experience" | "ready",
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

function QuestionnaireRouter({
  page,
  recoveryCredential,
  saveError,
  editingSection,

  onboardingData,
  sceneGoals,
  activityResponses,
  healthSafetyResponses,
  communicationResponses,
  aftercareResponses,

  updateSceneGoals,
  setHasStarted,
  setOnboardingStartPage,
  saveAndMove,
  returnToSummary,
  displayPage,
  saveActivitiesLocally,
  saveHealthSafetyLocally,
  saveCommunicationLocally,
  saveAftercareLocally,
  beginEditingSection,
  readBodyMap,
}: QuestionnaireRouterProps) {
  const savingMessage = saveError ? (
    <div
      className="questionnaire-save-error"
      role="alert"
    >
      {saveError}
    </div>
  ) : null;

  if (page === "scene-goals") {
    return (
      <>
        {savingMessage}

        <SceneGoals
          data={sceneGoals}
          updateData={updateSceneGoals}
          back={() => {
            if (editingSection) {
              void returnToSummary({
                sceneGoals,
              });

              return;
            }

            setOnboardingStartPage("ready");
            setHasStarted(false);
          }}
          next={() => {
            if (
              editingSection ===
              "scene-goals"
            ) {
              void returnToSummary({
                sceneGoals,
              });

              return;
            }

            void saveAndMove(
              "activities",
              {
                sceneGoals,
              },
            );
          }}
          onSaveAndReturnToSummary={
            editingSection ===
            "scene-goals"
              ? () => {
                  void returnToSummary({
                    sceneGoals,
                  });
                }
              : undefined
          }
        />
      </>
    );
  }

  if (page === "activities") {
    return (
      <>
        {savingMessage}

        <Activities
          initialResponses={
            activityResponses
          }
          back={() => {
            void saveAndMove(
              "scene-goals",
            );
          }}
          next={(responses) => {
            saveActivitiesLocally(
              responses,
            );

            if (
              editingSection ===
              "activities"
            ) {
              void returnToSummary({
                activities: responses,
              });

              return;
            }

            void saveAndMove(
              "health-safety",
              {
                activities: responses,
              },
            );
          }}
          onSaveAndReturnToSummary={
            editingSection ===
            "activities"
              ? (responses) => {
                  saveActivitiesLocally(
                    responses,
                  );

                  void returnToSummary({
                    activities:
                      responses,
                  });
                }
              : undefined
          }
        />
      </>
    );
  }

  if (page === "health-safety") {
    return (
      <>
        {savingMessage}

        <HealthSafety
          initialResponses={
            healthSafetyResponses
          }
          back={() => {
            void saveAndMove(
              "activities",
            );
          }}
          next={(responses) => {
            saveHealthSafetyLocally(
              responses,
            );

            if (
              editingSection ===
              "health-safety"
            ) {
              void returnToSummary({
                healthSafety: responses,
                bodyMap:
                  readBodyMap(),
              });

              return;
            }

            void saveAndMove(
              "communication",
              {
                healthSafety: responses,
                bodyMap:
                  readBodyMap(),
              },
            );
          }}
          onSaveAndReturnToSummary={
            editingSection ===
            "health-safety"
              ? (responses) => {
                  saveHealthSafetyLocally(
                    responses,
                  );

                  void returnToSummary({
                    healthSafety:
                      responses,
                    bodyMap:
                      readBodyMap(),
                  });
                }
              : undefined
          }
        />
      </>
    );
  }

  if (page === "communication") {
    return (
      <>
        {savingMessage}

        <CommunicationPage
          initialData={
            communicationResponses
          }
          onBack={() => {
            void saveAndMove(
              "health-safety",
            );
          }}
          onContinue={(responses) => {
            saveCommunicationLocally(
              responses,
            );

            if (
              editingSection ===
              "communication"
            ) {
              void returnToSummary({
                communication:
                  responses,
              });

              return;
            }

            void saveAndMove(
              "aftercare",
              {
                communication:
                  responses,
              },
            );
          }}
          onSaveAndReturnToSummary={
            editingSection ===
            "communication"
              ? (responses) => {
                  saveCommunicationLocally(
                    responses,
                  );

                  void returnToSummary({
                    communication:
                      responses,
                  });
                }
              : undefined
          }
        />
      </>
    );
  }

  if (page === "aftercare") {
    return (
      <>
        {savingMessage}

        <AftercarePage
          initialResponses={
            aftercareResponses
          }
          onBack={() => {
            void saveAndMove(
              "communication",
            );
          }}
          onContinue={(responses) => {
            saveAftercareLocally(
              responses,
            );

            void returnToSummary({
              aftercare: responses,
            });
          }}
          onSaveAndReturnToSummary={
            editingSection ===
            "aftercare"
              ? (responses) => {
                  saveAftercareLocally(
                    responses,
                  );

                  void returnToSummary({
                    aftercare:
                      responses,
                  });
                }
              : undefined
          }
        />
      </>
    );
  }

  if (page === "comparison") {
    return (
      <ComparisonPage
        recoveryToken={
          recoveryCredential
        }
        onBackToSummary={() => {
          displayPage("summary");
        }}
      />
    );
  }

  if (page === "summary") {
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
          onViewComparison={() => {
            displayPage("comparison");
          }}
        />
      </>
    );
  }

  return null;
}

export default QuestionnaireRouter;