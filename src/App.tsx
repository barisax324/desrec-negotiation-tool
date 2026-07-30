import { Route, Routes, useNavigate } from "react-router-dom";

import About from "./pages/About/About";
import CommunicationPage, {
  type CommunicationFormData,
} from "./pages/Communication/CommunicationPage";
import Home from "./pages/Home/Home";
import Join from "./pages/Join/Join";
import NegotiationSetup from "./pages/NegotiationSetup/NegotiationSetup";
import Pin from "./pages/Pin/Pin";
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

    /*
     * Aftercare & Follow-up will eventually be the next page.
     * Until that page exists, this sends the user to the existing
     * review page so the button does not lead to a broken route.
     */
    navigate("/review-negotiation");
  };

  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/create-pin"
        element={<Pin mode="create" />}
      />

      <Route
        path="/join-pin"
        element={<Pin mode="join" />}
      />

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

      <Route path="/start" element={<Start />} />
      <Route path="/join" element={<Join />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;