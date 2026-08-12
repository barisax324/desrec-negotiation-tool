import ActivitiesRouterPage from "./questionnaire-pages/ActivitiesRouterPage";
import SceneGoalsRouterPage from "./questionnaire-pages/SceneGoalsRouterPage";
import HealthSafetyRouterPage from "./questionnaire-pages/HealthSafetyRouterPage";
import CommunicationRouterPage from "./questionnaire-pages/CommunicationRouterPage";
import AftercareRouterPage from "./questionnaire-pages/AftercareRouterPage";
import SummaryRouterPage from "./questionnaire-pages/SummaryRouterPage";
import ComparisonRouterPage from "./questionnaire-pages/ComparisonRouterPage";

import type {QuestionnaireRouterProps,} from "./questionnaire-pages/questionnaireRouterTypes";
import type {QuestionnairePage,} from "../types";

function QuestionnaireRouter({
  page,
  recoveryCredential,
  saveError,
  editingSection,

  onboardingData,
  sceneGoals,
  activityResponses,
  healthSafetyResponses,
  communicationResponses,
  aftercareResponses,

  updateSceneGoals,
  setHasStarted,
  setOnboardingStartPage,
  saveAndMove,
  returnToSummary,
  displayPage,

  saveActivitiesLocally,
  saveHealthSafetyLocally,
  saveCommunicationLocally,
  saveAftercareLocally,

  beginEditingSection,
  readBodyMap,
}: QuestionnaireRouterProps) {
  const savingMessage = saveError ? (
    <div
      className="questionnaire-save-error"
      role="alert"
    >
      {saveError}
    </div>
  ) : null;

  function savePage(
    nextPage: QuestionnairePage,
  ) {
    void saveAndMove(nextPage);
  }

  switch (page) {
    case "scene-goals":
      return (
        <SceneGoalsRouterPage
          savingMessage={
            savingMessage
          }
          sceneGoals={sceneGoals}
          editingSection={
            editingSection
          }
          updateSceneGoals={
            updateSceneGoals
          }
          setHasStarted={
            setHasStarted
          }
          setOnboardingStartPage={
            setOnboardingStartPage
          }
          returnToSummary={
            returnToSummary
          }
          saveAndMove={
            saveAndMove
          }
        />
      );

    case "activities":
      return (
        <ActivitiesRouterPage
          savingMessage={
            savingMessage
          }
          activityResponses={
            activityResponses
          }
          editingSection={
            editingSection
          }
          saveActivitiesLocally={
            saveActivitiesLocally
          }
          returnToSummary={
            returnToSummary
          }
          saveAndMove={
            saveAndMove
          }
          savePage={savePage}
        />
      );

    case "health-safety":
      return (
        <HealthSafetyRouterPage
          savingMessage={
            savingMessage
          }
          healthSafetyResponses={
            healthSafetyResponses
          }
          editingSection={
            editingSection
          }
          saveHealthSafetyLocally={
            saveHealthSafetyLocally
          }
          returnToSummary={
            returnToSummary
          }
          saveAndMove={
            saveAndMove
          }
          savePage={savePage}
          readBodyMap={
            readBodyMap
          }
        />
      );

    case "communication":
      return (
        <CommunicationRouterPage
          savingMessage={
            savingMessage
          }
          communicationResponses={
            communicationResponses
          }
          editingSection={
            editingSection
          }
          saveCommunicationLocally={
            saveCommunicationLocally
          }
          returnToSummary={
            returnToSummary
          }
          saveAndMove={
            saveAndMove
          }
          savePage={savePage}
        />
      );

    case "aftercare":
      return (
        <AftercareRouterPage
          savingMessage={
            savingMessage
          }
          aftercareResponses={
            aftercareResponses
          }
          editingSection={
            editingSection
          }
          saveAftercareLocally={
            saveAftercareLocally
          }
          returnToSummary={
            returnToSummary
          }
          saveAndMove={
            saveAndMove
          }
          savePage={savePage}
        />
      );

    case "summary":
      return (
        <SummaryRouterPage
          savingMessage={
            savingMessage
          }
          onboardingData={
            onboardingData
          }
          sceneGoals={
            sceneGoals
          }
          activityResponses={
            activityResponses
          }
          healthSafetyResponses={
            healthSafetyResponses
          }
          communicationResponses={
            communicationResponses
          }
          aftercareResponses={
            aftercareResponses
          }
          beginEditingSection={
            beginEditingSection
          }
          onViewComparison={() => {
            displayPage("comparison");
          }}
        />
      );

    case "comparison":
      return (
        <ComparisonRouterPage
          recoveryCredential={
            recoveryCredential
          }
          onBackToSummary={() => {
            displayPage("summary");
          }}
        />
      );

    default:
      return null;
  }
}

export default QuestionnaireRouter;

