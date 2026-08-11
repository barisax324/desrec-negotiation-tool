import CommunicationPage from "../../../Communication/CommunicationPage";

import type {
  CommunicationFormData,
} from "../../../Communication/CommunicationPage";
import type {
  ProgressOverrides,
} from "../../startTypes";
import type {
  SummaryEditSection,
} from "../../../Summary/SummaryPage";

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