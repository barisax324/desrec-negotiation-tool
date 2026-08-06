import "./Start.css";

import { useEffect, useState } from "react";
import {Link, useSearchParams, } from "react-router-dom";
import { openNegotiation } from "../../services/negotiation/openNegotiation";
import { BODY_MAP_STORAGE_KEY, isQuestionnairePage, readBodyMap,} from "./startTypes";import {  getParticipantProgress,saveParticipantProgress,} from "../../services/negotiation/participantProgress";
import { useNegotiationOverview } from "./hooks/useNegotiationOverview";
import { useQuestionnaireState } from "./hooks/useQuestionnaireState";
import QuestionnaireRouter from "./components/QuestionnaireRouter";
import OnboardingRouter from "./components/OnboardingRouter";

import type {
  ParticipantProgressResponses,
  ProgressOverrides,
  QuestionnairePage,
} from "./startTypes";

import {
  DEFAULT_ONBOARDING_DATA,
} from "../Onboarding/types";

import type {OnboardingData, OnboardingPage, } from "../Onboarding/types";
import type { HealthSafetyResponses } from "../HealthSafety/types";
import type { CommunicationFormData } from "../Communication/CommunicationPage";
import type { AftercareResponses } from "../../components/Aftercare/AftercarePage";
import type { ActivityResponses } from "../Questionnaire/Activities/types";
import type { SummaryEditSection } from "../Summary/SummaryPage";

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

    const {
  negotiationInfo,
  setNegotiationInfo,
  isSavingOverview,
  overviewSaveError,
  saveOverview,
} = useNegotiationOverview(
  recoveryCredential,
);

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
  hasSeenWelcome,
  setHasSeenWelcome,
] = useState(false);

    const [
  onboardingStartPage,
  setOnboardingStartPage,
] = useState<OnboardingPage>(
  "welcome",
);

    const [
  hasReviewedScene,
  setHasReviewedScene,
] = useState(false);

const [page, setPage] =
  useState<QuestionnairePage>(
    "scene-goals",
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
  editingOnboardingSection,
  setEditingOnboardingSection,
] = useState<
  "about-you" | "onboarding-experience" | null
>(null);

const [
  onboardingEditDraft,
  setOnboardingEditDraft,
] = useState<OnboardingData | null>(null);

const {
  onboardingData,
  setOnboardingData,

  sceneGoals,
  setSceneGoals,
  updateSceneGoals,

  activityResponses,
  setActivityResponses,

  healthSafetyResponses,
  setHealthSafetyResponses,

  communicationResponses,
  setCommunicationResponses,

  aftercareResponses,
  setAftercareResponses,
} = useQuestionnaireState();

const [
  isEditingSceneDetails,
  setIsEditingSceneDetails,
] = useState(false);

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

        setNegotiationInfo({
  negotiationName:
    negotiationResult.negotiationName,
  sceneDate:
    negotiationResult.sceneDate,
  sceneDateUnknown:
    negotiationResult.sceneDateUnknown,
  plannedActivities:
    negotiationResult.plannedActivities,
});

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

const progressRow =
  await getParticipantProgress(
    recoveryCredential,
  );

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
          savedResponses.sceneGoals
        ) {
          setSceneGoals(
            savedResponses.sceneGoals,
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
            : "scene-goals";

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

      sceneGoals:
        overrides.sceneGoals ??
        sceneGoals,

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

await saveParticipantProgress({
  recoveryToken:
    recoveryCredential,
  currentPage:
    nextPage,
  responses,
});

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
  if (section === "scene-details") {
    setIsEditingSceneDetails(true);
    return;
  }

  if (
    section === "about-you" ||
    section === "onboarding-experience"
  ) {
    setOnboardingEditDraft(
      onboardingData
        ? { ...onboardingData }
        : { ...DEFAULT_ONBOARDING_DATA },
    );

    setEditingOnboardingSection(section);
    return;
  }

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
      "scene-goals",
      {
        onboardingCompleted: true,
        onboardingData:
          completedOnboardingData,
      },
    );
  }

  async function saveOnboardingEdit(
  updatedData: OnboardingData,
) {
  const saved = await saveProgress(
    "summary",
    {
      onboardingCompleted: true,
      onboardingData: updatedData,
    },
  );

  if (!saved) {
    return;
  }

  setOnboardingData(updatedData);
  setOnboardingEditDraft(null);
  setEditingOnboardingSection(null);
  displayPage("summary");
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

const onboardingPage = (
  <OnboardingRouter
  enabled={
  !hasStarted ||
  isEditingSceneDetails ||
  editingOnboardingSection !== null
}
    hasStarted={hasStarted}
    hasSeenWelcome={
      hasSeenWelcome
    }
    hasReviewedScene={
      hasReviewedScene
    }
    onboardingStartPage={
      onboardingStartPage
    }
    editingOnboardingSection={
      editingOnboardingSection
    }
    onboardingEditDraft={
      onboardingEditDraft
    }
    negotiationInfo={
      negotiationInfo
    }
    isSavingOverview={
      isSavingOverview
    }
    overviewSaveError={
      overviewSaveError
    }
    saveOverview={
      saveOverview
    }
    handleOnboardingComplete={
      handleOnboardingComplete
    }
    saveOnboardingEdit={
      saveOnboardingEdit
    }
    setHasSeenWelcome={
      setHasSeenWelcome
    }
    setHasReviewedScene={
      setHasReviewedScene
    }
    setOnboardingStartPage={
      setOnboardingStartPage
    }
    setEditingOnboardingSection={
      setEditingOnboardingSection
    }
    setOnboardingEditDraft={
      setOnboardingEditDraft
    }
  />
);

if (
  !hasStarted ||
  isEditingSceneDetails ||
  editingOnboardingSection !== null
) {
  return onboardingPage;
}

const questionnairePage = (
  <QuestionnaireRouter
    page={page}
    recoveryCredential={
      recoveryCredential
    }
    saveError={saveError}
    editingSection={
      editingSection
    }
    onboardingData={
      onboardingData
    }
    sceneGoals={
      sceneGoals
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
    updateSceneGoals={
      updateSceneGoals
    }
    setHasStarted={
      setHasStarted
    }
    setOnboardingStartPage={
      setOnboardingStartPage
    }
    saveAndMove={
      saveAndMove
    }
    returnToSummary={
      returnToSummary
    }
    displayPage={
      displayPage
    }
    saveActivitiesLocally={
      saveActivitiesLocally
    }
    saveHealthSafetyLocally={
      saveHealthSafetyLocally
    }
    saveCommunicationLocally={
      saveCommunicationLocally
    }
    saveAftercareLocally={
      saveAftercareLocally
    }
    beginEditingSection={
      beginEditingSection
    }
    readBodyMap={
      readBodyMap
    }
  />
);

if (isSaving) {
  return (
    <main className="questionnaire-loading">
      <h1>
        Saving your progress...
      </h1>
    </main>
  );
}

return questionnairePage;
}

export default Start;