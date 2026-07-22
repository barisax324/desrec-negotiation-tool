import { Link } from "react-router-dom";

function Recover() {
  return (
    <main>
      <h1>Recover My Link</h1>

      <p>
        Recover access to a negotiation using your negotiation information and
        recovery PIN.
      </p>

      <p>
        <Link to="/">Return home</Link>
      </p>
    </main>
  );
}

export default Recover;