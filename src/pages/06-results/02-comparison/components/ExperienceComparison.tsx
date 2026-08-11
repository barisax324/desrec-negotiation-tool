import type {
  SceneGoal,
  SceneGoalsData,
} from "../../../05-questionnaire/01-scene-goals";

interface ExperienceComparisonProps {
  participantA?: SceneGoalsData | null;
  participantB?: SceneGoalsData | null;
}

const GOAL_LABELS: Record<
  SceneGoal,
  string
> = {
  "emotional-connection":
    "Emotional Connection & Intimacy",
  relaxed: "Relaxed & Low Pressure",
  "skill-building":
    "Skill Building & Exploration",
  "high-protocol":
    "High Protocol & Formal Roles",
  catharsis:
    "Stress Relief & Emotional Catharsis",
  playful: "Playful Fun & Laughter",
  sensual: "Sensual Exploration",
  meditative: "Meditative & Flow State",
  "aftercare-focused":
    "Aftercare & Recovery Focused",
  beautiful: "Beautiful & Aesthetic",
  controlled: "Controlled",
  dominant: "Dominant",
  submissive: "Submissive",
  energetic: "Energetic & Intense",
  overwhelmed: "Overwhelmed",
  serious: "Serious & Intentional",
  unsure: "Unsure / Open to Discussion",
};

function getGoals(
  data?: SceneGoalsData | null,
): string[] {
  if (!data) {
    return [];
  }

  return [
    ...data.goals.map(
      (goal) => GOAL_LABELS[goal],
    ),
    ...data.customGoals
      .map((goal) => goal.trim())
      .filter(Boolean),
  ];
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
    <div className="summary-written-response">
      {value
        .split("\n")
        .filter((line) => line.trim())
        .map((line, index) => (
          <p key={index}>
            {line}
          </p>
        ))}
    </div>
  );
}

function arraysMatch(
  first: string[],
  second: string[],
): boolean {
  if (
    first.length === 0 ||
    second.length === 0
  ) {
    return false;
  }

  if (
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

export default function ExperienceComparison({
  participantA,
  participantB,
}: ExperienceComparisonProps) {
  const goalsA =
    getGoals(participantA);

  const goalsB =
    getGoals(participantB);

  const notesA =
    participantA?.notes.trim() ?? "";

  const notesB =
    participantB?.notes.trim() ?? "";

  const hasGoals =
    goalsA.length > 0 ||
    goalsB.length > 0;

  const hasNotes =
    Boolean(notesA || notesB);

  if (!hasGoals && !hasNotes) {
    return null;
  }

  const goalsMatch =
    arraysMatch(goalsA, goalsB);

  const notesMatch =
    Boolean(notesA) &&
    notesA === notesB;

  return (
    <section className="comparison-section">
      <h2>
        Experience Goals
      </h2>

      <div className="comparison-summary-row-list">
        {hasGoals && (
          <article
            className={[
              "comparison-summary-row",
              goalsMatch
                ? "comparison-summary-row--match"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="comparison-summary-topic">
              <h3>
                Desired Experience
              </h3>

              {goalsMatch && (
                <span className="comparison-match-label">
                  Same response
                </span>
              )}
            </div>

            <section className="comparison-summary-column">

              <TagAnswer
                values={goalsA}
              />
            </section>

            <section className="comparison-summary-column">

              <TagAnswer
                values={goalsB}
              />
            </section>
          </article>
        )}

        {hasNotes && (
          <article
            className={[
              "comparison-summary-row",
              notesMatch
                ? "comparison-summary-row--match"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
          >
            <div className="comparison-summary-topic">
              <h3>
                Additional Notes
              </h3>

              {notesMatch && (
                <span className="comparison-match-label">
                  Same response
                </span>
              )}
            </div>

            <section className="comparison-summary-column">

              <TextAnswer
                value={notesA}
              />
            </section>

            <section className="comparison-summary-column">

              <TextAnswer
                value={notesB}
              />
            </section>
          </article>
        )}
      </div>
    </section>
  );
}