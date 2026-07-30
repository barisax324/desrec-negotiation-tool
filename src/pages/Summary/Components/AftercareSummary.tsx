import type { AftercareResponses } from "../../../components/Aftercare/AftercarePage";

import {
  AFTERCARE_HELP_OPTIONS,
  FOLLOW_UP_OPTIONS,
} from "../../../components/Aftercare/aftercareOptions";

interface AftercareSummaryProps {
  responses: AftercareResponses | null;
}

export default function AftercareSummary({
  responses,
}: AftercareSummaryProps) {
  if (!responses) {
    return (
      <p className="summary-empty-response">
        No aftercare preferences provided.
      </p>
    );
  }

  const helpfulItems = responses.helpfulItems
    .map(
      (id) =>
        AFTERCARE_HELP_OPTIONS.find(
          (option) => option.id === id,
        )?.label,
    )
    .filter(Boolean) as string[];

  if (
    responses.helpfulItemsOther.trim()
  ) {
    helpfulItems.push(
      responses.helpfulItemsOther,
    );
  }

  const followUp =
    FOLLOW_UP_OPTIONS.find(
      (option) =>
        option.id ===
        responses.followUpPreference,
    )?.label ?? "";

  return (
    <div className="summary-response-group">
      <div className="summary-response-block">
        <h3>Helpful Aftercare</h3>

        {helpfulItems.length ? (
          <div className="summary-tag-list">
            {helpfulItems.map((item) => (
              <span
                key={item}
                className="summary-tag"
              >
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="summary-empty-response">
            Nothing selected.
          </p>
        )}
      </div>

      {responses.possibleResponses && (
        <div className="summary-response-block">
          <h3>Possible Responses</h3>

          <p className="summary-written-response">
            {responses.possibleResponses}
          </p>
        </div>
      )}

      {responses.feelingCaredFor && (
        <div className="summary-response-block">
          <h3>What Helps Me Feel Cared For</h3>

          <p className="summary-written-response">
            {responses.feelingCaredFor}
          </p>
        </div>
      )}

      {responses.thingsToAvoid && (
        <div className="summary-response-block">
          <h3>Please Avoid</h3>

          <p className="summary-written-response">
            {responses.thingsToAvoid}
          </p>
        </div>
      )}

      {followUp && (
        <div className="summary-response-block">
          <h3>Preferred Follow-up</h3>

          <p>{followUp}</p>
        </div>
      )}

      {responses.additionalNotes && (
        <div className="summary-response-block">
          <h3>Additional Notes</h3>

          <p className="summary-written-response">
            {responses.additionalNotes}
          </p>
        </div>
      )}
    </div>
  );
}