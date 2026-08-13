# Development Log

Internal development notes for the DesREC Negotiation Tool.

Unlike `CHANGELOG.md`, this document captures architectural decisions, design philosophy, refactoring milestones, technical debt, and long-term development plans. It is intended for developers and project maintainers rather than end users.
---
## 2026-08-13

### Questionnaire / Results Data Audit

Continued auditing questionnaire inputs to make sure the values collected from participants are represented correctly in Summary, Comparison, and printable Comparison results.

#### Activities
- Expanded the activity preference model.
- Interest now uses a five-point scale.
- Added a separate Experience scale.
- Added Limits / Boundaries for activities that are generally allowed but have specific caveats.
- Hard Limit remains separate and applies to the activity as a whole.
- Updated Summary, Comparison, and print handling for the new response structure.

#### Health & Safety
- Removed collection of emergency contact identifying information from the negotiation.
- Replaced emergency contact name, relationship, phone number, and instructions with a Yes / No question asking whether the participant has an emergency contact available.
- Updated Summary, Comparison, and print output accordingly.

#### Body Map
- Repositioned the upper-arm markers to better include the shoulder area.
- Repositioned the lower-leg markers to better include the knee area.
- Updated displayed labels to Shoulder / Upper Arm and Knee / Lower Leg.
- Linked the front and back representations of each hand and foot.
- Selecting either side of a hand or foot now applies the same status to its corresponding front/back region.
- Paired hand/foot regions share a single notes entry.
- Removed duplicate hand/foot rows from Summary, Comparison, and printable Comparison while leaving other front/back body regions independent.

### Verification
- Confirmed Body Map interaction behaves correctly in the development UI.
- Confirmed the project builds successfully after the Body Map and results changes.
---

# 2026-08-11

## Major Architecture Refactor

### Objective

Establish a scalable, maintainable project architecture before continuing feature development.

The primary goals were to:

- Reduce application complexity.
- Separate business logic from presentation.
- Standardize project organization.
- Improve long-term maintainability.
- Create reusable infrastructure for future Summary editing and collaboration features.

No user-facing functionality was intentionally changed during this refactor.

---

## Completed

### Application Architecture

The application was reorganized into dedicated application layers.

```
src
├── app
├── pages
├── shared
├── services
└── utils
```

Responsibilities are now clearly separated.

- **app** manages application orchestration and routing.
- **pages** contains the user workflow.
- **shared** contains reusable resources.
- **services** contains database interaction.
- **utils** contains application utilities.

---

### Workflow Organization

All user-facing pages were reorganized into numbered workflow folders.

```
01-home
02-setup
03-security
04-onboarding
05-questionnaire
06-results
07-about
```

This mirrors the actual user experience and makes navigation significantly easier.

---

### Shared Resources

Shared resources were consolidated into a single location.

```
shared
├── assets
├── clients
├── components
├── data
├── design
├── layouts
├── styles
├── types
├── ui
└── utils
```

The project no longer scatters reusable resources throughout unrelated folders.

---

### Questionnaire Architecture

Questionnaire routing now uses dedicated router components.

```
QuestionnaireRouter
├── SceneGoalsRouterPage
├── ActivitiesRouterPage
├── HealthSafetyRouterPage
├── CommunicationRouterPage
├── AftercareRouterPage
├── SummaryRouterPage
└── ComparisonRouterPage
```

Responsibilities moved into router components include:

- page navigation
- questionnaire progression
- progress saving
- Summary return behavior
- edit mode behavior
- comparison navigation

`QuestionnaireRouter` now serves only as the routing layer.

---

### Onboarding

The onboarding flow was further simplified.

- Reduced duplicated editing logic.
- Shared helper functions.
- Consistent navigation behavior.
- Improved separation between routing and UI.

---

### Shared Hooks

Application state is now managed primarily through reusable hooks.

Current hooks include:

```
useNegotiationLoader
useNegotiationOverview
useQuestionnaireState
useParticipantProgress
useSummaryEditing
useOnboardingFlow
```

Each hook has a focused responsibility, reducing duplication throughout the application.

---

### Documentation

Project documentation was reorganized.

```
docs/
├── CHANGELOG.md
├── DEVLOG.md
├── README.md
└── ROADMAP.md
```

---

## Design Philosophy

Current architectural principles:

- Single responsibility.
- Business logic separated from UI.
- Reusable components over duplicated implementations.
- Shared hooks over duplicated state.
- Predictable workflow-based organization.
- Minimize coupling between application layers.
- Keep future feature development straightforward.

---

## UI Philosophy

The interface should reduce cognitive load whenever possible.

Guiding principles include:

- Show only the information users need.
- Use color intentionally, not decoratively.
- Favor consistency over novelty.
- Reuse shared UI components whenever possible.
- Keep navigation predictable.
- Reduce scrolling where practical.

---

## Client-Side Encryption and Privacy Architecture

A major privacy migration was completed on 2026-08-12.

The negotiation tool now encrypts sensitive negotiation content in the browser before it is sent to Supabase.

### Encrypted Shared Negotiation Data

The following shared fields are no longer stored as plaintext:

- Negotiation name
- Scene date
- Scene date undecided status
- Planned scene activities

These values are serialized into a shared-details payload and encrypted client-side using AES-GCM.

Supabase stores only:

- `shared_details_ciphertext`
- `shared_details_iv`
- `shared_details_version`

The previous plaintext columns were removed after the encrypted workflow passed end-to-end testing.

### Encrypted Participant Responses

Participant questionnaire responses are also encrypted client-side before persistence.

Supabase stores only:

- `responses_ciphertext`
- `responses_iv`
- `responses_encryption_version`
- `responses_version`

The old plaintext `participants.responses` JSONB column was removed after encrypted save, recovery, and comparison flows were verified.

### Shared Encryption Key

Each negotiation receives a randomly generated 256-bit AES-GCM shared key in the browser.

The raw key is not stored in Supabase.

The key is initially carried in the URL fragment:```text #k=...

---


### High Priority

- Implement `QuestionnaireContext` to eliminate prop drilling.
- Simplify router component interfaces.
- Introduce TypeScript path aliases (`@/...`).
- Continue decomposing large orchestration components where appropriate.

---

### Medium Priority

- Complete Summary edit dialogs.
- Convert remaining questionnaire sections into reusable form components.
- Continue reducing duplicated navigation callbacks.
- Improve shared type organization.

---

### Low Priority

- Accessibility review.
- Animation polish.
- Bundle size optimization.
- Performance improvements.
- Additional UI refinement.

---

## Upcoming Work

### Summary Editing

Replace page navigation with inline editing for:

- Scene Details
- About You
- Experience
- Scene Goals
- Activities
- Health & Safety
- Communication
- Aftercare

---

### Comparison Improvements

Only use comparison highlighting where it improves decision-making.

Color-coded comparison should remain for:

- Activities
- Communication & Boundaries

Other sections should simply display each participant's responses without similarity highlighting.

---

### Production Readiness

Before public release:

- Complete accessibility review.
- Cross-browser testing.
- Mobile testing.
- Performance optimization.
- Full workflow validation.
- Verify both Participant A and Participant B flows after every significant feature addition.

---

## Notes

This architecture refactor represents one of the largest internal improvements made to the project.

Although users should notice very little difference, future development should be significantly faster, cleaner, and more maintainable due to the standardized project organization and separation of responsibilities.

The project is now focused primarily on usability, polish, and production readiness rather than large architectural changes.