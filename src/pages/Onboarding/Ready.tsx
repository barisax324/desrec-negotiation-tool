import Button from "../../ui/Button";
import OnboardingLayout from "./OnboardingLayout";
import type { OnboardingData } from "./types";

interface ReadyProps {
  data: OnboardingData;
  back: () => void;
  next: () => void;
}

function Ready({
  back,
  next,
}: ReadyProps) {
  return (
    <OnboardingLayout
      title="Ready"
      progress={8}
    >
      <p>
        You're all set. When you're ready, begin your
        negotiation questionnaire.
      </p>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginTop: "2rem",
        }}
      >
        <Button onClick={back}>
          Back
        </Button>

        <Button onClick={next}>
          Begin Questionnaire
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export default Ready;