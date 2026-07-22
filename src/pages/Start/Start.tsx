import MainLayout from "../../layouts/MainLayout";

import negotiation from "../../data/negotiation.json";

import QuestionRenderer from "../../components/QuestionRenderer";

function Start() {
  return (
    <MainLayout>
      <h1>{negotiation.title}</h1>

      {negotiation.sections.map((section) => (
        <section key={section.id}>
          <h2>{section.title}</h2>

          {section.description && <p>{section.description}</p>}

          {section.questions.map((question) => (
            <QuestionRenderer
              key={question.id}
              question={question}
            />
          ))}
        </section>
      ))}
    </MainLayout>
  );
}

export default Start;