import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "../root";
import { QuestionnaireProvider } from "../negotiation-flow/context/QuestionnaireContext";

import "@/shared/styles/global/index.css";

ReactDOM.createRoot(
  document.getElementById("root")!,
).render(
  <QuestionnaireProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QuestionnaireProvider>,
);

