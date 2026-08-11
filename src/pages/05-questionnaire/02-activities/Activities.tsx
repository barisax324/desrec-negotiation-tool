import { useMemo, useState } from "react";

import Button from "@/shared/ui/button";
import PageLayout from "@/shared/ui/page-layout";
import ActivityCategory from "./ActivityCategory";
import { ACTIVITY_CATEGORIES } from "./activityData";

import type {
  ActivityCategoryId,
  ActivityResponse,
  ActivityResponses,
} from "./types";

import "./Activities.css";

interface ActivitiesProps {
  initialResponses?: ActivityResponses;
  back: () => void;
  next: (
    responses: ActivityResponses,
  ) => void;
  onSaveAndReturnToSummary?: (
    responses: ActivityResponses,
  ) => void;
  showNavigation?: boolean;
}

function Activities({
  initialResponses = {},
  back,
  next,
  onSaveAndReturnToSummary,
  showNavigation = true,
}: ActivitiesProps) {
    const [
    expandedCategory,
    setExpandedCategory,
  ] = useState<ActivityCategoryId | null>(
    null,
  );

  const [responses, setResponses] =
    useState<ActivityResponses>(
      initialResponses,
    );

  const activeCategories = useMemo(
    () =>
      ACTIVITY_CATEGORIES.filter(
        (category) => category.active,
      ).sort(
        (first, second) =>
          first.order - second.order,
      ),
    [],
  );

  function toggleCategory(
    categoryId: ActivityCategoryId,
  ) {
    setExpandedCategory(
      (currentCategory) =>
        currentCategory === categoryId
          ? null
          : categoryId,
    );
  }

  function handleResponseChange(
    response: ActivityResponse,
  ) {
    setResponses((currentResponses) => ({
      ...currentResponses,
      [response.activityId]: response,
    }));
  }

  function handleContinue() {
    next(responses);
  }

  function handleSaveAndReturn() {
    onSaveAndReturnToSummary?.(
      responses,
    );
  }

  return (
    <PageLayout
      title="Activities"
      subtitle="Explore the kinds of activities that may be part of our scene."
    >
      <section className="activities-page">
        <div className="activities-introduction">
          <p>
            You do not need to have an answer for every
            activity. Only open and respond
            to the ones that matter for
            this negotiation.
          </p>

          <div className="activities-reminder">
            <span aria-hidden="true">
              ⓘ
            </span>

            <p>
              You can return to any category
              later. Leaving an activity
              blank does not mean the
              questionnaire is unfinished.
            </p>
          </div>
        </div>

        <div className="activity-category-list">
          {activeCategories.map(
            (category) => (
              <ActivityCategory
                key={category.id}
                category={category}
                isExpanded={
                  expandedCategory ===
                  category.id
                }
                responses={responses}
                onToggle={() =>
                  toggleCategory(
                    category.id,
                  )
                }
                onResponseChange={
                  handleResponseChange
                }
              />
            ),
          )}
        </div>

        {showNavigation && (
          <div className="activities-navigation">
            <Button onClick={back}>
              Back
            </Button>

            {onSaveAndReturnToSummary && (
              <Button
                onClick={
                  handleSaveAndReturn
                }
              >
                Return to Summary
              </Button>
            )}

            <Button
              onClick={handleContinue}
            >
              Continue
            </Button>
          </div>
        )}
              </section>
    </PageLayout>
  );
}

export default Activities;