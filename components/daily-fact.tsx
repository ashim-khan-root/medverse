"use client";

import { useState, useSyncExternalStore } from "react";
import { Lightbulb, RotateCcw } from "lucide-react";
import myths from "@/content/myths.json";
import type { MythFact } from "@/lib/types";
import { Chip } from "./clay";

const facts = myths as MythFact[];

const noopSubscribe = () => () => {};
const getDayIndex = () => Math.floor(Date.now() / 86_400_000);
const getZero = () => 0;

export function DailyFact() {
  const [offset, setOffset] = useState(0);
  const day = useSyncExternalStore(noopSubscribe, getDayIndex, getZero);
  const fact = facts[(day + offset) % facts.length];

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between gap-3">
        <Chip tone="sun">
          <Lightbulb className="size-3.5" aria-hidden />
          Claim of the day
        </Chip>
        <button
          type="button"
          onClick={() => setOffset((o) => o + 1)}
          className="grid size-8 place-items-center rounded-full text-muted transition hover:bg-white hover:text-ink"
          aria-label="Show another fact"
        >
          <RotateCcw className="size-4" aria-hidden />
        </button>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Chip tone={fact.verdict === "myth" ? "coral" : "mint"}>
          {fact.verdict === "myth" ? "Myth" : "Fact"}
        </Chip>
        <span className="text-[11px] font-bold text-muted">Can you tell?</span>
      </div>
      <p className="mt-2 text-lg font-black leading-snug">{fact.claim}</p>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
        {fact.explanation}
      </p>
      <p className="mt-3 text-xs font-bold text-muted">
        <span className="font-extrabold text-ink">Why it matters:</span>{" "}
        {fact.whyItMatters}
      </p>
    </div>
  );
}
