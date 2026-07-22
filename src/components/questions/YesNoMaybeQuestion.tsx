import type { NegotiationQuestion } from "../../types/negotiation";

interface YesNoMaybeQuestionProps {
  question: NegotiationQuestion;
}

function YesNoMaybeQuestion({ question }: YesNoMaybeQuestionProps) {
  return <div>Yes / No / Maybe: {question.title}</div>;
}

export default YesNoMaybeQuestion;