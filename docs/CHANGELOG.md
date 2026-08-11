# Changelog

All notable user facing changes to the DesREC Negotiation Tool will be documented in this file.

---
## v1.1.0 - In Development

### Added
- Added a **Scene Details** page before onboarding so participants can review shared negotiation information before beginning the questionnaire.
- Added a **Planned Activities** field to the Scene Details page with contextual guidance.
- Added in-place editing for shared **Scene Details**, allowing either participant to update the negotiation name, planned scene date, and planned activities.
- Added automatic synchronization and persistent storage for shared Scene Details between participants.
- Added reusable onboarding and questionnaire router components.
- Added the reusable `AboutYouForm` component as the first step toward Summary edit dialogs.
- Added the `useQuestionnaireState` hook to centralize questionnaire state management.
- Added the `useNegotiationOverview` hook to centralize Scene Details state and save logic.
- Added the `useNegotiationLoader` hook to centralize negotiation loading, participant validation, and progress restoration.
- Added the `useParticipantProgress` hook to centralize questionnaire progress saving and navigation.
- Added the `useSummaryEditing` hook to centralize Summary editing state and logic.
- Added the `participantProgress` service to separate participant progress database operations from UI logic.
- Added reusable `StartLoading` and `StartError` components for loading and error states.

### Changed
- Reordered the participant flow so **Scene Details** is presented before onboarding.
- Added back navigation throughout onboarding so participants can review and edit previous pages before beginning the questionnaire.
- Renamed **Experience Goals** to **Scene Goals** throughout the application.
- Updated questionnaire progress tracking to use the new `scene-goals` page identifier.
- Updated Scene Goals wording to focus on the current scene rather than general experience.
- Updated Scene Details editing so selecting a date automatically clears **Not decided yet**.
- Redesigned the Scene Details page to match the layout used throughout the rest of the application.
- Reorganized the application into a numbered workflow-based page structure covering Home, Setup, Security, Onboarding, Questionnaire, Results, and About.
- Moved shared assets, static data, and the Supabase client into centralized shared directories.
- Standardized shared UI folder naming using lowercase kebab-case conventions.
- Updated imports throughout the project to match the new application architecture.
- Continued refactoring `Start.tsx` by moving state management, loading, routing, and database logic into dedicated hooks, services, and router components.

### Fixed
- Fixed circular dependency issues introduced during the hook refactor.
- Fixed questionnaire progress restoration after moving negotiation loading into a dedicated hook.
- Fixed participant progress saving after refactoring questionnaire state management.
- Fixed TypeScript errors introduced during the refactor and removed unused imports.
- Fixed Scene Details synchronization, persistence, validation, and save behavior.
- Fixed onboarding navigation that could return participants to the wrong page.
- Fixed questionnaire progress saving after renaming Experience Goals to Scene Goals.
- Fixed the `participants.current_page` database constraint and default value after the Scene Goals rename.
- Fixed Scene Goals option styling caused by an incorrect CSS class name.
- Fixed numerous import paths and build issues introduced during the project architecture reorganization.
- Resolved Windows case-sensitivity issues affecting TypeScript builds after folder renaming.

### Improved
- Removed the scene time field from the Scene Details page.
- Redesigned the Scene Details page using separate cards for scene date and planned activities.
- Added planned activities to the Review page before negotiation creation.
- Improved section heading layout to prevent titles from overlapping their containers.
- Improved visual consistency across onboarding and questionnaire pages.
- Improved overall project organization and maintainability through a standardized directory structure.

### Database
- Added the `planned_activities` column to the `negotiations` table.
- Updated negotiation creation and loading functions to store and return planned scene activities.
- Updated participant progress tracking to use `scene-goals` instead of `experience-goals`.
- Migrated existing participant progress records to the new page identifier.
- Updated the `participants.current_page` constraint and default value.

### Refactored
- Refactored the questionnaire architecture by moving each questionnaire page into its own dedicated router component.
- Simplified `QuestionnaireRouter` so it is responsible only for page routing and navigation.
- Moved page-specific navigation, save, comparison, and Summary return logic into dedicated router page components.
- Extracted shared questionnaire routing types into a standalone type definition file.
- Refactored onboarding editing to eliminate duplicated update, save, and cancel logic.
- Simplified `OnboardingRouter` by introducing reusable helper functions for editing workflows.
- Continued decomposing `Start.tsx` into focused hooks, services, and router components.
- Standardized routing architecture across onboarding and questionnaire flows in preparation for a shared Questionnaire Context.
- Completed a full project architecture reorganization into dedicated `app`, `pages`, and `shared` layers.
- Centralized reusable UI components, assets, styles, design tokens, shared data, and shared clients into a unified `shared` directory.
- Reorganized the application into workflow-based numbered page folders for improved navigation and scalability.
- Moved project documentation into a dedicated `docs` directory.
- Standardized the overall project structure to improve maintainability, readability, and long-term scalability without changing user-facing functionality.

### In Progress
- Implementing a shared Questionnaire Context to eliminate prop drilling between routing components.
- Simplifying router component interfaces after Questionnaire Context is implemented.
- Converting questionnaire sections into reusable form components for both the questionnaire and Summary edit dialogs.
- Building Summary edit dialogs for Scene Details, About You, Experience, Scene Goals, Activities, Health & Safety, Communication, and Aftercare.
- Continuing architecture cleanup, UI polish, accessibility improvements, and production readiness.

---

## v1.0.0 - 2026-08-03

### 🎉 Initial Public Release

#### Added
- Guided multi-page negotiation workflow
- Password-protected participant access
- Personal recovery links
- Recovery by Reference ID and password
- Side-by-side comparison page
- Print-friendly comparison layout
- PDF export
- Interactive body map
- Body map notes
- Mobile-friendly body map
- Mobile-friendly comparison layout
- Automatic progress saving
- Automatic negotiation expiration
- Version number displayed on the summary page
- Bug report email link

#### Improved
- Complete responsive layout for desktop and mobile
- Cleaner summary page
- Improved navigation throughout the questionnaire
- Better comparison readability on phones

#### Fixed
- Participant B invitation flow
- Mobile body map orbit menu
- Orbit menu touch interaction
- Comparison layout on mobile devices
- Multiple navigation and routing issues
- Numerous UI and usability improvements