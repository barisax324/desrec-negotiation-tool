# Roadmap

Planned features, improvements, and long-term goals for the DesREC Negotiation Tool.

---

# Current Focus (v1.1)

The current development focus is on usability, consistency, Summary editing, and production readiness rather than adding major new features.

---

# UI & UX Improvements

- Standardize all buttons across the application using the shared `Button` component.
- Remove page-specific button styling from Setup, Scene Details, Onboarding, Questionnaire, Summary, Comparison, and future pages.
- Consolidate colors, sizing, spacing, hover states, loading states, and disabled states into `Button.css`.
- Ensure consistent button order across desktop and mobile:
  - Desktop: **Back** on the left, **Continue/Save** on the right.
  - Mobile: Primary action above the secondary action.
- Standardize button widths, border radii, and icon spacing.
- Continue reducing visual clutter throughout the application.
- Standardize spacing between sections and cards.
- Standardize page titles and section headers.
- Improve typography hierarchy.
- Improve loading and empty states.
- Improve responsive layouts on mobile and tablet.

---

# Onboarding Flow

Continue reviewing the onboarding experience for clarity and consistency.

Current flow:

1. Welcome
2. Scene Details
3. About You
4. Scene Goals
5. Ready
6. Questionnaire

Tasks:

- Verify back navigation throughout onboarding.
- Review helper text and descriptions.
- Review page titles.
- Review button wording.
- Ensure every onboarding page follows the same layout and interaction patterns.

---

# Shared Scene Details

- Add a **Last Updated** timestamp.
- Show which participant last updated the shared details.
- Notify participants when Scene Details have changed.

### Scene Details

- Fix refresh behavior so the **Edit Scene Details** dialog does not automatically reopen after refreshing.
- Treat dialog visibility as temporary UI state only.

---

# Summary & Comparison

## Summary Editing

Replace full-page editing with inline dialogs for:

- Scene Details
- About You
- Experience
- Scene Goals
- Activities
- Health & Safety
- Communication & Boundaries
- Aftercare

## Comparison Improvements

Use comparison highlighting only where it improves decision making.

### Keep color-coded comparisons for:

- Activities
- Communication & Boundaries

### Display normally (no similarity highlighting):

- Scene Details
- About You
- Experience
- Health & Safety
- Aftercare

Show both participants' responses side-by-side without emphasizing whether answers match.

---

# Architecture

- Implement `QuestionnaireContext` to eliminate prop drilling.
- Simplify router component interfaces.
- Continue reducing duplicated state management.
- Continue simplifying orchestration components.
- Introduce TypeScript path aliases (`@/...`) to eliminate long relative imports.
- Continue reducing duplicate types throughout the application.

---

# Developer Experience

## Documentation

- Create `ARCHITECTURE.md`.
- Create `CONTRIBUTING.md`.
- Continue improving project documentation.
- Keep README, CHANGELOG, DEVLOG, and ROADMAP synchronized.

## Code Quality

- Remove unused code.
- Remove unused CSS.
- Audit TODO/FIXME comments.
- Continue simplifying large components.
- Continue expanding reusable shared UI components.

---

# Accessibility

- Full keyboard navigation.
- Improve focus states.
- Improve screen reader support.
- Verify color contrast.
- Improve body map accessibility.
- Complete accessibility review before release.

---

# Performance

- Lazy-load large pages.
- Reduce JavaScript bundle size.
- Optimize images.
- Reduce unnecessary renders.
- Improve startup performance.

---

# Testing

## Manual Testing

Before every release:

- Create negotiation
- Join negotiation
- Recover negotiation
- Complete Participant A
- Complete Participant B
- Verify Summary
- Verify Comparison
- Verify Print
- Verify desktop layout
- Verify mobile layout

## Browser Testing

- Chrome
- Firefox
- Edge
- Safari

---

# Production Readiness

- Display the application version within the UI.
- Expand the About page to include:
  - Current version
  - Privacy information
  - Changelog
  - Bug report link
  - DesREC information
- Add GitHub issue templates.
- Finalize production build configuration.
- Complete end-to-end workflow validation.

---

# Future Features

## Negotiation Report

- Generate a polished printable negotiation report.
- Improve print layouts.
- Support PDF export.

## Progressive Web App

- Installable application.
- Offline support.
- Home screen installation.
- Native-like experience.

## Long-Term Ideas

- Optional dark mode.
- Optional compact mode.
- Additional accessibility improvements.
- Additional customization options.

---

# Release Process

Before every release:

- Update version number.
- Update CHANGELOG.
- Update DEVLOG.
- Update ROADMAP.
- Verify production build.
- Complete manual testing.
- Create a Git tag.
- Push the release tag.

---

# Guiding Principles

Every feature should support these goals:

- Privacy first.
- Communication over automation.
- Reduce cognitive load.
- Consistency over novelty.
- Reuse shared components whenever possible.
- Keep business logic separate from presentation.
- Build tools that encourage better conversations rather than making decisions for the user.