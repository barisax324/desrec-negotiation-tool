import Button from "../../../shared/ui/button";
import { OnboardingLayout, ONBOARDING_PROGRESS,} from "../shared";

interface WelcomeProps {
  back: () => void;
  next: () => void;
}

function Welcome({
  back,
  next,
}: WelcomeProps) {
  return (
    <OnboardingLayout
      title="Welcome"
      progress={ONBOARDING_PROGRESS.welcome}
    >
      <div className="participant-welcome-box">
        <p>
          <strong>
            You're about to complete your side of a shared
            negotiation.
          </strong>
        </p>

        <p>
          Your responses are private until both participants have
          finished. Once both people submit, you'll receive a
          comparison that highlights shared interests, discussion
          topics, and boundaries.
        </p>

        <p className="participant-reminder">
          There are no right or wrong answers. Answer based on how
          you feel right now.
        </p>
      </div>

      <section className="participant-principles">
        <h2>Key Principles</h2>

        <article className="participant-principle-card">
          <span
            className="participant-principle-icon"
            aria-hidden="true"
          >
            ◇
          </span>

          <div>
            <h3>Consent</h3>

            <p>
              This tool supports conversation. It does not replace
              verbal communication or create consent.
            </p>
          </div>
        </article>

        <article className="participant-principle-card">
          <span
            className="participant-principle-icon"
            aria-hidden="true"
          >
            ▢
          </span>

          <div>
            <h3>Privacy</h3>

            <p>
              Your responses are only available through your secure
              participant link. The negotiation will be permanently
              deleted when it expires.
            </p>
          </div>
        </article>

        <article className="participant-principle-card">
          <span
            className="participant-principle-icon"
            aria-hidden="true"
          >
            ↻
          </span>

          <div>
            <h3>Flexibility</h3>

            <p>
              Your answers describe today. You can always change
              your mind before, during, or after a scene.
            </p>
          </div>
        </article>
      </section>

      <div className="participant-actions">
        <Button
          variant="secondary"
          onClick={back}
        >
          ← Back
        </Button>

        <Button onClick={next}>
          Continue
          <span aria-hidden="true">
            {" "}
            →
          </span>
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export default Welcome;