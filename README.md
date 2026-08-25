# PrepPilot

An AI-powered mock interview platform. Practice interviews for any role, get instant AI feedback on your answers, and track your progress over time.

**Live app:** [preppilot-interview.vercel.app](https://preppilot-interview.vercel.app/)

## What it does

- Sign up and log in securely (Firebase Auth)
- Start a mock interview for a role of your choice
- Answer AI-generated interview questions (mix of technical and behavioral)
- Get instant, specific feedback from Gemini after each answer
- Receive an overall performance summary — strengths, weaknesses, and a score — at the end
- Review your full interview history anytime, including the complete transcript of any past session

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS
- **Auth & Database:** Firebase Authentication (email/password) + Firestore
- **AI:** Google Gemini API for question generation, per-answer feedback, and summary scoring
- **Hosting:** Vercel, with automatic deploys on every push to `main`

## How it's built

- API keys and secrets are never exposed to the browser — all Gemini API calls go through server-side Next.js API routes (`/api/generate-questions`, `/api/generate-feedback`, `/api/generate-summary`)
- Auth state is shared across the app via a React Context (`AuthContext`), and protected routes redirect unauthenticated users to `/login`
- Completed interviews are saved to Firestore, tagged by user ID, and queried back out for the dashboard's history view
- Built using a feature-branch Git workflow (branch → test → merge to `main`) to keep `main` always in a deployable state

## Running it locally

\`\`\`bash
git clone https://github.com/pranoj/ai-mock-interview.git
cd ai-mock-interview
npm install
\`\`\`

Create a `.env.local` file with:

\`\`\`
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
GEMINI_API_KEY=
\`\`\`

Then run:

\`\`\`bash
npm run dev
\`\`\`