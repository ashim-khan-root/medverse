"use client";

import { useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import type { NearbyPlace } from "@/lib/types";

const colors: Record<NearbyPlace["type"], string> = {
  pharmacy: "#6fd3ac",
  clinic: "#7fc2ee",
  hospital: "#ff8e8e",
};

function iconFor(type: NearbyPlace["type"]) {
  return L.divIcon({
    className: "",
    html: `<span style="display:block;width:22px;height:22px;border-radius:9999px;background:${colors[type]};border:3px solid #fff;box-shadow:0 6px 14px rgba(43,36,64,0.45)"></span>`,
    iconSize: [26, 26],
    iconAnchor: [13, 13],
    popupAnchor: [0, -12],
  });
}

function Recenter({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();
  useEffect(() => {
    map.setView([center.lat, center.lng], 14, { animate: true });
  }, [center.lat, center.lng, map]);
  return null;
}

export default function NearbyMap({
  center,
  places,
}: {
  center: { lat: number; lng: number };
  places: NearbyPlace[];
}) {
  return (
    <MapContainer
      center={[center.lat, center.lng]}
      zoom={14}
      scrollWheelZoom={false}
      className="h-full w-full"
      aria-label="Map of nearby pharmacies and clinics"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Recenter center={center} />
      {places.map((place) => (
        <Marker
          key={place.id}
          position={[place.lat, place.lng]}
          icon={iconFor(place.type)}
          title={place.name}
          alt={place.name}
        >
          <Popup>
            <strong>{place.name}</strong>
            <br />
            {place.address ? `${place.address}` : place.type}
            <br />
            <a href={place.mapsUrl} target="_blank" rel="noopener noreferrer">
              Open in Maps
            </a>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
