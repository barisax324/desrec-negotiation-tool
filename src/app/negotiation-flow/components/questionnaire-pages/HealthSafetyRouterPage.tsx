import HealthSafety from "../../../../pages/05-questionnaire/03-health-safety";

import type {
  HealthSafetyResponses,
} from "../../../../pages/05-questionnaire/03-health-safety";

import type {
  ProgressOverrides,
} from "../../types";
import type {
  SummaryEditSection,
} from "../../../../pages/06-results/01-summary";

interface HealthSafetyRouterPageProps {
  savingMessage: React.ReactNode;

  healthSafetyResponses:
    | HealthSafetyResponses
    | null;

  editingSection:
    | SummaryEditSection
    | null;

  saveHealthSafetyLocally: (
    responses: HealthSafetyResponses,
  ) => void;

  returnToSummary: (
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  saveAndMove: (
    nextPage: "communication",
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  savePage: (
    nextPage: "activities",
  ) => void;

  readBodyMap: () => {
    statuses: Record<string, string>;
    notes: Record<string, string>;
  } | null;
}

function HealthSafetyRouterPage({
  savingMessage,
  healthSafetyResponses,
  editingSection,
  saveHealthSafetyLocally,
  returnToSummary,
  saveAndMove,
  savePage,
  readBodyMap,
}: HealthSafetyRouterPageProps) {
  return (
    <>
      {savingMessage}

      <HealthSafety
        initialResponses={
          healthSafetyResponses
        }
        back={() => {
          savePage("activities");
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
              healthSafety:
                responses,
              bodyMap:
                readBodyMap(),
            });

            return;
          }

          void saveAndMove(
            "communication",
            {
              healthSafety:
                responses,
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

export default HealthSafetyRouterPage;