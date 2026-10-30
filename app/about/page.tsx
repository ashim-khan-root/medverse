import type { Metadata } from "next";
import {
  BookOpenCheck,
  Database,
  ExternalLink,
  Info,
  Lock,
  ShieldAlert,
} from "lucide-react";
import { ClayCard, Chip, Disclaimer, PageHeader } from "@/components/clay";

export const metadata: Metadata = {
  title: "About & Sources",
  description:
    "How MedVerse works, what it is not, where its data comes from, and what it stores.",
};

const sources = [
  {
    name: "openFDA drug labels",
    use: "General medicine uses, warnings, and active ingredients.",
    href: "https://open.fda.gov/apis/drug/label/",
    licence: "Public domain (US government)",
  },
  {
    name: "OpenStreetMap + Overpass",
    use: "Nearby pharmacies, clinics, and hospitals.",
    href: "https://www.openstreetmap.org/",
    licence: "ODbL — © OpenStreetMap contributors",
  },
  {
    name: "Nominatim",
    use: "Turning a city name into map coordinates.",
    href: "https://nominatim.org/",
    licence: "OpenStreetMap data (ODbL), usage policy applies",
  },
  {
    name: "Next.js",
    use: "Web framework and API routes.",
    href: "https://nextjs.org/",
    licence: "MIT",
  },
  {
    name: "Tailwind CSS",
    use: "Styling and design tokens.",
    href: "https://tailwindcss.com/",
    licence: "MIT",
  },
  {
    name: "Leaflet + react-leaflet",
    use: "The interactive map.",
    href: "https://leafletjs.com/",
    licence: "BSD-2-Clause / MIT",
  },
  {
    name: "Lucide icons",
    use: "Interface icons.",
    href: "https://lucide.dev/",
    licence: "ISC",
  },
  {
    name: "Google Gemini (optional)",
    use: "Plain-language explanation of pasted medical reports.",
    href: "https://ai.google.dev/",
    licence: "Google AI terms",
  },
  {
    name: "Nunito (Google Fonts)",
    use: "Friendly rounded typeface.",
    href: "https://fonts.google.com/specimen/Nunito",
    licence: "SIL Open Font License",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <PageHeader
        eyebrow="About & Sources"
        title="A student health-learning project"
        subtitle="MedVerse is built to make health topics approachable. It is a school project, not a medical service."
        accent="grape"
        icon={<Info className="size-3.5" aria-hidden />}
      />

      <div className="mb-4">
        <Disclaimer tone="emergency">
          Educational use only. MedVerse does not diagnose conditions, recommend
          treatment, calculate doses, or replace a doctor, pharmacist, or emergency
          service. In an emergency, call your local emergency number.
        </Disclaimer>
      </div>

      <div className="grid gap-4">
        <ClayCard>
          <div className="flex items-center gap-2">
            <BookOpenCheck className="size-5 text-grape" aria-hidden />
            <h2 className="text-lg font-black">What you can do here</h2>
          </div>
          <ul className="mt-3 grid gap-2 text-sm font-semibold text-muted sm:grid-cols-2">
            <li className="rounded-2xl bg-white/70 p-3">Take first-aid and myth/fact quizzes.</li>
            <li className="rounded-2xl bg-white/70 p-3">Explore a simple body diagram.</li>
            <li className="rounded-2xl bg-white/70 p-3">Look up general medicine label info.</li>
            <li className="rounded-2xl bg-white/70 p-3">Track small healthy habits privately.</li>
            <li className="rounded-2xl bg-white/70 p-3">Find nearby care on a map.</li>
            <li className="rounded-2xl bg-white/70 p-3">See the source for every health claim.</li>
          </ul>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-2">
            <ShieldAlert className="size-5 text-[#8c2f2f]" aria-hidden />
            <h2 className="text-lg font-black">What it will never do</h2>
          </div>
          <ul className="mt-3 grid gap-2 text-sm font-semibold text-muted">
            <li>❌ Tell you whether you have a condition.</li>
            <li>❌ Recommend or change a medicine or dose.</li>
            <li>❌ Ask for your symptoms, medical history, or personal health data.</li>
          </ul>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-2">
            <Lock className="size-5 text-[#1c5f49]" aria-hidden />
            <h2 className="text-lg font-black">Privacy</h2>
          </div>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
            No accounts and no sign-in. Habit check-ins are stored only in your
            browser&apos;s local storage, on this device. Your location is sent only
            as part of a nearby-search request and is not saved by MedVerse.
          </p>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center gap-2">
            <Database className="size-5 text-[#1d5878]" aria-hidden />
            <h2 className="text-lg font-black">Data sources & licences</h2>
          </div>
          <div className="mt-3 space-y-2">
            {sources.map((source) => (
              <div
                key={source.name}
                className="rounded-2xl bg-white/70 px-3.5 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <a
                    href={source.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-sm font-extrabold text-grape hover:underline"
                  >
                    {source.name}
                    <ExternalLink className="size-3" aria-hidden />
                  </a>
                  <Chip tone="soft">{source.licence}</Chip>
                </div>
                <p className="mt-1 text-xs font-semibold text-muted">{source.use}</p>
              </div>
            ))}
          </div>
          <p className="mt-3 text-xs font-semibold text-muted">
            Full attribution lives in <code className="font-bold">THIRD_PARTY_NOTICES.md</code>{" "}
            in the project repository.
          </p>
        </ClayCard>

        <ClayCard>
          <h2 className="text-lg font-black">Content review</h2>
          <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
            Quiz and myth content is seeded with a source and a review date, and
            should be checked by a teacher or health educator before submission. If
            you spot something inaccurate, correct the JSON and bump the review date.
          </p>
          <p className="mt-3 text-xs font-bold text-muted">
            Last updated: 30 October 2026
          </p>
        </ClayCard>
      </div>
    </div>
  );
}
