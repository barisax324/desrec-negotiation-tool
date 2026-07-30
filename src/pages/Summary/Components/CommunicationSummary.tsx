import type { CommunicationFormData } from "../../Communication/CommunicationPage";

import {
  CHECK_IN_OPTIONS,
  COMMUNICATION_HABIT_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  SAFEWORD_OPTIONS,
  SOMETHING_WRONG_OPTIONS,
  type CommunicationOption,
} from "../../Communication/communicationOptions";

interface CommunicationSummaryProps {
  responses: CommunicationFormData | null;
}

function getSelectedLabels(
  selectedIds: string[],
  options: CommunicationOption[],
): string[] {
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

function SummaryTags({
  labels,
  emptyText,
}: {
  labels: string[];
  emptyText: string;
}) {
  if (labels.length === 0) {
    return (
      <p className="summary-empty-response">
        {emptyText}
      </p>
    );
  }

  return (
    <div className="summary-tag-list">
      {labels.map((label) => (
        <span
          key={label}
          className="summary-tag"
        >
          {label}
        </span>
      ))}
    </div>
  );
}

export default function CommunicationSummary({
  responses,
}: CommunicationSummaryProps) {
  if (!responses) {
    return (
      <p className="summary-empty-response">
        No communication preferences provided.
      </p>
    );
  }

  const checkIns = getSelectedLabels(
    responses.checkIns,
    CHECK_IN_OPTIONS,
  );

  const communicationStyle = getSelectedLabels(
    responses.communicationStyle,
    COMMUNICATION_STYLE_OPTIONS,
  );

  const somethingWrong = getSelectedLabels(
    responses.somethingWrong,
    SOMETHING_WRONG_OPTIONS,
  );

  const communicationHabits = getSelectedLabels(
    responses.communicationHabits,
    COMMUNICATION_HABIT_OPTIONS,
  );

  const safeword =
    responses.safewordType === "custom"
      ? responses.customSafeword.trim()
      : SAFEWORD_OPTIONS.find(
          (option) =>
            option.id === responses.safewordType,
        )?.label ?? "";

  return (
    <div className="summary-response-group">
      <div className="summary-response-block">
        <h3>Check-ins</h3>

        <SummaryTags
          labels={checkIns}
          emptyText="No check-in preference selected."
        />
      </div>

      <div className="summary-response-block">
        <h3>Communication Style</h3>

        <SummaryTags
          labels={communicationStyle}
          emptyText="No communication style selected."
        />
      </div>

      <div className="summary-response-block">
        <h3>If Something Feels Wrong</h3>

        <SummaryTags
          labels={somethingWrong}
          emptyText="No response preference selected."
        />
      </div>

      <div className="summary-response-block">
        <h3>Safewords &amp; Signals</h3>

        {safeword ? (
          <p className="summary-written-response">
            {safeword}
          </p>
        ) : (
          <p className="summary-empty-response">
            No safeword preference selected.
          </p>
        )}
      </div>

      <div className="summary-response-block">
        <h3>Communication Habits</h3>

        <SummaryTags
          labels={communicationHabits}
          emptyText="No communication habits selected."
        />
      </div>

      {responses.discussionFlags.length > 0 && (
        <div className="summary-response-block">
          <h3>Discuss in Person</h3>

          <div className="summary-tag-list">
            {responses.discussionFlags.map((flag) => (
              <span
                key={`${flag.sectionId}-${flag.optionId}`}
                className="summary-tag"
              >
                {flag.sectionLabel}: {flag.optionLabel}
              </span>
            ))}
          </div>
        </div>
      )}

      {responses.additionalNotes.trim() && (
        <div className="summary-response-block">
          <h3>Additional Communication Notes</h3>

          <p className="summary-written-response">
            {responses.additionalNotes}
          </p>
        </div>
      )}
    </div>
  );
}