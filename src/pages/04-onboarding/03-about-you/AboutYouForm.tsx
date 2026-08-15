import type { ChangeEvent } from "react";

import type {
  OnboardingData,
  OnboardingRole,
} from "../shared";
import "./AboutYou.css";

interface AboutYouFormProps {
  data: OnboardingData;
  updateData: (
    updates: Partial<OnboardingData>,
  ) => void;
}

interface RoleOption {
  value: OnboardingRole;
  label: string;
  description: string;
}

const ROLE_OPTIONS: RoleOption[] = [
  {
    value: "top",
    label: "Top",
    description:
      "Directing, initiating, or taking the active role during the scene.",
  },
  {
    value: "bottom",
    label: "Bottom",
    description:
      "Receiving, following, or taking the receptive role during the scene.",
  },
  {
    value: "switch",
    label: "Switch",
    description:
      "Planning to participate in both active and receptive roles during the scene.",
  },
  {
    value: "observer",
    label: "Observer",
    description:
      "Present as a witness, audience member, photographer, or silent participant.",
  },
  {
    value: "facilitator",
    label: "Facilitator",
    description:
      "Supporting safety, education, timekeeping, or overall scene management.",
  },
  {
    value: "unsure",
    label: "Unsure",
    description:
      "Still exploring or discussing what role feels right today.",
  },
  {
    value: "other",
    label: "Other",
    description:
      "A role or dynamic not represented above.",
  },
];

function AboutYouForm({
  data,
  updateData,
}: AboutYouFormProps) {
  function handleNicknameChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    updateData({
      nickname: event.target.value,
    });
  }

  function handleRoleSelect(
    role: OnboardingRole,
  ) {
    updateData({
      role,
      otherRole:
        role === "other"
          ? data.otherRole
          : "",
    });
  }

  function handleOtherRoleChange(
    event: ChangeEvent<HTMLInputElement>,
  ) {
    updateData({
      otherRole: event.target.value,
    });
  }

  return (
    <div className="about-you">
      <section className="about-you-section">
        <div className="about-you-section-heading">
          <div>
            <h2>
              What would you like to be called?
            </h2>

            <span className="about-you-optional">
              Optional
            </span>
          </div>

          <p>
           This name will appear in your summary, the completed comparison, and downloaded PDF.
          </p>
        </div>

        <label
          className="about-you-nickname-field"
          htmlFor="onboarding-nickname"
        >
          <span
            className="about-you-input-icon"
            aria-hidden="true"
          >
            ♙
          </span>

          <input
            id="onboarding-nickname"
            type="text"
            value={data.nickname}
            onChange={handleNicknameChange}
            placeholder="Nickname or first name"
            autoComplete="nickname"
            maxLength={60}
          />
        </label>

        <p className="about-you-helper-text">
          <span aria-hidden="true">ⓘ</span>

          Your personal link remains the only way to
          access your side of the negotiation.
        </p>
      </section>

      <section
        className="about-you-section"
        aria-labelledby="planned-role-heading"
      >
        <div className="about-you-section-heading">
          <div>
            <h2 id="planned-role-heading">
              What best describes your role in this
              negotiation?
            </h2>

            <span className="about-you-required">
              Required
            </span>
          </div>

          <p>
            Choose the option that best matches your
            planned participation.
          </p>
        </div>

        <div
          className="about-you-role-list"
          role="radiogroup"
          aria-labelledby="planned-role-heading"
        >
          {ROLE_OPTIONS.map((option) => {
            const isSelected =
              data.role === option.value;

            return (
              <button
                key={option.value}
                type="button"
                className={[
                  "about-you-role-card",
                  isSelected
                    ? "about-you-role-card-selected"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                role="radio"
                aria-checked={isSelected}
                onClick={() =>
                  handleRoleSelect(
                    option.value,
                  )
                }
              >
                <span className="about-you-role-copy">
                  <strong>
                    {option.label}
                  </strong>

                  <span>
                    {option.description}
                  </span>
                </span>

                <span
                  className="about-you-radio"
                  aria-hidden="true"
                >
                  <span />
                </span>
              </button>
            );
          })}
        </div>

        {data.role === "other" && (
          <div className="about-you-other-field">
            <label htmlFor="onboarding-other-role">
              Describe your planned role
              <span>Optional</span>
            </label>

            <input
              id="onboarding-other-role"
              type="text"
              value={data.otherRole}
              onChange={handleOtherRoleChange}
              placeholder="Enter your role or dynamic"
              maxLength={100}
              autoFocus
            />
          </div>
        )}
      </section>
    </div>
  );
}

export default AboutYouForm;

