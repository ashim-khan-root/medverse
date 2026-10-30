import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Bone, Compass, Pill, ScanHeart } from "lucide-react";
import { ClayCard, Chip, Disclaimer, PageHeader } from "@/components/clay";

export const metadata: Metadata = {
  title: "Explore",
  description:
    "Explore the human body and look up general medicine label information.",
};

const cards = [
  {
    href: "/explore/body",
    title: "Human Body Explorer",
    text: "Tap organs on a friendly diagram to learn where they are and what they do.",
    icon: ScanHeart,
    bg: "bg-lavender-soft",
    fg: "text-[#4b3a86]",
    tone: "lavender" as const,
    tag: "7 organs",
  },
  {
    href: "/explore/medicine",
    title: "Medicine Search",
    text: "Look up general uses and warnings from public drug-label data.",
    icon: Pill,
    bg: "bg-sky-soft",
    fg: "text-[#1d5878]",
    tone: "sky" as const,
    tag: "openFDA",
  },
  {
    href: "/explore/xray",
    title: "How Doctors Read X-Rays",
    text: "Learn what an X-ray shows and how a clinician interprets it — educational only.",
    icon: Bone,
    bg: "bg-peach-soft",
    fg: "text-[#8a4419]",
    tone: "peach" as const,
    tag: "guide",
  },
];

export default function ExplorePage() {
  return (
    <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Explore"
        title="Look inside, then look things up"
        subtitle="A clickable body map for curious minds, and a plain-language medicine lookup — both built for learning."
        accent="sky"
        icon={<Compass className="size-3.5" aria-hidden />}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="group">
              <ClayCard className="flex h-full flex-col transition duration-200 group-hover:-translate-y-1 group-hover:shadow-2xl">
                <div className="flex items-start justify-between">
                  <span className={`grid size-12 place-items-center rounded-2xl ${card.bg} ${card.fg}`}>
                    <Icon className="size-6" aria-hidden />
                  </span>
                  <Chip tone={card.tone}>{card.tag}</Chip>
                </div>
                <h2 className="mt-4 text-xl font-black">{card.title}</h2>
                <p className="mt-2 flex-1 text-sm font-semibold leading-relaxed text-muted">
                  {card.text}
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-grape">
                  Open
                  <ArrowRight className="size-4 transition group-hover:translate-x-0.5" aria-hidden />
                </span>
              </ClayCard>
            </Link>
          );
        })}
      </div>

      <div className="mt-6">
        <Disclaimer />
      </div>
    </div>
  );
}
