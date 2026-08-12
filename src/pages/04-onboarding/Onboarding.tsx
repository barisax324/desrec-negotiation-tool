import {
  useEffect,
  useState,
} from "react";

import Welcome from "./01-welcome";
import AboutYou from "./03-about-you";
import Experience from "./04-experience";
import Ready from "./05-ready";

import {
  DEFAULT_ONBOARDING_DATA,
} from "./shared";

import type {
  OnboardingData,
  OnboardingPage,
} from "./shared";

const pages: OnboardingPage[] = [
  "welcome",
  "about-you",
  "experience",
  "ready",
];

interface OnboardingProps {
  initialPage?: OnboardingPage;
  welcomeOnly?: boolean;
  onWelcomeContinue?: () => void;
  onBackToOverview: () => void;

  onComplete: (
    data: OnboardingData,
  ) => void;
}

export default function Onboarding({
  initialPage = "welcome",
  welcomeOnly = false,
  onWelcomeContinue,
  onBackToOverview,
  onComplete,
}: OnboardingProps) {
  const [
    currentPage,
    setCurrentPage,
  ] = useState(() => {
    const pageIndex =
      pages.indexOf(initialPage);

    return pageIndex >= 0
      ? pageIndex
      : 0;
  });

  const [
    data,
    setData,
  ] = useState<OnboardingData>(
    DEFAULT_ONBOARDING_DATA,
  );

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "auto",
    });
  }, [currentPage]);

  function next() {
    if (
      currentPage === 0 &&
      welcomeOnly &&
      onWelcomeContinue
    ) {
      onWelcomeContinue();
      return;
    }

    if (
      currentPage <
      pages.length - 1
    ) {
      setCurrentPage(
        (page) => page + 1,
      );
    }
  }

  function back() {
    if (
      currentPage === 1 &&
      initialPage === "about-you"
    ) {
      onBackToOverview();
      return;
    }

    if (currentPage > 0) {
      setCurrentPage(
        (page) => page - 1,
      );
      return;
    }

    onBackToOverview();
  }

  function updateData(
    updates: Partial<OnboardingData>,
  ) {
    setData(
      (previousData) => ({
        ...previousData,
        ...updates,
      }),
    );
  }

  switch (pages[currentPage]) {
    case "welcome":
      return (
        <Welcome
          next={next}
          back={onBackToOverview}
        />
      );

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
          next={() =>
            onComplete(data)
          }
        />
      );

    default:
      return null;
  }
}

