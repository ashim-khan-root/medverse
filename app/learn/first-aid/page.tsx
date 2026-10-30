import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { ClayCard, Disclaimer, PageHeader } from "@/components/clay";
import { QuizEngine } from "@/components/quiz-engine";
import questions from "@/content/first-aid.json";
import type { QuizQuestion } from "@/lib/types";

export const metadata: Metadata = {
  title: "First-Aid Quiz",
  description:
    "Scenario-based first-aid questions with explanations and sources for students.",
};

export default function FirstAidPage() {
  const qs = questions as QuizQuestion[];

  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <Link
        href="/learn"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Learn
      </Link>

      <PageHeader
        eyebrow="First-Aid Quiz"
        title="What would you do?"
        subtitle="Choose the best first action. Each answer explains the reason and where the guidance comes from."
        accent="mint"
        icon={<ShieldAlert className="size-3.5" aria-hidden />}
      />

      <Disclaimer tone="emergency">
        For a real emergency, call your local emergency number. This quiz is
        educational and does not replace trained help.
      </Disclaimer>

      <ClayCard className="mt-4">
        <QuizEngine questions={qs} />
      </ClayCard>
    </div>
  );
}
