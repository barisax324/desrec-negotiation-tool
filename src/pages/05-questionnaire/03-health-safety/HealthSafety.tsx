import { useState } from "react";

import Button from "@/shared/ui/button";
import PageLayout from "@/shared/ui/page-layout";

import { ACCESSIBILITY_OPTIONS } from "./data/accessibilityOptions";
import { MEDICAL_CONSIDERATIONS } from "./data/medicalOptions";

import BodyMap from "./components/BodyMap/BodyMap";
import SelectableOptionGroup from "./components/SelectableOptionGroup";
import type {
  EmergencyContactAvailable,
  HealthSafetyResponses,
  MedicalInformation,
  SelectedOptionResponse,
  SelectedOptionResponses,
} from "./types";

import "./HealthSafety.css";

interface HealthSafetyProps {
  initialResponses?: HealthSafetyResponses | null;

  back: () => void;

  next: (
    responses: HealthSafetyResponses,
  ) => void;

  onSaveAndReturnToSummary?: (
    responses: HealthSafetyResponses,
  ) => void;

  showNavigation?: boolean;
}

const EMPTY_MEDICAL_INFORMATION: MedicalInformation = {
  allergies: "",
  medications: "",
  conditions: "",
  additionalInformation: "",
};

function HealthSafety({
  initialResponses,
  back,
  next,
  onSaveAndReturnToSummary,
  showNavigation = true,
}: HealthSafetyProps) {
    const [
    medicalConsiderations,
    setMedicalConsiderations,
  ] = useState<SelectedOptionResponses>(
    initialResponses?.medicalConsiderations ??
      {},
  );

  const [
    accessibilitySupport,
    setAccessibilitySupport,
  ] = useState<SelectedOptionResponses>(
    initialResponses?.accessibilitySupport ??
      {},
  );

  const [
    additionalSupportInformation,
    setAdditionalSupportInformation,
  ] = useState(
    initialResponses?.additionalSupportInformation ??
      "",
  );

  const [
    medicalInformation,
    setMedicalInformation,
  ] = useState<MedicalInformation>(
    initialResponses?.medicalInformation ??
      EMPTY_MEDICAL_INFORMATION,
  );

const [
  emergencyContactAvailable,
  setEmergencyContactAvailable,
] = useState<
  EmergencyContactAvailable | null
>(
  initialResponses?.emergencyContactAvailable ??
    null,
);

  const [
    whyThisMattersOpen,
    setWhyThisMattersOpen,
  ] = useState(false);

  function updateSelectedOption(
    setter: React.Dispatch<
      React.SetStateAction<SelectedOptionResponses>
    >,
    optionId: string,
    response: SelectedOptionResponse,
  ) {
    setter((currentResponses) => ({
      ...currentResponses,
      [optionId]: response,
    }));
  }

  function updateMedicalInformation(
    field: keyof MedicalInformation,
    value: string,
  ) {
    setMedicalInformation(
      (currentInformation) => ({
        ...currentInformation,
        [field]: value,
      }),
    );
  }

function createResponses(): HealthSafetyResponses {
  return {
    medicalConsiderations,
    medicalInformation,
    emergencyContactAvailable,
    accessibilitySupport,
    additionalSupportInformation,
  };
}

  function handleContinue() {
    next(createResponses());
  }

  function handleSaveAndReturn() {
    onSaveAndReturnToSummary?.(
      createResponses(),
    );
  }

  return (
    <PageLayout
      title="Health & Safety"
      subtitle="Help your partner understand your body, any medical considerations, and anything that helps create a safer, more enjoyable experience."
    >
      <section className="health-safety-page">
        <div className="health-introduction">
          <p>
            Every field on this page is optional.
            Include only the information that feels
            relevant to this negotiation.
          </p>

          <div className="health-reminder">
            <span aria-hidden="true">ⓘ</span>

            <p>
              This is not a medical intake form. You
              do not need to provide a diagnosis or
              explain anything you do not want to
              share.
            </p>
          </div>
        </div>

        <section className="health-section">
          <div className="health-section-heading">
            <div>
              <h2>
                General Medical Considerations
              </h2>

              <p>
                Select anything that may be relevant
                during play. You can add optional
                details to each selected item.
              </p>
            </div>

            <span className="health-optional-label">
              Optional
            </span>
          </div>

          <SelectableOptionGroup
            options={MEDICAL_CONSIDERATIONS}
            responses={medicalConsiderations}
            onChange={(optionId, response) =>
              updateSelectedOption(
                setMedicalConsiderations,
                optionId,
                response,
              )
            }
          />
        </section>

        <section className="health-section">
          <div className="health-section-heading">
            <div>
              <h2>Body Map</h2>

              <p>
                Mark any areas that deserve
                additional attention and add optional
                information for your partner.
              </p>
            </div>

            <span className="health-optional-label">
              Optional
            </span>
          </div>

          <BodyMap />
        </section>

        <section className="health-section">
          <div className="health-section-heading">
            <div>
              <h2>
                Accessibility &amp; Support
              </h2>

              <p>
                Select anything that would help you
                remain physically comfortable or
                supported.
              </p>
            </div>

            <span className="health-optional-label">
              Optional
            </span>
          </div>

          <SelectableOptionGroup
            options={ACCESSIBILITY_OPTIONS}
            responses={accessibilitySupport}
            notesLabel="Additional details (optional)"
            onChange={(optionId, response) =>
              updateSelectedOption(
                setAccessibilitySupport,
                optionId,
                response,
              )
            }
          />

          <div className="health-field health-support-field">
            <label htmlFor="additional-support-information">
              Anything Else That Would Help You Feel
              Physically Comfortable or Supported?
            </label>

            <textarea
              id="additional-support-information"
              value={additionalSupportInformation}
              onChange={(event) =>
                setAdditionalSupportInformation(
                  event.target.value,
                )
              }
              placeholder="Add anything that does not fit the options above."
            />
          </div>
        </section>

        <section className="health-section">
          <div className="health-section-heading">
            <div>
              <h2>Medical Information</h2>

              <p>
                Add any broader medical information
                that may be relevant to play.
              </p>
            </div>

            <span className="health-optional-label">
              Optional
            </span>
          </div>

          <div className="health-field-list">
            <div className="health-field">
              <label htmlFor="health-allergies">
                Relevant Allergies
              </label>

              <textarea
                id="health-allergies"
                value={medicalInformation.allergies}
                onChange={(event) =>
                  updateMedicalInformation(
                    "allergies",
                    event.target.value,
                  )
                }
                placeholder="Include allergies that may affect products, materials, food, medications, or the environment."
              />
            </div>

            <div className="health-field">
              <label htmlFor="health-medications">
                Relevant Medications
              </label>

              <textarea
                id="health-medications"
                value={
                  medicalInformation.medications
                }
                onChange={(event) =>
                  updateMedicalInformation(
                    "medications",
                    event.target.value,
                  )
                }
                placeholder="Include only medications your partner may need to know about."
              />
            </div>

            <div className="health-field">
              <label htmlFor="health-conditions">
                Medical Conditions Relevant to Play
              </label>

              <textarea
                id="health-conditions"
                value={medicalInformation.conditions}
                onChange={(event) =>
                  updateMedicalInformation(
                    "conditions",
                    event.target.value,
                  )
                }
                placeholder="Share any conditions, symptoms, or warning signs that may affect play."
              />
            </div>

            <div className="health-field">
              <label htmlFor="health-additional-information">
                Anything Else Your Partner Should
                Know
              </label>

              <textarea
                id="health-additional-information"
                value={
                  medicalInformation
                    .additionalInformation
                }
                onChange={(event) =>
                  updateMedicalInformation(
                    "additionalInformation",
                    event.target.value,
                  )
                }
                placeholder="Add any other health or safety information that does not fit above."
              />
            </div>
          </div>
        </section>

<section className="health-section">
  <div className="health-section-heading">
    <div>
      <h2>Emergency Contact</h2>

      <p>
        Do you have an emergency contact your
        partner could reach if needed?
      </p>
    </div>

    <span className="health-optional-label">
      Optional
    </span>
  </div>

  <div className="health-emergency-choice">
    <label className="health-emergency-option">
      <input
        type="radio"
        name="emergency-contact-available"
        value="yes"
        checked={
          emergencyContactAvailable === "yes"
        }
        onChange={() =>
          setEmergencyContactAvailable("yes")
        }
      />

      <span>Yes</span>
    </label>

    <label className="health-emergency-option">
      <input
        type="radio"
        name="emergency-contact-available"
        value="no"
        checked={
          emergencyContactAvailable === "no"
        }
        onChange={() =>
          setEmergencyContactAvailable("no")
        }
      />

      <span>No</span>
    </label>
  </div>

  <p className="health-field-help">
    Contact details are intentionally not collected
    here. Share them directly with your partner if
    appropriate.
  </p>
</section>

        <div className="health-why-card">
          <button
            type="button"
            className="health-why-header"
            aria-expanded={whyThisMattersOpen}
            onClick={() =>
              setWhyThisMattersOpen(
                (currentValue) =>
                  !currentValue,
              )
            }
          >
            <span>Why this matters</span>

            <span aria-hidden="true">
              {whyThisMattersOpen
                ? "−"
                : "+"}
            </span>
          </button>

          {whyThisMattersOpen && (
            <div className="health-why-content">
              <p>
                Health and accessibility needs can
                affect positioning, circulation,
                sensation, endurance, recovery, and
                how someone responds during play.
                Sharing relevant information helps
                both people make safer, more informed
                decisions.
              </p>

              <p>
                You are never required to share your
                full medical history. Focus only on
                what your partner may reasonably need
                to know for this negotiation.
              </p>
            </div>
          )}
        </div>

        <div className="health-privacy-reminder">
          <span aria-hidden="true">🔒</span>

          <p>
            <strong>
              Your health information is personal.
            </strong>{" "}
            Share only what you are comfortable
            including in this negotiation.
          </p>
        </div>

        {showNavigation && (
          <div className="health-navigation">
            <Button onClick={back}>
              Back
            </Button>

            {onSaveAndReturnToSummary && (
              <Button
                onClick={handleSaveAndReturn}
              >
                Return to Summary
              </Button>
            )}

            <Button onClick={handleContinue}>
              Continue
            </Button>
          </div>
        )}
              </section>
    </PageLayout>
  );
}

export default HealthSafety;

