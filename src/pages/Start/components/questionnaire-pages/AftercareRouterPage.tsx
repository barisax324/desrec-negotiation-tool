import AftercarePage from "../../../../components/Aftercare/AftercarePage";

import type { AftercareResponses } from "../../../../components/Aftercare/AftercarePage";
import type {
  ProgressOverrides,
} from "../../startTypes";
import type {
  SummaryEditSection,
} from "../../../Summary/SummaryPage";

interface AftercareRouterPageProps {
  savingMessage: React.ReactNode;

  aftercareResponses:
    | AftercareResponses
    | null;

  editingSection:
    | SummaryEditSection
    | null;

  saveAftercareLocally: (
    responses: AftercareResponses,
  ) => void;

  returnToSummary: (
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  saveAndMove: (
    nextPage: "summary",
    overrides?: ProgressOverrides,
  ) => Promise<void>;

  savePage: (
    nextPage: "communication",
  ) => void;
}

function AftercareRouterPage({
  savingMessage,

  aftercareResponses,
  editingSection,

  saveAftercareLocally,
  returnToSummary,
  saveAndMove,
  savePage,
}: AftercareRouterPageProps) {
  return (
    <>
      {savingMessage}

      <AftercarePage
        initialResponses={
          aftercareResponses
        }
        onBack={() => {
          savePage(
            "communication",
          );
        }}
        onContinue={(responses) => {
          saveAftercareLocally(
            responses,
          );

          void saveAndMove(
            "summary",
            {
              aftercare: responses,
            },
          );
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

export default AftercareRouterPage;