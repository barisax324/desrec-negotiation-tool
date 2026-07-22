import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

function Home() {
  return (
    <MainLayout>
      <p>
        Complete a structured negotiation separately and compare your responses
        together when both participants have finished.
      </p>

      <div
        style={{
          display: "flex",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "2rem",
        }}
      >
        <Link to="/start">Start a Negotiation</Link>
        <Link to="/join">Join</Link>
        <Link to="/recover">Recover Link</Link>
      </div>

      <div style={{ marginTop: "2rem" }}>
        <Link to="/privacy">Privacy</Link>
        {" · "}
        <Link to="/about">About</Link>
      </div>
    </MainLayout>
  );
}

export default Home;