import { Route, Routes } from "react-router-dom";
import About from "./pages/About/About";
import Home from "./pages/Home/Home";
import Join from "./pages/Join/Join";
import Privacy from "./pages/Privacy/Privacy";
import Recover from "./pages/Recover/Recover";
import Start from "./pages/Start/Start";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/start" element={<Start />} />
      <Route path="/join" element={<Join />} />
      <Route path="/recover" element={<Recover />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}

export default App;