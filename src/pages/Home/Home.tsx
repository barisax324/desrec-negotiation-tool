import { Link } from "react-router-dom";

function Home() {
  return (
    <main>
      <h1>DesREC Negotiation Tool</h1>

      <p>
        Complete a structured negotiation separately and review your responses
        together when both participants are finished.
      </p>

      <div>
        <Link to="/start">Start a Negotiation</Link>
      </div>

      <div>
        <Link to="/join">Join a Negotiation</Link>
      </div>

      <div>
        <Link to="/recover">Recover My Link</Link>
      </div>

      <footer>
        <Link to="/privacy">Privacy</Link>
        {" · "}
        <Link to="/about">About</Link>
      </footer>
    </main>
  );
}

export default Home;