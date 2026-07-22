import { Link } from "react-router-dom";
import MainLayout from "../../layouts/MainLayout";

function Join() {
  return (
    <MainLayout>
      <h2>Join a Negotiation</h2>

      <p>
        Use the private participant link that was shared with you.
      </p>

      <p>
        <Link to="/">Return Home</Link>
      </p>
    </MainLayout>
  );
}

export default Join;