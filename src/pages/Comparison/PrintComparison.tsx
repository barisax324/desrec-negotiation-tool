import type {
  ExperienceLevel,
  OnboardingData,
  OnboardingRole,
} from "../Onboarding/types";

import type {
  SceneGoal,
  SceneGoalsData,
} from "../Questionnaire/SceneGoals/SceneGoals";

import type {
  ActivityResponse,
  ActivityResponses,
  InterestLevel,
} from "../Questionnaire/Activities/types";

import type {
  HealthSafetyResponses,
  SelectedOptionResponses,
} from "../HealthSafety/types";

import type { CommunicationFormData } from "../Communication/CommunicationPage";
import type { AftercareResponses } from "../../components/Aftercare/AftercarePage";
import type { BodyRegionStatus } from "../HealthSafety/data/bodyMapOptions";

import { ACTIVITY_LOOKUP } from "../Questionnaire/Activities/activitylookup";
import { MEDICAL_CONSIDERATIONS } from "../HealthSafety/data/medicalOptions";
import { ACCESSIBILITY_OPTIONS } from "../HealthSafety/data/accessibilityOptions";

import {
  CHECK_IN_OPTIONS,
  COMMUNICATION_HABIT_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  SAFEWORD_OPTIONS,
  SOMETHING_WRONG_OPTIONS,
  type CommunicationOption,
} from "../Communication/communicationOptions";

import {
  AFTERCARE_HELP_OPTIONS,
  FOLLOW_UP_OPTIONS,
} from "../../components/Aftercare/aftercareOptions";

import "./PrintComparison.css";

interface BodyMapData {
  statuses: Record<
    string,
    BodyRegionStatus
  >;

  notes: Record<
    string,
    string
  >;
}

export interface PrintParticipantResponses {
  onboardingData?:
    | OnboardingData
    | null;

  sceneGoals?:
    SceneGoalsData;

  activities?:
    ActivityResponses;

  healthSafety?:
    | HealthSafetyResponses
    | null;

  bodyMap?:
    | BodyMapData
    | null;

  communication?:
    | CommunicationFormData
    | null;

  aftercare?:
    | AftercareResponses
    | null;
}

interface PrintComparisonProps {
  publicId: string;
  negotiationName: string | null;
  sceneDate: string | null;
  sceneDateUnknown: boolean;
  participantAName: string;
  participantBName: string;
  participantA: PrintParticipantResponses;
  participantB: PrintParticipantResponses;
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
  "some-experience":
    "Some Experience",
  comfortable: "Comfortable",
  "very-experienced":
    "Very Experienced",
  "teaching-facilitating":
    "Teaching or Facilitating",
};

const GOAL_LABELS: Record<
  ExperienceGoal,
  string
> = {
  "emotional-connection":
    "Emotional Connection & Intimacy",
  relaxed:
    "Relaxed & Low Pressure",
  "skill-building":
    "Skill Building & Exploration",
  "high-protocol":
    "High Protocol & Formal Roles",
  catharsis:
    "Stress Relief & Emotional Catharsis",
  playful:
    "Playful Fun & Laughter",
  sensual:
    "Sensual Exploration",
  meditative:
    "Meditative & Flow State",
  "aftercare-focused":
    "Aftercare & Recovery Focused",
  beautiful:
    "Beautiful & Aesthetic",
  controlled: "Controlled",
  dominant: "Dominant",
  submissive: "Submissive",
  energetic:
    "Energetic & Intense",
  overwhelmed: "Overwhelmed",
  serious:
    "Serious & Intentional",
  unsure:
    "Unsure / Open to Discussion",
};

const REGION_LABELS: Record<
  string,
  string
