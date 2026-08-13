import {
  ACCESSIBILITY_OPTIONS,
  MEDICAL_CONSIDERATIONS,
} from "@/pages/05-questionnaire/03-health-safety";

import type {
  HealthSafetyResponses,
  SelectedOptionResponses,
} from "../../../05-questionnaire/03-health-safety";

interface HealthSummaryProps {
  responses: HealthSafetyResponses | null;
}

function SelectedOptions({
  responses,
  options,
}: {
  responses: SelectedOptionResponses;
  options: { id: string; label: string }[];
}) {
  const selected = options.filter(
    (option) => responses[option.id]?.selected,
  );

  if (selected.length === 0) {
    return (
      <p className="summary-empty-response">
        None provided.
      </p>
    );
  }

  return (
    <div className="summary-tag-list">
      {selected.map((option) => (
        <span
          key={option.id}
          className="summary-tag"
        >
          {option.label}
        </span>
      ))}
    </div>
  );
}

export default function HealthSummary({
  responses,
}: HealthSummaryProps) {
  if (!responses) {
    return (
      <p className="summary-empty-response">
        No health information provided.
      </p>
    );
  }

  const {
    medicalConsiderations,
    accessibilitySupport,
    medicalInformation,
    emergencyContactAvailable,
    additionalSupportInformation,
  } = responses;

  return (
    <div className="summary-response-group">
      <div className="summary-response-block">
        <h3>Medical Considerations</h3>

        <SelectedOptions
          responses={medicalConsiderations}
          options={MEDICAL_CONSIDERATIONS}
        />
      </div>

      <div className="summary-response-block">
        <h3>Accessibility & Support</h3>

        <SelectedOptions
          responses={accessibilitySupport}
          options={ACCESSIBILITY_OPTIONS}
        />

        {additionalSupportInformation.trim() && (
          <p className="summary-written-response">
            {additionalSupportInformation}
          </p>
        )}
      </div>

      {(medicalInformation.allergies ||
        medicalInformation.medications ||
        medicalInformation.conditions ||
        medicalInformation.additionalInformation) && (
        <div className="summary-response-block">
          <h3>Medical Information</h3>

          {medicalInformation.allergies && (
            <>
              <strong>Allergies</strong>
              <p>{medicalInformation.allergies}</p>
            </>
          )}

          {medicalInformation.medications && (
            <>
              <strong>Medications</strong>
              <p>{medicalInformation.medications}</p>
            </>
          )}

          {medicalInformation.conditions && (
            <>
              <strong>Conditions</strong>
              <p>{medicalInformation.conditions}</p>
            </>
          )}

          {medicalInformation.additionalInformation && (
            <>
              <strong>Additional Information</strong>
              <p>
                {
                  medicalInformation.additionalInformation
                }
              </p>
            </>
          )}
        </div>
      )}

{emergencyContactAvailable && (
  <div className="summary-response-block">
    <h3>Emergency Contact</h3>

    <p>
      {emergencyContactAvailable === "yes"
        ? "Has an emergency contact available."
        : "Does not have an emergency contact available."}
    </p>
  </div>
)}
    </div>
  );
}

