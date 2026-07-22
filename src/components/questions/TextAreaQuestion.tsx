import type { NegotiationQuestion } from "../../types/negotiation";

interface TextAreaQuestionProps {
  question: NegotiationQuestion;
}

function TextAreaQuestion({ question }: TextAreaQuestionProps) {
  return <div>Textarea: {question.title}</div>;
}

export default TextAreaQuestion;