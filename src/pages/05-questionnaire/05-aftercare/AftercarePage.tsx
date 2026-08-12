import { useState } from "react";

import {
  AFTERCARE_HELP_OPTIONS,
  FOLLOW_UP_OPTIONS,
} from "./aftercareOptions";

import "./AftercarePage.css";

export interface AftercareResponses {
  helpfulItems: string[];
  helpfulItemsOther: string;
  possibleResponses: string;
  feelingCaredFor: string;
  thingsToAvoid: string;
  followUpPreference: string;
  additionalNotes: string;
}

interface AftercarePageProps {
  initialResponses?: AftercareResponses | null;

  onBack: () => void;

  onContinue: (
    responses: AftercareResponses,
  ) => void;

  onSaveAndReturnToSummary?: (
    responses: AftercareResponses,
  ) => void;

  showNavigation?: boolean;
}

const INITIAL_RESPONSES: AftercareResponses = {
  helpfulItems: [],
  helpfulItemsOther: "",
  possibleResponses: "",
  feelingCaredFor: "",
  thingsToAvoid: "",
  followUpPreference: "",
  additionalNotes: "",
};

function AftercarePage({
  initialResponses,
  onBack,
  onContinue,
  onSaveAndReturnToSummary,
  showNavigation = true,
}: AftercarePageProps) {
    const [responses, setResponses] =
    useState<AftercareResponses>(
      initialResponses ??
        INITIAL_RESPONSES,
    );

  function updateResponses(
    updates: Partial<AftercareResponses>,
  ) {
    setResponses((current) => ({
      ...current,
      ...updates,
    }));
  }

  function toggleHelpfulItem(
    optionId: string,
  ) {
    setResponses((current) => {
      const isSelected =
        current.helpfulItems.includes(
          optionId,
        );

      return {
        ...current,

        helpfulItems: isSelected
          ? current.helpfulItems.filter(
              (item) =>
                item !== optionId,
            )
          : [
              ...current.helpfulItems,
              optionId,
            ],

        helpfulItemsOther:
          optionId === "other" &&
          isSelected
            ? ""
            : current.helpfulItemsOther,
      };
    });
  }

  function handleComplete() {
    onContinue(responses);
  }

  function handleSaveAndReturn() {
    onSaveAndReturnToSummary?.(
      responses,
    );
  }

  const showOtherField =
    responses.helpfulItems.includes(
      "other",
    );

  return (
    <main className="aftercare-page">
      <div className="aftercare-page__container">
        <header className="aftercare-header">
          <p className="aftercare-eyebrow">
            Questionnaire
          </p>

          <h1>
            Aftercare
          </h1>

          <p className="aftercare-intro">
            Aftercare looks different for
            everyone. Tell your partner what
            helps you feel safe, supported,
            and cared for after a scene.
          </p>

          <div className="aftercare-progress">
            <div className="aftercare-progress__text">
              <span>
                Aftercare
              </span>

              <span>
                Almost complete
              </span>
            </div>

            <div className="aftercare-progress__track">
              <div className="aftercare-progress__fill" />
            </div>
          </div>
        </header>

        <section className="aftercare-section">
          <div className="aftercare-section__heading">
            <p className="aftercare-section__number">
              01
            </p>

            <div>
              <h2>
                What helps me?
              </h2>

              <p>
                Choose all that apply.
              </p>
            </div>
          </div>

          <div className="aftercare-chip-grid">
            {AFTERCARE_HELP_OPTIONS.map(
              (option) => {
                const isSelected =
                  responses.helpfulItems.includes(
                    option.id,
                  );

                return (
                  <button
                    key={option.id}
                    type="button"
                    className={[
                      "aftercare-chip",
                      isSelected
                        ? "is-selected"
                        : "",
                      option.id === "other"
                        ? "is-other"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    aria-pressed={
                      isSelected
                    }
                    onClick={() =>
                      toggleHelpfulItem(
                        option.id,
                      )
                    }
                  >
                    <span className="aftercare-chip__indicator">
                      {isSelected
                        ? "✓"
                        : ""}
                    </span>

                    <span>
                      {option.label}
                    </span>
                  </button>
                );
              },
            )}
          </div>

          {showOtherField && (
            <div className="aftercare-expanded-field">
              <label htmlFor="aftercare-other-help">
                What else helps?
              </label>

              <input
                id="aftercare-other-help"
                type="text"
                value={
                  responses.helpfulItemsOther
                }
                maxLength={300}
                placeholder="Describe anything else that helps you feel supported."
                onChange={(event) =>
                  updateResponses({
                    helpfulItemsOther:
                      event.target.value,
                  })
                }
              />
            </div>
          )}
        </section>

        <section className="aftercare-section">
          <div className="aftercare-section__heading">
            <p className="aftercare-section__number">
              02
            </p>

            <div>
              <h2>
                Tell your partner about
                your aftercare
              </h2>

              <p>
                Share as much or as little
                detail as feels useful.
              </p>
            </div>
          </div>

          <div className="aftercare-text-fields">
            <div className="aftercare-field">
              <label htmlFor="aftercare-responses">
                After a scene I
                sometimes...
              </label>

              <textarea
                id="aftercare-responses"
                value={
                  responses.possibleResponses
                }
                maxLength={1200}
                placeholder="Examples: I sometimes get very quiet, cry even when everything went well, become very tired, need extra reassurance, or do not realize I am dropping until hours later."
                onChange={(event) =>
                  updateResponses({
                    possibleResponses:
                      event.target.value,
                  })
                }
              />

              <span className="aftercare-character-count">
                {
                  responses
                    .possibleResponses
                    .length
                }{" "}
                / 1200
              </span>
            </div>

            <div className="aftercare-field">
              <label htmlFor="aftercare-cared-for">
                What makes me feel cared
                for?
              </label>

              <textarea
                id="aftercare-cared-for"
                value={
                  responses.feelingCaredFor
                }
                maxLength={1200}
                placeholder="Examples: Hold me without talking, tell me I did well, bring me water or a snack, watch TV with me, tuck me into bed, rub my back, or sit quietly with me."
                onChange={(event) =>
                  updateResponses({
                    feelingCaredFor:
                      event.target.value,
                  })
                }
              />

              <span className="aftercare-character-count">
                {
                  responses
                    .feelingCaredFor
                    .length
                }{" "}
                / 1200
              </span>
            </div>

            <div className="aftercare-field">
              <label htmlFor="aftercare-avoid">
                Please avoid...
              </label>

              <textarea
                id="aftercare-avoid"
                value={
                  responses.thingsToAvoid
                }
                maxLength={1200}
                placeholder="Examples: Do not ask if I am okay repeatedly, do not joke immediately afterward, do not leave without checking in, do not touch me before asking, or do not bring up mistakes right away."
                onChange={(event) =>
                  updateResponses({
                    thingsToAvoid:
                      event.target.value,
                  })
                }
              />

              <span className="aftercare-character-count">
                {
                  responses
                    .thingsToAvoid
                    .length
                }{" "}
                / 1200
              </span>
            </div>
          </div>
        </section>

        <section className="aftercare-section">
          <div className="aftercare-section__heading">
            <p className="aftercare-section__number">
              03
            </p>

            <div>
              <h2>
                Follow-up
              </h2>

              <p>
                How would you like your
                partner to check in?
              </p>
            </div>
          </div>

          <div className="aftercare-follow-up">
            {FOLLOW_UP_OPTIONS.map(
              (option) => {
                const isSelected =
                  responses.followUpPreference ===
                  option.id;

                return (
                  <label
                    key={option.id}
                    className={[
                      "aftercare-radio-card",
                      isSelected
                        ? "is-selected"
                        : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                  >
                    <input
                      type="radio"
                      name="aftercare-follow-up"
                      value={option.id}
                      checked={isSelected}
                      onChange={() =>
                        updateResponses({
                          followUpPreference:
                            option.id,
                        })
                      }
                    />

                    <span className="aftercare-radio-card__control" />

                    <span>
                      {option.label}
                    </span>
                  </label>
                );
              },
            )}
          </div>
        </section>

        <section className="aftercare-section">
          <div className="aftercare-section__heading">
            <p className="aftercare-section__number">
              04
            </p>

            <div>
              <h2>
                Anything else?
              </h2>

              <p>
                Add anything that was not
                covered above.
              </p>
            </div>
          </div>

          <div className="aftercare-field">
            <label
              className="aftercare-visually-hidden"
              htmlFor="aftercare-additional-notes"
            >
              Additional aftercare notes
            </label>

            <textarea
              id="aftercare-additional-notes"
              className="aftercare-field__large"
              value={
                responses.additionalNotes
              }
              maxLength={1800}
              placeholder="Anything else you would like your partner to know about caring for you after a scene."
              onChange={(event) =>
                updateResponses({
                  additionalNotes:
                    event.target.value,
                })
              }
            />

            <span className="aftercare-character-count">
              {
                responses.additionalNotes
                  .length
              }{" "}
              / 1800
            </span>
          </div>
        </section>

        {showNavigation && (
          <footer className="aftercare-actions">
            <button
              type="button"
              className="aftercare-back-button"
              onClick={onBack}
            >
              ← Back
            </button>

            {onSaveAndReturnToSummary && (
              <button
                type="button"
                className="aftercare-summary-button"
                onClick={
                  handleSaveAndReturn
                }
              >
                Return to Summary
              </button>
            )}

            <button
              type="button"
              className="aftercare-complete-button"
              onClick={handleComplete}
            >
              Complete
            </button>
          </footer>
        )}
              </div>
    </main>
  );
}

export default AftercarePage;

