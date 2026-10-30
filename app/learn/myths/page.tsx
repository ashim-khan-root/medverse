import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, BadgeHelp } from "lucide-react";
import { ClayCard, PageHeader } from "@/components/clay";
import { MythQuiz } from "@/components/myth-quiz";
import items from "@/content/myths.json";
import type { MythFact } from "@/lib/types";

export const metadata: Metadata = {
  title: "Myth or Fact",
  description:
    "Separate common health myths from facts with evidence-based explanations.",
};

export default function MythsPage() {
  const facts = items as MythFact[];

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
        eyebrow="Myth or Fact"
        title="Can you spot the myth?"
        subtitle="Read each claim and decide. Then see the evidence and why it matters."
        accent="lavender"
        icon={<BadgeHelp className="size-3.5" aria-hidden />}
      />

      <ClayCard>
        <MythQuiz items={facts} />
      </ClayCard>
    </div>
  );
}
