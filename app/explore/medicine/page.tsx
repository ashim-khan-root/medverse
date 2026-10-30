import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Pill } from "lucide-react";
import { ClayCard, Disclaimer, PageHeader } from "@/components/clay";
import { MedicineSearch } from "@/components/medicine-search";

export const metadata: Metadata = {
  title: "Medicine Search",
  description:
    "Look up general medicine label information: common uses, warnings, and active ingredients.",
};

export default function MedicinePage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 sm:px-6">
      <Link
        href="/explore"
        className="mb-4 inline-flex items-center gap-1.5 text-sm font-extrabold text-muted transition hover:text-ink"
      >
        <ArrowLeft className="size-4" aria-hidden />
        Back to Explore
      </Link>

      <PageHeader
        eyebrow="Medicine Search"
        title="What is this medicine generally used for?"
        subtitle="Search public drug-label data for general uses and warnings. This is source material, not personal advice."
        accent="sky"
        icon={<Pill className="size-3.5" aria-hidden />}
      />

      <div className="mb-4">
        <Disclaimer>
          General information only — never start, stop, or change a medicine based
          on this page. Ask a pharmacist or doctor.
        </Disclaimer>
      </div>

      <ClayCard>
        <MedicineSearch />
      </ClayCard>
    </div>
  );
}
