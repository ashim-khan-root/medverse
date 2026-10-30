import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BadgeHelp, BookOpen, ShieldAlert } from "lucide-react";
import { ClayCard, Chip, Disclaimer, PageHeader } from "@/components/clay";

export const metadata: Metadata = {
  title: "Learn",
  description: "Short first-aid and health myth quizzes with clear explanations.",
};

const quizzes = [
  {
    href: "/learn/first-aid",
    title: "First-Aid Quiz",
    text: "Ten real-life scenarios — burns, bleeding, choking, and more. Learn the right first move.",
    icon: ShieldAlert,
    bg: "bg-mint-soft",
    fg: "text-[#1c5f49]",
    tone: "mint" as const,
    tag: "10 scenarios",
  },
  {
    href: "/learn/myths",
    title: "Myth or Fact?",
    text: "Spot common health myths and learn the evidence behind each answer.",
    icon: BadgeHelp,
    bg: "bg-sun-soft",
    fg: "text-[#7a5a00]",
    tone: "sun" as const,
    tag: "12 claims",
  },
];

export default function LearnPage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Learn"
        title="Small lessons, big difference"
        subtitle="Pick a quiz. Every answer comes with a short explanation and a source, so you learn the why — not just the what."
        accent="mint"
        icon={<BookOpen className="size-3.5" aria-hidden />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {quizzes.map((quiz) => {
          const Icon = quiz.icon;
          return (
            <Link key={quiz.href} href={quiz.href} className="group">
              <ClayCard className="flex h-full flex-col transition duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <div className="flex items-start justify-between">
                  <span className={`grid size-12 place-items-center rounded-2xl ${quiz.bg} ${quiz.fg}`}>
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <Chip tone={quiz.tone}>{quiz.tag}</Chip>
                </div>
                <h2 className="mt-4 text-xl font-black">{quiz.title}</h2>
                <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-muted">
                  {quiz.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-grape">
                  Start
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </ClayCard>
            </Link>
          );
        })}
      </div>

      <div className="mt-6">
        <Disclaimer tone="emergency">
          These quizzes are for learning. In a real emergency, contact your local
          emergency services immediately.
        </Disclaimer>
      </div>

      <ClayCard className="mt-6">
        <h2 className="text-lg font-black">How it works</h2>
        <ol className="mt-3 grid gap-2 text-sm font-semibold text-muted sm:grid-cols-3">
          <li className="rounded-2xl bg-white/70 p-3">
            <span className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-grape">
              1 · Choose
            </span>
            Pick an answer you think is right.
          </li>
          <li className="rounded-2xl bg-white/70 p-3">
            <span className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-grape">
              2 · Learn
            </span>
            See the explanation and the source.
          </li>
          <li className="rounded-2xl bg-white/70 p-3">
            <span className="mb-1 block text-xs font-extrabold uppercase tracking-wide text-grape">
              3 · Retry
            </span>
            Play again in a fresh order.
          </li>
        </ol>
      </ClayCard>
    </div>
  );
}
