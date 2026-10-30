"use client";

import { useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import type { MythFact } from "@/lib/types";
import { shuffle } from "@/lib/utils";
import { ClayButton, Chip } from "./clay";

export function MythQuiz({ items }: { items: MythFact[] }) {
  const [order, setOrder] = useState<MythFact[]>(items);
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<"myth" | "fact" | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = order[index];
  const revealed = picked !== null;
  const total = order.length;
  const correct = picked === current?.verdict;

  function choose(value: "myth" | "fact") {
    if (revealed) return;
    setPicked(value);
    if (value === current.verdict) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setPicked(null);
  }

  function reset() {
    setOrder(shuffle(items));
    setIndex(0);
    setPicked(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    return (
      <div className="animate-pop text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-sun-soft text-[#7a5a00]">
          <Trophy className="size-8" aria-hidden />
        </div>
        <p className="mt-4 text-2xl font-black">
          {score} / {total} correct
        </p>
        <p className="mt-2 text-sm font-semibold text-muted">
          Myth-busting is a skill. The explanations matter more than the score.
        </p>
        <div className="mt-5 flex justify-center">
          <ClayButton onClick={reset} variant="primary">
            <RotateCcw className="size-4" aria-hidden />
            Play again
          </ClayButton>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Chip tone="sun">
          Claim {index + 1} of {total}
        </Chip>
        <span className="text-sm font-extrabold text-muted">
          Score <span className="text-ink">{score}</span>
        </span>
      </div>

      <div className="clay-inset mt-5 rounded-3xl p-5 sm:p-6">
        <p className="text-xs font-extrabold uppercase tracking-wider text-muted">
          Is this a myth or a fact?
        </p>
        <p className="mt-2 text-xl font-black leading-snug sm:text-2xl">
          “{current.claim}”
        </p>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-3">
        {(["myth", "fact"] as const).map((value) => {
          const isAnswer = value === current.verdict;
          const isPicked = picked === value;
          const state = !revealed
            ? "idle"
            : isAnswer
              ? "correct"
              : isPicked
                ? "wrong"
                : "dim";
          return (
            <button
              key={value}
              type="button"
              onClick={() => choose(value)}
              disabled={revealed}
              aria-pressed={isPicked}
              className={[
                "rounded-2xl border px-4 py-5 text-base font-black uppercase tracking-wide transition",
                state === "idle" &&
                  "border-white/70 bg-white/70 shadow-sm hover:-translate-y-0.5 hover:bg-white",
                state === "correct" && "border-transparent bg-mint-soft text-[#1c5f49]",
                state === "wrong" && "border-transparent bg-coral-soft text-[#8c2f2f]",
                state === "dim" && "border-transparent bg-white/40 text-muted",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="flex items-center justify-center gap-2">
                {state === "correct" ? <CheckCircle2 className="size-5" aria-hidden /> : null}
                {state === "wrong" ? <XCircle className="size-5" aria-hidden /> : null}
                {value}
              </span>
            </button>
          );
        })}
      </div>

      {revealed ? (
        <div
          className={`animate-pop mt-4 rounded-2xl p-4 text-sm font-semibold leading-relaxed ${
            correct ? "bg-mint-soft text-[#1c5f49]" : "bg-sky-soft text-[#1d5878]"
          }`}
          role="status"
        >
          <p className="font-extrabold">
            {correct ? "You got it — it is a " : "Actually, it is a "}
            {current.verdict}.
          </p>
          <p className="mt-1">{current.explanation}</p>
          <p className="mt-2 text-xs font-bold">
            <span className="font-extrabold">Why it matters:</span> {current.whyItMatters}
          </p>
          <p className="mt-2 text-[11px] font-bold opacity-80">
            Source: {current.source} · reviewed {current.reviewedAt}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex justify-end">
        <ClayButton onClick={next} disabled={!revealed}>
          {index + 1 >= total ? "See results" : "Next claim"}
          <ArrowRight className="size-4" aria-hidden />
        </ClayButton>
      </div>
    </div>
  );
}
