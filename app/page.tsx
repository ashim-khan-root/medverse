import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Compass,
  HeartPulse,
  MapPin,
  Pill,
  Sparkles,
} from "lucide-react";
import { ClayCard, Chip, Disclaimer } from "@/components/clay";
import { HeroArt } from "@/components/illustrations";
import { DailyFact } from "@/components/daily-fact";
import { HomeProgress } from "@/components/home-progress";

const tiles = [
  {
    href: "/learn",
    label: "First-aid quiz",
    hint: "Practise what to do in real moments.",
    icon: BookOpen,
    bg: "bg-mint-soft",
    fg: "text-[#1c5f49]",
  },
  {
    href: "/explore/medicine",
    label: "Check a medicine",
    hint: "Look up general label information.",
    icon: Pill,
    bg: "bg-sky-soft",
    fg: "text-[#1d5878]",
  },
  {
    href: "/explore/body",
    label: "Explore the body",
    hint: "Tap an organ and see what it does.",
    icon: Compass,
    bg: "bg-lavender-soft",
    fg: "text-[#4b3a86]",
  },
  {
    href: "/nearby",
    label: "Find nearby care",
    hint: "Pharmacies and clinics around you.",
    icon: MapPin,
    bg: "bg-peach-soft",
    fg: "text-[#8a4419]",
  },
];

export default function HomePage() {
  return (
    <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
      <section className="grid items-center gap-8 md:grid-cols-[1.3fr_1fr]">
        <div>
          <Chip tone="mint">
            <Sparkles className="size-3.5" aria-hidden />
            Health, one small lesson at a time
          </Chip>
          <h1 className="mt-4 text-4xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            Learn how your body works — and how to look after it.
          </h1>
          <p className="mt-4 max-w-xl text-base font-semibold leading-relaxed text-muted">
            Short first-aid quizzes, health myths, a body explorer, medicine
            lookup, habit streaks, and nearby care. Made for curious students.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/learn" className="btn btn-primary">
              Start a quiz
              <ArrowRight className="size-4" aria-hidden />
            </Link>
            <Link href="/explore/body" className="btn btn-soft">
              <HeartPulse className="size-4" aria-hidden />
              Explore the body
            </Link>
          </div>
        </div>

        <div className="relative">
          <HeroArt className="mx-auto w-full max-w-sm animate-floaty" />
          <span className="absolute left-2 top-4 rounded-2xl bg-white/90 px-3 py-2 text-xs font-extrabold shadow-lg shadow-ink/10 backdrop-blur">
            🫀 206 bones
          </span>
          <span className="absolute bottom-6 right-0 rounded-2xl bg-white/90 px-3 py-2 text-xs font-extrabold shadow-lg shadow-ink/10 backdrop-blur">
            🧠 1 amazing brain
          </span>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="jump-heading">
        <div className="mb-4 flex items-end justify-between gap-4">
          <h2 id="jump-heading" className="text-xl font-black sm:text-2xl">
            Jump back in
          </h2>
          <span className="text-xs font-bold text-muted">4 quick starts</span>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tiles.map((tile) => {
            const Icon = tile.icon;
            return (
              <Link
                key={tile.href}
                href={tile.href}
                className="clay-card group flex items-start gap-3 p-4 transition hover:-translate-y-1 hover:shadow-xl"
              >
                <span className={`grid size-11 shrink-0 place-items-center rounded-2xl ${tile.bg} ${tile.fg}`}>
                  <Icon className="size-5" aria-hidden />
                </span>
                <span className="min-w-0">
                  <span className="block text-sm font-black leading-tight">
                    {tile.label}
                  </span>
                  <span className="mt-1 block text-xs font-semibold leading-snug text-muted">
                    {tile.hint}
                  </span>
                </span>
                <ArrowRight className="ml-auto size-4 shrink-0 text-muted opacity-0 transition group-hover:opacity-100" aria-hidden />
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mt-8 grid gap-5 md:grid-cols-2">
        <ClayCard>
          <DailyFact />
        </ClayCard>
        <ClayCard>
          <HomeProgress />
        </ClayCard>
      </section>

      <section className="mt-8">
        <Disclaimer />
      </section>
    </div>
  );
}
