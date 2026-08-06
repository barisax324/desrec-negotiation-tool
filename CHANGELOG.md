# Changelog

All notable changes to the DesREC Negotiation Tool will be documented in this file.

---
## v1.1.0 - In Development

### Added
- Added a **Scene Overview** page before onboarding so participants can review the planned negotiation before beginning the questionnaire.
- Added a **Planned Activities** field to the Scene Information page with contextual guidance.
- Planned scene activities are now stored with the negotiation and displayed to both participants before the questionnaire.
- Added in-place editing for shared **Scene Details**, allowing either participant to update the negotiation name, planned scene date, and planned activities.
- Added automatic synchronization of Scene Details between participants.
- Added persistent storage for Scene Details so updates remain after page refreshes.
- Added reusable `AboutYouForm` component as the first step toward reusable edit dialogs throughout the application.
- Added `useQuestionnaireState` hook to centralize questionnaire state management.
- Added `useNegotiationOverview` hook to centralize Scene Overview state and save logic.
- Added `participantProgress` service to separate participant progress database operations from page logic.

### Changed
- Reordered the participant flow so **Scene Overview** is presented before onboarding.
- Added back navigation throughout the onboarding flow so participants can review and edit previous pages before beginning the questionnaire.
- Updated Scene Overview editing so selecting a date automatically clears **Not decided yet**.
- Continued refactoring `Start.tsx` by moving state management and database logic into reusable hooks and services.

### Fixed
- Fixed Scene Details updates so changes are synchronized correctly between both participants.
- Fixed Scene Details persistence so updates remain after page refreshes.
- Fixed Scene Overview save behavior and validation.
- Fixed onboarding navigation that could return participants to the wrong page.

### Improved
- Removed the scene time field from the Scene Information page.
- Redesigned the Scene Information page using separate cards for scene date and planned activities.
- Improved section heading layout to prevent titles from overlapping their containers.
- Added planned activities to the Review page before negotiation creation.
- Shared scene detail changes now save to Supabase and remain synchronized between participants.

### Database
- Added the `planned_activities` column to the `negotiations` table.
- Updated negotiation creation functions to store planned scene activities.
- Updated negotiation loading functions to return planned scene activities.

### In Progress
- Refactoring Summary editing to use reusable modal dialogs instead of navigating back through the questionnaire.
- Refactoring `Start.tsx` into smaller, more maintainable hooks and components.
- Converting questionnaire sections to reusable form components so the same UI can be used for both the questionnaire and Summary edit dialogs.
- Building Summary edit dialogs for Scene Details, About You, Experience, Activities, Health & Safety, Communication, and Aftercare.

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