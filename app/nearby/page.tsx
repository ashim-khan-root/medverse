import type { Metadata } from "next";
import { MapPin } from "lucide-react";
import { ClayCard, Disclaimer, PageHeader } from "@/components/clay";
import { NearbyExplorer } from "@/components/nearby-explorer";

export const metadata: Metadata = {
  title: "Nearby Care",
  description:
    "Find nearby pharmacies, clinics, and hospitals on a map, with a manual city fallback.",
};

export default function NearbyPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 sm:px-6">
      <PageHeader
        eyebrow="Nearby Care"
        title="What's close to you?"
        subtitle="Find pharmacies, clinics, and hospitals around your location — or search a city if you prefer not to share your location."
        accent="peach"
        icon={<MapPin className="size-3.5" aria-hidden />}
      />

      <div className="mb-4">
        <Disclaimer tone="emergency">
          In an emergency, call your local emergency number immediately. Do not wait
          for an app.
        </Disclaimer>
      </div>

      <ClayCard>
        <NearbyExplorer />
      </ClayCard>

      <p className="mt-3 text-center text-xs font-semibold text-muted">
        Location is used only in your browser request. MedVerse does not store your
        location.
      </p>
    </div>
  );
}
