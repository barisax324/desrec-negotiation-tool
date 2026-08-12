import {
  useState,
} from "react";

import {
  DEFAULT_ONBOARDING_DATA,
} from "@/pages/04-onboarding/shared";
import type {
  OnboardingData,
} from "@/pages/04-onboarding/shared";

import type {
  SummaryEditSection,
} from "@/pages/06-results/01-summary";

import type {
  ProgressOverrides,
  QuestionnairePage,
} from "../types";

interface UseSummaryEditingInput {
  onboardingData: OnboardingData | null;

  setOnboardingData: React.Dispatch<
    React.SetStateAction<OnboardingData | null>
  >;

  setHasStarted: React.Dispatch<
    React.SetStateAction<boolean>
  >;

  setPage: React.Dispatch<
    React.SetStateAction<QuestionnairePage>
  >;

  saveProgress: (
    nextPage: QuestionnairePage,
    overrides?: ProgressOverrides,
  ) => Promise<boolean>;

  saveAndMove: (
    nextPage: QuestionnairePage,
    overrides?: ProgressOverrides,
  ) => Promise<void>;
}

export function useSummaryEditing({
  onboardingData,
  setOnboardingData,
  setHasStarted,
  setPage,
  saveProgress,
  saveAndMove,
}: UseSummaryEditingInput) {
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
    | "about-you"
    | "onboarding-experience"
    | null
  >(null);

  const [
    onboardingEditDraft,
    setOnboardingEditDraft,
  ] = useState<OnboardingData | null>(
    null,
  );

  const [
    isEditingSceneDetails,
    setIsEditingSceneDetails,
  ] = useState(false);

  function beginEditingSection(
    section: SummaryEditSection,
  ) {
    if (section === "scene-details") {
      setIsEditingSceneDetails(true);
      return;
    }

    if (
      section === "about-you" ||
      section ===
        "onboarding-experience"
    ) {
      setOnboardingEditDraft(
        onboardingData
          ? { ...onboardingData }
          : {
              ...DEFAULT_ONBOARDING_DATA,
            },
      );

      setEditingOnboardingSection(
        section,
      );

      return;
    }

    setEditingSection(section);
    setHasStarted(true);

    void saveAndMove(section, {
      onboardingCompleted: true,
    });
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
    setPage("summary");
  }

  function cancelOnboardingEdit() {
    setOnboardingEditDraft(null);
    setEditingOnboardingSection(null);
  }

  return {
    editingSection,
    setEditingSection,

    editingOnboardingSection,
    setEditingOnboardingSection,

    onboardingEditDraft,
    setOnboardingEditDraft,

    isEditingSceneDetails,
    setIsEditingSceneDetails,

    beginEditingSection,
    saveOnboardingEdit,
    cancelOnboardingEdit,
  };
}

