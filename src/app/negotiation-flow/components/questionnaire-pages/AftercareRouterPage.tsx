import AftercarePage from "@/pages/05-questionnaire/05-aftercare";
import type {
  AftercareResponses,
} from "@/pages/05-questionnaire/05-aftercare";
import type {
  ProgressOverrides,
} from "../../types";
import type {
  SummaryEditSection,
} from "@/pages/06-results/01-summary";

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