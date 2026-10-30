"use client";

import { useState } from "react";
import {
  AlertCircle,
  ExternalLink,
  Loader2,
  Pill,
  Search,
  WifiOff,
} from "lucide-react";
import type { MedicineResult } from "@/lib/types";
import { ClayButton, Chip, EmptyState } from "./clay";

const suggestions = [
  "Paracetamol",
  "Ibuprofen",
  "Cetirizine",
  "ORS",
  "Metformin",
  "Salbutamol",
];

type ApiResponse = {
  results?: MedicineResult[];
  source?: "openFDA" | "fallback";
  offline?: boolean;
  message?: string;
  error?: string;
};

export function MedicineSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<MedicineResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);
  const [lastQuery, setLastQuery] = useState("");

  async function runSearch(term: string) {
    const value = term.trim();
    if (!value || loading) return;

    setQuery(value);
    setLoading(true);
    setError(null);
    setMessage(null);
    setOffline(false);
    setSearched(true);
    setLastQuery(value);

    try {
      const response = await fetch(`/api/medicine?q=${encodeURIComponent(value)}`);
      const data: ApiResponse = await response.json();

      if (!response.ok) {
        throw new Error(data.error ?? "Search failed");
      }

      setResults(data.results ?? []);
      setOffline(Boolean(data.offline));
      setMessage(data.message ?? null);
    } catch {
      setResults([]);
      setError(
        "Could not reach the medicine service. Check your connection and try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          void runSearch(query);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <label htmlFor="medicine-query" className="sr-only">
          Medicine name
        </label>
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
            aria-hidden
          />
          <input
            id="medicine-query"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Try paracetamol, ibuprofen, ORS…"
            className="clay-input pl-11"
            autoComplete="off"
            maxLength={60}
          />
        </div>
        <ClayButton type="submit" disabled={loading || query.trim().length === 0}>
          {loading ? (
            <Loader2 className="size-4 animate-spin" aria-hidden />
          ) : (
            <Search className="size-4" aria-hidden />
          )}
          {loading ? "Searching…" : "Search"}
        </ClayButton>
      </form>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <span className="text-xs font-extrabold text-muted">Quick picks:</span>
        {suggestions.map((name) => (
          <button
            key={name}
            type="button"
            onClick={() => void runSearch(name)}
            className="rounded-full bg-white/70 px-2.5 py-1 text-xs font-bold text-muted transition hover:bg-white hover:text-ink"
          >
            {name}
          </button>
        ))}
      </div>

      {offline ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-sun-soft px-4 py-3 text-xs font-bold text-[#7a5a00]">
          <WifiOff className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{message}</span>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 flex items-start gap-2 rounded-2xl bg-coral-soft px-4 py-3 text-sm font-bold text-[#8c2f2f]">
          <AlertCircle className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{error}</span>
        </div>
      ) : null}

      <div className="mt-5">
        {loading ? (
          <div className="space-y-3" aria-hidden>
            <div className="clay-inset h-24 animate-pulse rounded-3xl" />
            <div className="clay-inset h-24 animate-pulse rounded-3xl" />
          </div>
        ) : null}

        {!loading && !error && searched && results.length === 0 ? (
          <EmptyState
            icon={<Pill className="size-8" aria-hidden />}
            title={`No match for “${lastQuery}”`}
            hint="Check the spelling, or try a generic name such as paracetamol. Only general label information is shown."
          />
        ) : null}

        {!loading && results.length > 0 ? (
          <div className="space-y-3">
            {results.map((item) => (
              <MedicineCard key={item.id} item={item} />
            ))}
          </div>
        ) : null}

        {!searched && !loading ? (
          <div className="clay-inset rounded-3xl p-5 text-sm font-semibold leading-relaxed text-muted">
            <p className="font-extrabold text-ink">What you can look up</p>
            <p className="mt-1">
              General label information such as common uses, warnings, and active
              ingredients. MedVerse never gives you a personal dose or tells you
              whether a medicine is right for you.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

function MedicineCard({ item }: { item: MedicineResult }) {
  return (
    <article className="clay-inset animate-pop rounded-3xl p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <h3 className="text-lg font-black leading-tight">{item.productName}</h3>
          {item.genericName ? (
            <p className="mt-0.5 text-xs font-bold text-muted">{item.genericName}</p>
          ) : null}
        </div>
        <Chip tone={item.source === "openFDA" ? "sky" : "peach"}>
          {item.source === "openFDA" ? "openFDA" : "Sample data"}
        </Chip>
      </div>

      {item.uses ? (
        <div className="mt-3">
          <p className="text-[11px] font-extrabold uppercase tracking-wider text-muted">
            Common uses
          </p>
          <p className="mt-1 line-clamp-4 text-sm font-semibold leading-relaxed">
            {item.uses}
          </p>
        </div>
      ) : null}

      <div className="mt-3 space-y-2">
        {item.warnings ? (
          <Section title="Warnings" text={item.warnings} />
        ) : null}
        {item.directions ? (
          <Section title="Directions" text={item.directions} />
        ) : null}
        {item.activeIngredients ? (
          <Section title="Active ingredients" text={item.activeIngredients} />
        ) : null}
      </div>

      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-[11px] font-bold text-muted">
        <span>
          Source: {item.source === "openFDA" ? "openFDA drug label" : "curated sample"}
          {item.effectiveDate ? ` · label ${item.effectiveDate}` : ""}
        </span>
        <a
          href={item.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-extrabold text-grape hover:underline"
        >
          Data source
          <ExternalLink className="size-3" aria-hidden />
        </a>
      </div>

      <p className="mt-2 text-[11px] font-bold text-muted">
        Not a substitute for a pharmacist or clinician. Do not use this page to
        decide on treatment.
      </p>
    </article>
  );
}

function Section({ title, text }: { title: string; text: string }) {
  return (
    <details className="group rounded-2xl bg-white/70 px-3 py-2">
      <summary className="cursor-pointer list-none text-xs font-extrabold uppercase tracking-wide text-muted marker:hidden">
        {title}
        <span className="float-right text-grape transition group-open:rotate-45" aria-hidden>
          +
        </span>
      </summary>
      <p className="mt-2 text-sm font-semibold leading-relaxed text-ink/90">{text}</p>
    </details>
  );
}
