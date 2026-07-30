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

interface SummaryPageProps {
  experienceGoals: ExperienceGoalsData;
  activityResponses: ActivityResponses;
  healthSafetyResponses: HealthSafetyResponses | null;
  communicationResponses: CommunicationFormData | null;
  aftercareResponses: AftercareResponses | null;
  onEditResponses: () => void;
}

export default function SummaryPage({
  experienceGoals,
  activityResponses,
  healthSafetyResponses,
  communicationResponses,
  aftercareResponses,
  onEditResponses,
}: SummaryPageProps) {
  function handlePrint() {
    window.print();
  }

  return (
    <main className="summary-page">
      <article className="summary-document">
        <header className="summary-header">
          <div className="summary-complete-label">
            <span aria-hidden="true">✓</span>
            Questionnaire Complete
          </div>

          <p className="summary-organization">
            Desert Rope Education Collective
          </p>

          <h1>Your Negotiation Summary</h1>

          <p className="summary-introduction">
            Thank you for taking the time to thoughtfully consider your
            preferences, boundaries, and needs.
          </p>

          <p className="summary-introduction">
            Review this summary before discussing it with your partner.
          </p>

          <p className="summary-principle">
            The most effective scenes begin with thoughtful negotiation.
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
            onClick={onEditResponses}
          >
            Edit Responses
          </button>
        </div>

        <aside className="summary-private-note">
          <strong>Your personal summary</strong>

          <p>
            Review the information below before sharing it. This summary is
            intended to support an in-person negotiation, not replace it.
          </p>
        </aside>

        <div className="summary-section-list">
          <section className="summary-section">
            <h2>Experience Goals</h2>

            <div className="summary-section-content">
              <ExperienceSummary data={experienceGoals} />
            </div>
          </section>

          <section className="summary-section">
            <h2>Activities</h2>

            <div className="summary-section-content">
              <ActivitiesSummary responses={activityResponses} />
            </div>
          </section>

          <section className="summary-section">
            <h2>Health &amp; Safety</h2>

            <div className="summary-section-content">
              <HealthSummary responses={healthSafetyResponses} />

              <div className="summary-response-block">
                <h3>Body Map</h3>
                <BodyMapSummary />
              </div>
            </div>
          </section>

          <section className="summary-section">
            <h2>Communication &amp; Boundaries</h2>

            <div className="summary-section-content">
              <CommunicationSummary responses={communicationResponses} />
            </div>
          </section>

          <section className="summary-section">
            <h2>Aftercare</h2>

            <div className="summary-section-content">
              <AftercareSummary responses={aftercareResponses} />
            </div>
          </section>
        </div>

        <div className="summary-edit-area summary-screen-only">
          <p>Need to change something?</p>

          <button
            type="button"
            className="summary-return-button"
            onClick={onEditResponses}
          >
            ← Return to Negotiation
          </button>
        </div>

        <footer className="summary-footer">
          <strong>Desert Rope Education Collective</strong>

          <p>
            <em>This questionnaire is a tool.</em>
            <br />
            <em>Negotiation is a conversation.</em>
          </p>

          <span>desrec.org</span>
        </footer>
      </article>
    </main>
  );
}