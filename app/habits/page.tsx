import type { Metadata } from "next";
import { Sparkles } from "lucide-react";
import { ClayCard, Disclaimer, PageHeader } from "@/components/clay";
import { HabitsTracker } from "@/components/habits-tracker";

export const metadata: Metadata = {
  title: "Healthy Habits",
  description:
    "Build small daily health habits and track your streak — privately, on your device.",
};

export default function HabitsPage() {
  return (
    <div className="mx-auto w-full max-w-2xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Habits"
        title="One check-in at a time"
        subtitle="Choose a few small habits. Tap when you do them. Your progress stays on this device — no account, no sharing."
        accent="peach"
        icon={<Sparkles className="size-3.5" aria-hidden />}
      />

      <ClayCard>
        <HabitsTracker />
      </ClayCard>

      <div className="mt-4">
        <Disclaimer>
          Habit tracking is for encouragement only. It does not detect or treat any
          health condition. Talk to a trusted adult or doctor about health concerns.
        </Disclaimer>
      </div>
    </div>
  );
}
