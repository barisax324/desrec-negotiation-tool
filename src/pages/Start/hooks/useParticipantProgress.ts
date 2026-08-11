import { useState } from "react";

import {
  saveParticipantProgress,
} from "../../../services/negotiation/participantProgress";

import {
  readBodyMap,
} from "../startTypes";

import type {
  ParticipantProgressResponses,
  ProgressOverrides,
  QuestionnairePage,
} from "../startTypes";

import type {
  OnboardingData,
} from "../../Onboarding/types";

import type {
  SceneGoalsData,
} from "../../Questionnaire/SceneGoals/SceneGoals";

import type {
  ActivityResponses,
} from "../../Questionnaire/Activities/types";

import type {
  HealthSafetyResponses,
} from "../../HealthSafety/types";

import type {
  CommunicationFormData,
} from "../../Communication/CommunicationPage";

import type {
  AftercareResponses,
} from "../../../components/Aftercare/AftercarePage";

interface UseParticipantProgressInput {
  recoveryCredential: string;
onboardingCompleted: boolean;

  onboardingData: OnboardingData | null;
  sceneGoals: SceneGoalsData;
  activityResponses: ActivityResponses;
  healthSafetyResponses:
    | HealthSafetyResponses
    | null;
  communicationResponses:
    | CommunicationFormData
    | null;
  aftercareResponses:
    | AftercareResponses
    | null;

  setPage: (
    page: QuestionnairePage,
  ) => void;
}

export function useParticipantProgress({
  recoveryCredential,
  onboardingCompleted,

  onboardingData,
  sceneGoals,
  activityResponses,
  healthSafetyResponses,
  communicationResponses,
  aftercareResponses,

  setPage,
}: UseParticipantProgressInput) {
  const [
    isSaving,
    setIsSaving,
  ] = useState(false);

  const [
    saveError,
    setSaveError,
  ] = useState("");

  function buildResponses(
    overrides: ProgressOverrides = {},
  ): ParticipantProgressResponses {
    return {
      onboardingCompleted:
        overrides.onboardingCompleted ??
        onboardingCompleted,

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
        overrides.aftercare !==
        undefined
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
      await saveParticipantProgress({
        recoveryToken:
          recoveryCredential,
        currentPage:
          nextPage,
        responses:
          buildResponses(overrides),
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

  async function saveAndMove(
    nextPage: QuestionnairePage,
    overrides: ProgressOverrides = {},
  ): Promise<void> {
    const saved =
      await saveProgress(
        nextPage,
        overrides,
      );

    if (saved) {
      setPage(nextPage);
    }
  }

  async function returnToSummary(
    overrides: ProgressOverrides = {},
  ): Promise<void> {
    const saved =
      await saveProgress(
        "summary",
        overrides,
      );

    if (!saved) {
      return;
    }

    setPage("summary");
  }

  return {
    isSaving,
    saveError,
    saveProgress,
    saveAndMove,
    returnToSummary,
  };
}