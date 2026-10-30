"use client";

import { useState, type FormEvent } from "react";
import dynamic from "next/dynamic";
import {
  Building2,
  Crosshair,
  ExternalLink,
  Loader2,
  MapPin,
  Navigation,
  Pill,
  Search,
  Stethoscope,
  WifiOff,
} from "lucide-react";
import nearbyFallbackData from "@/content/nearby-fallback.json";
import type { NearbyPlace } from "@/lib/types";
import { formatDistance, haversineMeters } from "@/lib/utils";
import { ClayButton, EmptyState } from "./clay";

const NearbyMap = dynamic(() => import("./nearby-map"), {
  ssr: false,
  loading: () => (
    <div className="grid h-full place-items-center bg-sky-soft text-sm font-bold text-[#1d5878]">
      Loading map…
    </div>
  ),
});

type FallbackFile = {
  city: string;
  center: { lat: number; lng: number };
  places: NearbyPlace[];
};

type Center = { lat: number; lng: number; label: string };
type PlaceType = "pharmacy" | "clinic" | "hospital";

const FALLBACK = nearbyFallbackData as FallbackFile;
const DEFAULT_CENTER: Center = {
  lat: FALLBACK.center.lat,
  lng: FALLBACK.center.lng,
  label: `${FALLBACK.city} (sample)`,
};

const TYPES: { value: PlaceType; label: string; icon: typeof Pill }[] = [
  { value: "pharmacy", label: "Pharmacies", icon: Pill },
  { value: "clinic", label: "Clinics", icon: Stethoscope },
  { value: "hospital", label: "Hospitals", icon: Building2 },
];

const RADII = [1000, 3000, 5000, 10000];

