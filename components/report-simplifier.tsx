"use client";

import { useState, type FormEvent } from "react";
import {
  AlertCircle,
  FileText,
  Loader2,
  Sparkles,
  Upload,
  X,
} from "lucide-react";
import { Chip, ClayButton, ClayCard, Disclaimer, PageHeader } from "./clay";
import { ReadAloud } from "./read-aloud";

type Result = { reply: string; source: string; offline: boolean };

type Mode = "report" | "xray";

export function ReportSimplifier() {
  const [mode, setMode] = useState<Mode>("report");
  const [text, setText] = useState("");
  const [image, setImage] = useState<{ mimeType: string; data: string; name: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleFile(file: File | null) {
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (JPG, PNG, etc.).");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setError("Image is too large. Please use one under 4 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const base64 = dataUrl.split(",")[1];
      setImage({ mimeType: file.type, data: base64, name: file.name });
      setError(null);
    };
    reader.readAsDataURL(file);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (!text.trim() && !image) {
      setError("Paste some report text or upload a photo first.");
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: text.trim(),
          image: image ? { mimeType: image.mimeType, data: image.data } : undefined,
          mode,
        }),
      });
      const data = (await response.json()) as Result & { error?: string };
      if (!response.ok || data.error) {
        setError(data.error ?? "Something went wrong.");
        return;
      }
      setResult(data);
    } catch {
      setError("Could not reach the server. Check your connection.");
    } finally {
      setLoading(false);
    }
  }

  function reset() {
    setText("");
    setImage(null);
    setResult(null);
    setError(null);
  }

  return (
    <div>
      <PageHeader
        eyebrow={mode === "xray" ? "X-ray explainer" : "Report explainer"}
        title={mode === "xray" ? "What does my X-ray show?" : "What does my report say?"}
        subtitle={
          mode === "xray"
            ? "Upload an X-ray image. MedVerse will describe what is visible in plain words. It does NOT diagnose — only a radiologist can interpret an X-ray."
            : "Paste the text from a medical report (or upload a photo of it). MedVerse will explain it in plain words and list questions to ask your doctor."
        }
      />

      <div className="mb-5 flex gap-2">
        <button
          type="button"
          onClick={() => {
            setMode("report");
            setResult(null);
            setError(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
            mode === "report"
              ? "bg-grape text-white shadow-md shadow-grape/30"
              : "bg-white/70 text-muted hover:bg-white"
          }`}
          aria-pressed={mode === "report"}
        >
          Medical report
        </button>
        <button
          type="button"
          onClick={() => {
            setMode("xray");
            setResult(null);
            setError(null);
          }}
          className={`rounded-full px-4 py-2 text-sm font-extrabold transition ${
            mode === "xray"
              ? "bg-grape text-white shadow-md shadow-grape/30"
              : "bg-white/70 text-muted hover:bg-white"
          }`}
          aria-pressed={mode === "xray"}
        >
          X-ray image
        </button>
      </div>

      <ClayCard className="mb-4">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 size-5 shrink-0 text-[#8a4419]" aria-hidden />
          <div className="text-sm font-semibold leading-relaxed text-muted">
            <strong className="font-extrabold text-ink">Important:</strong>{" "}
            {mode === "xray"
              ? "This is an educational tool, NOT a radiologist. It cannot diagnose or tell you whether a bone is broken. Always ask a qualified doctor or radiologist to interpret your X-ray."
              : "This is an educational tool, not a doctor. It does not diagnose, prescribe, or tell you whether a value is normal for you. Always ask a qualified doctor or pharmacist to interpret your report. Never start, stop, or change treatment based on this page."}
          </div>
        </div>
      </ClayCard>

      <form onSubmit={submit} className="space-y-4">
        <ClayCard>
          <label htmlFor="report-text" className="block text-sm font-extrabold">
            {mode === "xray" ? "Optional notes" : "Paste report text"}
          </label>
          <p className="mt-1 text-xs font-semibold text-muted">
            {mode === "xray"
              ? "Add any context (e.g. which body part, when the X-ray was taken). The image is what matters most."
              : "Copy the text from your report, or type what you remember. Remove personal details like your name or ID if you prefer."}
          </p>
          <textarea
            id="report-text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={mode === "xray" ? 3 : 8}
            placeholder={
              mode === "xray"
                ? "e.g. Wrist X-ray taken on 12 Oct after a fall. Doctor mentioned checking for fracture."
                : "e.g. CBC: Haemoglobin 11.2 g/dL, WBC 7800 /uL, Platelets 2.1 lakh/uL. Impression: mild anaemia. Follow up in 4 weeks."
            }
            className="clay-input mt-3 min-h-[80px] w-full resize-y"
          />
          <div className="mt-2 flex items-center justify-between text-xs font-bold text-muted">
            <span>{text.length} characters</span>
            <span>Max 12,000</span>
          </div>
        </ClayCard>

        <ClayCard>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-sm font-extrabold">
                {mode === "xray" ? "Upload the X-ray image (required)" : "Or upload a photo"}
              </p>
              <p className="mt-1 text-xs font-semibold text-muted">
                JPG or PNG, up to 4 MB. Works best with clear, well-lit photos.
              </p>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-white/80 px-4 py-2.5 text-sm font-extrabold text-ink shadow-sm transition hover:-translate-y-0.5">
              <Upload className="size-4" aria-hidden />
              Choose image
              <input
                type="file"
                accept="image/*"
                className="sr-only"
                onChange={(e) => handleFile(e.target.files?.[0] ?? null)}
              />
            </label>
          </div>
          {image ? (
            <div className="mt-3 flex items-center gap-3 rounded-2xl bg-mint-soft px-3.5 py-2.5">
              <FileText className="size-4 shrink-0 text-[#1c5f49]" aria-hidden />
              <span className="min-w-0 flex-1 truncate text-xs font-extrabold text-[#1c5f49]">
                {image.name}
              </span>
              <button
                type="button"
                onClick={() => setImage(null)}
                className="grid size-7 place-items-center rounded-full text-[#1c5f49] hover:bg-white/60"
                aria-label="Remove image"
              >
                <X className="size-4" aria-hidden />
              </button>
            </div>
          ) : null}
        </ClayCard>

        <div className="flex flex-wrap items-center gap-3">
          <ClayButton type="submit" variant="primary" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden />
                Explaining…
              </>
            ) : (
              <>
                <Sparkles className="size-4" aria-hidden />
                {mode === "xray" ? "Describe this X-ray" : "Explain this report"}
              </>
            )}
          </ClayButton>
          <ClayButton type="button" variant="soft" onClick={reset} disabled={loading}>
            Clear
          </ClayButton>
        </div>
      </form>

      {error ? (
        <ClayCard className="mt-4 border-coral-soft bg-coral-soft">
          <p className="text-sm font-extrabold text-[#8c2f2f]">{error}</p>
        </ClayCard>
      ) : null}

      {result ? (
        <ClayCard className="mt-6">
          <div className="mb-3 flex items-center justify-between gap-3">
            <Chip tone="lavender">Explained by {result.source}</Chip>
            <div className="flex items-center gap-2">
              <ReadAloud text={result.reply} />
              <span className="text-[11px] font-bold text-muted">
                {result.offline ? "Offline" : "Live"}
              </span>
            </div>
          </div>
          <div className="prose-clay space-y-3 text-sm font-semibold leading-relaxed">
            {result.reply.split("\n").map((line, index) => {
              if (line.startsWith("## ")) {
                return (
                  <h3 key={index} className="mt-4 text-base font-black text-ink">
                    {line.replace(/^##\s*/, "")}
                  </h3>
                );
              }
              if (line.trim() === "") return <div key={index} className="h-1" />;
              return (
                <p key={index} className="text-muted">
                  {line}
                </p>
              );
            })}
          </div>
          <div className="mt-4">
            <Disclaimer tone={mode === "xray" ? "emergency" : "neutral"}>
              {mode === "xray"
                ? "This is generated by AI and may be wrong. Gemini is NOT a radiologist and cannot diagnose. A qualified clinician must interpret your X-ray."
                : "This explanation is generated by AI and may be wrong or incomplete. It is educational only and not medical advice. A qualified doctor must interpret your report."}
            </Disclaimer>
          </div>
        </ClayCard>
      ) : null}
    </div>
  );
}
