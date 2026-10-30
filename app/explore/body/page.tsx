import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, ScanHeart } from "lucide-react";
import { ClayCard, Disclaimer, PageHeader } from "@/components/clay";
import { BodyExplorer } from "@/components/body-diagram";
import parts from "@/content/anatomy.json";
import type { BodyPart } from "@/lib/types";

export const metadata: Metadata = {
  title: "Human Body Explorer",
  description:
    "A friendly interactive diagram of major human organs for students.",
};

export default function BodyPage() {
  const bodyParts = parts as BodyPart[];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <Link
        href="/explore"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Explore
      </Link>

      <PageHeader
        eyebrow="Human Body Explorer"
        title="Meet your organs"
        subtitle="Tap a coloured dot on the body. You will see what the organ is, where it sits, and what it does."
        accent="lavender"
        icon={<ScanHeart className="size-3.5" aria-hidden />}
      />

      <ClayCard>
        <BodyExplorer parts={bodyParts} />
      </ClayCard>

      <div className="mt-4">
        <Disclaimer>
          Simplified for learning. Real organs are more complex — ask a biology
          teacher if you want to go deeper.
        </Disclaimer>
      </div>
    </div>
  );
}
