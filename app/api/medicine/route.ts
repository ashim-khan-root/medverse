import fallbackData from "@/content/medicine-fallback.json";
import type { MedicineResult } from "@/lib/types";

const FALLBACK = fallbackData as MedicineResult[];

type CacheEntry = {
  at: number;
  results: MedicineResult[];
};

const cache = new Map<string, CacheEntry>();
const TTL = 60 * 60 * 1000;

const SYNONYMS: Record<string, string> = {
  paracetamol: "acetaminophen",
  crocin: "acetaminophen",
  dolo: "acetaminophen",
  calpol: "acetaminophen",
  combiflam: "ibuprofen",
  brufen: "ibuprofen",
  disprin: "aspirin",
  zyrtec: "cetirizine",
  okacet: "cetirizine",
  cetzine: "cetirizine",
  allegra: "fexofenadine",
  azithral: "azithromycin",
  augmentin: "amoxicillin",
  ciplox: "ciprofloxacin",
  flagyl: "metronidazole",
  pan40: "pantoprazole",
  pantop: "pantoprazole",
  volini: "diclofenac",
  betadine: "povidone-iodine",
  meftal: "mefenamic acid",
};

function stripHtml(text: string) {
  return text
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function pick(record: Record<string, unknown>, key: string): string | undefined {
  const value = record?.[key];
  if (!value) return undefined;
  const first = Array.isArray(value) ? value[0] : value;
  if (typeof first !== "string") return undefined;
  const clean = stripHtml(first);
  return clean ? clean.slice(0, 1400) : undefined;
}

function formatEffective(raw?: string) {
  if (!raw || !/^\d{8}$/.test(raw)) return raw;
  return `${raw.slice(0, 4)}-${raw.slice(4, 6)}-${raw.slice(6, 8)}`;
}

function normalize(record: Record<string, unknown>, index: number): MedicineResult {
  const openfda = (record?.openfda ?? {}) as Record<string, string[] | undefined>;
  const brand = openfda.brand_name?.[0];
  const generic = openfda.generic_name?.[0];

  return {
    id: `fda-${index}-${(brand ?? generic ?? "drug").toLowerCase().replace(/\W+/g, "-")}`,
    productName: brand ?? generic ?? "Unknown product",
    genericName: generic,
    uses: pick(record, "indications_and_usage") ?? pick(record, "purpose"),
    warnings: pick(record, "warnings") ?? pick(record, "boxed_warning"),
    directions:
      pick(record, "dosage_and_administration") ?? pick(record, "directions"),
    activeIngredients: pick(record, "active_ingredient"),
    effectiveDate: formatEffective(
      typeof record.effective_time === "string" ? record.effective_time : undefined,
    ),
    sourceUrl: "https://open.fda.gov/apis/drug/label/",
    source: "openFDA",
  };
}

function fallbackMatches(term: string): MedicineResult[] {
  const needle = term.toLowerCase();
  return FALLBACK.filter((item) => {
    const haystack = `${item.productName} ${item.genericName ?? ""} ${item.id}`.toLowerCase();
    return haystack.includes(needle);
  });
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return Response.json({ error: "Please type a medicine name." }, { status: 400 });
  }
  if (q.length > 60) {
    return Response.json({ error: "That search is too long." }, { status: 400 });
  }

  const key = q.toLowerCase();
  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < TTL) {
    return Response.json({
      results: cached.results,
      source: "openFDA",
      offline: false,
    });
  }

  const term = q.replace(/[^\w\s-]/g, "").trim();
  const mapped = SYNONYMS[term.toLowerCase()] ?? term;
  const terms = [...new Set([term, mapped])];
  const search = terms
    .flatMap((t) => [
      `openfda.generic_name:"${t}"`,
      `openfda.brand_name:"${t}"`,
      `openfda.substance_name:"${t}"`,
    ])
    .join(" OR ");
  const url = `https://api.fda.gov/drug/label.json?search=${encodeURIComponent(
    search,
  )}&limit=5`;

  try {
    const response = await fetch(url, {
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) {
      throw new Error(`openFDA responded ${response.status}`);
    }

    const payload = (await response.json()) as {
      results?: Record<string, unknown>[];
    };
    const results = (payload.results ?? []).map(normalize);

    if (results.length === 0) {
      throw new Error("No openFDA results");
    }

    cache.set(key, { at: Date.now(), results });
    return Response.json({ results, source: "openFDA", offline: false });
  } catch {
    const results = fallbackMatches(q);
    return Response.json({
      results,
      source: "fallback",
      offline: true,
      message:
        "The live medicine database is unavailable, so this shows a small curated sample instead.",
    });
  }
}
