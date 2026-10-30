# MedVerse

A playful, student-focused health-learning web app: first-aid and myth/fact
quizzes, an interactive body explorer, a general medicine lookup, a private habit
tracker, a nearby-care map, a plain-language medical report explainer, and an
X-ray reading guide.

> **Educational use only.** MedVerse does not diagnose, prescribe, calculate
> doses, or replace a doctor, pharmacist, or emergency service.

## Stack

- Next.js 16 (App Router) + TypeScript
- Tailwind CSS v4 (custom claymorphism design system)
- Leaflet + react-leaflet (OpenStreetMap tiles)
- openFDA drug-label API (via a server route)
- Overpass API + Nominatim (via server routes)
- Google Gemini (optional, for the Report Explainer page)
- No accounts, no database

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

```bash
npm run build   # production build
npm start       # run the production build
npm run lint    # eslint
```

## Deploy (free)

1. Push this folder to a GitHub repository.
2. Import it at https://vercel.com/new.
3. Deploy — no environment variables required for the core app.
4. (Optional) Add `GEMINI_API_KEY` to enable the Report Explainer page.
   Copy `.env.local.example` to `.env.local` for local dev.

Server routes act as a small proxy so browser CORS and rate limits stay under
control, and so every external API failure can fall back to bundled sample data.

## Project structure

```
app/
  page.tsx              Home
  learn/                Quiz hub, first-aid quiz, myth/fact quiz
  explore/              Body explorer + medicine search
  habits/               Habit tracker
  nearby/               Nearby care map
  about/                Disclaimers, sources, licences
  api/medicine/         openFDA proxy + fallback
  api/nearby/           Overpass proxy + fallback
  api/geocode/          Nominatim proxy + fallback
components/             Clay UI, quizzes, diagrams, map, illustrations
content/                Editable JSON content and sample data
lib/                    Types, storage, habit math, helpers
```

## Editing content (no coding)

All learning content is plain JSON in `content/`:

- `first-aid.json` — quiz questions
- `myths.json` — myth/fact claims
- `anatomy.json` — body parts and hotspot positions
- `medicine-fallback.json` — medicines shown when the live API is unavailable
- `nearby-fallback.json` — sample places and the default fallback city
- `habits.json` — the habit list

Every health claim has a `source` and a `reviewedAt` date. Ask a teacher or
health educator to review before submission.

## Fallbacks

Live data can fail (school network, rate limits, outages). MedVerse is designed so
the demo never breaks:

- Medicine search falls back to a curated sample and labels it "Sample data".
- Nearby care falls back to a bundled New Delhi sample and says so.
- City lookup falls back to a list of major cities.

## Licence

Project code and original SVG illustrations: for the student project's use.
Third-party software and data remain under their own licences — see
`THIRD_PARTY_NOTICES.md`.
