import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import "./CommunicationPage.css";

import {
  CHECK_IN_OPTIONS,
  COMMUNICATION_HABIT_OPTIONS,
  COMMUNICATION_STYLE_OPTIONS,
  SAFEWORD_OPTIONS,
  SOMETHING_WRONG_OPTIONS,
  type CommunicationOption,
  type CommunicationSectionId,
} from "./communicationOptions";

interface CommunicationPageProps {
  initialData?: CommunicationFormData | null;

  onBack?: () => void;

  onContinue?: (
    data: CommunicationFormData,
  ) => void;

  onSaveAndReturnToSummary?: (
    data: CommunicationFormData,
  ) => void;

  showNavigation?: boolean;
}

export interface DiscussionFlag {
  sectionId: CommunicationSectionId;
  sectionLabel: string;
  optionId: string;
  optionLabel: string;
}

export interface CommunicationFormData {
  checkIns: string[];
  communicationStyle: string[];
  somethingWrong: string[];
  safewordType: string;
  customSafeword: string;
  communicationHabits: string[];
  additionalNotes: string;
  discussionFlags: DiscussionFlag[];
}

interface AccordionSectionProps {
  id: CommunicationSectionId;
  title: string;
  description: string;
  isOpen: boolean;
  isLocked: boolean;
  isComplete: boolean;
  summary?: string;
  children: ReactNode;
  onToggle: () => void;
  sectionRef?: React.RefObject<
    HTMLDivElement | null
  >;
}

const SECTION_ORDER: CommunicationSectionId[] = [
  "check-ins",
  "communication-style",
  "something-wrong",
  "safewords",
  "communication-habits",
  "anything-else",
];

const SECTION_LABELS: Record<
  CommunicationSectionId,
  string
> = {
  "check-ins": "Check-ins",
  "communication-style":
    "Communication Style",
  "something-wrong":
    "If Something Feels Wrong",
  safewords: "Safewords & Signals",
  "communication-habits":
    "Communication Habits",
  "anything-else": "Anything Else?",
};

function toggleArrayValue(
  values: string[],
  value: string,
): string[] {
  if (values.includes(value)) {
    return values.filter(
      (item) => item !== value,
    );
  }

  return [...values, value];
}

function getOptionLabels(
  selectedIds: string[],
  options: CommunicationOption[],
): string[] {
  return selectedIds
    .map((selectedId) =>
      options.find(
        (option) =>
          option.id === selectedId,
      ),
    )
    .filter(
      (
        option,
      ): option is CommunicationOption =>
        Boolean(option),
    )
    .map((option) =>
      option.discussionFlag
        ? `${option.label} · Discuss in person`
        : option.label,
    );
}

function createSummary(
  labels: string[],
): string {
  if (labels.length === 0) {
    return "";
  }

  if (labels.length <= 3) {
    return labels.join(" • ");
  }

  return `${labels.length} options selected`;
}

function AccordionSection({
  id,
  title,
  description,
  isOpen,
  isLocked,
  isComplete,
  summary,
  children,
  onToggle,
  sectionRef,
}: AccordionSectionProps) {
  return (
    <div
      ref={sectionRef}
      className={[
        "communication-accordion",
        isOpen ? "is-open" : "",
        isLocked ? "is-locked" : "",
        isComplete ? "is-complete" : "",
      ]
        .filter(Boolean)
        .join(" ")}
      data-section-id={id}
    >
      <button
        type="button"
        className="communication-accordion__header"
        onClick={onToggle}
        disabled={isLocked}
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
      >
        <span
          className="communication-accordion__icon"
          aria-hidden="true"
        >
          {isLocked
            ? "⌕"
            : isOpen
              ? "−"
              : "+"}
        </span>

        <span className="communication-accordion__heading">
          <span className="communication-accordion__title-row">
            <span className="communication-accordion__title">
              {title}
            </span>

            {isComplete && !isOpen && (
              <span className="communication-accordion__complete">
                Complete
              </span>
            )}
          </span>

          {isLocked ? (
            <span className="communication-accordion__summary">
              Complete the previous section
              first.
            </span>
          ) : summary && !isOpen ? (
            <span className="communication-accordion__summary">
              {summary}
            </span>
          ) : (
            <span className="communication-accordion__description">
              {description}
            </span>
          )}
        </span>
      </button>

      <div
        id={`${id}-content`}
        className="communication-accordion__content"
        aria-hidden={!isOpen}
      >
        <div className="communication-accordion__inner">
          {children}
        </div>
      </div>
    </div>
  );
}

