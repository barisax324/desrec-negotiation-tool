import type {
  ExperienceLevel,
  OnboardingData,
  OnboardingRole,
} from "@/pages/04-onboarding/shared";

interface AboutYouComparisonProps {
  participantA?: OnboardingData | null;
  participantB?: OnboardingData | null;
}

const ROLE_LABELS: Record<
  OnboardingRole,
  string
> = {
  top: "Top",
  bottom: "Bottom",
  switch: "Switch",
  observer: "Observer",
  facilitator: "Facilitator",
  unsure: "Unsure",
  other: "Other",
};

const EXPERIENCE_LABELS: Record<
  ExperienceLevel,
  string
> = {
  "first-time": "First Time",
  learning: "Learning",
  "some-experience": "Some Experience",
  comfortable: "Comfortable",
  "very-experienced": "Very Experienced",
  "teaching-facilitating":
    "Teaching or Facilitating",
};

function hasText(
  value: string | null | undefined,
): boolean {
  return Boolean(value?.trim());
}

function getRoleLabel(
  data?: OnboardingData | null,
): string {
  if (!data?.role) {
    return "";
  }

  if (
    data.role === "other" &&
    hasText(data.otherRole)
  ) {
    return data.otherRole.trim();
  }

  return ROLE_LABELS[data.role];
}

function getExperienceLabel(
  data?: OnboardingData | null,
): string {
  if (!data?.experience) {
    return "";
  }

  return EXPERIENCE_LABELS[
    data.experience
  ];
}

function ComparisonValue({
  value,
}: {
  value: string;
}) {
  return (
    <div
      className={[
        "comparison-summary-value",
        !value
          ? "comparison-summary-value--empty"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {value || "No response"}
    </div>
  );
}

function ComparisonRow({
  label,
  participantA,
  participantB,
}: {
  label: string;
  participantA: string;
  participantB: string;
}) {
  if (!participantA && !participantB) {
    return null;
  }

  const isMatch =
    Boolean(participantA) &&
    participantA === participantB;

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
  <ComparisonValue
    value={participantA}
  />
</section>

<section className="comparison-summary-column">
  <ComparisonValue
    value={participantB}
  />
</section>
    </article>
  );
}

export default function AboutYouComparison({
  participantA,
  participantB,
}: AboutYouComparisonProps) {
  const nicknameA =
    participantA?.nickname.trim() ?? "";

  const nicknameB =
    participantB?.nickname.trim() ?? "";

  const roleA =
    getRoleLabel(participantA);

  const roleB =
    getRoleLabel(participantB);

  const experienceA =
    getExperienceLabel(participantA);

  const experienceB =
    getExperienceLabel(participantB);

  const hasAnyResponse =
    nicknameA ||
    nicknameB ||
    roleA ||
    roleB ||
    experienceA ||
    experienceB;

  if (!hasAnyResponse) {
    return null;
  }

  return (
    <section className="comparison-section">
      <h2>About You</h2>

      <div className="comparison-summary-row-list">
        <ComparisonRow
          label="Name"
          participantA={nicknameA}
          participantB={nicknameB}
        />

        <ComparisonRow
          label="Role in This Negotiation"
          participantA={roleA}
          participantB={roleB}
        />

        <ComparisonRow
          label="Experience"
          participantA={experienceA}
          participantB={experienceB}
        />
      </div>
    </section>
  );
}

