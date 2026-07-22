import { Link } from "react-router-dom";
import negotiationData from "../../Data/negotiation.json";
import type { NegotiationTemplate } from "../../types/negotiation";
import MainLayout from "../../layouts/MainLayout";
import questionrenderer from "../../components/QuestionRenderer/QuestionRenderer";

function Start() {
  const negotiation = negotiationData as NegotiationTemplate;

  return (
    <MainLayout>
      <h2>Start a Negotiation</h2>

      <p>{negotiation.description}</p>

      <p>
        This template currently contains{" "}
        <strong>{negotiation.sections.length} sections</strong>.
      </p>

      <div>
  {negotiation.sections.map((section) => (
    <section key={section.id}>
      <h3>{section.title}</h3>

      <p>{section.description}</p>

      {section.questions.map((question) => (
        <questionrenderer
          key={question.id}
          question={question}
        />
      ))}
    </section>
  ))}
</div>

      <p>
        <Link to="/">Return home</Link>
      </p>
    </MainLayout>
  );
}

export default Start;