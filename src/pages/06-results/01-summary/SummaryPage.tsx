import "./SummaryPage.css";

import type {
  OnboardingData,
  OnboardingRole,
  ExperienceLevel,
} from "../../04-onboarding/shared";
import type {
  SceneGoalsData,
} from "../../05-questionnaire/01-scene-goals";
import type {
  ActivityResponses,
} from "../../05-questionnaire/02-activities";
import type {
  CommunicationFormData,
} from "../../05-questionnaire/04-communication-boundaries";
import type {
  HealthSafetyResponses,
} from "../../05-questionnaire/03-health-safety";
import type {
  AftercareResponses,
} from "../../05-questionnaire/05-aftercare";

import ExperienceSummary from "./components/ExperienceSummary";
import ActivitiesSummary from "./components/ActivitiesSummary";
import HealthSummary from "./components/HealthSummary";
import BodyMapSummary from "./components/BodyMapSummary";
import CommunicationSummary from "./components/CommunicationSummary";
import AftercareSummary from "./components/AftercareSummary";
import { APP_VERSION } from "@/version";

export type SummaryEditSection =
  | "scene-details"
  | "about-you"
  | "onboarding-experience"
  | "scene-goals"
  | "activities"
  | "health-safety"
  | "communication"
  | "aftercare";

interface SummaryPageProps {
  onboardingData: OnboardingData | null;
  sceneGoals: SceneGoalsData;
  activityResponses: ActivityResponses;
  healthSafetyResponses: HealthSafetyResponses | null;
  communicationResponses: CommunicationFormData | null;
  aftercareResponses: AftercareResponses | null;

  onEditSection: (
    section: SummaryEditSection,
  ) => void;

  onViewComparison: () => void;
}

const ROLE_LABELS: Record<OnboardingRole, string> = {
  top: "Top",
  bottom: "Bottom",
  switch: "Switch",
  observer: "Observer",
  facilitator: "Facilitator",
  unsure: "Unsure",
  other: "Other",
};

const EXPERIENCE_LABELS: Record<
  ExperienceLevel,
  string
> = {
  "first-time": "First time",
  learning: "Learning",
  "some-experience": "Some experience",
  comfortable: "Comfortable",
  "very-experienced": "Very experienced",
  "teaching-facilitating":
    "Teaching or facilitating",
};

