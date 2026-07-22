import { Link } from "react-router-dom";

function Join() {
  return (
    <main>
      <h1>Join a Negotiation</h1>

      <p>Use the private participant link that was shared with you.</p>

      <p>
        <Link to="/">Return home</Link>
      </p>
    </main>
  );
}

export default Join;