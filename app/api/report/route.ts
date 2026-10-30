import type { NextRequest } from "next/server";

const GEMINI_MODEL = "gemini-2.0-flash";
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`;

const REPORT_PROMPT = `You are a health-literacy assistant for a school project. Your job is to help a student (around 14 years old, India) understand a medical report in plain, friendly language.

Rules:
- NEVER diagnose, prescribe, or give personal medical advice.
- NEVER tell the person what treatment to take or whether a value is "normal for them".
- Use simple words a 14-year-old can understand. Avoid jargon; if you must use a term, explain it.
- Structure your reply with these exact headings:
  ## What this report seems to be about
  ## Key findings in plain words
  ## Words you might not know
  ## Questions to ask your doctor
  ## Important disclaimer
- Under "Words you might not know", list 3-6 medical terms found in the report with a one-line plain explanation each.
- Under "Questions to ask your doctor", list 4-6 short, specific questions.
- End with a clear disclaimer that this is educational, not medical advice, and that a doctor must interpret the report.
- Keep the whole reply under ~400 words.
- If the input is not a medical report or is too short, say so politely and ask for a clearer paste.`;

const XRAY_PROMPT = `You are a health-literacy assistant for a school project. A student (around 14 years old, India) has uploaded an X-ray image and wants to understand it.

CRITICAL RULES — follow these exactly:
- You are NOT a radiologist. You CANNOT and MUST NOT diagnose, identify fractures, or give any medical opinion.
- Do NOT say "this shows a fracture", "this looks broken", "this is normal", or anything that sounds like a diagnosis.
- You may only describe what is VISIBLE in general terms (e.g. "this appears to be an X-ray of a hand/wrist", "bones are visible as white structures", "the image shows the area around the wrist").
- If you notice anything that looks unusual to a non-expert eye, say "some areas look different from typical X-ray images — only a radiologist can tell whether this matters."
- Structure your reply with these exact headings:
  ## What this image appears to show
  ## General observations (not a diagnosis)
  ## Words you might hear from a doctor
  ## Questions to ask your radiologist or doctor
  ## Important disclaimer
- Under "Words you might hear from a doctor", list 3-5 terms (fracture, dislocation, greenstick, comminuted, sprain) with one-line plain explanations.
- Under "Questions to ask your radiologist or doctor", list 4-6 short questions.
- End with a very clear disclaimer: this is NOT a diagnosis, Gemini is not a radiologist, and only a qualified clinician who examines the patient can interpret an X-ray.
- Keep the whole reply under ~350 words.
- If the image is not an X-ray or is too unclear, say so politely.`;

type Mode = "report" | "xray";

function systemPrompt(mode: Mode): string {
  return mode === "xray" ? XRAY_PROMPT : REPORT_PROMPT;
}

type GeminiPart = { text: string } | { inlineData: { mimeType: string; data: string } };

export async function POST(request: NextRequest) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return Response.json(
      {
        error:
          "Report analysis is not configured yet. Ask the project owner to add a GEMINI_API_KEY.",
        offline: true,
      },
      { status: 503 },
    );
  }

  let body: {
    text?: string;
    image?: { mimeType: string; data: string };
    mode?: Mode;
  } = {};
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  const text = (body.text ?? "").trim();
  const image = body.image;
  const mode: Mode = body.mode === "xray" ? "xray" : "report";

  if (mode === "report" && !text && !image) {
    return Response.json(
      { error: "Please paste some report text or upload a photo first." },
      { status: 400 },
    );
  }
  if (mode === "xray" && !image && !text) {
    return Response.json(
      { error: "Please upload an X-ray image (or paste a description)." },
      { status: 400 },
    );
  }
  if (text.length > 12000) {
    return Response.json(
      { error: "That text is too long. Please paste a shorter section." },
      { status: 400 },
    );
  }

  const parts: GeminiPart[] = [];
  if (image?.data && image?.mimeType) {
    parts.push({ inlineData: { mimeType: image.mimeType, data: image.data } });
  }
  parts.push({
    text: `${systemPrompt(mode)}\n\n---\nINPUT:\n${text || (image ? "(see attached image)" : "")}`,
  });

  const url = `${GEMINI_ENDPOINT}?key=${encodeURIComponent(apiKey)}`;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts }],
        generationConfig: {
          temperature: 0.2,
          maxOutputTokens: 800,
        },
        safetySettings: [
          { category: "HARM_CATEGORY_DANGEROUS_CONTENT", threshold: "BLOCK_LOW_AND_ABOVE" },
        ],
      }),
      signal: AbortSignal.timeout(30_000),
    });

    if (!response.ok) {
      const detail = await response.text();
      return Response.json(
        { error: `Gemini responded ${response.status}. ${detail.slice(0, 200)}` },
        { status: 502 },
      );
    }

    const payload = (await response.json()) as {
      candidates?: { content?: { parts?: { text?: string }[] } }[];
    };
    const reply = payload.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") ?? "";

    if (!reply) {
      return Response.json(
        { error: "Gemini returned an empty response. Try again." },
        { status: 502 },
      );
    }

    return Response.json({ reply, source: "Gemini", offline: false, mode });
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    return Response.json(
      { error: `Could not reach Gemini: ${message}`, offline: true },
      { status: 502 },
    );
  }
}
