import SceneGoals from "../../../Questionnaire/SceneGoals/SceneGoals";

import type {
  SceneGoalsData,
} from "../../../Questionnaire/SceneGoals/SceneGoals";
import type {
  ProgressOverrides,
} from "../../startTypes";
import type {
  SummaryEditSection,
} from "../../../Summary/SummaryPage";

interface SceneGoalsRouterPageProps {
  savingMessage: React.ReactNode;

  sceneGoals: SceneGoalsData;

  editingSection:
    | SummaryEditSection
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

  returnToSummary: (
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  saveAndMove: (
    nextPage: "activities",
    overrides?: ProgressOverrides,
  ) => Promise<void>;
}

function SceneGoalsRouterPage({
  savingMessage,
  sceneGoals,
  editingSection,
  updateSceneGoals,
  setHasStarted,
  setOnboardingStartPage,
  returnToSummary,
  saveAndMove,
}: SceneGoalsRouterPageProps) {
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

          setOnboardingStartPage(
            "ready",
          );

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

export default SceneGoalsRouterPage;