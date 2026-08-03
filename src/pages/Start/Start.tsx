import "./Start.css";

import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Activities from "../Questionnaire/Activities/Activities";
import Onboarding from "../Onboarding";
import ExperienceGoals from "../Questionnaire/ExperienceGoals/ExperienceGoals";
import HealthSafety from "../HealthSafety/HealthSafety";
import CommunicationPage from "../Communication/CommunicationPage";
import AftercarePage from "../../components/Aftercare/AftercarePage";
import SummaryPage from "../Summary/SummaryPage";
import ComparisonPage from "../Comparison/ComparisonPage";

import type { HealthSafetyResponses } from "../HealthSafety/types";
import type { CommunicationFormData } from "../Communication/CommunicationPage";
import type { ExperienceGoalsData } from "../Questionnaire/ExperienceGoals/ExperienceGoals";
import type { OnboardingData } from "../Onboarding/types";
import type { AftercareResponses } from "../../components/Aftercare/AftercarePage";
import type { ActivityResponses } from "../Questionnaire/Activities/types";
import type { SummaryEditSection } from "../Summary/SummaryPage";

import { openNegotiation } from "../../services/negotiation/openNegotiation";
import { supabase } from "../../lib/supabase";

type QuestionnairePage =
  | "experience-goals"
  | "activities"
  | "health-safety"
  | "communication"
  | "aftercare"
  | "summary"
  | "comparison";

interface BodyMapData {
  statuses: Record<string, string>;
  notes: Record<string, string>;
}

interface ParticipantProgressResponses {
  onboardingCompleted: boolean;
  onboardingData: OnboardingData | null;
  experienceGoals: ExperienceGoalsData;
  activities: ActivityResponses;
  healthSafety: HealthSafetyResponses | null;
  communication: CommunicationFormData | null;
  aftercare: AftercareResponses | null;
  bodyMap: BodyMapData | null;
}

interface ParticipantProgressRow {
  current_page: string;
  responses: Partial<ParticipantProgressResponses> | null;
  responses_version: number;
}

interface ProgressOverrides {
  onboardingCompleted?: boolean;
  onboardingData?: OnboardingData | null;
  experienceGoals?: ExperienceGoalsData;
  activities?: ActivityResponses;
  healthSafety?: HealthSafetyResponses | null;
  communication?: CommunicationFormData | null;
  aftercare?: AftercareResponses | null;
  bodyMap?: BodyMapData | null;
}

const BODY_MAP_STORAGE_KEY =
  "desrec.bodyMap";

const DEFAULT_EXPERIENCE_GOALS: ExperienceGoalsData = {
  goals: [],
  customGoals: [],
  notes: "",
};

function isQuestionnairePage(
  value: string | null | undefined,
): value is QuestionnairePage {
  return (
    value === "experience-goals" ||
    value === "activities" ||
    value === "health-safety" ||
    value === "communication" ||
    value === "aftercare" ||
    value === "summary"  ||
    value === "comparison"
  );
}

function readBodyMap(): BodyMapData | null {
  const savedBodyMap =
    sessionStorage.getItem(
      BODY_MAP_STORAGE_KEY,
    );

  if (!savedBodyMap) {
    return null;
  }

  try {
    const parsedBodyMap =
      JSON.parse(
        savedBodyMap,
      ) as Partial<BodyMapData>;

    return {
      statuses:
        parsedBodyMap.statuses ?? {},
      notes:
        parsedBodyMap.notes ?? {},
    };
  } catch {
    return null;
  }
}

interface StartProps {
  participantRole?: "A" | "B";
}

function Start({
  participantRole = "A",
}: StartProps) {
  const [searchParams] =
    useSearchParams();

  const recoveryCredential =
    searchParams.get("r")?.trim() ??
    "";

  const [isLoading, setIsLoading] =
    useState(true);

  const [isSaving, setIsSaving] =
    useState(false);

  const [loadError, setLoadError] =
    useState("");

  const [saveError, setSaveError] =
    useState("");

  const [hasStarted, setHasStarted] =
    useState(false);

  const [
    onboardingData,
    setOnboardingData,
  ] = useState<OnboardingData | null>(
    null,
  );

const [page, setPage] =
  useState<QuestionnairePage>(
    "experience-goals",
  );

useEffect(() => {
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "auto",
  });
}, [page]);

