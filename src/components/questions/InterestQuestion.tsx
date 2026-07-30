import type {
  AnswerValue,
  NegotiationQuestion,
} from "../../types/negotiation";

import QuestionCard from "../QuestionCard";

interface InterestQuestionProps {
  question: NegotiationQuestion;
  value: AnswerValue;
  onChange: (questionId: string, value: AnswerValue) => void;
}

const options = [
  { value: "love", label: "❤️ Love" },
  { value: "interested", label: "👍 Interested" },
  { value: "curious", label: "🤔 Curious" },
  { value: "depends", label: "⚠️ Depends" },
  { value: "not_this_scene", label: "🚫 Not This Scene" },
];

function InterestQuestion({
  question,
  value,
  onChange,
}: InterestQuestionProps) {
  return (
    <QuestionCard question={question}>
      <div className="interest-options">
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={
              value === option.value
                ? "interest-button interest-button-selected"
                : "interest-button"
            }
            onClick={() => onChange(question.id, option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </QuestionCard>
  );
}

export default InterestQuestion;