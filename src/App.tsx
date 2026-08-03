import {
  Navigate,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import About from "./pages/About/About";
import AftercarePage from "./components/Aftercare/AftercarePage";
import CommunicationPage, {
  type CommunicationFormData,
} from "./pages/Communication/CommunicationPage";
import CreatePassword from "./pages/create-password/CreatePassword";
import Home from "./pages/Home/Home";
import Join from "./pages/Join/Join";
import NegotiationSetup from "./pages/NegotiationSetup/NegotiationSetup";
import Privacy from "./pages/Privacy/Privacy";
import Recover from "./pages/Recover/Recover";
import Retention from "./pages/Retention/Retention";
import ReviewNegotiation from "./pages/ReviewNegotiation/ReviewNegotiation";
import SavePersonalLink from "./pages/SavePersonalLink/SavePersonalLink";
import Start from "./pages/Start/Start";

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
      <Route path="/start" element={<Start />} />
      <Route path="/join" element={<Join />} />

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