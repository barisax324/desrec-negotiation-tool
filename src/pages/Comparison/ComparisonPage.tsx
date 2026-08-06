import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  getNegotiationComparison,
  type NegotiationComparisonResult,
} from "../../services/negotiation/getNegotiationComparison";

import PrintComparison from "./PrintComparison";

import type { OnboardingData } from "../Onboarding/types";
import type { SceneGoalsData } from "../Questionnaire/SceneGoals/SceneGoals";
import type { ActivityResponses } from "../Questionnaire/Activities/types";
import type { HealthSafetyResponses } from "../HealthSafety/types";
import type { CommunicationFormData } from "../Communication/CommunicationPage";
import type { AftercareResponses } from "../../components/Aftercare/AftercarePage";
import type { BodyRegionStatus } from "../HealthSafety/data/bodyMapOptions";

import AboutYouComparison from "./Components/AboutYouComparison";
import ExperienceComparison from "./Components/ExperienceComparison";
import ActivitiesComparison from "./Components/ActivitiesComparison";
import HealthComparison from "./Components/HealthComparison";
import BodyMapComparison from "./Components/BodyMapComparison";
import CommunicationComparison from "./Components/CommunicationComparison";
import AftercareComparison from "./Components/AftercareComparison";

import "./ComparisonPage.css";

interface ComparisonPageProps {
  recoveryToken: string;
  onBackToSummary: () => void;
}

interface BodyMapData {
  statuses: Record<
    string,
    BodyRegionStatus
  >;

  notes: Record<
    string,
    string
  >;
}

interface SavedParticipantResponses {
  onboardingCompleted?: boolean;

  onboardingData?:
    | OnboardingData
    | null;

  sceneGoals?:
    SceneGoalsData;

  activities?:
    ActivityResponses;

  healthSafety?:
    | HealthSafetyResponses
    | null;

  bodyMap?:
    | BodyMapData
    | null;

  communication?:
    | CommunicationFormData
    | null;

  aftercare?:
    | AftercareResponses
    | null;
}

function formatSceneDate(
  sceneDate: string,
): string {
  const parsedDate = new Date(
    `${sceneDate}T00:00:00`,
  );

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return sceneDate;
  }

  return parsedDate.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

