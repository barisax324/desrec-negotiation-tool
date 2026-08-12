import CommunicationPage from "@/pages/05-questionnaire/04-communication-boundaries";

import type {
  CommunicationFormData,
} from "@/pages/05-questionnaire/04-communication-boundaries";

import type {
  ProgressOverrides,
} from "../../types";
import type {
  SummaryEditSection,
} from "@/pages/06-results/01-summary";

interface CommunicationRouterPageProps {
  savingMessage: React.ReactNode;

  communicationResponses:
    | CommunicationFormData
    | null;

  editingSection:
    | SummaryEditSection
    | null;

  saveCommunicationLocally: (
    responses: CommunicationFormData,
  ) => void;

  returnToSummary: (
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  saveAndMove: (
    nextPage: "aftercare",
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  savePage: (
    nextPage: "health-safety",
  ) => void;
}

function CommunicationRouterPage({
  savingMessage,

  communicationResponses,
  editingSection,

  saveCommunicationLocally,
  returnToSummary,
  saveAndMove,
  savePage,
}: CommunicationRouterPageProps) {
  return (
    <>
      {savingMessage}

      <CommunicationPage
        initialData={
          communicationResponses
        }
        onBack={() => {
          savePage(
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

export default CommunicationRouterPage;

