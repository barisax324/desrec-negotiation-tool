import { useState } from "react";

import Button from "../../../shared/ui/button";
import PageLayout from "../../../shared/ui/page-layout";

import "./SceneGoals.css";

export type SceneGoal =
  | "emotional-connection"
  | "relaxed"
  | "skill-building"
  | "high-protocol"
  | "catharsis"
  | "playful"
  | "sensual"
  | "meditative"
  | "aftercare-focused"
  | "beautiful"
  | "controlled"
  | "dominant"
  | "submissive"
  | "energetic"
  | "overwhelmed"
  | "serious"
  | "unsure";

export interface SceneGoalsData {
  goals: SceneGoal[];
  customGoals: string[];
  notes: string;
}

interface SceneGoalsProps {
  data: SceneGoalsData;

  updateData: (
    updates: Partial<SceneGoalsData>,
  ) => void;

  next: () => void;
  back: () => void;

  onSaveAndReturnToSummary?: () => void;
  showNavigation?: boolean;
}

interface GoalOption {
  value: SceneGoal;
  label: string;
}

const GOAL_OPTIONS: GoalOption[] = [
  {
    value: "emotional-connection",
    label: "Emotional Connection & Intimacy",
  },
  {
    value: "relaxed",
    label: "Relaxed & Low Pressure",
  },
  {
    value: "skill-building",
    label: "Skill Building & Exploration",
  },
  {
    value: "high-protocol",
    label: "High Protocol & Formal Roles",
  },
  {
    value: "catharsis",
    label: "Stress Relief & Emotional Catharsis",
  },
  {
    value: "playful",
    label: "Playful Fun & Laughter",
  },
  {
    value: "sensual",
    label: "Sensual Exploration",
  },
  {
    value: "meditative",
    label: "Meditative & Flow State",
  },
  {
    value: "aftercare-focused",
    label: "Aftercare & Recovery Focused",
  },
  {
    value: "beautiful",
    label: "Beautiful & Aesthetic",
  },
  {
    value: "controlled",
    label: "Controlled",
  },
  {
    value: "dominant",
    label: "Dominant",
  },
  {
    value: "submissive",
    label: "Submissive",
  },
  {
    value: "energetic",
    label: "Energetic & Intense",
  },
  {
    value: "overwhelmed",
    label: "Overwhelmed",
  },
  {
    value: "serious",
    label: "Serious & Intentional",
  },
  {
    value: "unsure",
    label: "Unsure / Open to Discussion",
  },
];

function SceneGoals({
  data,
  updateData,
  next,
  back,
  onSaveAndReturnToSummary,
  showNavigation = true,
}: SceneGoalsProps) {
    const [showCustomGoal, setShowCustomGoal] =
    useState(false);

  const [customGoalInput, setCustomGoalInput] =
    useState("");

  const hasSelection =
    data.goals.length > 0 ||
    data.customGoals.length > 0;

  function toggleGoal(
    goal: SceneGoal,
  ) {
    const isSelected =
      data.goals.includes(goal);

    updateData({
      goals: isSelected
        ? data.goals.filter(
            (selectedGoal) =>
              selectedGoal !== goal,
          )
        : [...data.goals, goal],
    });
  }

  function addCustomGoal() {
    const trimmedGoal =
      customGoalInput.trim();

    if (!trimmedGoal) {
      return;
    }

    const alreadyExists =
      data.customGoals.some(
        (goal) =>
          goal.toLowerCase() ===
          trimmedGoal.toLowerCase(),
      );

    if (alreadyExists) {
      setCustomGoalInput("");
      return;
    }

    updateData({
      customGoals: [
        ...data.customGoals,
        trimmedGoal,
      ],
    });

    setCustomGoalInput("");
    setShowCustomGoal(false);
  }

  function removeCustomGoal(
    goalToRemove: string,
  ) {
    updateData({
      customGoals:
        data.customGoals.filter(
          (goal) =>
            goal !== goalToRemove,
        ),
    });
  }

  return (
<PageLayout
  title="Scene Goals"
  subtitle="What are your goals for this scene?"
>
        <section className="scene-goals-card">
        <div className="scene-goals-heading">
          <span className="scene-goals-eyebrow">
            Desired vibe and intentions
          </span>

          <h2>
            What kind of experience are you
            hoping to create during our scene?
          </h2>

          <p>
            Choose the words that best describe
            how you would like the scene
            to feel.
          </p>
        </div>

        <div
          className="scene-goals-options"
          aria-label="Scene goals"
        >
          {GOAL_OPTIONS.map((option) => {
            const isSelected =
              data.goals.includes(
                option.value,
              );

            return (
              <button
                key={option.value}
                type="button"
                className={`scene-goal-chip${
                  isSelected
                    ? " scene-goal-chip--selected"
                    : ""
                }`}
                aria-pressed={isSelected}
                onClick={() =>
                  toggleGoal(option.value)
                }
              >
                {option.label}
              </button>
            );
          })}
        </div>

        {data.customGoals.length > 0 && (
          <div className="scene-custom-goals">
            {data.customGoals.map(
              (goal) => (
                <div
                  className="scene-custom-goal"
                  key={goal}
                >
                  <span>{goal}</span>

                  <button
                    type="button"
                    aria-label={`Remove ${goal}`}
                    onClick={() =>
                      removeCustomGoal(goal)
                    }
                  >
                    ×
                  </button>
                </div>
              ),
            )}
          </div>
        )}

        {!showCustomGoal ? (
          <button
            type="button"
            className="scene-add-goal"
            onClick={() =>
              setShowCustomGoal(true)
            }
          >
            <span aria-hidden="true">
              ＋
            </span>

            Add something else
          </button>
        ) : (
          <div className="scene-custom-entry">
            <label htmlFor="custom-scene-goal">
              Add another scene goal
            </label>

            <div className="scene-custom-entry__controls">
              <input
                id="custom-scene-goal"
                type="text"
                value={customGoalInput}
                placeholder="Enter your own goal"
                autoFocus
                onChange={(event) =>
                  setCustomGoalInput(
                    event.target.value,
                  )
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter"
                  ) {
                    event.preventDefault();
                    addCustomGoal();
                  }

                  if (
                    event.key === "Escape"
                  ) {
                    setCustomGoalInput("");
                    setShowCustomGoal(false);
                  }
                }}
              />

              <Button
                onClick={addCustomGoal}
                disabled={
                  !customGoalInput.trim()
                }
              >
                Add
              </Button>
            </div>

            <button
              type="button"
              className="scene-custom-cancel"
              onClick={() => {
                setCustomGoalInput("");
                setShowCustomGoal(false);
              }}
            >
              Cancel
            </button>
          </div>
        )}

        <div className="scene-goals-notes">
          <label htmlFor="scene-goals-notes">
            Anything you would like your
            partner to know about these goals?
          </label>

          <textarea
            id="scene-goals-notes"
            value={data.notes}
            placeholder="Optional notes"
            rows={4}
            onChange={(event) =>
              updateData({
                notes: event.target.value,
              })
            }
          />
        </div>

        {showNavigation && (
          <div className="scene-goals-navigation">
            <Button onClick={back}>
              Back
            </Button>

            {onSaveAndReturnToSummary && (
              <Button
                onClick={
                  onSaveAndReturnToSummary
                }
                disabled={!hasSelection}
              >
                Return to Summary
              </Button>
            )}

            <Button
              onClick={next}
              disabled={!hasSelection}
            >
              Continue
            </Button>
          </div>
        )}
              </section>
    </PageLayout>
  );
}

export default SceneGoals;