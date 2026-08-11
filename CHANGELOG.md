# Changelog

All notable changes to the DesREC Negotiation Tool will be documented in this file.

---
## v1.1.0 - In Development

### Added
- Added a **Scene Details** page before onboarding so participants can review the shared negotiation information before beginning the questionnaire.
- Added a **Planned Activities** field to the Scene Details page with contextual guidance.
- Planned scene activities are now stored with the negotiation and displayed to both participants before the questionnaire.
- Added in-place editing for shared **Scene Details**, allowing either participant to update the negotiation name, planned scene date, and planned activities.
- Added automatic synchronization of Scene Details between participants.
- Added persistent storage for Scene Details so updates remain after page refreshes.
- Added reusable `AboutYouForm` component as the first step toward reusable Summary edit dialogs.
- Added reusable onboarding and questionnaire router components.
- Added `useQuestionnaireState` to centralize questionnaire state management.
- Added `useNegotiationOverview` to centralize Scene Details state and save logic.
- Added the `participantProgress` service to separate participant progress database operations from page logic.
- Added `useNegotiationLoader` hook to separate negotiation loading, participant validation, and progress restoration from `Start.tsx`.
- Added `useParticipantProgress` hook to centralize questionnaire progress saving and navigation.
- Added `useSummaryEditing` hook to centralize Summary editing state and logic.
- Added reusable `StartLoading` and `StartError` components for loading and error screens.

### Changed
- Continued refactoring `Start.tsx` by extracting loading, progress management, Summary editing, and status display into dedicated hooks and components.
- Replaced several wrapper functions with direct React state setters where appropriate.
- Simplified questionnaire routing by separating page rendering from application state management.
- Continued reducing the size and responsibilities of `Start.tsx` in preparation for moving remaining questionnaire logic into reusable components.
- Reordered the participant flow so **Scene Details** is presented before onboarding.
- Added back navigation throughout the onboarding flow so participants can review and edit previous pages before beginning the questionnaire.
- Renamed **Experience Goals** to **Scene Goals** throughout the questionnaire flow.
- Updated questionnaire progress tracking to use the new `scene-goals` page identifier.
- Updated the Scene Goals page wording to focus on the current scene rather than general experience.
- Updated Scene Details editing so selecting a date automatically clears **Not decided yet**.
- Updated the Scene Details and Scene Goals pages to match the visual layout used throughout the rest of the application.
- Continued refactoring `Start.tsx` by moving state management and database logic into reusable hooks, routers, and services.

### Fixed
- Fixed circular dependency issues introduced during the hook refactor.
- Fixed questionnaire progress restoration after moving negotiation loading into a dedicated hook.
- Fixed participant progress saving after refactoring questionnaire state management.
- Fixed TypeScript errors introduced during the refactor and cleaned up unused imports.
- Fixed Scene Details updates so changes are synchronized correctly between both participants.
- Fixed Scene Details persistence so updates remain after page refreshes.
- Fixed Scene Details save behavior and validation.
- Fixed onboarding navigation that could return participants to the wrong page.
- Fixed questionnaire progress saving after renaming Experience Goals to Scene Goals.
- Fixed participant progress database validation to recognize the `scene-goals` page.
- Fixed the `participants.current_page` database constraint and default value after the Scene Goals rename.
- Fixed Scene Goals option styling caused by an incorrect CSS class name.

### Improved
- Removed the scene time field from the Scene Details page.
- Redesigned the Scene Details page using separate cards for scene date and planned activities.
- Improved section heading layout to prevent titles from overlapping their containers.
- Added planned activities to the Review page before negotiation creation.
- Shared Scene Details now save to Supabase and remain synchronized between participants.
- Improved visual consistency across onboarding and questionnaire pages.

### Database
- Added the `planned_activities` column to the `negotiations` table.
- Updated negotiation creation functions to store planned scene activities.
- Updated negotiation loading functions to return planned scene activities.
- Updated participant progress tracking to use `scene-goals` instead of `experience-goals`.
- Migrated existing participant progress records from `experience-goals` to `scene-goals`.
- Updated the `participants.current_page` constraint and default value.

### In Progress
- Refactoring Summary editing to use reusable modal dialogs instead of navigating back through the questionnaire.
- Converting the remaining questionnaire sections into reusable form components so the same UI can be used for both the questionnaire and Summary edit dialogs.
- Building Summary edit dialogs for About You, Experience, Scene Goals, Activities, Health & Safety, Communication, and Aftercare.
- Continuing to refactor `Start.tsx` into smaller, focused hooks and components.
- Polishing layout and visual consistency across all onboarding, questionnaire, and Summary pages.

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