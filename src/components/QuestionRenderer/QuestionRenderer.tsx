import type { NegotiationQuestion } from "../../types/negotiation";

interface Props {
  question: NegotiationQuestion;
}

function QuestionRenderer({ question }: Props) {
  switch (question.type) {
    case "text":
      return (
        <div>
          <label>{question.title}</label>
          <input type="text" />
        </div>
      );

    case "textarea":
      return (
        <div>
          <label>{question.title}</label>
          <textarea rows={4}></textarea>
        </div>
      );

    case "singleSelect":
      return (
        <div>
          <label>{question.title}</label>

          <select>
            <option value="">Choose one...</option>

            {question.options?.map((option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );

    case "multiSelect":
      return (
        <div>
          <label>{question.title}</label>

          {question.options?.map((option) => (
            <div key={option.value}>
              <label>
                <input type="checkbox" />
                {option.label}
              </label>
            </div>
          ))}
        </div>
      );

    case "interestScale":
      return (
        <div>
          <label>{question.title}</label>

          {question.options?.map((option) => (
            <label
              key={option.value}
              style={{ marginRight: "20px" }}
            >
              <input
                type="radio"
                name={question.id}
              />
              {option.label}
            </label>
          ))}
        </div>
      );

    case "info":
      return (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "16px",
            borderRadius: "8px",
            background: "#f9f9f9",
          }}
        >
          <strong>{question.title}</strong>

          <p>{question.description}</p>
        </div>
      );

    default:
      return <p>Unsupported question type.</p>;
  }
}

export default QuestionRenderer;