export default function ComparisonPage({
  recoveryToken,
  onBackToSummary,
}: ComparisonPageProps) {
  const [
    comparison,
    setComparison,
  ] =
    useState<NegotiationComparisonResult | null>(
      null,
    );

  const [
    isLoading,
    setIsLoading,
  ] = useState(true);

  const [
    error,
    setError,
  ] = useState("");

  const [
    activeSectionTitle,
    setActiveSectionTitle,
  ] = useState("About You");

  const comparisonSectionsRef =
    useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  useEffect(() => {
    let isCancelled = false;

    async function loadComparison() {
      setIsLoading(true);
      setError("");

      try {
        const result =
          await getNegotiationComparison(
            recoveryToken,
          );

        if (!isCancelled) {
          setComparison(result);
        }
      } catch (caughtError) {
        if (!isCancelled) {
          setError(
            caughtError instanceof Error
              ? caughtError.message
              : "The comparison could not be loaded.",
          );
        }
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadComparison();

    return () => {
      isCancelled = true;
    };
  }, [recoveryToken]);

  useEffect(() => {
    const container =
      comparisonSectionsRef.current;

    if (!container) {
      return;
    }

    const sections =
      Array.from(
        container.querySelectorAll<HTMLElement>(
          "[data-comparison-section]",
        ),
      );

    if (sections.length === 0) {
      return;
    }

    function updateActiveSection() {
      const stickyHeader =
        document.querySelector<HTMLElement>(
          ".comparison-column-labels",
        );

      const headerOffset =
        (stickyHeader?.offsetHeight ??
          60) + 12;

      let activeSection =
        sections[0];

      for (const section of sections) {
        const sectionTop =
          section.getBoundingClientRect()
            .top;

        if (
          sectionTop <=
          headerOffset
        ) {
          activeSection = section;
        } else {
          break;
        }
      }

      const nextTitle =
        activeSection.dataset
          .comparisonSection;

      if (nextTitle) {
        setActiveSectionTitle(
          nextTitle,
        );
      }
    }

    updateActiveSection();

    window.addEventListener(
      "scroll",
      updateActiveSection,
      {
        passive: true,
      },
    );

    window.addEventListener(
      "resize",
      updateActiveSection,
    );

    return () => {
      window.removeEventListener(
        "scroll",
        updateActiveSection,
      );

      window.removeEventListener(
        "resize",
        updateActiveSection,
      );
    };
  }, [comparison]);

  if (isLoading) {
    return (
      <main className="comparison-status-page">
        <section className="comparison-waiting-card">
          <p className="comparison-eyebrow">
            Negotiation Comparison
          </p>

          <h1>
            Loading comparison...
          </h1>

          <p>
            Please wait while both
            questionnaires are securely
            compared.
          </p>
        </section>
    
      </main>
    );
  }

  if (
    error ||
    !comparison
  ) {
    return (
      <main className="comparison-status-page">
        <section className="comparison-waiting-card">
          <p className="comparison-eyebrow">
            Negotiation Comparison
          </p>

          <h1>
            The comparison could not be
            opened
          </h1>

          <p>
            {error ||
              "The comparison was unavailable."}
          </p>

          <button
            type="button"
            onClick={
              onBackToSummary
            }
          >
            Return to Summary
          </button>
        </section>
      </main>
    );
  }

  const bothComplete =
    comparison.participantAComplete &&
    comparison.participantBComplete;

  if (!bothComplete) {
    return (
      <main className="comparison-status-page">
        <section className="comparison-waiting-card">
          <p className="comparison-eyebrow">
            Negotiation Comparison
          </p>

          <h1>
            Waiting for both
            questionnaires
          </h1>

          <div className="comparison-completion-list">
            <p>
              <span aria-hidden="true">
                {comparison
                  .participantAComplete
                  ? "✓"
                  : "○"}
              </span>

              Participant A{" "}
              {comparison
                .participantAComplete
                ? "is complete"
                : "has not finished"}
            </p>

            <p>
              <span aria-hidden="true">
                {comparison
                  .participantBComplete
                  ? "✓"
                  : "○"}
              </span>

              Participant B{" "}
              {comparison
                .participantBComplete
                ? "is complete"
                : "has not finished"}
            </p>
          </div>

          <p>
            The other participant’s
            answers remain private until
            both questionnaires are
            complete.
          </p>

          <button
            type="button"
            onClick={
              onBackToSummary
            }
          >
            Return to Summary
          </button>
        </section>
      </main>
    );
  }

  const participantA =
    (comparison.participantAResponses ??
      {}) as SavedParticipantResponses;

  const participantB =
    (comparison.participantBResponses ??
      {}) as SavedParticipantResponses;

  const participantAName =
    participantA.onboardingData
      ?.nickname.trim() ||
    "Participant A";

  const participantBName =
    participantB.onboardingData
      ?.nickname.trim() ||
    "Participant B";

  return (
    <main className="comparison-page">
      <header className="comparison-header">
        <button
          type="button"
          className="comparison-back-button comparison-screen-only"
          onClick={
            onBackToSummary
          }
        >
          ← Return to Summary
        </button>

        <p className="comparison-eyebrow">
          Desert Rope Education
          Collective
        </p>

        <h1>
          Negotiation Comparison
        </h1>

        {comparison.negotiationName && (
          <p>
            <strong>
              {
                comparison.negotiationName
              }
            </strong>
          </p>
        )}

        <section
          className="comparison-negotiation-details"
          aria-label="Negotiation details"
        >
          <div className="comparison-detail-row">
            <span>
              Reference ID
            </span>

            <strong>
              {comparison.publicId}
            </strong>
          </div>

          {(comparison.sceneDate ||
            comparison.sceneDateUnknown) && (
            <div className="comparison-detail-row">
              <span>
                Scene Date
              </span>

              <strong>
                {comparison.sceneDateUnknown
                  ? "Not decided"
                  : comparison.sceneDate
                    ? formatSceneDate(
                        comparison.sceneDate,
                      )
                    : ""}
              </strong>
            </div>
          )}
        </section>

        <div className="comparison-actions comparison-screen-only">
          <button
            type="button"
            className="comparison-action-button comparison-action-button--primary"
            onClick={handlePrint}
          >
            Print Comparison
          </button>

          <button
            type="button"
            className="comparison-action-button"
            onClick={handlePrint}
          >
            Save as PDF
          </button>
        </div>

        <p className="comparison-introduction">
          Responses are shown side by
          side. Rows where neither person
          answered are hidden. When only
          one person answered, the other
          side shows “No response.”
        </p>
      </header>

      <div className="comparison-column-labels">
        <div>
          {activeSectionTitle}
        </div>

        <div>
          {participantAName}
        </div>

        <div>
          {participantBName}
        </div>
      </div>

      <div
        className="comparison-section-list"
        ref={comparisonSectionsRef}
      >
        <div
          className="comparison-section-wrapper"
          data-comparison-section="About You"
        >
          <AboutYouComparison
            participantA={
              participantA.onboardingData
            }
            participantB={
              participantB.onboardingData
            }
          />
        </div>

        <div
          className="comparison-section-wrapper"
          data-comparison-section="Scene Goals"
        >
          <ExperienceComparison
            participantA={
              participantA.experienceGoals
            }
            participantB={
              participantB.experienceGoals
            }
          />
        </div>

        <div
          className="comparison-section-wrapper"
          data-comparison-section="Activities"
        >
          <ActivitiesComparison
            participantA={
              participantA.activities
            }
            participantB={
              participantB.activities
            }
          />
        </div>

        <div
          className="comparison-section-wrapper"
          data-comparison-section="Health & Safety"
        >
          <HealthComparison
            participantA={
              participantA.healthSafety
            }
            participantB={
              participantB.healthSafety
            }
          />
        </div>

        <div
          className="comparison-section-wrapper"
          data-comparison-section="Body Map"
        >
          <BodyMapComparison
            participantA={
              participantA.bodyMap
            }
            participantB={
              participantB.bodyMap
            }
          />
        </div>

        <div
          className="comparison-section-wrapper"
          data-comparison-section="Communication & Boundaries"
        >
          <CommunicationComparison
            participantA={
              participantA.communication
            }
            participantB={
              participantB.communication
            }
          />
        </div>

        <div
          className="comparison-section-wrapper"
          data-comparison-section="Aftercare"
        >
          <AftercareComparison
            participantA={
              participantA.aftercare
            }
            participantB={
              participantB.aftercare
            }
          />
        </div>
      </div>
<PrintComparison
  publicId={comparison.publicId}
  negotiationName={
    comparison.negotiationName
  }
  sceneDate={
    comparison.sceneDate
  }
  sceneDateUnknown={
    comparison.sceneDateUnknown
  }
  participantAName={
    participantAName
  }
  participantBName={
    participantBName
  }
  participantA={
    participantA
  }
  participantB={
    participantB
  }
/>
    </main>
  );
}