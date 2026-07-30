import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App";
import { QuestionnaireProvider } from "./context/QuestionnaireContext";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <QuestionnaireProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QuestionnaireProvider>
  </React.StrictMode>,
);