function formatSceneDate(
  sceneDate: string,
): string {
  if (!sceneDate) {
    return "";
  }

  const parsedDate = new Date(
    `${sceneDate}T00:00:00`,
  );

  if (Number.isNaN(parsedDate.getTime())) {
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

export default function SummaryPage({
  onboardingData,
  sceneGoals,
  activityResponses,
  healthSafetyResponses,
  communicationResponses,
  aftercareResponses,
  onEditSection,
  onViewComparison,
}: SummaryPageProps) {
  const referenceId =
    sessionStorage.getItem(
      "desrec.publicId",
    ) ?? "";

  const negotiationName =
    sessionStorage.getItem(
      "desrec.negotiationName",
    ) ?? "";

  const sceneDate =
    sessionStorage.getItem(
      "desrec.sceneDate",
    ) ?? "";

  const sceneDateUnknown =
    sessionStorage.getItem(
      "desrec.sceneDateUndecided",
    ) === "true";

  const plannedActivities =
    sessionStorage.getItem(
      "desrec.plannedActivities",
    ) ?? "";

  const participantRole =
    sessionStorage.getItem(
      "desrec.currentParticipantRole",
    ) ?? "";

  function handlePrint() {
    window.print();
  }

  return (
    <main className="summary-page">
      <article className="summary-document">
        <header className="summary-header">
          <div className="summary-complete-label">
            <span aria-hidden="true">
              ✓
            </span>

            Questionnaire Complete
          </div>

          <p className="summary-organization">
            Desert Rope Education Collective
          </p>

          <h1>
            Your Negotiation Summary
          </h1>

          <section
            className="summary-negotiation-details"
            aria-label="Negotiation details"
          >
            {referenceId && (
              <div className="summary-detail-row">
                <span>
                  Reference ID
                </span>

                <strong>
                  {referenceId}
                </strong>
              </div>
            )}

            {participantRole && (
              <div className="summary-detail-row">
                <span>
                  Participant
                </span>

                <strong>
                  {participantRole}
                </strong>
              </div>
            )}
          </section>

          <p className="summary-introduction">
            Thank you for taking the time
            to thoughtfully consider your
            preferences, boundaries, and
            needs.
          </p>

          <p className="summary-introduction">
            Review this summary before
            discussing it with your partner.
          </p>

          <p className="summary-principle">
            The most effective scenes begin
            with thoughtful negotiation.
          </p>
        </header>

        <div className="summary-actions summary-screen-only">
          <button
            type="button"
            className="summary-button summary-button--primary"
            onClick={handlePrint}
          >
            Print Summary
          </button>

          <button
            type="button"
            className="summary-button"
            onClick={handlePrint}
          >
            Save as PDF
          </button>

          <button
            type="button"
            className="summary-button"
            onClick={onViewComparison}
          >
            View Comparison
          </button>
        </div>

        <aside className="summary-private-note">
          <strong>
            Your personal summary
          </strong>

          <p>
            Review the information below
            before sharing it. This summary
            is intended to support an
            in-person negotiation, not
            replace it.
          </p>
        </aside>

        <div className="summary-section-list">
          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>Scene Details</h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "scene-details",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <div className="summary-response-block">
                <h3>Negotiation Name</h3>

                <p>
                  {negotiationName ||
                    "No name provided"}
                </p>
              </div>

              <div className="summary-response-block">
                <h3>Scene Date</h3>

                <p>
                  {sceneDateUnknown
                    ? "Not decided yet"
                    : sceneDate
                      ? formatSceneDate(
                          sceneDate,
                        )
                      : "No date provided"}
                </p>
              </div>

              <div className="summary-response-block">
                <h3>Planned Activities</h3>

                <p>
                  {plannedActivities ||
                    "No planned activities provided"}
                </p>
              </div>
            </div>
          </section>

          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>About You</h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "about-you",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <div className="summary-response-block">
                <h3>Name</h3>

                <p>
                  {onboardingData?.nickname ||
                    "No name provided"}
                </p>
              </div>

              <div className="summary-response-block">
                <h3>Planned Role</h3>

                <p>
                  {onboardingData?.role
                    ? onboardingData.role ===
                      "other"
                      ? onboardingData.otherRole ||
                        "Other"
                      : ROLE_LABELS[
                          onboardingData.role
                        ]
                    : "No role selected"}
                </p>
              </div>
            </div>
          </section>

          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>General Experience</h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "onboarding-experience",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <div className="summary-response-block">
                <h3>Experience Level</h3>

                <p>
                  {onboardingData?.experience
                    ? EXPERIENCE_LABELS[
                        onboardingData.experience
                      ]
                    : "No experience level selected"}
                </p>
              </div>
            </div>
          </section>

          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>
                Experience Goals
              </h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "scene-goals",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <ExperienceSummary
                data={sceneGoals}
              />
            </div>
          </section>

          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>Activities</h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "activities",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <ActivitiesSummary
                responses={
                  activityResponses
                }
              />
            </div>
          </section>

          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>
                Health &amp; Safety
              </h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "health-safety",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <HealthSummary
                responses={
                  healthSafetyResponses
                }
              />

              <div className="summary-response-block">
                <h3>Body Map</h3>

                <BodyMapSummary />
              </div>
            </div>
          </section>

          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>
                Communication &amp;
                Boundaries
              </h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "communication",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <CommunicationSummary
                responses={
                  communicationResponses
                }
              />
            </div>
          </section>

          <section className="summary-section">
            <div className="summary-section-heading">
              <h2>Aftercare</h2>

              <button
                type="button"
                className="summary-edit-button summary-screen-only"
                onClick={() =>
                  onEditSection(
                    "aftercare",
                  )
                }
              >
                Edit
              </button>
            </div>

            <div className="summary-section-content">
              <AftercareSummary
                responses={
                  aftercareResponses
                }
              />
            </div>
          </section>
        </div>

        <footer className="summary-footer">
          {referenceId && (
            <p className="summary-footer-reference">
              Reference ID:{" "}
              <strong>
                {referenceId}
              </strong>
            </p>
          )}

          <strong>
            Desert Rope Education Collective
          </strong>

          <p>
            <em>
              This questionnaire is a tool.
            </em>

            <br />

            <em>
              Negotiation is a conversation.
            </em>
          </p>

          <br />
          <br />

          <p>
            Version {APP_VERSION}
          </p>

          <p className="summary-feedback">
            Found a bug or have feedback?
            <br />

            <a href="mailto:desrecphx@gmail.com">
              desrecphx@gmail.com
            </a>
          </p>

          <span>
            desrec.org
          </span>
        </footer>
      </article>
    </main>
  );
}