const [
  editingSection,
  setEditingSection,
] = useState<SummaryEditSection | null>(
  null,
);

  const [
    experienceGoals,
    setExperienceGoals,
  ] = useState<ExperienceGoalsData>(
    DEFAULT_EXPERIENCE_GOALS,
  );

  const [
    activityResponses,
    setActivityResponses,
  ] = useState<ActivityResponses>({});

  const [
    healthSafetyResponses,
    setHealthSafetyResponses,
  ] =
    useState<HealthSafetyResponses | null>(
      null,
    );

  const [
    communicationResponses,
    setCommunicationResponses,
  ] =
    useState<CommunicationFormData | null>(
      null,
    );

  const [
    aftercareResponses,
    setAftercareResponses,
  ] =
    useState<AftercareResponses | null>(
      null,
    );

  useEffect(() => {
    let isCancelled = false;

    async function loadNegotiation() {
      setIsLoading(true);
      setLoadError("");
      setSaveError("");

      if (!recoveryCredential) {
        setLoadError(
          "This link is incomplete. Please open your negotiation using your Personal Link and password, or your Reference ID and password.",
        );

        setIsLoading(false);
        return;
      }

      try {
        const negotiationResult =
          await openNegotiation(
            recoveryCredential,
            "recovery",
          );

        if (isCancelled) {
          return;
        }

        if (
          negotiationResult.participantRole !==
          participantRole
        ) {
          setLoadError(
            `This login does not belong to Participant ${participantRole}.`,
          );

          return;
        }

        sessionStorage.setItem(
          "desrec.activeRecoveryToken",
          recoveryCredential,
        );

        sessionStorage.setItem(
          "desrec.currentParticipantRole",
          negotiationResult.participantRole,
        );

        sessionStorage.setItem(
          "desrec.negotiationStatus",
          negotiationResult.negotiationStatus,
        );

        if (
          negotiationResult.negotiationName
        ) {
          sessionStorage.setItem(
            "desrec.negotiationName",
            negotiationResult.negotiationName,
          );
        }

        if (negotiationResult.expiresAt) {
          sessionStorage.setItem(
            "desrec.expiresAt",
            negotiationResult.expiresAt,
          );
        }

        const {
          data,
          error,
        } = await supabase.rpc(
          "get_participant_progress",
          {
            p_recovery_token:
              recoveryCredential,
          },
        );

        if (error) {
          console.error(
            "get_participant_progress error:",
            error,
          );

          throw new Error(
            error.message,
          );
        }

        const progressRow =
          Array.isArray(data)
            ? (data[0] as
                | ParticipantProgressRow
                | undefined)
            : undefined;

        const savedResponses =
          progressRow?.responses ?? {};

        if (
          savedResponses.onboardingData
        ) {
          setOnboardingData(
            savedResponses.onboardingData,
          );
        }

        if (
          savedResponses.experienceGoals
        ) {
          setExperienceGoals(
            savedResponses.experienceGoals,
          );
        }

        if (savedResponses.activities) {
          setActivityResponses(
            savedResponses.activities,
          );
        }

        if (
          savedResponses.healthSafety
        ) {
          setHealthSafetyResponses(
            savedResponses.healthSafety,
          );
        }

        if (
          savedResponses.communication
        ) {
          setCommunicationResponses(
            savedResponses.communication,
          );
        }

        if (
          savedResponses.aftercare
        ) {
          setAftercareResponses(
            savedResponses.aftercare,
          );
        }

        if (savedResponses.bodyMap) {
          sessionStorage.setItem(
            BODY_MAP_STORAGE_KEY,
            JSON.stringify(
              savedResponses.bodyMap,
            ),
          );
        } else {
          sessionStorage.removeItem(
            BODY_MAP_STORAGE_KEY,
          );
        }

        const savedPage =
          isQuestionnairePage(
            progressRow?.current_page,
          )
            ? progressRow.current_page
            : "experience-goals";

        setPage(savedPage);

        const onboardingCompleted =
          savedResponses.onboardingCompleted ===
          true;

        setHasStarted(
          onboardingCompleted,
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "The negotiation could not be opened.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadNegotiation();

    return () => {
      isCancelled = true;
    };
  }, [
    participantRole,
    recoveryCredential,
  ]);

  function buildProgressResponses(
    overrides: ProgressOverrides = {},
  ): ParticipantProgressResponses {
    return {
      onboardingCompleted:
        overrides.onboardingCompleted ??
        hasStarted,

      onboardingData:
        overrides.onboardingData !==
        undefined
          ? overrides.onboardingData
          : onboardingData,

      experienceGoals:
        overrides.experienceGoals ??
        experienceGoals,

      activities:
        overrides.activities ??
        activityResponses,

      healthSafety:
        overrides.healthSafety !==
        undefined
          ? overrides.healthSafety
          : healthSafetyResponses,

      communication:
        overrides.communication !==
        undefined
          ? overrides.communication
          : communicationResponses,

      aftercare:
        overrides.aftercare !== undefined
          ? overrides.aftercare
          : aftercareResponses,

      bodyMap:
        overrides.bodyMap !== undefined
          ? overrides.bodyMap
          : readBodyMap(),
    };
  }

  async function saveProgress(
    nextPage: QuestionnairePage,
    overrides: ProgressOverrides = {},
  ): Promise<boolean> {
    if (!recoveryCredential) {
      setSaveError(
        "Your secure login session is missing. Please reopen the negotiation.",
      );

      return false;
    }

    setIsSaving(true);
    setSaveError("");

    try {
      const responses =
        buildProgressResponses(
          overrides,
        );

      const { error } =
        await supabase.rpc(
          "save_participant_progress",
          {
            p_recovery_token:
              recoveryCredential,
            p_current_page:
              nextPage,
            p_responses:
              responses,
          },
        );

      if (error) {
        console.error(
          "save_participant_progress error:",
          error,
        );

        throw new Error(
          error.message,
        );
      }

      return true;
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? `Your progress could not be saved: ${error.message}`
          : "Your progress could not be saved.",
      );

      return false;
    } finally {
      setIsSaving(false);
    }
  }

function displayPage(
  nextPage: QuestionnairePage,
) {
  setPage(nextPage);
}

  async function saveAndMove(
    nextPage: QuestionnairePage,
    overrides: ProgressOverrides = {},
  ) {
    const saved =
      await saveProgress(
        nextPage,
        overrides,
      );

    if (!saved) {
      return;
    }

    displayPage(nextPage);
  }

  async function returnToSummary(
    overrides: ProgressOverrides = {},
  ) {
    const saved =
      await saveProgress(
        "summary",
        overrides,
      );

    if (!saved) {
      return;
    }

    setEditingSection(null);
    displayPage("summary");
  }

  function beginEditingSection(
    section: SummaryEditSection,
  ) {
    setEditingSection(section);
    setHasStarted(true);

    void saveAndMove(section, {
      onboardingCompleted: true,
    });
  }

  async function handleOnboardingComplete(
    completedOnboardingData: OnboardingData,
  ) {
    setOnboardingData(
      completedOnboardingData,
    );

    setHasStarted(true);

    await saveAndMove(
      "experience-goals",
      {
        onboardingCompleted: true,
        onboardingData:
          completedOnboardingData,
      },
    );
  }

  function updateExperienceGoals(
    updates: Partial<ExperienceGoalsData>,
  ) {
    setExperienceGoals(
      (currentData) => ({
        ...currentData,
        ...updates,
      }),
    );
  }

  function saveActivitiesLocally(
    responses: ActivityResponses,
  ) {
    setActivityResponses(responses);
  }

  function saveHealthSafetyLocally(
    responses: HealthSafetyResponses,
  ) {
    setHealthSafetyResponses(
      responses,
    );
  }

  function saveCommunicationLocally(
    responses: CommunicationFormData,
  ) {
    setCommunicationResponses(
      responses,
    );
  }

  function saveAftercareLocally(
    responses: AftercareResponses,
  ) {
    setAftercareResponses(responses);
  }

  if (isLoading) {
    return (
      <main className="questionnaire-loading">
        <h1>
          Opening your negotiation...
        </h1>

        <p>
          Please wait while your private
          access is verified.
        </p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="questionnaire-error">
        <h1>
          This negotiation could not be
          opened
        </h1>

        <p>{loadError}</p>

        <p>
          Your login may be incomplete,
          invalid, or expired.
        </p>

        <p>
          <Link to="/open">
            Open My Negotiation
          </Link>
        </p>

        <p>
          <Link to="/">
            Return Home
          </Link>
        </p>
      </main>
    );
  }

  if (!hasStarted) {
    return (
      <Onboarding
        onComplete={(data) => {
          void handleOnboardingComplete(
            data,
          );
        }}
      />
    );
  }

  const savingMessage =
    saveError ? (
      <div
        className="questionnaire-save-error"
        role="alert"
      >
        {saveError}
      </div>
    ) : null;

  if (page === "experience-goals") {
    return (
      <>
        {savingMessage}

        <ExperienceGoals
          data={experienceGoals}
          updateData={
            updateExperienceGoals
          }
          back={() => {
            if (editingSection) {
              void returnToSummary({
                experienceGoals,
              });

              return;
            }

            setHasStarted(false);
          }}
          next={() => {
            if (
              editingSection ===
              "experience-goals"
            ) {
              void returnToSummary({
                experienceGoals,
              });

              return;
            }

            void saveAndMove(
              "activities",
              {
                experienceGoals,
              },
            );
          }}
          onSaveAndReturnToSummary={
            editingSection ===
            "experience-goals"
              ? () => {
                  void returnToSummary({
                    experienceGoals,
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
              "experience-goals",
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
      recoveryToken={recoveryCredential}
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
          experienceGoals={
            experienceGoals
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

  if (isSaving) {
    return (
      <main className="questionnaire-loading">
        <h1>
          Saving your progress...
        </h1>
      </main>
    );
  }

  return null;
}

export default Start;