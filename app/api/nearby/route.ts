import fallbackData from "@/content/nearby-fallback.json";
import type { NearbyPlace } from "@/lib/types";
import { haversineMeters } from "@/lib/utils";

const TYPES = new Set(["pharmacy", "clinic", "hospital"]);

const OVERPASS_ENDPOINTS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
];

type CacheEntry = { at: number; places: NearbyPlace[] };
const cache = new Map<string, CacheEntry>();
const TTL = 10 * 60 * 1000;

const fallback = fallbackData as {
  city: string;
  center: { lat: number; lng: number };
  places: Array<{
    id: string;
    name: string;
    type: "pharmacy" | "clinic" | "hospital";
    lat: number;
    lng: number;
    address?: string;
    source: "fallback";
  }>;
};

function buildQuery(lat: number, lng: number, radius: number, type: string) {
  return `[out:json][timeout:10];
(
  node["amenity"="${type}"](around:${radius},${lat},${lng});
  way["amenity"="${type}"](around:${radius},${lat},${lng});
  relation["amenity"="${type}"](around:${radius},${lat},${lng});
);
out center tags 40;`;
}

type OverpassElement = {
  id: number;
  lat?: number;
  lon?: number;
  center?: { lat: number; lon: number };
  tags?: Record<string, string>;
};

function normalizeElements(
  elements: OverpassElement[],
  origin: { lat: number; lng: number },
  type: string,
): NearbyPlace[] {
  return elements
    .map((element): NearbyPlace | null => {
      const lat = element.lat ?? element.center?.lat;
      const lng = element.lon ?? element.center?.lon;
      if (lat === undefined || lng === undefined) return null;

      const tags = element.tags ?? {};
      const name =
        tags.name ?? tags["name:en"] ?? tags.operator ?? `Unnamed ${type}`;
      const address =
        [tags["addr:housenumber"], tags["addr:street"], tags["addr:city"]]
          .filter(Boolean)
          .join(", ") ||
        tags["addr:full"] ||
        undefined;

      return {
        id: `osm-${element.id}`,
        name,
        type: type as NearbyPlace["type"],
        lat,
        lng,
        address,
        distanceMeters: haversineMeters(origin, { lat, lng }),
        mapsUrl: `https://www.openstreetmap.org/?mlat=${lat}&mlon=${lng}#map=18/${lat}/${lng}`,
        source: "OSM",
      };
    })
    .filter((place): place is NearbyPlace => place !== null)
    .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0))
    .slice(0, 25);
}

function fallbackPlaces(
  type: string,
  origin: { lat: number; lng: number },
  maxDistance: number,
): NearbyPlace[] {
  return fallback.places
    .filter((place) => place.type === type)
    .map((place) => ({
      ...place,
      distanceMeters: haversineMeters(origin, { lat: place.lat, lng: place.lng }),
      mapsUrl: `https://www.openstreetmap.org/?mlat=${place.lat}&mlon=${place.lng}#map=18/${place.lat}/${place.lng}`,
    }))
    .filter((place) => (place.distanceMeters ?? Infinity) <= maxDistance)
    .sort((a, b) => (a.distanceMeters ?? 0) - (b.distanceMeters ?? 0));
}

async function queryOverpass(query: string): Promise<OverpassElement[]> {
  let lastError: unknown = new Error("No Overpass endpoint reachable");

  for (const endpoint of OVERPASS_ENDPOINTS) {
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "User-Agent": "MedVerse/1.0 (student health-education project)",
        },
        body: `data=${encodeURIComponent(query)}`,
        signal: AbortSignal.timeout(8_000),
      });
      if (!response.ok) throw new Error(`Overpass responded ${response.status}`);
      const payload = (await response.json()) as { elements?: OverpassElement[] };
      return payload.elements ?? [];
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const radius = Number(searchParams.get("radius") ?? 3000);
  const type = (searchParams.get("type") ?? "pharmacy").toLowerCase();

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return Response.json({ error: "Invalid location." }, { status: 400 });
  }
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return Response.json({ error: "Location out of range." }, { status: 400 });
  }
  if (!TYPES.has(type)) {
    return Response.json({ error: "Unknown place type." }, { status: 400 });
  }

  const safeRadius = Math.min(Math.max(Number.isFinite(radius) ? radius : 3000, 200), 10_000);
  const key = `${lat.toFixed(3)},${lng.toFixed(3)},${safeRadius},${type}`;

  const cached = cache.get(key);
  if (cached && Date.now() - cached.at < TTL) {
    return Response.json({ places: cached.places, offline: false });
  }

  try {
    const elements = await queryOverpass(
      buildQuery(lat, lng, safeRadius, type),
    );
    const places = normalizeElements(elements, { lat, lng }, type);
    if (places.length === 0) throw new Error("No results from Overpass");

    cache.set(key, { at: Date.now(), places });
    return Response.json({ places, offline: false });
  } catch {
    const places = fallbackPlaces(type, { lat, lng }, safeRadius);
    return Response.json({
      places,
      offline: true,
      city: places.length > 0 ? fallback.city : undefined,
      message:
        places.length > 0
          ? `Live map data is unavailable right now, so this shows a sample set for ${fallback.city}.`
          : "Live map data is unavailable right now. Try again in a minute, or search a nearby city.",
    });
  }
}
