import "./Start.css";

import { useEffect, useState } from "react";
import {
  Link,
  useSearchParams,
} from "react-router-dom";

import Activities from "../Questionnaire/Activities/Activities";
import Onboarding from "../Onboarding";
import ExperienceGoals from "../Questionnaire/ExperienceGoals/ExperienceGoals";
import HealthSafety from "../HealthSafety/HealthSafety";
import CommunicationPage from "../Communication/CommunicationPage";
import AftercarePage from "../../components/Aftercare/AftercarePage";
import SummaryPage from "../Summary/SummaryPage";

import type { HealthSafetyResponses } from "../HealthSafety/types";
import type { CommunicationFormData } from "../Communication/CommunicationPage";
import type { ExperienceGoalsData } from "../Questionnaire/ExperienceGoals/ExperienceGoals";
import type { OnboardingData } from "../Onboarding/types";
import type { AftercareResponses } from "../../components/Aftercare/AftercarePage";
import type { ActivityResponses } from "../Questionnaire/Activities/types";

import { openNegotiation } from "../../services/negotiation/openNegotiation";

type QuestionnairePage =
  | "experience-goals"
  | "activities"
  | "health-safety"
  | "communication"
  | "aftercare"
  | "summary";

const DEFAULT_EXPERIENCE_GOALS: ExperienceGoalsData = {
  goals: [],
  customGoals: [],
  notes: "",
};

function readStoredResponse(
  storageKey: string,
): unknown {
  const savedResponse =
    sessionStorage.getItem(storageKey);

  if (!savedResponse) {
    return null;
  }

  try {
    return JSON.parse(savedResponse) as unknown;
  } catch {
    return null;
  }
}