> = {
  "front-head": "Head",
  "front-neck": "Neck",
  "front-chest": "Chest",
  "front-abdomen": "Abdomen",
  "front-pelvis": "Pelvis",
  "front-left-upper-arm":
    "Left Upper Arm",
  "front-right-upper-arm":
    "Right Upper Arm",
  "front-left-forearm":
    "Left Forearm",
  "front-right-forearm":
    "Right Forearm",
  "front-left-hand": "Left Hand",
  "front-right-hand": "Right Hand",
  "front-left-thigh":
    "Left Thigh",
  "front-right-thigh":
    "Right Thigh",
  "front-left-lower-leg":
    "Left Lower Leg",
  "front-right-lower-leg":
    "Right Lower Leg",
  "front-left-foot": "Left Foot",
  "front-right-foot":
    "Right Foot",

  "back-head": "Back of Head",
  "back-neck": "Back of Neck",
  "back-chest": "Back / Chest",
  "back-upper-back":
    "Upper Back",
  "back-lower-back":
    "Lower Back",
  "back-pelvis": "Pelvis",
  "back-left-upper-arm":
    "Left Upper Arm",
  "back-right-upper-arm":
    "Right Upper Arm",
  "back-left-forearm":
    "Left Forearm",
  "back-right-forearm":
    "Right Forearm",
  "back-left-hand": "Left Hand",
  "back-right-hand": "Right Hand",
  "back-left-thigh":
    "Left Thigh",
  "back-right-thigh":
    "Right Thigh",
  "back-left-lower-leg":
    "Left Lower Leg",
  "back-right-lower-leg":
    "Right Lower Leg",
  "back-left-foot": "Left Foot",
  "back-right-foot": "Right Foot",
};

const STATUS_LABELS: Record<
  BodyRegionStatus,
  string
> = {
  fine: "Fine",
  "ask-first": "Ask First",
  sensitive: "Sensitive",
  avoid: "Avoid",
  "medical-consideration":
    "Medical Consideration",
};

function formatSceneDate(
  sceneDate: string,
): string {
  const parsedDate = new Date(
    `${sceneDate}T00:00:00`,
  );

  if (
    Number.isNaN(
      parsedDate.getTime(),
    )
  ) {
    return sceneDate;
  }

  return parsedDate.toLocaleDateString(
    undefined,
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  );
}

function cleanText(
  value:
    | string
    | null
    | undefined,
): string {
  return value?.trim() ?? "";
}

function formatFallbackLabel(
  value: string,
): string {
  return value
    .replace(
      /([a-z0-9])([A-Z])/g,
      "$1 $2",
    )
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) =>
      letter.toUpperCase(),
    );
}

function formatRole(
  data?:
    | OnboardingData
    | null,
): string {
  if (!data?.role) {
    return "";
  }

  if (
    data.role === "other" &&
    data.otherRole.trim()
  ) {
    return data.otherRole.trim();
  }

  return ROLE_LABELS[data.role];
}

function formatExperience(
  data?:
    | OnboardingData
    | null,
): string {
  if (!data?.experience) {
    return "";
  }

  return EXPERIENCE_LABELS[
    data.experience
  ];
}

function getGoals(
  data?: SceneGoalsData,
): string {
  if (!data) {
    return "";
  }

  return [
    ...data.goals.map(
      (goal) =>
        GOAL_LABELS[goal],
    ),
    ...data.customGoals
      .map((goal) =>
        goal.trim(),
      )
      .filter(Boolean),
  ].join(" • ");
}

function interestLabel(
  level: InterestLevel,
): string {
  switch (level) {
    case 1:
      return "Hard Limit";

    case 2:
      return "Ask First";

    case 3:
      return "Interested";

    case 4:
      return "Very Interested";
  }
}

function hasActivityResponse(
  response?: ActivityResponse,
): boolean {
  if (!response) {
    return false;
  }

  return (
    response.interest !== null ||
    response.discussFurther ||
    response.hardLimit ||
    response.notes.trim().length >
      0
  );
}

