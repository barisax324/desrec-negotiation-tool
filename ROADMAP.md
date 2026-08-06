## UI Refactor

- Standardize all buttons across the application using the shared `Button` component.
- Remove page-specific button styling from Setup, Scene Overview, Onboarding, Questionnaire, Summary, Comparison, and future pages.
- Consolidate colors, sizing, spacing, hover states, loading states, and disabled states into `Button.css`.
- Ensure consistent button order across desktop and mobile (Back on the left, Continue/Save on the right on desktop; primary action above secondary on mobile).
- Standardize button widths, border radii, and icon spacing throughout the app.

## Onboarding Flow Improvements

- Reorder the onboarding flow to:
  1. Welcome
  2. Scene Details
  3. About You
  4. Scene Goals
  5. Ready
  6. Questionnaire

- Rename **Scene Overview** to **Scene Details** throughout the application.

- Ensure back navigation follows the same order:
  - Questionnaire → Ready
  - Ready → Scene Goals
  - Scene Goals → About You
  - About You → Scene Details
  - Scene Details → Welcome
  - Welcome → Open Negotiation

- Review all page titles, descriptions, and button text for consistency after the flow change.

## Shared Scene Details

- Add a "Last updated" timestamp when shared scene details are modified.
- Display which participant most recently updated the shared details (without exposing identities, e.g. "Updated by your scene partner" or "Updated by you").
- Notify participants when shared scene details have changed since they last viewed them.

### Scene Overview

- **Fix refresh behavior:** Refreshing the page currently reopens the **Edit Scene Details** popup automatically.
- The edit popup should only open when the user explicitly clicks **Edit Details**.
- Refreshing the page should return the user to the normal **Scene Overview** page with the popup closed.
- The popup open/closed state should be treated as temporary UI state only and should not persist across page refreshes.