import { Link } from "react-router-dom";

function About() {
  return (
    <main>
      <h1>About This Tool</h1>

      <p>
        The DesREC Negotiation Tool supports structured communication between
        participants. It does not replace consent or an ongoing conversation.
      </p>

      <p>
        <Link to="/">Return home</Link>
      </p>
    </main>
  );
}

export default About;