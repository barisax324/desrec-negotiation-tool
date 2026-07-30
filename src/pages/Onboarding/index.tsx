import { useState } from "react";

import Welcome from "./Welcome";
import AboutYou from "./AboutYou/AboutYou";
import Experience from "./Experience";
import Ready from "./Ready";

import { DEFAULT_ONBOARDING_DATA } from "./types";
import type {
  OnboardingData,
  OnboardingPage,
} from "./types";

const pages: OnboardingPage[] = [
  "welcome",
  "about-you",
  "experience",
  "ready",
];

interface OnboardingProps {
  onComplete: (data: OnboardingData) => void;
}

export default function Onboarding({
  onComplete,
}: OnboardingProps) {
  const [currentPage, setCurrentPage] = useState(0);

  const [data, setData] = useState<OnboardingData>(
    DEFAULT_ONBOARDING_DATA,
  );

  function next() {
    if (currentPage < pages.length - 1) {
      setCurrentPage((page) => page + 1);
    }
  }

  function back() {
    if (currentPage > 0) {
      setCurrentPage((page) => page - 1);
    }
  }

  function updateData(
    updates: Partial<OnboardingData>,
  ) {
    setData((previousData) => ({
      ...previousData,
      ...updates,
    }));
  }

  switch (pages[currentPage]) {
    case "welcome":
      return <Welcome next={next} />;

    case "about-you":
      return (
        <AboutYou
          data={data}
          updateData={updateData}
          next={next}
          back={back}
        />
      );

    case "experience":
      return (
        <Experience
          data={data}
          updateData={updateData}
          next={next}
          back={back}
        />
      );

    case "ready":
      return (
        <Ready
          data={data}
          back={back}
          next={() => onComplete(data)}
        />
      );

    default:
      return null;
  }
}