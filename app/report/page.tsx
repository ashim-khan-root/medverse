import type { Metadata } from "next";
import { ReportSimplifier } from "@/components/report-simplifier";

export const metadata: Metadata = {
  title: "Report Explainer · MedVerse",
  description:
    "Paste a medical report and get a plain-language explanation plus questions to ask your doctor.",
};

export default function ReportPage() {
  return <ReportSimplifier />;
}
