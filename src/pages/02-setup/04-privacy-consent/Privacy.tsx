import { Link } from "react-router-dom";

function Privacy() {
  return (
    <main>
      <h1>Privacy</h1>

      <p>
        This page will explain what the application stores, how responses are
        protected, and what DesREC and the hosting providers can access.
      </p>

      <p>
        <Link to="/">Return home</Link>
      </p>
    </main>
  );
}

export default Privacy;