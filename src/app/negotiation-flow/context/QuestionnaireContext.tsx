import {
  createContext,
  useContext,
  useState,
  type ReactNode,
} from "react";

interface QuestionnaireData {
  activities: Record<string, unknown>;
  healthSafety: Record<string, unknown>;
}

interface QuestionnaireContextValue {
  questionnaire: QuestionnaireData;
  updateActivities: (
    activities: QuestionnaireData["activities"],
  ) => void;
  updateHealthSafety: (
    healthSafety: QuestionnaireData["healthSafety"],
  ) => void;
}

const QuestionnaireContext =
  createContext<QuestionnaireContextValue | null>(
    null,
  );

interface QuestionnaireProviderProps {
  children: ReactNode;
}

export function QuestionnaireProvider({
  children,
}: QuestionnaireProviderProps) {
  const [questionnaire, setQuestionnaire] =
    useState<QuestionnaireData>({
      activities: {},
      healthSafety: {},
    });

  function updateActivities(
    activities: QuestionnaireData["activities"],
  ) {
    setQuestionnaire((current) => ({
      ...current,
      activities,
    }));
  }

  function updateHealthSafety(
    healthSafety: QuestionnaireData["healthSafety"],
  ) {
    setQuestionnaire((current) => ({
      ...current,
      healthSafety,
    }));
  }

  return (
    <QuestionnaireContext.Provider
      value={{
        questionnaire,
        updateActivities,
        updateHealthSafety,
      }}
    >
      {children}
    </QuestionnaireContext.Provider>
  );
}

export function useQuestionnaire() {
  const context = useContext(
    QuestionnaireContext,
  );

  if (!context) {
    throw new Error(
      "useQuestionnaire must be used inside QuestionnaireProvider",
    );
  }

  return context;
}