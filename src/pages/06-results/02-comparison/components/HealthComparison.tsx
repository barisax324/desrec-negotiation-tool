import {
  ACCESSIBILITY_OPTIONS,
  MEDICAL_CONSIDERATIONS,
} from "@/pages/05-questionnaire/03-health-safety";

import type {
  HealthSafetyResponses,
  SelectedOptionResponses,
} from "../../../05-questionnaire/03-health-safety";

interface HealthComparisonProps {
  participantA?: HealthSafetyResponses | null;
  participantB?: HealthSafetyResponses | null;
}

function hasText(
  value: string | null | undefined,
): boolean {
  return Boolean(value?.trim());
}

function getSelectedOptionLabels(
  responses: SelectedOptionResponses | undefined,
  options: { id: string; label: string }[],
): string[] {
  if (!responses) {
    return [];
  }

  return options
    .filter(
      (option) =>
        responses[option.id]?.selected,
    )
    .map((option) => option.label);
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

function ComparisonRow({
  label,
  participantA,
  participantB,
  isMatch = false,
  kind = "text",
}: {
  label: string;
  participantA: string | string[];
  participantB: string | string[];
  isMatch?: boolean;
  kind?: "text" | "tags";
}) {
  const hasParticipantA =
    Array.isArray(participantA)
      ? participantA.length > 0
      : hasText(participantA);

  const hasParticipantB =
    Array.isArray(participantB)
      ? participantB.length > 0
      : hasText(participantB);

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

export default function HealthComparison({
  participantA,
  participantB,
}: HealthComparisonProps) {
  const medicalA =
    getSelectedOptionLabels(
      participantA?.medicalConsiderations,
      MEDICAL_CONSIDERATIONS,
    );

  const medicalB =
    getSelectedOptionLabels(
      participantB?.medicalConsiderations,
      MEDICAL_CONSIDERATIONS,
    );

  const accessibilityA =
    getSelectedOptionLabels(
      participantA?.accessibilitySupport,
      ACCESSIBILITY_OPTIONS,
    );

  const accessibilityB =
    getSelectedOptionLabels(
      participantB?.accessibilitySupport,
      ACCESSIBILITY_OPTIONS,
    );

  const supportA =
    participantA?.additionalSupportInformation.trim() ??
    "";

  const supportB =
    participantB?.additionalSupportInformation.trim() ??
    "";

  const allergiesA =
    participantA?.medicalInformation.allergies.trim() ??
    "";

  const allergiesB =
    participantB?.medicalInformation.allergies.trim() ??
    "";

  const medicationsA =
    participantA?.medicalInformation.medications.trim() ??
    "";

  const medicationsB =
    participantB?.medicalInformation.medications.trim() ??
    "";

  const conditionsA =
    participantA?.medicalInformation.conditions.trim() ??
    "";

  const conditionsB =
    participantB?.medicalInformation.conditions.trim() ??
    "";

  const additionalMedicalA =
    participantA?.medicalInformation.additionalInformation.trim() ??
    "";

  const additionalMedicalB =
    participantB?.medicalInformation.additionalInformation.trim() ??
    "";

  const emergencyNameA =
    participantA?.emergencyInformation.name.trim() ??
    "";

  const emergencyNameB =
    participantB?.emergencyInformation.name.trim() ??
    "";

  const emergencyRelationshipA =
    participantA?.emergencyInformation.relationship.trim() ??
    "";

  const emergencyRelationshipB =
    participantB?.emergencyInformation.relationship.trim() ??
    "";

  const emergencyPhoneA =
    participantA?.emergencyInformation.phone.trim() ??
    "";

  const emergencyPhoneB =
    participantB?.emergencyInformation.phone.trim() ??
    "";

  const emergencyInstructionsA =
    participantA?.emergencyInformation.instructions.trim() ??
    "";

  const emergencyInstructionsB =
    participantB?.emergencyInformation.instructions.trim() ??
    "";

  const hasAnyResponse =
    medicalA.length > 0 ||
    medicalB.length > 0 ||
    accessibilityA.length > 0 ||
    accessibilityB.length > 0 ||
    supportA ||
    supportB ||
    allergiesA ||
    allergiesB ||
    medicationsA ||
    medicationsB ||
    conditionsA ||
    conditionsB ||
    additionalMedicalA ||
    additionalMedicalB ||
    emergencyNameA ||
    emergencyNameB ||
    emergencyRelationshipA ||
    emergencyRelationshipB ||
    emergencyPhoneA ||
    emergencyPhoneB ||
    emergencyInstructionsA ||
    emergencyInstructionsB;

  if (!hasAnyResponse) {
    return null;
  }

  return (
    <section className="comparison-section">
      <h2>Health &amp; Safety</h2>

      <div className="comparison-summary-row-list">
        <ComparisonRow
          label="Medical Considerations"
          participantA={medicalA}
          participantB={medicalB}
          kind="tags"
          isMatch={arraysMatch(
            medicalA,
            medicalB,
          )}
        />

        <ComparisonRow
          label="Accessibility & Support"
          participantA={accessibilityA}
          participantB={accessibilityB}
          kind="tags"
          isMatch={arraysMatch(
            accessibilityA,
            accessibilityB,
          )}
        />

        <ComparisonRow
          label="Additional Support Information"
          participantA={supportA}
          participantB={supportB}
          isMatch={
            Boolean(supportA) &&
            supportA === supportB
          }
        />

        <ComparisonRow
          label="Allergies"
          participantA={allergiesA}
          participantB={allergiesB}
          isMatch={
            Boolean(allergiesA) &&
            allergiesA === allergiesB
          }
        />

        <ComparisonRow
          label="Medications"
          participantA={medicationsA}
          participantB={medicationsB}
          isMatch={
            Boolean(medicationsA) &&
            medicationsA === medicationsB
          }
        />

        <ComparisonRow
          label="Conditions"
          participantA={conditionsA}
          participantB={conditionsB}
          isMatch={
            Boolean(conditionsA) &&
            conditionsA === conditionsB
          }
        />

        <ComparisonRow
          label="Additional Medical Information"
          participantA={additionalMedicalA}
          participantB={additionalMedicalB}
          isMatch={
            Boolean(additionalMedicalA) &&
            additionalMedicalA ===
              additionalMedicalB
          }
        />

        <ComparisonRow
          label="Emergency Contact"
          participantA={emergencyNameA}
          participantB={emergencyNameB}
          isMatch={
            Boolean(emergencyNameA) &&
            emergencyNameA ===
              emergencyNameB
          }
        />

        <ComparisonRow
          label="Relationship"
          participantA={
            emergencyRelationshipA
          }
          participantB={
            emergencyRelationshipB
          }
          isMatch={
            Boolean(
              emergencyRelationshipA,
            ) &&
            emergencyRelationshipA ===
              emergencyRelationshipB
          }
        />

        <ComparisonRow
          label="Phone"
          participantA={emergencyPhoneA}
          participantB={emergencyPhoneB}
          isMatch={
            Boolean(emergencyPhoneA) &&
            emergencyPhoneA ===
              emergencyPhoneB
          }
        />

        <ComparisonRow
          label="Emergency Instructions"
          participantA={
            emergencyInstructionsA
          }
          participantB={
            emergencyInstructionsB
          }
          isMatch={
            Boolean(
              emergencyInstructionsA,
            ) &&
            emergencyInstructionsA ===
              emergencyInstructionsB
          }
        />
      </div>
    </section>
  );
}