function Start() {
 
 const [activityResponses, setActivityResponses] =
  useState<ActivityResponses>({}); const [searchParams] = useSearchParams();

  const [isLoading, setIsLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [hasStarted, setHasStarted] =
    useState(false);

const [page, setPage] =
  useState<QuestionnairePage>(
    "experience-goals",
  );

  const [experienceGoals, setExperienceGoals] =
    useState<ExperienceGoalsData>(
      DEFAULT_EXPERIENCE_GOALS,
    );

const [
  communicationResponses,
  setCommunicationResponses,
] = useState<CommunicationFormData | null>(null);

const [
  aftercareResponses,
  setAftercareResponses,
] = useState<AftercareResponses | null>(null);

const [
  healthSafetyResponses,
  setHealthSafetyResponses,
] = useState<HealthSafetyResponses | null>(
  null,
);

  const token =
    searchParams.get("t")?.trim() ?? "";

  useEffect(() => {
    let isCancelled = false;

    async function loadNegotiation() {
      setIsLoading(true);
      setLoadError("");

      if (!token) {
        setLoadError(
          "This personal link is incomplete. Please use the full link created for this negotiation.",
        );

        setIsLoading(false);
        return;
      }

      try {
        const result =
          await openNegotiation(token);

        if (isCancelled) {
          return;
        }

        if (result.participantRole !== "A") {
          setLoadError(
            "This link does not belong to Participant A.",
          );

          return;
        }

        sessionStorage.setItem(
          "desrec.activeAccessToken",
          token,
        );

        sessionStorage.setItem(
          "desrec.currentParticipantRole",
          result.participantRole,
        );

        sessionStorage.setItem(
          "desrec.negotiationStatus",
          result.negotiationStatus,
        );

        if (result.negotiationName) {
          sessionStorage.setItem(
            "desrec.negotiationName",
            result.negotiationName,
          );
        }

        if (result.expiresAt) {
          sessionStorage.setItem(
            "desrec.expiresAt",
            result.expiresAt,
          );
        }

        const onboardingWasCompleted =
          sessionStorage.getItem(
            `desrec.onboardingComplete.${token}`,
          ) === "true";

        const savedExperienceGoals =
          sessionStorage.getItem(
            `desrec.experienceGoals.${token}`,
          );

        if (savedExperienceGoals) {
          try {
            setExperienceGoals(
              JSON.parse(
                savedExperienceGoals,
              ) as ExperienceGoalsData,
            );
          } catch {
            setExperienceGoals(
              DEFAULT_EXPERIENCE_GOALS,
            );
          }
        }

        const savedCommunication =
          readStoredResponse(
            `desrec.communication.${token}`,
          );

if (savedCommunication) {
  setCommunicationResponses(
    savedCommunication as CommunicationFormData,
  );
}

        const savedAftercare =
          readStoredResponse(
            `desrec.aftercare.${token}`,
          );

        if (savedAftercare) {
          setAftercareResponses(
            savedAftercare as AftercareResponses,
          );
        }

        setHasStarted(
          onboardingWasCompleted,
        );
      } catch (error) {
        if (isCancelled) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "The negotiation could not be opened.",
        );
      } finally {
        if (!isCancelled) {
          setIsLoading(false);
        }
      }
    }

    void loadNegotiation();

    return () => {
      isCancelled = true;
    };
  }, [token]);

  function scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

function moveToPage(
  nextPage: QuestionnairePage,
) {
  setPage(nextPage);
  scrollToTop();
}

  function handleOnboardingComplete(
    onboardingData: OnboardingData,
  ) {
    sessionStorage.setItem(
      `desrec.onboardingComplete.${token}`,
      "true",
    );

    sessionStorage.setItem(
      `desrec.onboardingData.${token}`,
      JSON.stringify(onboardingData),
    );

    setHasStarted(true);
    moveToPage("experience-goals");
  }

  function updateExperienceGoals(
    updates: Partial<ExperienceGoalsData>,
  ) {
    setExperienceGoals((currentData) => {
      const updatedData = {
        ...currentData,
        ...updates,
      };

      sessionStorage.setItem(
        `desrec.experienceGoals.${token}`,
        JSON.stringify(updatedData),
      );

      return updatedData;
    });
  }

  function returnToOnboarding() {
    setHasStarted(false);
    scrollToTop();
  }

  if (isLoading) {
    return (
      <main className="questionnaire-loading">
        <h1>Opening your negotiation...</h1>

        <p>
          Please wait while your private link is
          verified.
        </p>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="questionnaire-error">
        <h1>
          This negotiation could not be opened
        </h1>

        <p>{loadError}</p>

        <p>
          The link may be incomplete, invalid, or
          expired.
        </p>

        <p>
          <Link to="/recover">
            Recover My Personal Link
          </Link>
        </p>

        <p>
          <Link to="/">Return Home</Link>
        </p>
      </main>
    );
  }

  if (!hasStarted) {
    return (
      <Onboarding
        onComplete={handleOnboardingComplete}
      />
    );
  }

  if (page === "experience-goals") {
    return (
      <ExperienceGoals
        data={experienceGoals}
        updateData={updateExperienceGoals}
        back={returnToOnboarding}
        next={() =>
          moveToPage("activities")
        }
      />
    );
  }

if (page === "activities") {
  return (
    <Activities
      back={() =>
        moveToPage("experience-goals")
      }
      next={(responses) => {
        setActivityResponses(responses);

        console.log(
          "Activity responses:",
          responses,
        );

        moveToPage("health-safety");
      }}
    />
  );
}

  if (page === "health-safety") {
    return (
<HealthSafety
  back={() =>
    moveToPage("activities")
  }
  next={(responses) => {
    setHealthSafetyResponses(
      responses,
    );

    sessionStorage.setItem(
      `desrec.healthSafety.${token}`,
      JSON.stringify(responses),
    );

    moveToPage("communication");
  }}
/>
    );
  }

  if (page === "communication") {
    return (
      <CommunicationPage
        onBack={() =>
          moveToPage("health-safety")
        }
        onContinue={(responses) => {
          setCommunicationResponses(
            responses,
          );

          sessionStorage.setItem(
           "communicationResponses",
            JSON.stringify(responses),
          );

          moveToPage("aftercare");
        }}
      />
    );
  }

if (page === "aftercare") {
  return (
    <AftercarePage
      onBack={() =>
        moveToPage("communication")
      }
onContinue={(
  responses: AftercareResponses,
) => {
  setAftercareResponses(
    responses,
  );

  sessionStorage.setItem(
    `desrec.aftercare.${token}`,
    JSON.stringify(responses),
  );

  moveToPage("summary");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
}}
    />
  );
}

if (page === "summary") {
  return (
<SummaryPage
  experienceGoals={experienceGoals}
  activityResponses={activityResponses}
  healthSafetyResponses={healthSafetyResponses}
  communicationResponses={communicationResponses}
  aftercareResponses={aftercareResponses}
  onEditResponses={() => moveToPage("experience-goals")}/>  );
}

return null;
}

export default Start;