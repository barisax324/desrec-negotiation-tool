import Activities from "@/pages/05-questionnaire/02-activities";

import type {
  ActivityResponses,
} from "@/pages/05-questionnaire/02-activities";

import type {
  ProgressOverrides,
} from "../../types";
import type {
  SummaryEditSection,
} from "@/pages/06-results/01-summary";

interface ActivitiesRouterPageProps {
  savingMessage: React.ReactNode;

  activityResponses: ActivityResponses;

  editingSection:
    | SummaryEditSection
    | null;

  saveActivitiesLocally: (
    responses: ActivityResponses,
  ) => void;

  returnToSummary: (
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  saveAndMove: (
    nextPage: "health-safety",
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  savePage: (
    nextPage: "scene-goals",
  ) => void;
}

function ActivitiesRouterPage({
  savingMessage,
  activityResponses,
  editingSection,
  saveActivitiesLocally,
  returnToSummary,
  saveAndMove,
  savePage,
}: ActivitiesRouterPageProps) {
  return (
    <>
      {savingMessage}

      <Activities
        initialResponses={
          activityResponses
        }
        back={() => {
          savePage(
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
              activities:
                responses,
            });

            return;
          }

          void saveAndMove(
            "health-safety",
            {
              activities:
                responses,
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

export default ActivitiesRouterPage;