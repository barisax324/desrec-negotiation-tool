import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import ScrollToTop from "@/shared/components/scroll-to-top";
import About from "@/pages/07-about";
import AftercarePage from "@/pages/05-questionnaire/05-aftercare";
import CommunicationPage, {
  type CommunicationFormData,
} from "@/pages/05-questionnaire/04-communication-boundaries";
import CreatePassword from "@/pages/03-security/01-secure-negotiation";
import Home from "@/pages/01-home";
import Join from "@/pages/03-security/03-join";
import NegotiationSetup from "@/pages/02-setup/01-negotiation-details";
import Privacy from "@/pages/02-setup/04-privacy-consent";
import Recover from "@/pages/03-security/04-recover";
import Retention from "@/pages/02-setup/02-availability";
import ReviewNegotiation from "@/pages/02-setup/03-review";
import SavePersonalLink from "@/pages/03-security/02-save-access";
import NegotiationFlow from "../negotiation-flow";
import HealthSafety from "@/pages/05-questionnaire/03-health-safety";

function App() {
  const navigate = useNavigate();

  const handleCommunicationContinue = (
    communicationData: CommunicationFormData,
  ) => {
    sessionStorage.setItem(
      "desrec-communication-boundaries",
      JSON.stringify(communicationData),
    );

    navigate("/aftercare-follow-up");
  };

return (
  <>
    <ScrollToTop />

    <Routes>
            <Route path="/" element={<Home />} />

      {/* New negotiation setup */}
      <Route
        path="/negotiation-setup"
        element={<NegotiationSetup />}
      />

      <Route
        path="/communication-boundaries"
        element={
          <CommunicationPage
            onBack={() => navigate(-1)}
            onContinue={handleCommunicationContinue}
          />
        }
      />

      <Route
        path="/aftercare-follow-up"
        element={
          <AftercarePage
            onBack={() => navigate(-1)}
            onContinue={(aftercareData) => {
              sessionStorage.setItem(
                "desrec-aftercare-follow-up",
                JSON.stringify(aftercareData),
              );

              navigate("/deletion-preference");
            }}
          />
        }
      />

      <Route
        path="/deletion-preference"
        element={<Retention />}
      />

      <Route
        path="/review-negotiation"
        element={<ReviewNegotiation />}
      />

      <Route
        path="/save-personal-link"
        element={<SavePersonalLink />}
      />

      <Route
        path="/create-password"
        element={<CreatePassword />}
      />

      {/* Open or join an existing negotiation */}
      <Route
        path="/open"
        element={<Recover />}
      />

      {/* Authenticated questionnaires */}
<Route
  path="/start"
  element={<NegotiationFlow />}
/>
      <Route path="/join" element={<Join />} />

{import.meta.env.DEV && (
  <Route
    path="/dev/health-safety"
    element={
      <HealthSafety
        back={() => navigate("/")}
        next={() => {}}
      />
    }
  />
)}

      {/* Information pages */}
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />

      {/* Redirect old authentication routes */}
      <Route
        path="/join-pin"
        element={
          <Navigate
            to="/open"
            replace
          />
        }
      />

      <Route
        path="/recover"
        element={
          <Navigate
            to="/open"
            replace
          />
        }
      />

      {/* Return unknown URLs to the home page */}
      <Route
        path="*"
        element={
          <Navigate
            to="/"
            replace
          />
        }
      />
    </Routes>
  </>
);
}

export default App;

