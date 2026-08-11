import SceneGoals from "@/pages/05-questionnaire/01-scene-goals";
import type {
  SceneGoalsData,
} from "@/pages/05-questionnaire/01-scene-goals";
import type {
  ProgressOverrides,
} from "../../types";
import type {
  SummaryEditSection,
} from "@/pages/06-results/01-summary";

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