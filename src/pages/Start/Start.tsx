import { Link } from "react-router-dom";

function Start() {
  return (
    <main>
      <h1>Start a Negotiation</h1>

      <p>
        Create a private negotiation for you and another participant.
      </p>

      <button type="button">Create Negotiation</button>

      <p>
        <Link to="/">Return home</Link>
      </p>
    </main>
  );
}

export default Start;