function formatActivityResponse(
  response?: ActivityResponse,
): string {
  if (
    !hasActivityResponse(response)
  ) {
    return "";
  }

  const parts: string[] = [];

  if (response?.hardLimit) {
    parts.push("Hard Limit");
  } else if (
    response?.interest !== null &&
    response?.interest !==
      undefined
  ) {
    parts.push(
      interestLabel(
        response.interest,
      ),
    );
  }

  if (
    response?.discussFurther
  ) {
    parts.push("Discuss");
  }

  if (response?.notes.trim()) {
    parts.push(
      `Notes: ${response.notes.trim()}`,
    );
  }

  return parts.join(" • ");
}

function getSelectedLabels(
  responses:
    | SelectedOptionResponses
    | undefined,
  options: {
    id: string;
    label: string;
  }[],
): string {
  if (!responses) {
    return "";
  }

  return options
    .filter(
      (option) =>
        responses[option.id]
          ?.selected,
    )
    .map(
      (option) =>
        option.label,
    )
    .join(" • ");
}

function getCommunicationLabels(
  selectedIds:
    | string[]
    | undefined,
  options:
    CommunicationOption[],
): string {
  if (!selectedIds) {
    return "";
  }

  return selectedIds
    .map((id) => {
      const option =
        options.find(
          (candidate) =>
            candidate.id === id,
        );

      if (!option) {
        return "";
      }

      return option.discussionFlag
        ? `${option.label} · Discuss in person`
        : option.label;
    })
    .filter(Boolean)
    .join(" • ");
}

function getSafeword(
  responses:
    | CommunicationFormData
    | null
    | undefined,
): string {
  if (!responses?.safewordType) {
    return "";
  }

  if (
    responses.safewordType ===
    "custom"
  ) {
    return cleanText(
      responses.customSafeword,
    );
  }

  return (
    SAFEWORD_OPTIONS.find(
      (option) =>
        option.id ===
        responses.safewordType,
    )?.label ?? ""
  );
}

function getDiscussionFlags(
  responses:
    | CommunicationFormData
    | null
    | undefined,
): string {
  if (
    !responses ||
    responses.discussionFlags
      .length === 0
  ) {
    return "";
  }

  return responses.discussionFlags
    .map(
      (flag) =>
        `${flag.sectionLabel}: ${flag.optionLabel}`,
    )
    .join(" • ");
}

function getHelpfulAftercare(
  responses:
    | AftercareResponses
    | null
    | undefined,
): string {
  if (!responses) {
    return "";
  }

  const labels =
    responses.helpfulItems
      .map(
        (id) =>
          AFTERCARE_HELP_OPTIONS.find(
            (option) =>
              option.id === id,
          )?.label,
      )
      .filter(
        (
          label,
        ): label is string =>
          Boolean(label),
      );

  const other = cleanText(
    responses.helpfulItemsOther,
  );

  if (other) {
    labels.push(other);
  }

  return labels.join(" • ");
}

function getFollowUp(
  responses:
    | AftercareResponses
    | null
    | undefined,
): string {
  if (
    !responses
      ?.followUpPreference
  ) {
    return "";
  }

  return (
    FOLLOW_UP_OPTIONS.find(
      (option) =>
        option.id ===
        responses.followUpPreference,
    )?.label ?? ""
  );
}

function formatBodyMapResponse(
  bodyMap:
    | BodyMapData
    | null
    | undefined,
  regionId: string,
): string {
  const status =
    bodyMap?.statuses[
      regionId
    ];

  const note = cleanText(
    bodyMap?.notes[regionId],
  );

  if (
    (!status ||
      status === "fine") &&
    !note
  ) {
    return "";
  }

  const parts: string[] = [];

  if (
    status &&
    status !== "fine"
  ) {
    parts.push(
      STATUS_LABELS[status],
    );
  }

  if (note) {
    parts.push(
      `Notes: ${note}`,
    );
  }

  return parts.join(" • ");
}

