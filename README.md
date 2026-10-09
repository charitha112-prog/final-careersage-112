# CareerSage Frontend

A React + Vite frontend prototype for CareerSage, with a cream/orange/navy/blue palette, abstract background shapes, translucent glass cards, and generic demo data.

## Run locally

```bash
npm install
npm run dev
```

Open the local Vite URL printed in the terminal.

## Included
- Landing page and separate login/create-account screens
- Demo form validation and duplicate email/phone checks
- Resume file selection with 10 MB/type validation
- In-place basketball basket interaction after choosing a resume
- Simulated resume analysis and dashboard
- Resume analysis, interview preparation, technical/company question banks, mock tests, progress chart, practice interview, and profile
- Animated kitten video icon in the top bar of app pages; click it to re-upload a resume
- Generic sample data in `src/data.js`

## Demo-only note
Authentication and resume analysis are simulated in the browser. Do not use the demo password storage for real accounts. Connect the forms and resume flow to a secure backend before production. See `BACKEND_HANDOFF.md`.

## Latest UI refinements
- Larger circular kitten animation centered on the initial resume-upload state (not shown on landing, login, or create-account screens).
- Header re-upload action is a standalone circular kitten icon with a two-line label, without an oval glass button.
- Resume basket has a backboard, orange-red rim, red net, drag-to-drop target, spinning arc, and “Good shot!” success state. Clicking the PDF alone does not shoot it.
- Dashboard, preparation overview, interview practice, resume analysis, and progress layouts use tighter desktop spacing; interview banks can still scroll when content needs more room.
- Progress chart and practice summary are side by side, and dashboard strengths/improvements/next steps are stacked vertically on the right.
- Demo resume completion is remembered per account in local storage so returning demo users go to their dashboard.
