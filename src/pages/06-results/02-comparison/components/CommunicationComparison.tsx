import {
  CHECK_IN_OPTIONS,
  COMMUNICATION_HABIT_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  SAFEWORD_OPTIONS,
  SOMETHING_WRONG_OPTIONS,
} from "@/pages/05-questionnaire/04-communication-boundaries";

import type {
  CommunicationFormData,
  CommunicationOption,
} from "../../../05-questionnaire/04-communication-boundaries";

interface CommunicationComparisonProps {
  participantA?: CommunicationFormData | null;
  participantB?: CommunicationFormData | null;
}

function getSelectedLabels(
  selectedIds: string[] | undefined,
  options: CommunicationOption[],
): string[] {
  if (!selectedIds) {
    return [];
  }

  return selectedIds
    .map((id) => {
      const option = options.find(
        (candidate) => candidate.id === id,
      );

      if (!option) {
        return null;
      }

      return option.discussionFlag
        ? `${option.label} · Discuss in person`
        : option.label;
    })
    .filter((label): label is string => Boolean(label));
}

function getSafeword(
  responses?: CommunicationFormData | null,
): string {
  if (!responses?.safewordType) {
    return "";
  }

  if (responses.safewordType === "custom") {
    return responses.customSafeword.trim();
  }

  return (
    SAFEWORD_OPTIONS.find(
      (option) =>
        option.id === responses.safewordType,
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

function TagAnswer({
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
          <TagAnswer
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
          <TagAnswer
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

export default function CommunicationComparison({
  participantA,
  participantB,
}: CommunicationComparisonProps) {
  const checkInsA =
    getSelectedLabels(
      participantA?.checkIns,
      CHECK_IN_OPTIONS,
    );

  const checkInsB =
    getSelectedLabels(
      participantB?.checkIns,
      CHECK_IN_OPTIONS,
    );

  const communicationStyleA =
    getSelectedLabels(
      participantA?.communicationStyle,
      COMMUNICATION_STYLE_OPTIONS,
    );

  const communicationStyleB =
    getSelectedLabels(
      participantB?.communicationStyle,
      COMMUNICATION_STYLE_OPTIONS,
    );

  const somethingWrongA =
    getSelectedLabels(
      participantA?.somethingWrong,
      SOMETHING_WRONG_OPTIONS,
    );

  const somethingWrongB =
    getSelectedLabels(
      participantB?.somethingWrong,
      SOMETHING_WRONG_OPTIONS,
    );

  const communicationHabitsA =
    getSelectedLabels(
      participantA?.communicationHabits,
      COMMUNICATION_HABIT_OPTIONS,
    );

  const communicationHabitsB =
    getSelectedLabels(
      participantB?.communicationHabits,
      COMMUNICATION_HABIT_OPTIONS,
    );

  const safewordA =
    getSafeword(participantA);

  const safewordB =
    getSafeword(participantB);

  const notesA =
    participantA?.additionalNotes.trim() ?? "";

  const notesB =
    participantB?.additionalNotes.trim() ?? "";

  const hasAnyResponse =
    checkInsA.length > 0 ||
    checkInsB.length > 0 ||
    communicationStyleA.length > 0 ||
    communicationStyleB.length > 0 ||
    somethingWrongA.length > 0 ||
    somethingWrongB.length > 0 ||
    communicationHabitsA.length > 0 ||
    communicationHabitsB.length > 0 ||
    safewordA ||
    safewordB ||
    notesA ||
    notesB;

  if (!hasAnyResponse) {
    return null;
  }

  return (
    <section className="comparison-section">
      <h2>
        Communication &amp; Boundaries
      </h2>

      <div className="comparison-summary-row-list">
        <ComparisonRow
          label="Check-ins"
          participantA={checkInsA}
          participantB={checkInsB}
          kind="tags"
          isMatch={arraysMatch(
            checkInsA,
            checkInsB,
          )}
        />

        <ComparisonRow
          label="Communication Style"
          participantA={communicationStyleA}
          participantB={communicationStyleB}
          kind="tags"
          isMatch={arraysMatch(
            communicationStyleA,
            communicationStyleB,
          )}
        />

        <ComparisonRow
          label="If Something Feels Wrong"
          participantA={somethingWrongA}
          participantB={somethingWrongB}
          kind="tags"
          isMatch={arraysMatch(
            somethingWrongA,
            somethingWrongB,
          )}
        />

        <ComparisonRow
          label="Safewords & Signals"
          participantA={safewordA}
          participantB={safewordB}
          isMatch={
            Boolean(safewordA) &&
            safewordA === safewordB
          }
        />

        <ComparisonRow
          label="Communication Habits"
          participantA={communicationHabitsA}
          participantB={communicationHabitsB}
          kind="tags"
          isMatch={arraysMatch(
            communicationHabitsA,
            communicationHabitsB,
          )}
        />

        <ComparisonRow
          label="Additional Communication Notes"
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