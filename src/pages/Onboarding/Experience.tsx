import Button from "../../ui/Button";
import OnboardingLayout from "./OnboardingLayout";
import type {
  ExperienceLevel,
  OnboardingData,
} from "./types";
import "./Experience.css";

interface ExperienceProps {
  data: OnboardingData;
  updateData: (
    updates: Partial<OnboardingData>,
  ) => void;
  next: () => void;
  back: () => void;
}

interface ExperienceOption {
  value: ExperienceLevel;
  title: string;
  description: string;
}

const EXPERIENCE_OPTIONS: ExperienceOption[] = [
  {
    value: "first-time",
    title: "First Time",
    description:
      "This is my first negotiation or first time exploring BDSM or rope.",
  },
  {
    value: "learning",
    title: "Learning",
    description:
      "I have started exploring and am still building confidence.",
  },
  {
    value: "some-experience",
    title: "Some Experience",
    description:
      "I have participated enough to understand the basics.",
  },
  {
    value: "comfortable",
    title: "Comfortable",
    description:
      "I feel confident in most common situations.",
  },
  {
    value: "very-experienced",
    title: "Very Experienced",
    description:
      "I have spent significant time developing my knowledge and skills.",
  },
  {
    value: "teaching-facilitating",
    title: "Teaching or Facilitating",
    description:
      "I regularly teach, mentor, facilitate, or organize within the community.",
  },
];

function Experience({
  data,
  updateData,
  next,
  back,
}: ExperienceProps) {
  const selectExperience = (
    experience: ExperienceLevel,
  ) => {
    updateData({ experience });
  };

  return (
    <OnboardingLayout
      title="Experience"
      subtitle="Help us understand your background. Experience is not a measure of worth or ability. It simply provides context for your responses."
      progress={6}
    >
      <div className="experience-options">
        {EXPERIENCE_OPTIONS.map((option) => {
          const isSelected =
            data.experience === option.value;

          return (
            <button
              key={option.value}
              type="button"
              className={`experience-card${
                isSelected
                  ? " experience-card--selected"
                  : ""
              }`}
              aria-pressed={isSelected}
              onClick={() =>
                selectExperience(option.value)
              }
            >
              <span className="experience-card__text">
                <span className="experience-card__title">
                  {option.title}
                </span>

                <span className="experience-card__description">
                  {option.description}
                </span>
              </span>

              <span
                className="experience-card__indicator"
                aria-hidden="true"
              >
                {isSelected && (
                  <span className="experience-card__indicator-dot" />
                )}
              </span>
            </button>
          );
        })}
      </div>

      <p className="experience-note">
        There are no right or wrong answers. Choose
        the option that best reflects your experience
        today.
      </p>

      <div className="experience-navigation">
        <Button onClick={back}>
          Back
        </Button>

        <Button
          onClick={next}
          disabled={!data.experience}
        >
          Continue
        </Button>
      </div>
    </OnboardingLayout>
  );
}

export default Experience;