import type { GeoPlace } from "@/lib/types";

const CITY_FALLBACK: GeoPlace[] = [
  { displayName: "New Delhi, India", lat: 28.6139, lng: 77.209 },
  { displayName: "Mumbai, Maharashtra, India", lat: 19.076, lng: 72.8777 },
  { displayName: "Bengaluru, Karnataka, India", lat: 12.9716, lng: 77.5946 },
  { displayName: "Hyderabad, Telangana, India", lat: 17.385, lng: 78.4867 },
  { displayName: "Chennai, Tamil Nadu, India", lat: 13.0827, lng: 80.2707 },
  { displayName: "Kolkata, West Bengal, India", lat: 22.5726, lng: 88.3639 },
  { displayName: "Pune, Maharashtra, India", lat: 18.5204, lng: 73.8567 },
  { displayName: "Lucknow, Uttar Pradesh, India", lat: 26.8467, lng: 80.9462 },
];

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = (searchParams.get("q") ?? "").trim();

  if (!q) {
    return Response.json({ error: "Please enter a city or area." }, { status: 400 });
  }

  try {
    const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=5&q=${encodeURIComponent(
      q,
    )}`;
    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
        "User-Agent": "MedVerse/1.0 (student health-education project)",
        "Accept-Language": "en",
      },
      signal: AbortSignal.timeout(8000),
    });

    if (!response.ok) throw new Error(`Nominatim responded ${response.status}`);

    const payload = (await response.json()) as Array<{
      display_name?: string;
      lat?: string;
      lon?: string;
    }>;

    const results: GeoPlace[] = payload
      .filter((item) => item.lat && item.lon)
      .map((item) => ({
        displayName: item.display_name ?? "Unknown place",
        lat: Number(item.lat),
        lng: Number(item.lon),
      }));

    if (results.length === 0) throw new Error("No geocode results");

    return Response.json({ results, offline: false });
  } catch {
    const needle = q.toLowerCase();
    const results = CITY_FALLBACK.filter((city) =>
      city.displayName.toLowerCase().includes(needle),
    );
    return Response.json({
      results: results.length > 0 ? results : CITY_FALLBACK.slice(0, 3),
      offline: true,
      message: "Place search is offline — showing a few major cities instead.",
    });
  }
}
