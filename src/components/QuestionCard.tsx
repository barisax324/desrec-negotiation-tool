import type { ReactNode } from "react";
import type { NegotiationQuestion } from "../types/negotiation";

interface QuestionCardProps {
  question: NegotiationQuestion;
  children: ReactNode;
}

function QuestionCard({
  question,
  children,
}: QuestionCardProps) {
  return (
    <div className="question-card">
      <h3>{question.title}</h3>

      {question.description && <p>{question.description}</p>}

      <div className="question-body">
        {children}
      </div>
    </div>
  );
}

export default QuestionCard;