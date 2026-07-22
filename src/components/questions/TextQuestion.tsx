import type { NegotiationQuestion } from "../../types/negotiation";

interface TextQuestionProps {
  question: NegotiationQuestion;
}

function TextQuestion({ question }: TextQuestionProps) {
  return <div>Text Question: {question.title}</div>;
}

export default TextQuestion;