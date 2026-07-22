import type { NegotiationQuestion } from "../../types/negotiation";

interface InfoCardProps {
  question: NegotiationQuestion;
}

function InfoCard({ question }: InfoCardProps) {
  return (
    <div className="info-card">
      <h3>{question.title}</h3>

      {question.description && (
        <p>{question.description}</p>
      )}
    </div>
  );
}

export default InfoCard;