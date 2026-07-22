import type { NegotiationQuestion } from "../../types/negotiation";

interface SingleSelectQuestionProps {
  question: NegotiationQuestion;
}

function SingleSelectQuestion({ question }: SingleSelectQuestionProps) {
  return <div>Single Select: {question.title}</div>;
}

export default SingleSelectQuestion;