function samplePlaces(type: PlaceType, center: { lat: number; lng: number }): NearbyPlace[] {
  return FALLBACK.places
    .filter((place) => place.type === type)
    .map((place) => ({
      ...place,
      distanceMeters: haversineMeters(center, { lat: place.lat, lng: place.lng }),
      mapsUrl: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=18/${place.lat}/${place.lng}`,
    }))
    .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
}

export function NearbyExplorer() {
  const [center, setCenter] = useState<Center>(DEFAULT_CENTER);
  const [type, setType] = useState<PlaceType>("pharmacy");
  const [radius, setRadius] = useState(3000);
  const [places, setPlaces] = useState<NearbyPlace[]>(
    samplePlaces("pharmacy", DEFAULT_CENTER),
  );
  const [loading, setLoading] = useState(false);
  const [offline, setOffline] = useState(true);
  const [message, setMessage] = useState(
    "Live map data is unavailable, so this shows a sample set for New Delhi.",
  );
  const [cityQuery, setCityQuery] = useState("");
  const [locating, setLocating] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function load(
    nextCenter: Center = center,
    nextType: PlaceType = type,
    nextRadius: number = radius,
  ) {
    setLoading(true);
    setNotice(null);
    try {
      const response = await fetch(
        `/api/nearby?lat=${nextCenter.lat}&lng=${nextCenter.lng}&radius=${nextRadius}&type=${nextType}`,
      );
      if (!response.ok) throw new Error("Nearby request failed");
      const data = (await response.json()) as {
        places?: NearbyPlace[];
        offline?: boolean;
        message?: string;
      };
      const results = data.places ?? [];
      setPlaces(results);
      setOffline(Boolean(data.offline));
      setMessage(
        data.message ??
          (data.offline
            ? "Live map data is unavailable, so this shows a sample set."
            : `Live results around ${nextCenter.label}.`),
      );
    } catch {
      const nearSample =
        haversineMeters(nextCenter, FALLBACK.center) < 50_000;
      setPlaces(nearSample ? samplePlaces(nextType, nextCenter) : []);
      setOffline(true);
      setMessage(
        nearSample
          ? "Live map data is unavailable, so this shows a sample set."
          : "Live map data is unavailable right now. Try again in a minute.",
      );
    } finally {
      setLoading(false);
    }
  }

  function useMyLocation() {
    setNotice(null);
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setNotice("This browser does not support location. Search a city instead.");
      return;
    }

    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        const next: Center = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          label: "your location",
        };
        setCenter(next);
        void load(next);
      },
      () => {
        setLocating(false);
        setNotice(
          "Location permission was denied or unavailable. Search a city instead.",
        );
      },
      { timeout: 10_000, maximumAge: 60_000 },
    );
  }

  async function searchCity(event: FormEvent) {
    event.preventDefault();
    const value = cityQuery.trim();
    if (!value || locating) return;

    setLocating(true);
    setNotice(null);
    try {
      const response = await fetch(`/api/geocode?q=${encodeURIComponent(value)}`);
      const data = (await response.json()) as {
        results?: { displayName: string; lat: number; lng: number }[];
        message?: string;
      };
      const first = data.results?.[0];
      if (!first) {
        setNotice(`No place found for “${value}”. Try a city name.`);
        return;
      }
      const next: Center = {
        lat: first.lat,
        lng: first.lng,
        label: first.displayName.split(",")[0],
      };
      setCenter(next);
      if (data.message) setNotice(data.message);
      void load(next);
    } catch {
      setNotice("Could not look up that place. Check your connection.");
    } finally {
      setLocating(false);
    }
  }

  function changeType(next: PlaceType) {
    setType(next);
    void load(center, next, radius);
  }

  function changeRadius(next: number) {
    setRadius(next);
    void load(center, type, next);
  }

  return (
    <div>
      <div className="clay-inset rounded-3xl p-4">
        <div className="flex flex-col gap-2 sm:flex-row">
          <ClayButton
            type="button"
            onClick={useMyLocation}
            disabled={locating}
            variant="mint"
          >
            {locating ? (
              <Loader2 className="size-4 animate-spin" aria-hidden />
            ) : (
              <Crosshair className="size-4" aria-hidden />
            )}
            Use my location
          </ClayButton>

          <form onSubmit={searchCity} className="flex flex-1 gap-2">
            <label htmlFor="city-query" className="sr-only">
              Search a city or area
            </label>
            <div className="relative flex-1">
              <Search
                className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted"
                aria-hidden
              />
              <input
                id="city-query"
                name="city"
                value={cityQuery}
                onChange={(event) => setCityQuery(event.target.value)}
                placeholder="Or type a city, e.g. Mumbai"
                className="clay-input pl-11"
                autoComplete="off"
              />
            </div>
            <ClayButton type="submit" variant="soft" disabled={locating}>
              <Navigation className="size-4" aria-hidden />
              Find
            </ClayButton>
          </form>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-1.5">
          {TYPES.map((item) => {
            const Icon = item.icon;
            const active = type === item.value;
            return (
              <button
                key={item.value}
                type="button"
                onClick={() => changeType(item.value)}
                data-active={active}
                aria-pressed={active}
                className="tab"
              >
                <Icon className="size-4" aria-hidden />
                {item.label}
              </button>
            );
          })}

          <label className="ml-auto flex items-center gap-1.5 text-xs font-extrabold text-muted">
            <span className="sr-only">Search radius</span>
            <select
              id="radius"
              name="radius"
              value={radius}
              onChange={(event) => changeRadius(Number(event.target.value))}
              className="rounded-full border border-white/70 bg-white/80 px-3 py-1.5 text-xs font-extrabold text-ink"
            >
              {RADII.map((r) => (
                <option key={r} value={r}>
                  {r / 1000} km
                </option>
              ))}
            </select>
          </label>
        </div>

        <p className="mt-2 flex items-center gap-1.5 text-[11px] font-bold text-muted">
          <MapPin className="size-3.5" aria-hidden />
          {center.label}
        </p>
      </div>

      {notice ? (
        <div className="mt-3 rounded-2xl bg-sun-soft px-4 py-3 text-xs font-bold text-[#7a5a00]">
          {notice}
        </div>
      ) : null}

      {offline ? (
        <div className="mt-3 flex items-start gap-2 rounded-2xl bg-sun-soft px-4 py-3 text-xs font-bold text-[#7a5a00]">
          <WifiOff className="mt-0.5 size-4 shrink-0" aria-hidden />
          <span>{message}</span>
        </div>
      ) : null}

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.1fr_1fr]">
        <div className="clay-inset h-[320px] overflow-hidden rounded-3xl">
          <NearbyMap center={center} places={places} />
        </div>

        <div className="min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-sm font-extrabold uppercase tracking-wider text-muted">
              {places.length} nearby
            </h2>
            {loading ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-muted">
                <Loader2 className="size-3.5 animate-spin" aria-hidden />
                Updating
              </span>
            ) : null}
          </div>

          <div className="mt-2 max-h-[320px] space-y-2 overflow-y-auto pr-1">
            {places.length === 0 && !loading ? (
              <EmptyState
                icon={<MapPin className="size-8" aria-hidden />}
                title="Nothing found nearby"
                hint="Try a wider radius or a different place type."
              />
            ) : null}

            {places.map((place) => (
              <article
                key={place.id}
                className="rounded-2xl border border-white/70 bg-white/70 px-3.5 py-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <h3 className="min-w-0 flex-1 break-words text-sm font-black leading-tight">
                    {place.name}
                  </h3>
                  <span className="shrink-0 rounded-full bg-mint-soft px-2 py-0.5 text-[10px] font-extrabold text-[#1c5f49]">
                    {formatDistance(place.distanceMeters) || place.type}
                  </span>
                </div>
                {place.address ? (
                  <p className="mt-1 text-xs font-semibold text-muted">{place.address}</p>
                ) : (
                  <p className="mt-1 text-xs font-semibold capitalize text-muted">
                    {place.type}
                  </p>
                )}
                <a
                  href={place.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1.5 inline-flex items-center gap-1 text-xs font-extrabold text-grape hover:underline"
                >
                  Open in Maps
                  <ExternalLink className="size-3" aria-hidden />
                </a>
              </article>
            ))}
          </div>

          <p className="mt-2 text-[10px] font-bold text-muted">
            Map data © OpenStreetMap contributors. Sample entries are illustrative.
          </p>
        </div>
      </div>
    </div>
  );
}
