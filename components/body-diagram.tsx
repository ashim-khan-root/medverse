"use client";

import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { BodyPart } from "@/lib/types";
import { Chip } from "./clay";

const hex: Record<BodyPart["color"], string> = {
  mint: "#6fd3ac",
  sky: "#7fc2ee",
  peach: "#ffab7d",
  lavender: "#b9a6ef",
  sun: "#ffcf5c",
  coral: "#ff8e8e",
  grape: "#6c5ce7",
};

export function BodyExplorer({ parts }: { parts: BodyPart[] }) {
  const [activeId, setActiveId] = useState(parts[0]?.id ?? "");
  const active = parts.find((p) => p.id === activeId) ?? parts[0];

  if (!active) return null;

  return (
    <div className="grid gap-6 md:grid-cols-[minmax(0,320px)_1fr] md:items-start">
      <div className="relative mx-auto w-full max-w-[320px]">
        <div className="clay-inset relative overflow-hidden rounded-[32px] p-3">
          <svg
            viewBox="0 0 200 420"
            className="h-auto w-full"
            role="img"
            aria-label="Front view of the human body with labelled organs"
          >
            <ellipse cx="100" cy="404" rx="62" ry="8" fill="#eadfd3" opacity="0.6" />
            <circle cx="100" cy="50" r="42" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" />
            <circle cx="56" cy="52" r="8" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" />
            <circle cx="144" cy="52" r="8" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" />
            <rect x="88" y="86" width="24" height="18" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" />
            <rect x="64" y="100" width="72" height="150" rx="34" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" />
            <rect x="40" y="108" width="22" height="118" rx="11" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" transform="rotate(7 51 167)" />
            <rect x="138" y="108" width="22" height="118" rx="11" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" transform="rotate(-7 149 167)" />
            <rect x="76" y="240" width="22" height="150" rx="11" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" />
            <rect x="102" y="240" width="22" height="150" rx="11" fill="#f7ecdc" stroke="#ead9c6" strokeWidth="2" />

            <path
              d="M100 30c-14 0-22 9-22 19 0 9 8 16 22 24 14-8 22-15 22-24 0-10-8-19-22-19z"
              fill={hex.lavender}
              opacity="0.85"
            />
            <ellipse cx="80" cy="132" rx="15" ry="30" fill={hex.sky} opacity="0.8" />
            <ellipse cx="120" cy="132" rx="15" ry="30" fill={hex.sky} opacity="0.8" />
            <path
              d="M92 122c-9 0-16 6-16 14s8 12 16 20c8-8 16-12 16-20s-7-14-16-14z"
              fill={hex.coral}
              opacity="0.95"
            />
            <path
              d="M84 158c-12 2-18 10-16 22 2 11 12 18 24 16 10-2 14-10 12-20-2-11-10-20-20-18z"
              fill={hex.peach}
              opacity="0.9"
            />
            <path
              d="M116 160c14 1 22 10 20 22-2 12-14 18-26 14-10-4-12-14-6-24 3-6 7-11 12-12z"
              fill={hex.sun}
              opacity="0.9"
            />
            <ellipse cx="82" cy="196" rx="7" ry="13" fill={hex.mint} opacity="0.9" />
            <ellipse cx="118" cy="196" rx="7" ry="13" fill={hex.mint} opacity="0.9" />
            <path d="M100 120v110M84 140h32M82 156h36M82 172h36M84 188h32" stroke="#fff" strokeWidth="3" strokeLinecap="round" opacity="0.75" />
          </svg>

          {parts.map((part) => (
            <button
              key={part.id}
              type="button"
              onClick={() => setActiveId(part.id)}
              data-active={part.id === active.id}
              aria-pressed={part.id === active.id}
              aria-label={`${part.name} — ${part.system}`}
              className="hotspot size-6 text-[10px] font-black text-white"
              style={{
                left: `${part.hotspot.x}%`,
                top: `${part.hotspot.y}%`,
                background: hex[part.color],
              }}
            >
              {part.name.charAt(0)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-center text-xs font-bold text-muted">
          Tap a coloured dot to explore that organ.
        </p>
      </div>

      <div className="min-w-0">
        <div className="flex flex-wrap items-center gap-2">
          <Chip tone={active.color}>{active.system}</Chip>
        </div>
        <h2 className="mt-3 text-2xl font-black">{active.name}</h2>

        <dl className="mt-4 grid gap-3">
          <div className="clay-inset rounded-2xl p-3.5">
            <dt className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
              What it is
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-relaxed">{active.whatItIs}</dd>
          </div>
          <div className="clay-inset rounded-2xl p-3.5">
            <dt className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
              Where it is
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-relaxed">{active.whereItIs}</dd>
          </div>
          <div className="clay-inset rounded-2xl p-3.5">
            <dt className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
              What it does
            </dt>
            <dd className="mt-1 text-sm font-semibold leading-relaxed">{active.whatItDoes}</dd>
          </div>
        </dl>

        <div className="mt-4">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            Browse all parts
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {parts.map((part) => (
              <button
                key={part.id}
                type="button"
                onClick={() => setActiveId(part.id)}
                aria-pressed={part.id === active.id}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-extrabold transition ${
                  part.id === active.id
                    ? "bg-ink text-white"
                    : "bg-white/70 text-muted hover:bg-white hover:text-ink"
                }`}
              >
                {part.name}
              </button>
            ))}
          </div>
        </div>

        {active.relatedIds.length > 0 ? (
          <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-bold text-muted">
            Related:
            {active.relatedIds.map((id) => {
              const rel = parts.find((p) => p.id === id);
              if (!rel) return null;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveId(id)}
                  className="inline-flex items-center gap-1 rounded-full bg-white/80 px-2.5 py-1 font-extrabold text-grape"
                >
                  {rel.name}
                  <ArrowRight className="size-3" aria-hidden />
                </button>
              );
            })}
          </div>
        ) : null}
      </div>
    </div>
  );
}
