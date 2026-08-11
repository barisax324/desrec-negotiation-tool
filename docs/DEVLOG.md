# Development Log

Internal development notes for the DesREC Negotiation Tool.

Unlike `CHANGELOG.md`, this document records architectural decisions, refactoring milestones, technical debt, and future development plans. It is intended for developers and project maintainers.

---

# 2026-08-10

## Architecture Refactor

### Objective

Reduce the complexity of `Start.tsx`, separate application flow from page rendering, and establish a scalable architecture before implementing Summary edit dialogs and future collaboration features.

---

## Completed

### Start Flow

- Continued decomposing `Start.tsx` into dedicated hooks, services, and router components.
- Moved negotiation loading, progress management, onboarding flow, Summary editing, and questionnaire state into reusable hooks.
- Reduced `Start.tsx` to primarily orchestrating application flow.

### Questionnaire Routing

Introduced dedicated router components for every questionnaire page.

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

- Page navigation
- Progress saving
- Summary return logic
- Edit mode behavior
- Comparison navigation

`QuestionnaireRouter` now serves primarily as a page router instead of containing page-specific business logic.

### Onboarding

- Simplified `OnboardingRouter` by extracting shared editing helpers.
- Removed duplicated update, save, and cancel logic.
- Standardized onboarding editing behavior.

### Shared Types

- Moved questionnaire router interfaces into a dedicated shared type definition file.
- Reduced duplication between router components.

### General Cleanup

- Removed duplicated navigation logic.
- Standardized routing patterns across onboarding and questionnaire flows.
- Improved separation between UI components and application logic.

---

## Current Architecture

```
Start
├── useNegotiationLoader
├── useNegotiationOverview
├── useQuestionnaireState
├── useParticipantProgress
├── useSummaryEditing
├── useOnboardingFlow
│
├── OnboardingRouter
│
└── QuestionnaireRouter
     ├── SceneGoalsRouterPage
     ├── ActivitiesRouterPage
     ├── HealthSafetyRouterPage
     ├── CommunicationRouterPage
     ├── AftercareRouterPage
     ├── SummaryRouterPage
     └── ComparisonRouterPage
```

---

## Design Goals

Current architecture priorities:

- Single responsibility for components.
- Business logic separated from UI.
- Reusable hooks instead of duplicated state management.
- Consistent routing structure.
- Easy addition of future questionnaire pages.
- Minimize coupling between application layers.

---

## Remaining Technical Debt

### High Priority

- Introduce `QuestionnaireContext` to eliminate prop drilling.
- Replace large router component interfaces with shared context.
- Centralize questionnaire navigation into a dedicated navigation API.

### Medium Priority

- Replace Summary page navigation with reusable edit dialogs.
- Convert remaining questionnaire sections into reusable form components.
- Reduce duplicate save and navigation callbacks.
- Continue improving TypeScript type organization.

### Low Priority

- UI polish.
- Animation improvements.
- Accessibility review.
- Final production cleanup.

---

## Future Milestones

### Milestone 1

Implement `QuestionnaireContext`.

Expected benefits:

- Significantly fewer props passed between components.
- Cleaner router interfaces.
- Easier future feature development.

### Milestone 2

Summary edit dialogs.

Replace full-page navigation with inline editing for:

- Scene Details
- About You
- Experience
- Scene Goals
- Activities
- Health & Safety
- Communication
- Aftercare

### Milestone 3

Production polish.

- Cross-browser testing
- Mobile testing
- Accessibility review
- Performance optimization
- Launch preparation

---

## Notes

This refactor intentionally focused on architecture rather than user-facing functionality.

The goal was to establish a maintainable foundation before implementing larger features such as Summary edit dialogs, improved navigation, and future collaboration capabilities.