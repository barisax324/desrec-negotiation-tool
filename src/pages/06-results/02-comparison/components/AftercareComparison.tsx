import {
  AFTERCARE_HELP_OPTIONS,
  FOLLOW_UP_OPTIONS,
} from "@/pages/05-questionnaire/05-aftercare";

import type {
  AftercareResponses,
} from "@/pages/05-questionnaire/05-aftercare";

interface AftercareComparisonProps {
  participantA?: AftercareResponses | null;
  participantB?: AftercareResponses | null;
}

function getHelpfulItems(
  responses?: AftercareResponses | null,
): string[] {
  if (!responses) {
    return [];
  }

  const items = responses.helpfulItems
    .map(
      (id) =>
        AFTERCARE_HELP_OPTIONS.find(
          (option) => option.id === id,
        )?.label,
    )
    .filter(
      (label): label is string =>
        Boolean(label),
    );

  const other =
    responses.helpfulItemsOther.trim();

  if (other) {
    items.push(other);
  }

  return items;
}

function getFollowUp(
  responses?: AftercareResponses | null,
): string {
  if (!responses?.followUpPreference) {
    return "";
  }

  return (
    FOLLOW_UP_OPTIONS.find(
      (option) =>
        option.id ===
        responses.followUpPreference,
    )?.label ?? ""
  );
}

function arraysMatch(
  first: string[],
  second: string[],
): boolean {
  if (
    first.length === 0 ||
    second.length === 0 ||
    first.length !== second.length
  ) {
    return false;
  }

  const sortedFirst = [...first].sort();
  const sortedSecond = [...second].sort();

  return sortedFirst.every(
    (value, index) =>
      value === sortedSecond[index],
  );
}

function TagsAnswer({
  values,
}: {
  values: string[];
}) {
  if (values.length === 0) {
    return (
      <p className="comparison-summary-value comparison-summary-value--empty">
        No response
      </p>
    );
  }

  return (
    <div className="summary-tag-list">
      {values.map((value) => (
        <span
          key={value}
          className="summary-tag"
        >
          {value}
        </span>
      ))}
    </div>
  );
}

function TextAnswer({
  value,
}: {
  value: string;
}) {
  if (!value) {
    return (
      <p className="comparison-summary-value comparison-summary-value--empty">
        No response
      </p>
    );
  }

  return (
    <p className="summary-written-response">
      {value}
    </p>
  );
}

function ComparisonRow({
  label,
  participantA,
  participantB,
  kind = "text",
  isMatch = false,
}: {
  label: string;
  participantA: string | string[];
  participantB: string | string[];
  kind?: "text" | "tags";
  isMatch?: boolean;
}) {
  const hasParticipantA =
    Array.isArray(participantA)
      ? participantA.length > 0
      : Boolean(participantA);

  const hasParticipantB =
    Array.isArray(participantB)
      ? participantB.length > 0
      : Boolean(participantB);

  if (
    !hasParticipantA &&
    !hasParticipantB
  ) {
    return null;
  }

  return (
    <article
      className={[
        "comparison-summary-row",
        isMatch
          ? "comparison-summary-row--match"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="comparison-summary-topic">
        <h3>{label}</h3>

        {isMatch && (
          <span className="comparison-match-label">
            Same response
          </span>
        )}
      </div>

      <section className="comparison-summary-column">

        {kind === "tags" ? (
          <TagsAnswer
            values={
              participantA as string[]
            }
          />
        ) : (
          <TextAnswer
            value={
              participantA as string
            }
          />
        )}
      </section>

      <section className="comparison-summary-column">

        {kind === "tags" ? (
          <TagsAnswer
            values={
              participantB as string[]
            }
          />
        ) : (
          <TextAnswer
            value={
              participantB as string
            }
          />
        )}
      </section>
    </article>
  );
}

export default function AftercareComparison({
  participantA,
  participantB,
}: AftercareComparisonProps) {
  const helpfulA =
    getHelpfulItems(participantA);

  const helpfulB =
    getHelpfulItems(participantB);

  const possibleResponsesA =
    participantA?.possibleResponses.trim() ??
    "";

  const possibleResponsesB =
    participantB?.possibleResponses.trim() ??
    "";

  const caredForA =
    participantA?.feelingCaredFor.trim() ??
    "";

  const caredForB =
    participantB?.feelingCaredFor.trim() ??
    "";

  const avoidA =
    participantA?.thingsToAvoid.trim() ??
    "";

  const avoidB =
    participantB?.thingsToAvoid.trim() ??
    "";

  const followUpA =
    getFollowUp(participantA);

  const followUpB =
    getFollowUp(participantB);

  const notesA =
    participantA?.additionalNotes.trim() ??
    "";

  const notesB =
    participantB?.additionalNotes.trim() ??
    "";

  const hasAnyResponse =
    helpfulA.length > 0 ||
    helpfulB.length > 0 ||
    possibleResponsesA ||
    possibleResponsesB ||
    caredForA ||
    caredForB ||
    avoidA ||
    avoidB ||
    followUpA ||
    followUpB ||
    notesA ||
    notesB;

  if (!hasAnyResponse) {
    return null;
  }

  return (
    <section className="comparison-section">
      <h2>Aftercare</h2>

      <div className="comparison-summary-row-list">
        <ComparisonRow
          label="Helpful Aftercare"
          participantA={helpfulA}
          participantB={helpfulB}
          kind="tags"
          isMatch={arraysMatch(
            helpfulA,
            helpfulB,
          )}
        />

        <ComparisonRow
          label="Possible Responses"
          participantA={
            possibleResponsesA
          }
          participantB={
            possibleResponsesB
          }
          isMatch={
            Boolean(
              possibleResponsesA,
            ) &&
            possibleResponsesA ===
              possibleResponsesB
          }
        />

        <ComparisonRow
          label="What Helps Me Feel Cared For"
          participantA={caredForA}
          participantB={caredForB}
          isMatch={
            Boolean(caredForA) &&
            caredForA === caredForB
          }
        />

        <ComparisonRow
          label="Please Avoid"
          participantA={avoidA}
          participantB={avoidB}
          isMatch={
            Boolean(avoidA) &&
            avoidA === avoidB
          }
        />

        <ComparisonRow
          label="Preferred Follow-up"
          participantA={followUpA}
          participantB={followUpB}
          isMatch={
            Boolean(followUpA) &&
            followUpA === followUpB
          }
        />

        <ComparisonRow
          label="Additional Notes"
          participantA={notesA}
          participantB={notesB}
          isMatch={
            Boolean(notesA) &&
            notesA === notesB
          }
        />
      </div>
    </section>
  );
}