interface MultiSelectChipsProps {
  options: CommunicationOption[];
  selectedValues: string[];
  onChange: (
    nextValues: string[],
  ) => void;
}

function MultiSelectChips({
  options,
  selectedValues,
  onChange,
}: MultiSelectChipsProps) {
  return (
    <div className="communication-chips">
      {options.map((option) => {
        const isSelected =
          selectedValues.includes(option.id);

        return (
          <button
            key={option.id}
            type="button"
            className={[
              "communication-chip",
              isSelected
                ? "is-selected"
                : "",
              option.discussionFlag
                ? "is-discussion"
                : "",
            ]
              .filter(Boolean)
              .join(" ")}
            aria-pressed={isSelected}
            onClick={() =>
              onChange(
                toggleArrayValue(
                  selectedValues,
                  option.id,
                ),
              )
            }
          >
            <span
              className="communication-chip__check"
              aria-hidden="true"
            >
              {isSelected ? "✓" : ""}
            </span>

            <span className="communication-chip__label">
              {option.label}

              {option.discussionFlag && (
                <span className="communication-chip__note">
                  Discuss in person
                </span>
              )}
            </span>
          </button>
        );
      })}
    </div>
  );
}

interface ContinueSectionButtonProps {
  disabled?: boolean;
  final?: boolean;
  onClick: () => void;
}

function ContinueSectionButton({
  disabled = false,
  final = false,
  onClick,
}: ContinueSectionButtonProps) {
  return (
    <button
      type="button"
      className="communication-section-continue"
      disabled={disabled}
      onClick={onClick}
    >
      {final
        ? "Continue to Aftercare"
        : "Continue"}

      <span aria-hidden="true">
        →
      </span>
    </button>
  );
}

