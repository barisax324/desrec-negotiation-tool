import NegotiationOverview from "../../NegotiationOverview/NegotiationOverview";
import Onboarding from "../../Onboarding";
import AboutYou from "../../Onboarding/AboutYou/AboutYou";
import Experience from "../../Onboarding/Experience";

import type {
  OnboardingData,
  OnboardingPage,
} from "../../Onboarding/types";
import type { NegotiationInfo } from "../startTypes";

interface OnboardingRouterProps {
  enabled: boolean;

  hasStarted: boolean;
  hasSeenWelcome: boolean;
  hasReviewedScene: boolean;
  onboardingStartPage: OnboardingPage;

  editingOnboardingSection:
    | "about-you"
    | "onboarding-experience"
    | null;

  onboardingEditDraft: OnboardingData | null;

  negotiationInfo: NegotiationInfo;
  isSavingOverview: boolean;
  overviewSaveError: string;

  saveOverview: (values: {
    negotiationName: string | null;
    sceneDate: string | null;
    sceneDateUnknown: boolean;
    plannedActivities: string;
  }) => Promise<boolean>;

  handleOnboardingComplete: (
    data: OnboardingData,
  ) => Promise<void>;

  saveOnboardingEdit: (
    data: OnboardingData,
  ) => Promise<void>;

  setHasSeenWelcome: (
    value: boolean,
  ) => void;

  setHasReviewedScene: (
    value: boolean,
  ) => void;

  setOnboardingStartPage: (
    page: OnboardingPage,
  ) => void;

  setEditingOnboardingSection: (
    value:
      | "about-you"
      | "onboarding-experience"
      | null,
  ) => void;

  setOnboardingEditDraft: React.Dispatch<
    React.SetStateAction<OnboardingData | null>
  >;
}

function OnboardingRouter({
  enabled,

  hasStarted,
  hasSeenWelcome,
  hasReviewedScene,
  onboardingStartPage,

  editingOnboardingSection,
  onboardingEditDraft,

  negotiationInfo,
  isSavingOverview,
  overviewSaveError,

  saveOverview,
  handleOnboardingComplete,
  saveOnboardingEdit,

  setHasSeenWelcome,
  setHasReviewedScene,
  setOnboardingStartPage,
  setEditingOnboardingSection,
  setOnboardingEditDraft,
}: OnboardingRouterProps) {
  if (!enabled) {
    return null;
  }

  if (
    !hasStarted &&
    !hasSeenWelcome
  ) {
    return (
      <Onboarding
        initialPage="welcome"
        welcomeOnly
        onWelcomeContinue={() => {
          setHasSeenWelcome(true);
        }}
        onBackToOverview={() => {
          window.location.assign("/open");
        }}
        onComplete={(data) => {
          void handleOnboardingComplete(
            data,
          );
        }}
      />
    );
  }

  if (
    editingOnboardingSection ===
      "about-you" &&
    onboardingEditDraft
  ) {
    return (
      <AboutYou
        data={onboardingEditDraft}
        updateData={(updates) => {
          setOnboardingEditDraft(
            (current) =>
              current
                ? {
                    ...current,
                    ...updates,
                  }
                : current,
          );
        }}
        back={() => {
          setOnboardingEditDraft(null);
          setEditingOnboardingSection(
            null,
          );
        }}
        next={() => {
          void saveOnboardingEdit(
            onboardingEditDraft,
          );
        }}
      />
    );
  }

  if (
    editingOnboardingSection ===
      "onboarding-experience" &&
    onboardingEditDraft
  ) {
    return (
      <Experience
        data={onboardingEditDraft}
        updateData={(updates) => {
          setOnboardingEditDraft(
            (current) =>
              current
                ? {
                    ...current,
                    ...updates,
                  }
                : current,
          );
        }}
        back={() => {
          setOnboardingEditDraft(null);
          setEditingOnboardingSection(
            null,
          );
        }}
        next={() => {
          void saveOnboardingEdit(
            onboardingEditDraft,
          );
        }}
      />
    );
  }

  if (!hasReviewedScene) {
    return (
      <NegotiationOverview
        negotiationName={
          negotiationInfo.negotiationName
        }
        sceneDate={
          negotiationInfo.sceneDate
        }
        sceneDateUnknown={
          negotiationInfo.sceneDateUnknown
        }
        plannedActivities={
          negotiationInfo.plannedActivities
        }
        isSaving={isSavingOverview}
        saveError={overviewSaveError}
        onSave={saveOverview}
        onBack={() => {
          setHasSeenWelcome(false);
        }}
        onContinue={() => {
          if (
            negotiationInfo.negotiationName
          ) {
            sessionStorage.setItem(
              "desrec.negotiationName",
              negotiationInfo.negotiationName,
            );
          } else {
            sessionStorage.removeItem(
              "desrec.negotiationName",
            );
          }

          sessionStorage.setItem(
            "desrec.sceneDate",
            negotiationInfo.sceneDate ?? "",
          );

          sessionStorage.setItem(
            "desrec.sceneDateUndecided",
            String(
              negotiationInfo.sceneDateUnknown,
            ),
          );

          sessionStorage.setItem(
            "desrec.plannedActivities",
            negotiationInfo.plannedActivities ??
              "",
          );

          sessionStorage.setItem(
            "desrec.sceneOverviewReviewed",
            "true",
          );

          setOnboardingStartPage(
            "about-you",
          );

          setHasReviewedScene(true);
        }}
      />
    );
  }

  if (!hasStarted) {
    return (
      <Onboarding
        initialPage={
          onboardingStartPage
        }
        onBackToOverview={() => {
          setHasReviewedScene(false);
        }}
        onComplete={(data) => {
          void handleOnboardingComplete(
            data,
          );
        }}
      />
    );
  }

  return null;
}

export default OnboardingRouter;