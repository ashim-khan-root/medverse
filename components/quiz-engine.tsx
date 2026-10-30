"use client";

import { useMemo, useState } from "react";
import { ArrowRight, CheckCircle2, RotateCcw, Trophy, XCircle } from "lucide-react";
import type { QuizQuestion } from "@/lib/types";
import { shuffle } from "@/lib/utils";
import { ClayButton, Chip } from "./clay";

export function QuizEngine({ questions }: { questions: QuizQuestion[] }) {
  const [order, setOrder] = useState<QuizQuestion[]>(questions);
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const current = order[index];
  const revealed = selected !== null;
  const total = order.length;

  const pct = useMemo(
    () => (total ? Math.round((index / total) * 100) : 0),
    [index, total],
  );

  function choose(i: number) {
    if (revealed) return;
    setSelected(i);
    if (i === current.answerIndex) setScore((s) => s + 1);
  }

  function next() {
    if (index + 1 >= total) {
      setFinished(true);
      return;
    }
    setIndex((i) => i + 1);
    setSelected(null);
  }

  function reset() {
    setOrder(shuffle(questions));
    setIndex(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
  }

  if (finished) {
    const perfect = score === total;
    return (
      <div className="animate-pop text-center">
        <div className="mx-auto grid size-16 place-items-center rounded-3xl bg-sun-soft text-[#7a5a00]">
          <Trophy className="size-8" aria-hidden />
        </div>
        <p className="mt-4 text-2xl font-black">
          {score} / {total} correct
        </p>
        <p className="mt-2 text-sm font-semibold text-muted">
          {perfect
            ? "Perfect score — you really know your first aid!"
            : score >= total * 0.6
              ? "Nice work. Review the explanations and try again."
              : "Good start. Read each explanation, then have another go."}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <ClayButton onClick={reset} variant="primary">
            <RotateCcw className="size-4" aria-hidden />
            Try again
          </ClayButton>
        </div>
        <p className="mt-4 text-xs font-semibold text-muted">
          Educational only. In a real emergency, contact local emergency services.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Chip tone="mint">
          Question {index + 1} of {total}
        </Chip>
        <span className="text-sm font-extrabold text-muted">
          Score <span className="text-ink">{score}</span>
        </span>
      </div>

      <div className="mt-3 h-2.5 w-full overflow-hidden rounded-full bg-white/80 shadow-inner">
        <div
          className="h-full rounded-full bg-gradient-to-r from-mint to-sky transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-2">
        <Chip tone="lavender">{current.topic}</Chip>
        <Chip tone="soft">{current.difficulty === "easy" ? "Easy" : "Medium"}</Chip>
      </div>

      <h2 className="mt-4 text-xl font-black leading-snug sm:text-2xl">
        {current.prompt}
      </h2>

      <div className="mt-5 grid gap-2.5" role="group" aria-label="Answer choices">
        {current.choices.map((choice, i) => {
          const isAnswer = i === current.answerIndex;
          const isPicked = i === selected;
          const state = !revealed
            ? "idle"
            : isAnswer
              ? "correct"
              : isPicked
                ? "wrong"
                : "dim";

          return (
            <button
              key={choice}
              type="button"
              onClick={() => choose(i)}
              disabled={revealed}
              aria-pressed={isPicked}
              className={[
                "flex w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-sm font-bold transition",
                state === "idle" &&
                  "border-white/70 bg-white/70 shadow-sm hover:-translate-y-0.5 hover:bg-white",
                state === "correct" && "border-transparent bg-mint-soft text-[#1c5f49]",
                state === "wrong" && "border-transparent bg-coral-soft text-[#8c2f2f]",
                state === "dim" && "border-transparent bg-white/40 text-muted",
              ]
                .filter(Boolean)
                .join(" ")}
            >
              <span className="grid size-7 shrink-0 place-items-center rounded-full bg-white/80 text-xs font-black">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{choice}</span>
              {state === "correct" ? (
                <CheckCircle2 className="size-5 shrink-0" aria-label="Correct" />
              ) : null}
              {state === "wrong" ? (
                <XCircle className="size-5 shrink-0" aria-label="Incorrect" />
              ) : null}
            </button>
          );
        })}
      </div>

      {revealed ? (
        <div
          className="animate-pop mt-4 rounded-2xl bg-sky-soft p-4 text-sm font-semibold leading-relaxed text-[#1d5878]"
          role="status"
        >
          <p className="font-extrabold">
            {selected === current.answerIndex ? "Correct!" : "Not quite."}
          </p>
          <p className="mt-1">{current.explanation}</p>
          <p className="mt-2 text-[11px] font-bold opacity-80">
            Source: {current.source} · reviewed {current.reviewedAt}
          </p>
        </div>
      ) : null}

      <div className="mt-5 flex justify-end">
        <ClayButton onClick={next} disabled={!revealed}>
          {index + 1 >= total ? "See results" : "Next question"}
          <ArrowRight className="size-4" aria-hidden />
        </ClayButton>
      </div>
    </div>
  );
}
