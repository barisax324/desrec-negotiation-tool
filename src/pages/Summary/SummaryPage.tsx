import "./SummaryPage.css";

import type { ExperienceGoalsData } from "../Questionnaire/ExperienceGoals/ExperienceGoals";
import type { ActivityResponses } from "../Questionnaire/Activities/types";
import type { CommunicationFormData } from "../Communication/CommunicationPage";
import type { HealthSafetyResponses } from "../HealthSafety/types";
import type { AftercareResponses } from "../../components/Aftercare/AftercarePage";

import ExperienceSummary from "./Components/ExperienceSummary";
import ActivitiesSummary from "./Components/ActivitiesSummary";
import HealthSummary from "./Components/HealthSummary";
import BodyMapSummary from "./Components/BodyMapSummary";
import CommunicationSummary from "./Components/CommunicationSummary";
import AftercareSummary from "./Components/AftercareSummary";
import { APP_VERSION } from "../../version";

export type SummaryEditSection =
  | "experience-goals"
  | "activities"
  | "health-safety"
  | "communication"
  | "aftercare";

interface SummaryPageProps {
  experienceGoals: ExperienceGoalsData;
  activityResponses: ActivityResponses;
  healthSafetyResponses: HealthSafetyResponses | null;
  communicationResponses: CommunicationFormData | null;
  aftercareResponses: AftercareResponses | null;

  onEditSection: (
    section: SummaryEditSection,
  ) => void;

  onViewComparison: () => void;
}

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
  experienceGoals,
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
      "desrec.sceneDateUnknown",
    ) === "true";

  const participantRole =
    sessionStorage.getItem(
      "desrec.currentParticipantRole",
    ) ?? "";

  function handlePrint() {
    window.print();
  }

  function handleEditSelection(
    value: string,
  ) {
    const section =
      value as SummaryEditSection;

    if (
      section !== "experience-goals" &&
      section !== "activities" &&
      section !== "health-safety" &&
      section !== "communication" &&
      section !== "aftercare"
    ) {
      return;
    }

    onEditSection(section);
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

            {negotiationName && (
              <div className="summary-detail-row">
                <span>
                  Negotiation
                </span>

                <strong>
                  {negotiationName}
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

            {(sceneDate ||
              sceneDateUnknown) && (
              <div className="summary-detail-row">
                <span>
                  Scene Date
                </span>

                <strong>
                  {sceneDateUnknown
                    ? "Not decided"
                    : formatSceneDate(
                        sceneDate,
                      )}
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

          <label className="summary-edit-select">
            <span className="summary-edit-select__label">
              Edit Responses
            </span>

            <select
              defaultValue=""
              aria-label="Choose a section to edit"
              onChange={(event) => {
                handleEditSelection(
                  event.target.value,
                );

                event.currentTarget.value =
                  "";
              }}
            >
              <option
                value=""
                disabled
              >
                Choose a section
              </option>

              <option value="experience-goals">
                Experience Goals
              </option>

              <option value="activities">
                Activities
              </option>

              <option value="health-safety">
                Health &amp; Safety
              </option>

              <option value="communication">
                Communication &amp;
                Boundaries
              </option>

              <option value="aftercare">
                Aftercare
              </option>
            </select>
          </label>
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
            <h2>
              Experience Goals
            </h2>

            <div className="summary-section-content">
              <ExperienceSummary
                data={experienceGoals}
              />
            </div>
          </section>

          <section className="summary-section">
            <h2>
              Activities
            </h2>

            <div className="summary-section-content">
              <ActivitiesSummary
                responses={
                  activityResponses
                }
              />
            </div>
          </section>

          <section className="summary-section">
            <h2>
              Health &amp; Safety
            </h2>

            <div className="summary-section-content">
              <HealthSummary
                responses={
                  healthSafetyResponses
                }
              />

              <div className="summary-response-block">
                <h3>
                  Body Map
                </h3>

                <BodyMapSummary />
              </div>
            </div>
          </section>

          <section className="summary-section">
            <h2>
              Communication &amp;
              Boundaries
            </h2>

            <div className="summary-section-content">
              <CommunicationSummary
                responses={
                  communicationResponses
                }
              />
            </div>
          </section>

          <section className="summary-section">
            <h2>
              Aftercare
            </h2>

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