import "./NegotiationFlow.css";
import { useEffect, useState } from "react";
import {useSearchParams,} from "react-router-dom";
import {
  readBodyMap,
} from "./types";
import { useNegotiationOverview } from "./hooks/useNegotiationOverview";
import { useQuestionnaireState } from "./hooks/useQuestionnaireState";
import {useNegotiationLoader, } from "./hooks/useNegotiationLoader";
import OnboardingRouter from "./components/OnboardingRouter";
import {  useParticipantProgress, } from "./hooks/useParticipantProgress";
import QuestionnaireRouter from "./components/QuestionnaireRouter";
import {StartError,  StartLoading,} from "./components/StartStatus";
import {useSummaryEditing,} from "./hooks/useSummaryEditing";
import {useOnboardingFlow,} from "./hooks/useOnboardingFlow";
import type {
  QuestionnairePage,
} from "./types";
interface StartProps {
  participantRole?: "A" | "B";
}

function NegotiationFlow({
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
  onboardingCompleted,
  setOnboardingCompleted,
] = useState<boolean>(false);

const {
  isSaving,
  saveError,
  saveProgress,
  saveAndMove,
  returnToSummary,
} = useParticipantProgress({
  recoveryCredential,
  onboardingCompleted,

  onboardingData,
  sceneGoals,
  activityResponses,
  healthSafetyResponses,
  communicationResponses,
  aftercareResponses,

  setPage,
});

const {
  hasStarted,
  setHasStarted,

  hasSeenWelcome,
  setHasSeenWelcome,

  onboardingStartPage,
  setOnboardingStartPage,

  hasReviewedScene,
  setHasReviewedScene,

  handleOnboardingComplete,
} = useOnboardingFlow({
  onboardingCompleted,
  setOnboardingCompleted,
  setOnboardingData,
  saveAndMove,
});

const {
  editingSection,

  editingOnboardingSection,
  setEditingOnboardingSection,

  onboardingEditDraft,
  setOnboardingEditDraft,

  isEditingSceneDetails,

  beginEditingSection,
  saveOnboardingEdit,
} = useSummaryEditing({
  onboardingData,
  setOnboardingData,
  setHasStarted,
  setPage,
  saveProgress,
  saveAndMove,
});

const {
  isLoading,
  loadError,
} = useNegotiationLoader({
  recoveryCredential,
  participantRole,

  setNegotiationInfo,
  setOnboardingData,
  setSceneGoals,
  setActivityResponses,
  setHealthSafetyResponses,
  setCommunicationResponses,
  setAftercareResponses,
  setPage,
  setHasStarted,
});

if (isLoading) {
  return <StartLoading />;
}

if (loadError) {
  return (
    <StartError
      message={loadError}
    />
  );
}

const onboardingEnabled =
  !hasStarted ||
  isEditingSceneDetails ||
  editingOnboardingSection !== null;

if (onboardingEnabled) {
  return (
    <OnboardingRouter
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
}

if (isSaving) {
  return (
    <StartLoading
      message="Saving your progress..."
    />
  );
}

return (
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
      setPage
    }
    saveActivitiesLocally={
      setActivityResponses
    }
    saveHealthSafetyLocally={
      setHealthSafetyResponses
    }
    saveCommunicationLocally={
      setCommunicationResponses
    }
    saveAftercareLocally={
      setAftercareResponses
    }
    beginEditingSection={
      beginEditingSection
    }
    readBodyMap={
      readBodyMap
    }
  />
);

}

export default NegotiationFlow;