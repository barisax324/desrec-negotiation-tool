import { useState } from "react";

import {
  saveParticipantProgress,
} from "@/services/negotiation/participantProgress";

import {
  readBodyMap,
} from "../types";

import type {
  ParticipantProgressResponses,
  ProgressOverrides,
  QuestionnairePage,
} from "../types";

import type {
  OnboardingData,
} from "@/pages/04-onboarding/shared";

import type {
  SceneGoalsData,
} from "@/pages/05-questionnaire/01-scene-goals";

import type {
  ActivityResponses,
} from "@/pages/05-questionnaire/02-activities";

import type {
  HealthSafetyResponses,
} from "@/pages/05-questionnaire/03-health-safety";

import type {
  CommunicationFormData,
} from "@/pages/05-questionnaire/04-communication-boundaries";

import type {
  AftercareResponses,
} from "@/pages/05-questionnaire/05-aftercare";

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