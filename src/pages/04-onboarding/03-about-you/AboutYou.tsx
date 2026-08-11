import Button from "@/shared/ui/button";
import {
  OnboardingLayout,
} from "../shared";
import AboutYouForm from "./AboutYouForm";
import "./AboutYou.css";
import type {
  OnboardingData,
} from "../shared";

import {
  ONBOARDING_PROGRESS,
} from "../shared";

interface AboutYouProps {
  data: OnboardingData;

  updateData: (
    updates: Partial<OnboardingData>,
  ) => void;

  next: () => void;
  back: () => void;

  showNavigation?: boolean;
}

function AboutYou({
  data,
  updateData,
  next,
  back,
  showNavigation = true,
}: AboutYouProps) {
  const canContinue =
    data.role !== null;

  function handleContinue() {
    if (!canContinue) {
      return;
    }

    next();
  }

  return (
    <OnboardingLayout
      title="About You"
      subtitle="Tell us how you would like to be identified in this negotiation."
      progress={
        ONBOARDING_PROGRESS.aboutYou
      }
    >
      <AboutYouForm
        data={data}
        updateData={updateData}
      />

      {showNavigation && (
        <div className="about-you-actions">
          <Button onClick={back}>
            <span aria-hidden="true">
              ←
            </span>
            Back
          </Button>

          <div className="about-you-continue-area">
            <Button
              onClick={handleContinue}
              disabled={!canContinue}
            >
              Continue
              <span aria-hidden="true">
                →
              </span>
            </Button>

            {!canContinue && (
              <p>
                Choose your planned role to
                continue.
              </p>
            )}
          </div>
        </div>
      )}
    </OnboardingLayout>
  );
}

export default AboutYou;