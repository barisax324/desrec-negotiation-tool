import {
  useEffect,
  useState,
} from "react";

import type {
  Dispatch,
  SetStateAction,
} from "react";

import {
  openNegotiation,
} from "@/services/negotiation/openNegotiation";

import {
  getParticipantProgress,
} from "@/services/negotiation/participantProgress";

import {
  BODY_MAP_STORAGE_KEY,
  isQuestionnairePage,
} from "../types";

import type {
  NegotiationInfo,
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

interface UseNegotiationLoaderInput {
  recoveryCredential: string;
  participantRole: "A" | "B";

  setNegotiationInfo: Dispatch<
    SetStateAction<NegotiationInfo>
  >;

  setOnboardingData: Dispatch<
    SetStateAction<OnboardingData | null>
  >;

  setSceneGoals: Dispatch<
    SetStateAction<SceneGoalsData>
  >;

  setActivityResponses: Dispatch<
    SetStateAction<ActivityResponses>
  >;

  setHealthSafetyResponses: Dispatch<
    SetStateAction<
      HealthSafetyResponses | null
    >
  >;

  setCommunicationResponses: Dispatch<
    SetStateAction<
      CommunicationFormData | null
    >
  >;

  setAftercareResponses: Dispatch<
    SetStateAction<
      AftercareResponses | null
    >
  >;

  setPage: Dispatch<
    SetStateAction<QuestionnairePage>
  >;

  setHasStarted: Dispatch<
    SetStateAction<boolean>
  >;
}

export function useNegotiationLoader({
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
}: UseNegotiationLoaderInput) {
  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    loadError,
    setLoadError,
  ] = useState("");

  useEffect(() => {
    let isCancelled = false;

    async function loadNegotiation() {
      setIsLoading(true);
      setLoadError("");

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
        } else {
          sessionStorage.removeItem(
            "desrec.negotiationName",
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

        if (isCancelled) {
          return;
        }

        const savedResponses =
          progressRow?.responses ?? {};

        if (
          savedResponses.onboardingData
        ) {
          setOnboardingData(
            savedResponses.onboardingData,
          );
        }

        if (savedResponses.sceneGoals) {
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

        setHasStarted(
          savedResponses.onboardingCompleted ===
            true,
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
    setActivityResponses,
    setAftercareResponses,
    setCommunicationResponses,
    setHasStarted,
    setHealthSafetyResponses,
    setNegotiationInfo,
    setOnboardingData,
    setPage,
    setSceneGoals,
  ]);

  return {
    isLoading,
    loadError,
  };
}