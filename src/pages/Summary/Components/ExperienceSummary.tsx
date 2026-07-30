import type {
  ExperienceGoal,
  ExperienceGoalsData,
} from "../../Questionnaire/ExperienceGoals/ExperienceGoals";

interface ExperienceSummaryProps {
  data: ExperienceGoalsData;
}

const GOAL_LABELS: Record<ExperienceGoal, string> = {
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

export default function ExperienceSummary({
  data,
}: ExperienceSummaryProps) {
  const goals = [
    ...data.goals.map((goal) => GOAL_LABELS[goal]),
    ...data.customGoals.filter(
      (goal) => goal.trim().length > 0,
    ),
  ];

  return (
    <div className="summary-response-group">
      <div className="summary-response-block">
        <h3>Desired Experience</h3>

        {goals.length > 0 ? (
          <div className="summary-tag-list">
            {goals.map((goal) => (
              <span
                key={goal}
                className="summary-tag"
              >
                {goal}
              </span>
            ))}
          </div>
        ) : (
          <p className="summary-empty-response">
            No experience goals selected.
          </p>
        )}
      </div>

      {data.notes.trim() && (
        <div className="summary-response-block">
          <h3>Additional Notes</h3>

          <div className="summary-written-response">
            {data.notes
              .split("\n")
              .filter((line) => line.trim())
              .map((line, index) => (
                <p key={index}>{line}</p>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}