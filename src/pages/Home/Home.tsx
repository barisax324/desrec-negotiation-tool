import { useNavigate } from "react-router-dom";
import "./Home.css";

function Home() {
  const navigate = useNavigate();

  function handleCreateNegotiation() {
  navigate("/create-pin");
}

function handleJoinNegotiation() {
  navigate("/join-pin");
}

  return (
    <main className="home-page">
      <header className="home-topbar">
        <div className="home-brand">
          <span className="home-brand-mark">◇</span>

          <div>
            <p className="home-brand-name">DESREC</p>
            <p className="home-brand-tagline">
              Learn. Tie. Connect.
            </p>
          </div>
        </div>

        <span className="home-status">Private</span>
      </header>

      <section className="home-hero">
        <div className="home-logo-mark" aria-hidden="true">
          ◈
        </div>

        <p className="home-eyebrow">DESREC</p>

        <h1>Desert Rope Education Collective</h1>

        <span className="home-tool-label">
          Negotiation Tool
        </span>

        <p className="home-introduction">
          A guided conversation for discussing interests,
          boundaries, communication, and aftercare.
        </p>
      </section>

      <section className="home-content">
        <article className="home-card home-welcome-card">
          <p className="home-card-eyebrow">Start with a conversation</p>

          <h2>Negotiation should not feel like paperwork.</h2>

          <p>
            This tool helps two people communicate clearly,
            privately, and at their own pace. Each person answers
            independently before reviewing the completed
            negotiation together.
          </p>
        </article>

        <section
          className="home-benefits"
          aria-label="Privacy features"
        >
          <article className="home-benefit-card">
            <span className="home-benefit-icon" aria-hidden="true">
              ◎
            </span>

            <div>
              <h3>No accounts</h3>
              <p>Zero sign-ups or identity linking required.</p>
            </div>
          </article>

          <article className="home-benefit-card">
            <span className="home-benefit-icon" aria-hidden="true">
              ♙
            </span>

            <div>
              <h3>No permanent profiles</h3>
              <p>
                Your answers are connected only to this
                negotiation.
              </p>
            </div>
          </article>

          <article className="home-benefit-card">
            <span className="home-benefit-icon" aria-hidden="true">
              ♢
            </span>

            <div>
              <h3>Automatic deletion</h3>
              <p>
                Data self-destructs after 24h, 7d or 30d per creator setting.
              </p>
            </div>
          </article>
        </section>

        <article className="home-card home-actions-card">
          <p className="home-card-eyebrow">Private and collaborative</p>

          <h2>Ready to begin?</h2>

          <p>
            Create a new negotiation or use an invitation link to
            join one that has already been started.
          </p>

          <div className="home-actions">
            <button
              type="button"
              className="home-button home-button-primary"
              onClick={handleCreateNegotiation}
            >
              Create New Negotiation
              <span aria-hidden="true">→</span>
            </button>

            <button
              type="button"
              className="home-button home-button-secondary"
              onClick={handleJoinNegotiation}
            >
              Join Existing Negotiation
            </button>
          </div>

          <div className="home-secondary-links">
            <button type="button">How it works</button>
            <span aria-hidden="true">•</span>
            <button type="button">Privacy</button>
          </div>
        </article>

        <section className="home-how-it-works">
          <p className="home-section-eyebrow">
            Simple three-step process
          </p>

          <h2>How it works</h2>

          <div className="home-step-list">
            <article className="home-step-card">
              <span className="home-step-number">1</span>

              <div>
                <h3>Create and share</h3>
                <p>
                  Start a negotiation and securely share the
                  invitation with the other participant.
                </p>
              </div>
            </article>

            <article className="home-step-card">
              <span className="home-step-number">2</span>

              <div>
                <h3>Answer independently</h3>
                <p>
                  Each participant answers privately without seeing
                  the other person’s responses.
                </p>
              </div>
            </article>

            <article className="home-step-card">
              <span className="home-step-number">3</span>

              <div>
                <h3>Compare and talk</h3>
                <p>
                  Once both participants finish, review the answers
                  side by side and continue the conversation.
                </p>
              </div>
            </article>
          </div>
        </section>

        <article className="home-privacy-card">
          <div className="home-privacy-heading">
            <span aria-hidden="true">♡</span>

            <div>
              <p className="home-card-eyebrow">Privacy</p>
              <h2>Your negotiation belongs to you.</h2>
            </div>
          </div>

          <p>
            This application is designed with privacy in mind.
            Participants use unique access information rather than a
            permanent account.
          </p>

          <p>
            DesREC, the event host and application administrators do not
            have access to view the contents of your negotiation through
            the application.
          </p>

          <p>
            Your access link and recovery information should be
            treated like a password. Anyone who has them may be able
            to access the negotiation. 
          </p>

          <div className="home-privacy-note">
            Private does not mean anonymous. Do not include
            information you would not want the other participant to
            see.
          </div>
        </article>
      </section>

      <footer className="home-footer">
        <div className="home-footer-mark" aria-hidden="true">
          ◇
        </div>

        <p className="home-footer-name">
          Desert Rope Education Collective
        </p>

        <p>
          Promoting safe, inclusive, consent-conscious rope art 
          and kink education in the Southwest.
        </p>

        <div className="home-footer-links">
          <button type="button">About DesREC</button>
          <button type="button">Privacy</button>
          <button type="button">Safety</button>
        </div>
      </footer>
    </main>
  );
}

export default Home;