export default function CommunicationPage({
  initialData,
  onBack,
  onContinue,
  onSaveAndReturnToSummary,
  showNavigation = true,
}: CommunicationPageProps) {
    const [
    openSection,
    setOpenSection,
  ] =
    useState<CommunicationSectionId>(
      initialData
        ? "anything-else"
        : "check-ins",
    );

  const [
    unlockedSectionIndex,
    setUnlockedSectionIndex,
  ] = useState<number>(
    initialData
      ? SECTION_ORDER.length - 1
      : 0,
  );

  const [checkIns, setCheckIns] =
    useState<string[]>(
      initialData?.checkIns ?? [],
    );

  const [
    communicationStyle,
    setCommunicationStyle,
  ] = useState<string[]>(
    initialData?.communicationStyle ?? [],
  );

  const [
    somethingWrong,
    setSomethingWrong,
  ] = useState<string[]>(
    initialData?.somethingWrong ?? [],
  );

  const [
    safewordType,
    setSafewordType,
  ] = useState<string>(
    initialData?.safewordType ?? "",
  );

  const [
    customSafeword,
    setCustomSafeword,
  ] = useState<string>(
    initialData?.customSafeword ?? "",
  );

  const [
    communicationHabits,
    setCommunicationHabits,
  ] = useState<string[]>(
    initialData?.communicationHabits ?? [],
  );

  const [
    additionalNotes,
    setAdditionalNotes,
  ] = useState<string>(
    initialData?.additionalNotes ?? "",
  );

  const sectionRefs = {
    "check-ins":
      useRef<HTMLDivElement>(null),
    "communication-style":
      useRef<HTMLDivElement>(null),
    "something-wrong":
      useRef<HTMLDivElement>(null),
    safewords:
      useRef<HTMLDivElement>(null),
    "communication-habits":
      useRef<HTMLDivElement>(null),
    "anything-else":
      useRef<HTMLDivElement>(null),
  };

  const completion = useMemo<
    Record<
      CommunicationSectionId,
      boolean
    >
  >(
    () => ({
      "check-ins":
        checkIns.length > 0,

      "communication-style":
        communicationStyle.length > 0,

      "something-wrong":
        somethingWrong.length > 0,

      safewords:
        safewordType.length > 0 &&
        (safewordType !== "custom" ||
          customSafeword.trim().length >
            0),

      "communication-habits":
        communicationHabits.length > 0,

      "anything-else": true,
    }),
    [
      checkIns,
      communicationStyle,
      somethingWrong,
      safewordType,
      customSafeword,
      communicationHabits,
    ],
  );

  useEffect(() => {
    const firstInvalidIndex =
      SECTION_ORDER.findIndex(
        (sectionId, index) =>
          index <
            unlockedSectionIndex &&
          !completion[sectionId],
      );

    if (firstInvalidIndex === -1) {
      return;
    }

    setUnlockedSectionIndex(
      firstInvalidIndex,
    );

    setOpenSection(
      SECTION_ORDER[
        firstInvalidIndex
      ],
    );
  }, [
    completion,
    unlockedSectionIndex,
  ]);

  const discussionFlags =
    useMemo<DiscussionFlag[]>(() => {
      const flags: DiscussionFlag[] = [];

      const addFlags = (
        sectionId:
          CommunicationSectionId,
        selectedIds: string[],
        options:
          CommunicationOption[],
      ) => {
        selectedIds.forEach(
          (selectedId) => {
            const option =
              options.find(
                (candidate) =>
                  candidate.id ===
                  selectedId,
              );

            if (
              !option?.discussionFlag
            ) {
              return;
            }

            flags.push({
              sectionId,
              sectionLabel:
                SECTION_LABELS[
                  sectionId
                ],
              optionId: option.id,
              optionLabel:
                option.label,
            });
          },
        );
      };

      addFlags(
        "check-ins",
        checkIns,
        CHECK_IN_OPTIONS,
      );

      addFlags(
        "something-wrong",
        somethingWrong,
        SOMETHING_WRONG_OPTIONS,
      );

      addFlags(
        "communication-habits",
        communicationHabits,
        COMMUNICATION_HABIT_OPTIONS,
      );

      return flags;
    }, [
      checkIns,
      somethingWrong,
      communicationHabits,
    ]);

  const summaries = useMemo<
    Record<
      CommunicationSectionId,
      string
    >
  >(
    () => ({
      "check-ins": createSummary(
        getOptionLabels(
          checkIns,
          CHECK_IN_OPTIONS,
        ),
      ),

      "communication-style":
        createSummary(
          getOptionLabels(
            communicationStyle,
            COMMUNICATION_STYLE_OPTIONS,
          ),
        ),

      "something-wrong":
        createSummary(
          getOptionLabels(
            somethingWrong,
            SOMETHING_WRONG_OPTIONS,
          ),
        ),

      safewords:
        safewordType === "custom"
          ? customSafeword.trim() ||
            "Custom Safeword"
          : createSummary(
              getOptionLabels(
                safewordType
                  ? [safewordType]
                  : [],
                SAFEWORD_OPTIONS,
              ),
            ),

      "communication-habits":
        createSummary(
          getOptionLabels(
            communicationHabits,
            COMMUNICATION_HABIT_OPTIONS,
          ),
        ),

      "anything-else":
        additionalNotes.trim()
          ? "Additional information added"
          : "No additional information",
    }),
    [
      checkIns,
      communicationStyle,
      somethingWrong,
      safewordType,
      customSafeword,
      communicationHabits,
      additionalNotes,
    ],
  );

  function isSectionLocked(
    sectionId:
      CommunicationSectionId,
  ): boolean {
    const sectionIndex =
      SECTION_ORDER.indexOf(
        sectionId,
      );

    return (
      sectionIndex >
      unlockedSectionIndex
    );
  }

  function isSectionComplete(
    sectionId:
      CommunicationSectionId,
  ): boolean {
    const sectionIndex =
      SECTION_ORDER.indexOf(
        sectionId,
      );

    if (
      sectionId ===
      "anything-else"
    ) {
      return (
        sectionIndex <
        unlockedSectionIndex
      );
    }

    return completion[sectionId];
  }

  function scrollToSection(
    sectionId:
      CommunicationSectionId,
  ): void {
    window.setTimeout(() => {
      const element =
        sectionRefs[
          sectionId
        ].current;

      if (!element) {
        return;
      }

      const top =
        element.getBoundingClientRect()
          .top +
        window.scrollY -
        24;

      window.scrollTo({
        top,
        behavior: "smooth",
      });
    }, 230);
  }

  function handleSectionToggle(
    sectionId:
      CommunicationSectionId,
  ): void {
    if (
      isSectionLocked(sectionId)
    ) {
      return;
    }

    setOpenSection(sectionId);
  }

  function advanceFromSection(
    currentSectionId:
      CommunicationSectionId,
  ): void {
    if (
      !completion[
        currentSectionId
      ]
    ) {
      return;
    }

    const currentIndex =
      SECTION_ORDER.indexOf(
        currentSectionId,
      );

    const nextIndex =
      currentIndex + 1;

    if (
      nextIndex >=
      SECTION_ORDER.length
    ) {
      return;
    }

    const nextSectionId =
      SECTION_ORDER[nextIndex];

    setUnlockedSectionIndex(
      (currentUnlockedIndex) =>
        Math.max(
          currentUnlockedIndex,
          nextIndex,
        ),
    );

    setOpenSection(
      nextSectionId,
    );

    scrollToSection(
      nextSectionId,
    );
  }

  function createCommunicationData(): CommunicationFormData {
    return {
      checkIns,
      communicationStyle,
      somethingWrong,
      safewordType,
      customSafeword:
        customSafeword.trim(),
      communicationHabits,
      additionalNotes:
        additionalNotes.trim(),
      discussionFlags,
    };
  }

  function handleFinalContinue() {
    onContinue?.(
      createCommunicationData(),
    );
  }

  function handleSaveAndReturn() {
    onSaveAndReturnToSummary?.(
      createCommunicationData(),
    );
  }

  const completedRequiredSections =
    SECTION_ORDER.slice(0, 5).filter(
      (sectionId) =>
        completion[sectionId],
    ).length;

  const progressPercent =
    Math.round(
      (completedRequiredSections /
        5) *
        100,
    );

  return (
    <main className="communication-page">
      <div className="communication-page__container">
        <header className="communication-page__header">
          <div>
            <p className="communication-page__eyebrow">
              Scene Negotiation
            </p>

            <h1>
              Communication &amp;
              Boundaries
            </h1>

            <p className="communication-page__intro">
              Everyone communicates
              differently. Help your
              partner understand how to
              check in with you and respond
              if something changes during a
              scene.
            </p>
          </div>

          <div
            className="communication-progress"
            aria-label={`${progressPercent}% complete`}
          >
            <div className="communication-progress__text">
              <span>
                Communication
              </span>

              <span>
                {progressPercent}%
              </span>
            </div>

            <div className="communication-progress__track">
              <div
                className="communication-progress__fill"
                style={{
                  width: `${progressPercent}%`,
                }}
              />
            </div>
          </div>
        </header>

        <section className="communication-sections">
          <AccordionSection
            id="check-ins"
            title="Check-ins"
            description="How would you like your partner to check in with you during a scene?"
            isOpen={
              openSection ===
              "check-ins"
            }
            isLocked={isSectionLocked(
              "check-ins",
            )}
            isComplete={isSectionComplete(
              "check-ins",
            )}
            summary={
              summaries["check-ins"]
            }
            onToggle={() =>
              handleSectionToggle(
                "check-ins",
              )
            }
            sectionRef={
              sectionRefs["check-ins"]
            }
          >
            <MultiSelectChips
              options={
                CHECK_IN_OPTIONS
              }
              selectedValues={
                checkIns
              }
              onChange={setCheckIns}
            />

            <ContinueSectionButton
              disabled={
                !completion[
                  "check-ins"
                ]
              }
              onClick={() =>
                advanceFromSection(
                  "check-ins",
                )
              }
            />
          </AccordionSection>

          <AccordionSection
            id="communication-style"
            title="Communication Style"
            description="What communication style feels best during a scene?"
            isOpen={
              openSection ===
              "communication-style"
            }
            isLocked={isSectionLocked(
              "communication-style",
            )}
            isComplete={isSectionComplete(
              "communication-style",
            )}
            summary={
              summaries[
                "communication-style"
              ]
            }
            onToggle={() =>
              handleSectionToggle(
                "communication-style",
              )
            }
            sectionRef={
              sectionRefs[
                "communication-style"
              ]
            }
          >
            <MultiSelectChips
              options={
                COMMUNICATION_STYLE_OPTIONS
              }
              selectedValues={
                communicationStyle
              }
              onChange={
                setCommunicationStyle
              }
            />

            <ContinueSectionButton
              disabled={
                !completion[
                  "communication-style"
                ]
              }
              onClick={() =>
                advanceFromSection(
                  "communication-style",
                )
              }
            />
          </AccordionSection>

          <AccordionSection
            id="something-wrong"
            title="If Something Feels Wrong"
            description="What would you prefer your partner do if something does not feel right?"
            isOpen={
              openSection ===
              "something-wrong"
            }
            isLocked={isSectionLocked(
              "something-wrong",
            )}
            isComplete={isSectionComplete(
              "something-wrong",
            )}
            summary={
              summaries[
                "something-wrong"
              ]
            }
            onToggle={() =>
              handleSectionToggle(
                "something-wrong",
              )
            }
            sectionRef={
              sectionRefs[
                "something-wrong"
              ]
            }
          >
            <MultiSelectChips
              options={
                SOMETHING_WRONG_OPTIONS
              }
              selectedValues={
                somethingWrong
              }
              onChange={
                setSomethingWrong
              }
            />

            <ContinueSectionButton
              disabled={
                !completion[
                  "something-wrong"
                ]
              }
              onClick={() =>
                advanceFromSection(
                  "something-wrong",
                )
              }
            />
          </AccordionSection>

          <AccordionSection
            id="safewords"
            title="Safewords & Signals"
            description="How would you like to communicate if you need to slow down or stop?"
            isOpen={
              openSection ===
              "safewords"
            }
            isLocked={isSectionLocked(
              "safewords",
            )}
            isComplete={isSectionComplete(
              "safewords",
            )}
            summary={
              summaries.safewords
            }
            onToggle={() =>
              handleSectionToggle(
                "safewords",
              )
            }
            sectionRef={
              sectionRefs.safewords
            }
          >
            <div className="communication-chips">
              {SAFEWORD_OPTIONS.map(
                (option) => {
                  const isSelected =
                    safewordType ===
                    option.id;

                  return (
                    <button
                      key={option.id}
                      type="button"
                      className={[
                        "communication-chip",
                        isSelected
                          ? "is-selected"
                          : "",
                      ]
                        .filter(Boolean)
                        .join(" ")}
                      aria-pressed={
                        isSelected
                      }
                      onClick={() => {
                        setSafewordType(
                          option.id,
                        );

                        if (
                          option.id !==
                          "custom"
                        ) {
                          setCustomSafeword(
                            "",
                          );
                        }
                      }}
                    >
                      <span
                        className="communication-chip__check"
                        aria-hidden="true"
                      >
                        {isSelected
                          ? "✓"
                          : ""}
                      </span>

                      <span className="communication-chip__label">
                        {option.label}
                      </span>
                    </button>
                  );
                },
              )}
            </div>

            {safewordType ===
              "custom" && (
              <div className="communication-custom-field">
                <label htmlFor="custom-safeword">
                  Custom safeword
                </label>

                <input
                  id="custom-safeword"
                  type="text"
                  value={
                    customSafeword
                  }
                  maxLength={50}
                  placeholder="Enter your preferred safeword"
                  onChange={(event) =>
                    setCustomSafeword(
                      event.target.value,
                    )
                  }
                />
              </div>
            )}

            <ContinueSectionButton
              disabled={
                !completion.safewords
              }
              onClick={() =>
                advanceFromSection(
                  "safewords",
                )
              }
            />
          </AccordionSection>

          <AccordionSection
            id="communication-habits"
            title="Communication Habits"
            description="Help your partner understand how you naturally communicate under stress."
            isOpen={
              openSection ===
              "communication-habits"
            }
            isLocked={isSectionLocked(
              "communication-habits",
            )}
            isComplete={isSectionComplete(
              "communication-habits",
            )}
            summary={
              summaries[
                "communication-habits"
              ]
            }
            onToggle={() =>
              handleSectionToggle(
                "communication-habits",
              )
            }
            sectionRef={
              sectionRefs[
                "communication-habits"
              ]
            }
          >
            <MultiSelectChips
              options={
                COMMUNICATION_HABIT_OPTIONS
              }
              selectedValues={
                communicationHabits
              }
              onChange={
                setCommunicationHabits
              }
            />

            <ContinueSectionButton
              disabled={
                !completion[
                  "communication-habits"
                ]
              }
              onClick={() =>
                advanceFromSection(
                  "communication-habits",
                )
              }
            />
          </AccordionSection>

          <AccordionSection
            id="anything-else"
            title="Anything Else?"
            description="Is there anything important your partner should know about communicating with you during a scene?"
            isOpen={
              openSection ===
              "anything-else"
            }
            isLocked={isSectionLocked(
              "anything-else",
            )}
            isComplete={isSectionComplete(
              "anything-else",
            )}
            summary={
              summaries[
                "anything-else"
              ]
            }
            onToggle={() =>
              handleSectionToggle(
                "anything-else",
              )
            }
            sectionRef={
              sectionRefs[
                "anything-else"
              ]
            }
          >
            <div className="communication-notes-field">
              <label htmlFor="communication-notes">
                Additional communication
                information
              </label>

              <textarea
                id="communication-notes"
                value={
                  additionalNotes
                }
                maxLength={300}
                rows={6}
                placeholder="Optional"
                onChange={(event) =>
                  setAdditionalNotes(
                    event.target.value,
                  )
                }
              />

              <div className="communication-character-count">
                {additionalNotes.length}
                /300
              </div>
            </div>

            <ContinueSectionButton
              final
              onClick={
                handleFinalContinue
              }
            />
          </AccordionSection>
        </section>

        {showNavigation && (
          <div className="communication-page-actions">
            {onBack && (
              <button
                type="button"
                className="communication-back-button"
                onClick={onBack}
              >
                ← Back
              </button>
            )}

            {onSaveAndReturnToSummary && (
              <button
                type="button"
                className="communication-summary-button"
                onClick={
                  handleSaveAndReturn
                }
              >
                Return to Summary
              </button>
            )}
          </div>
        )}
              </div>
    </main>
  );
}

