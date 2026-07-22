import type { NegotiationQuestion } from "../types/negotiation";

import InfoCard from "./questions/InfoCard";
import TextQuestion from "./questions/TextQuestion";
import TextAreaQuestion from "./questions/TextAreaQuestion";
import YesNoMaybeQuestion from "./questions/YesNoMaybeQuestion";
import CheckboxGroupQuestion from "./questions/CheckboxGroupQuestion";
import SingleSelectQuestion from "./questions/SingleSelectQuestion";

interface QuestionRendererProps {
  question: NegotiationQuestion;
}

function QuestionRenderer({ question }: QuestionRendererProps) {
  switch (question.type) {
    case "infoCard":
      return <InfoCard question={question} />;

    case "text":
      return <TextQuestion question={question} />;

    case "textarea":
      return <TextAreaQuestion question={question} />;

    case "yesNoMaybe":
      return <YesNoMaybeQuestion question={question} />;

    case "checkboxGroup":
      return <CheckboxGroupQuestion question={question} />;

    case "singleSelect":
      return <SingleSelectQuestion question={question} />;

    default:
      return (
        <div>
          Unknown question type: <strong>{question.type}</strong>
        </div>
      );
  }
}

export default QuestionRenderer;