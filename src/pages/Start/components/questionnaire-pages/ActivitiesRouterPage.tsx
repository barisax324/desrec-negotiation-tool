import Activities from "../../../Questionnaire/Activities/Activities";

import type {
  ActivityResponses,
} from "../../../Questionnaire/Activities/types";
import type {
  ProgressOverrides,
} from "../../startTypes";
import type {
  SummaryEditSection,
} from "../../../Summary/SummaryPage";

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