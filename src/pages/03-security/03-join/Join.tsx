import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  Link,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import NegotiationFlow from "../../../app/negotiation-flow";

import { joinNegotiation } from "../../../services/negotiation/joinNegotiation";

function Join() {
  const navigate = useNavigate();

  const [searchParams] =
    useSearchParams();

  const invitationToken =
    searchParams.get("t")?.trim() ?? "";

  const recoveryToken =
    searchParams.get("r")?.trim() ?? "";

  const hasAttemptedJoin =
    useRef(false);

  const [joinError, setJoinError] =
    useState("");

  /*
   * A returning Participant B already has a
   * temporary recovery credential. NegotiationFlow.tsx
   * knows how to open this kind of link.
   */
  if (recoveryToken) {
    return (
     <NegotiationFlow participantRole="B" />
    );
  }

  useEffect(() => {
    if (
      !invitationToken ||
      hasAttemptedJoin.current
    ) {
      return;
    }

    hasAttemptedJoin.current = true;

    let isCancelled = false;

async function openInvitation() {
  setJoinError("");

  try {
    console.log(
      "Calling joinNegotiation...",
      invitationToken,
    );

    const result =
      await joinNegotiation(
        invitationToken,
      );

    console.log(
      "joinNegotiation returned:",
      result,
    );

    if (isCancelled) {
      return;
    }

    if (
      result.participantRole !== "B"
    ) {
      throw new Error(
        "This is not a valid Participant B invitation link.",
      );
    }

    sessionStorage.setItem(
      "desrec.pendingAccessToken",
      invitationToken,
    );

    sessionStorage.setItem(
      "desrec.currentParticipantRole",
      "B",
    );

    sessionStorage.setItem(
      "desrec.passwordCreated",
      "false",
    );

    sessionStorage.setItem(
      "desrec.firstTimeParticipant",
      "B",
    );

    sessionStorage.setItem(
      "desrec.publicId",
      result.publicId,
    );

    sessionStorage.setItem(
      "desrec.negotiationStatus",
      result.negotiationStatus,
    );

    if (result.negotiationName) {
      sessionStorage.setItem(
        "desrec.negotiationName",
        result.negotiationName,
      );
    } else {
      sessionStorage.removeItem(
        "desrec.negotiationName",
      );
    }

    if (result.sceneDate) {
      sessionStorage.setItem(
        "desrec.sceneDate",
        result.sceneDate,
      );
    }

    sessionStorage.setItem(
      "desrec.sceneDateUnknown",
      String(
        result.sceneDateUnknown,
      ),
    );

    sessionStorage.setItem(
      "desrec.retentionPeriod",
      result.retentionPeriod,
    );

    if (result.expiresAt) {
      sessionStorage.setItem(
        "desrec.expiresAt",
        result.expiresAt,
      );
    }

    console.log(
      "Navigating to create-password",
    );

    navigate(
      "/create-password?participant=B",
      {
        replace: true,
      },
    );
  } catch (caughtError) {
    console.error(
      "JOIN FAILED:",
      caughtError,
    );

    if (isCancelled) {
      return;
    }

    const message =
      caughtError instanceof Error
        ? caughtError.message
        : "The invitation could not be opened.";

    setJoinError(message);

    window.alert(message);
  }
}

    void openInvitation();

    return () => {
      isCancelled = true;
    };
  }, [
    invitationToken,
    navigate,
  ]);

  if (!invitationToken) {
    return (
      <main className="questionnaire-error">
        <h1>
          This invitation link is incomplete
        </h1>

        <p>
          Open the complete invitation link
          sent by Participant A.
        </p>

        <p>
          <Link to="/open">
            Open or Join a Negotiation
          </Link>
        </p>

        <p>
          <Link to="/">
            Return Home
          </Link>
        </p>
      </main>
    );
  }

  if (joinError) {
    return (
      <main className="questionnaire-error">
        <h1>
          This negotiation could not be opened
        </h1>

        <p>{joinError}</p>

        <p>
          The invitation may be incorrect,
          expired, or already used.
        </p>

        <p>
          <Link to="/open">
            Open or Join a Negotiation
          </Link>
        </p>

        <p>
          <Link to="/">
            Return Home
          </Link>
        </p>
      </main>
    );
  }

  return (
    <main className="questionnaire-loading">
      <h1>
        Opening your invitation...
      </h1>

      <p>
        Please wait while Participant B
        access is verified.
      </p>
    </main>
  );
}

export default Join;