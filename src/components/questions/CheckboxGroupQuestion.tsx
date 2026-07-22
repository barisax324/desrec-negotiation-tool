import type { NegotiationQuestion } from "../../types/negotiation";

interface CheckboxGroupQuestionProps {
  question: NegotiationQuestion;
}

function CheckboxGroupQuestion({ question }: CheckboxGroupQuestionProps) {
  return <div>Checkbox Group: {question.title}</div>;
}

export default CheckboxGroupQuestion;