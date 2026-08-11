import Button from "@/shared/ui/button";
import {
  OnboardingLayout,
} from "../shared";
import type {
  OnboardingData,
} from "../shared";

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
<p>
  <strong>You can pause at any time.</strong> Your progress is saved whenever you continue to another page or return to your summary. You can safely close this tab and reopen the negotiation later using your Personal Link or Reference ID and password.
</p>
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