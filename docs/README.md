# DesREC Negotiation Tool

A privacy-focused negotiation tool designed for rope, BDSM, and other consent-based activities.

The application guides two participants through a structured negotiation, allowing each person to complete their responses independently before viewing a side-by-side comparison.

The goal is not to negotiate for the user, but to facilitate clear communication and informed consent.

---

# Features

- Guided multi-step negotiation workflow
- Independent participant questionnaires
- Side-by-side comparison of responses
- Shared scene details
- Interactive body map
- Health & safety questionnaire
- Communication & boundary negotiation
- Aftercare planning
- Secure participant links
- Recovery using participant credentials
- Automatic progress saving
- Printable negotiation summary
- Automatic negotiation expiration

---

# Project Goals

- Privacy-first architecture
- Simple, guided user experience
- Clear communication over visual complexity
- Consistent interface throughout the application
- Mobile-friendly responsive design
- Maintainable, scalable codebase

---

# Technology

- React
- TypeScript
- Vite
- Supabase
- React Router
- CSS Modules / Shared UI Components

---

# Project Structure

```
src
├── app/
├── pages/
│   ├── 01-home
│   ├── 02-setup
│   ├── 03-security
│   ├── 04-onboarding
│   ├── 05-questionnaire
│   ├── 06-results
│   └── 07-about
│
├── shared/
│   ├── assets
│   ├── clients
│   ├── components
│   ├── data
│   ├── design
│   ├── layouts
│   ├── styles
│   ├── types
│   ├── ui
│   └── utils
│
├── services/
└── utils/
```

---

# Development

Install dependencies

```bash
npm install
```

Run locally

```bash
npm run dev
```

Production build

```bash
npm run build
```

Preview production build

```bash
npm run preview
```

---

# Current Status

The application is currently in active development toward the **v1.1** milestone.

Current priorities include:

- Summary editing for every questionnaire section
- Shared Questionnaire Context
- UI consistency and polish
- Comparison improvements
- Production readiness
- Accessibility improvements

---

# Design Principles

The application is designed around a few core principles.

## Privacy First

Participants control access to their own negotiation.

## Reduce Cognitive Load

Only highlight information that requires attention.

Visual complexity should never compete with the conversation.

## Consistency

Every page should follow the same interaction patterns whenever possible.

## Communication Over Automation

The application exists to encourage discussion—not replace it.

---

# UI Principles

- Use color only where it communicates meaningful information.
- Activities and Communication comparisons should remain color-coded.
- Informational sections should display responses without unnecessary comparison highlighting.
- Maintain consistent spacing, typography, and navigation throughout the application.
- Prefer reusable shared components over page-specific implementations.

---

# Architecture

The application follows a workflow-based architecture.

- `app` contains application orchestration.
- `pages` contains the user workflow.
- `shared` contains reusable components, UI, assets, styles, data, and shared services.
- `services` contains database interaction and business logic.

This organization is intended to keep future development predictable and maintainable.

---

# Future Development

See:

- `/docs/ROADMAP.md`
- `/docs/DEVLOG.md`
- `/docs/CHANGELOG.md`

for upcoming work, development notes, and release history.

---

# License

Private project.

Developed for the Desert Rope Education Collective (DesREC).