function PrintRow({
  label,
  participantA,
  participantB,
}: {
  label: string;
  participantA: string;
  participantB: string;
}) {
  const answerA =
    cleanText(participantA);

  const answerB =
    cleanText(participantB);

  if (!answerA && !answerB) {
    return null;
  }

  return (
    <div className="print-comparison-row">
      <div className="print-comparison-label">
        {label}
      </div>

      <div>
        {answerA || "—"}
      </div>

      <div>
        {answerB || "—"}
      </div>
    </div>
  );
}

export default function PrintComparison({
  publicId,
  negotiationName,
  sceneDate,
  sceneDateUnknown,
  participantAName,
  participantBName,
  participantA,
  participantB,
}: PrintComparisonProps) {
  const activityIds =
    Array.from(
      new Set([
        ...Object.keys(
          participantA.activities ??
            {},
        ),
        ...Object.keys(
          participantB.activities ??
            {},
        ),
      ]),
    );

  const bodyRegionIds =
    Array.from(
      new Set([
        ...Object.keys(
          participantA.bodyMap
            ?.statuses ?? {},
        ),
        ...Object.keys(
          participantB.bodyMap
            ?.statuses ?? {},
        ),
        ...Object.keys(
          participantA.bodyMap
            ?.notes ?? {},
        ),
        ...Object.keys(
          participantB.bodyMap
            ?.notes ?? {},
        ),
      ]),
    ).filter((regionId) => {
      return Boolean(
        formatBodyMapResponse(
          participantA.bodyMap,
          regionId,
        ) ||
          formatBodyMapResponse(
            participantB.bodyMap,
            regionId,
          ),
      );
    });

  return (
    <article className="print-comparison">
      <header className="print-comparison-header">
        <div>
          <p className="print-comparison-organization">
            Desert Rope Education
            Collective
          </p>

          <h1>
            Negotiation Comparison
          </h1>

          <p className="print-comparison-name">
            {negotiationName ||
              "Untitled Negotiation"}
          </p>
        </div>

        <dl className="print-comparison-meta">
          <div>
            <dt>
              Reference ID
            </dt>

            <dd>
              {publicId}
            </dd>
          </div>

          <div>
            <dt>
              Scene Date
            </dt>

            <dd>
              {sceneDateUnknown
                ? "Not decided"
                : sceneDate
                  ? formatSceneDate(
                      sceneDate,
                    )
                  : "Not decided"}
            </dd>
          </div>
        </dl>
      </header>

      <div className="print-comparison-columns">
        <strong>Topic</strong>

        <strong>
          {participantAName}
        </strong>

        <strong>
          {participantBName}
        </strong>
      </div>

      <section className="print-comparison-section">
        <h2>About You</h2>

        <PrintRow
          label="Role"
          participantA={formatRole(
            participantA.onboardingData,
          )}
          participantB={formatRole(
            participantB.onboardingData,
          )}
        />

        <PrintRow
          label="Experience"
          participantA={formatExperience(
            participantA.onboardingData,
          )}
          participantB={formatExperience(
            participantB.onboardingData,
          )}
        />
      </section>

      <section className="print-comparison-section">
        <h2>
          Experience Goals
        </h2>

        <PrintRow
          label="Desired Experience"
          participantA={getGoals(
            participantA.sceneGoals,
          )}
          participantB={getGoals(
            participantB.sceneGoals,
          )}
        />

        <PrintRow
          label="Additional Notes"
          participantA={
            participantA.sceneGoals
              ?.notes ?? ""
          }
          participantB={
            participantB.sceneGoals
              ?.notes ?? ""
          }
        />
      </section>

      <section className="print-comparison-section">
        <h2>Activities</h2>

        {activityIds.map(
          (activityId) => {
            const activity =
              ACTIVITY_LOOKUP[
                activityId
              ];

            if (!activity) {
              return null;
            }

            const responseA =
              participantA.activities?.[
                activityId
              ];

            const responseB =
              participantB.activities?.[
                activityId
              ];

            return (
              <PrintRow
                key={activityId}
                label={
                  activity.label
                }
                participantA={formatActivityResponse(
                  responseA,
                )}
                participantB={formatActivityResponse(
                  responseB,
                )}
              />
            );
          },
        )}
      </section>

      <section className="print-comparison-section">
        <h2>
          Health &amp; Safety
        </h2>

        <PrintRow
          label="Medical Considerations"
          participantA={getSelectedLabels(
            participantA.healthSafety
              ?.medicalConsiderations,
            MEDICAL_CONSIDERATIONS,
          )}
          participantB={getSelectedLabels(
            participantB.healthSafety
              ?.medicalConsiderations,
            MEDICAL_CONSIDERATIONS,
          )}
        />

        <PrintRow
          label="Accessibility & Support"
          participantA={getSelectedLabels(
            participantA.healthSafety
              ?.accessibilitySupport,
            ACCESSIBILITY_OPTIONS,
          )}
          participantB={getSelectedLabels(
            participantB.healthSafety
              ?.accessibilitySupport,
            ACCESSIBILITY_OPTIONS,
          )}
        />

        <PrintRow
          label="Additional Support Information"
          participantA={
            participantA.healthSafety
              ?.additionalSupportInformation ??
            ""
          }
          participantB={
            participantB.healthSafety
              ?.additionalSupportInformation ??
            ""
          }
        />

        <PrintRow
          label="Allergies"
          participantA={
            participantA.healthSafety
              ?.medicalInformation
              .allergies ?? ""
          }
          participantB={
            participantB.healthSafety
              ?.medicalInformation
              .allergies ?? ""
          }
        />

        <PrintRow
          label="Medications"
          participantA={
            participantA.healthSafety
              ?.medicalInformation
              .medications ?? ""
          }
          participantB={
            participantB.healthSafety
              ?.medicalInformation
              .medications ?? ""
          }
        />

        <PrintRow
          label="Conditions"
          participantA={
            participantA.healthSafety
              ?.medicalInformation
              .conditions ?? ""
          }
          participantB={
            participantB.healthSafety
              ?.medicalInformation
              .conditions ?? ""
          }
        />

        <PrintRow
          label="Additional Medical Information"
          participantA={
            participantA.healthSafety
              ?.medicalInformation
              .additionalInformation ??
            ""
          }
          participantB={
            participantB.healthSafety
              ?.medicalInformation
              .additionalInformation ??
            ""
          }
        />

        <PrintRow
          label="Emergency Contact"
          participantA={
            participantA.healthSafety
              ?.emergencyInformation
              .name ?? ""
          }
          participantB={
            participantB.healthSafety
              ?.emergencyInformation
              .name ?? ""
          }
        />

        <PrintRow
          label="Relationship"
          participantA={
            participantA.healthSafety
              ?.emergencyInformation
              .relationship ?? ""
          }
          participantB={
            participantB.healthSafety
              ?.emergencyInformation
              .relationship ?? ""
          }
        />

        <PrintRow
          label="Emergency Phone"
          participantA={
            participantA.healthSafety
              ?.emergencyInformation
              .phone ?? ""
          }
          participantB={
            participantB.healthSafety
              ?.emergencyInformation
              .phone ?? ""
          }
        />

        <PrintRow
          label="Emergency Instructions"
          participantA={
            participantA.healthSafety
              ?.emergencyInformation
              .instructions ?? ""
          }
          participantB={
            participantB.healthSafety
              ?.emergencyInformation
              .instructions ?? ""
          }
        />
      </section>

      {bodyRegionIds.length > 0 && (
        <section className="print-comparison-section">
          <h2>Body Map</h2>

          {bodyRegionIds.map(
            (regionId) => (
              <PrintRow
                key={regionId}
                label={
                  REGION_LABELS[
                    regionId
                  ] ??
                  formatFallbackLabel(
                    regionId,
                  )
                }
                participantA={formatBodyMapResponse(
                  participantA.bodyMap,
                  regionId,
                )}
                participantB={formatBodyMapResponse(
                  participantB.bodyMap,
                  regionId,
                )}
              />
            ),
          )}
        </section>
      )}

      <section className="print-comparison-section">
        <h2>
          Communication &amp;
          Boundaries
        </h2>

        <PrintRow
          label="Check-ins"
          participantA={getCommunicationLabels(
            participantA.communication
              ?.checkIns,
            CHECK_IN_OPTIONS,
          )}
          participantB={getCommunicationLabels(
            participantB.communication
              ?.checkIns,
            CHECK_IN_OPTIONS,
          )}
        />

        <PrintRow
          label="Communication Style"
          participantA={getCommunicationLabels(
            participantA.communication
              ?.communicationStyle,
            COMMUNICATION_STYLE_OPTIONS,
          )}
          participantB={getCommunicationLabels(
            participantB.communication
              ?.communicationStyle,
            COMMUNICATION_STYLE_OPTIONS,
          )}
        />

        <PrintRow
          label="If Something Feels Wrong"
          participantA={getCommunicationLabels(
            participantA.communication
              ?.somethingWrong,
            SOMETHING_WRONG_OPTIONS,
          )}
          participantB={getCommunicationLabels(
            participantB.communication
              ?.somethingWrong,
            SOMETHING_WRONG_OPTIONS,
          )}
        />

        <PrintRow
          label="Safewords & Signals"
          participantA={getSafeword(
            participantA.communication,
          )}
          participantB={getSafeword(
            participantB.communication,
          )}
        />

        <PrintRow
          label="Communication Habits"
          participantA={getCommunicationLabels(
            participantA.communication
              ?.communicationHabits,
            COMMUNICATION_HABIT_OPTIONS,
          )}
          participantB={getCommunicationLabels(
            participantB.communication
              ?.communicationHabits,
            COMMUNICATION_HABIT_OPTIONS,
          )}
        />

        <PrintRow
          label="Discuss in Person"
          participantA={getDiscussionFlags(
            participantA.communication,
          )}
          participantB={getDiscussionFlags(
            participantB.communication,
          )}
        />

        <PrintRow
          label="Additional Communication Notes"
          participantA={
            participantA.communication
              ?.additionalNotes ?? ""
          }
          participantB={
            participantB.communication
              ?.additionalNotes ?? ""
          }
        />
      </section>

      <section className="print-comparison-section">
        <h2>Aftercare</h2>

        <PrintRow
          label="Helpful Aftercare"
          participantA={getHelpfulAftercare(
            participantA.aftercare,
          )}
          participantB={getHelpfulAftercare(
            participantB.aftercare,
          )}
        />

        <PrintRow
          label="Possible Responses"
          participantA={
            participantA.aftercare
              ?.possibleResponses ??
            ""
          }
          participantB={
            participantB.aftercare
              ?.possibleResponses ??
            ""
          }
        />

        <PrintRow
          label="What Helps Me Feel Cared For"
          participantA={
            participantA.aftercare
              ?.feelingCaredFor ?? ""
          }
          participantB={
            participantB.aftercare
              ?.feelingCaredFor ?? ""
          }
        />

        <PrintRow
          label="Please Avoid"
          participantA={
            participantA.aftercare
              ?.thingsToAvoid ?? ""
          }
          participantB={
            participantB.aftercare
              ?.thingsToAvoid ?? ""
          }
        />

        <PrintRow
          label="Preferred Follow-up"
          participantA={getFollowUp(
            participantA.aftercare,
          )}
          participantB={getFollowUp(
            participantB.aftercare,
          )}
        />

        <PrintRow
          label="Additional Notes"
          participantA={
            participantA.aftercare
              ?.additionalNotes ?? ""
          }
          participantB={
            participantB.aftercare
              ?.additionalNotes ?? ""
          }
        />
      </section>
    </article>
  );
}