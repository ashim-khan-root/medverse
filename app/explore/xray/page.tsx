import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ClayCard, Disclaimer, PageHeader } from "@/components/clay";
import { ReadAloud } from "@/components/read-aloud";

export const metadata: Metadata = {
  title: "How Doctors Read X-Rays · MedVerse",
  description:
    "An educational guide to how doctors and radiologists look at X-ray images.",
};

const sections = [
  {
    title: "What an X-ray actually is",
    body: "An X-ray is a picture made by passing a small amount of radiation through the body. Dense parts like bone block more radiation and look white. Softer parts like muscle and fat let more through and look darker. Air looks almost black.",
  },
  {
    title: "What doctors look for",
    body: "A radiologist checks the bone outline for breaks, cracks, or misalignment; looks at joint spaces; checks for swelling or fluid; and compares the injured side with the other side. They also look for things that are not bone, like stones or foreign objects.",
  },
  {
    title: "Common words you may hear",
    body: "Fracture = a break in a bone. Dislocation = a bone pushed out of its joint. Sprain = a stretched or torn ligament (not a bone break). Greenstick = a partial break, common in children because their bones are more flexible. Comminuted = the bone broke into several pieces.",
  },
  {
    title: "Why you should not read your own X-ray",
    body: "X-rays are easy to misread. A normal variant can look like a break, and a real break can be missed. Only a trained clinician who also examines you can interpret the image safely. MedVerse never analyses X-ray images.",
  },
  {
    title: "Questions to ask your doctor",
    body: "Is the bone broken, and if so what kind of break? Does it need a cast, surgery, or just rest? How long until it heals? What should I avoid doing? When should I come back for a follow-up X-ray?",
  },
];

export default function XrayPage() {
  const allText = sections.map((s) => `${s.title}. ${s.body}`).join(" ");
  return (
    <div>
      <PageHeader
        eyebrow="X-ray guide"
        title="How doctors read X-rays"
        subtitle="A short, plain-language guide to what an X-ray shows and how a clinician interprets it. Educational only."
      />

      <div className="mb-6 flex items-center gap-3">
        <ReadAloud text={allText} />
        <span className="text-xs font-bold text-muted">Listen to this page</span>
      </div>

      <div className="space-y-4">
        {sections.map((section) => (
          <ClayCard key={section.title}>
            <h2 className="text-lg font-black">{section.title}</h2>
            <p className="mt-2 text-sm font-semibold leading-relaxed text-muted">
              {section.body}
            </p>
          </ClayCard>
        ))}
      </div>

      <div className="mt-6">
        <Disclaimer tone="emergency">
          MedVerse does not analyse X-ray images and cannot tell you whether a bone is
          broken. Always consult a qualified doctor or radiologist.
        </Disclaimer>
      </div>

      <ClayCard className="mt-6 bg-grape-soft">
        <h2 className="text-lg font-black text-[#4b3a86]">Curious about your own X-ray?</h2>
        <p className="mt-2 text-sm font-semibold leading-relaxed text-[#4b3a86]/80">
          The Report Explainer has an X-ray mode that describes what is visible in plain
          words. It is for curiosity only — it does not diagnose.
        </p>
        <Link
          href="/report"
          className="mt-3 inline-flex items-center gap-1.5 text-sm font-extrabold text-grape hover:underline"
        >
          Open Report Explainer <ArrowRight className="size-4" aria-hidden />
        </Link>
      </ClayCard>
    </div>
  );
}
