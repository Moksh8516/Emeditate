"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-hot-toast";
import { useMapEvents } from "react-leaflet";
import type * as L from "leaflet";
import { Icon } from "leaflet";

// Fix Leaflet marker icon
import "leaflet/dist/leaflet.css";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (Icon.Default.prototype as any)._getIconUrl;
Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Reverse Geocode
const reverseGeocode = async (lat: number, lng: number) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&accept-language=en`
    );

    const data = await response.json();
    const addr = data.address ?? {};

    return {
      country: addr.country ?? "",
      state: addr.state ?? addr.region ?? addr.state_district ?? "",
      district:
        addr.county ??
        addr.city ??
        addr.town ??
        addr.village ??
        addr.suburb ??
        "",
      fullAddress: data.display_name ?? "",
    };
  } catch (err) {
    console.warn("Reverse geocoding failed:", err);
    return null;
  }
};

// Inline click handler
const MapClick = ({
  onClick,
}: {
  onClick: (e: L.LeafletMouseEvent) => void;
}) => {
  useMapEvents({ click: onClick });
  return null;
};

// Dynamic Leaflet Components
const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  { ssr: false }
);
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  { ssr: false }
);
const Marker = dynamic(() => import("react-leaflet").then((m) => m.Marker), {
  ssr: false,
});

interface LeafletMapProps {
  onAddressSelect: (data: {
    lat: string;
    lng: string;
    country: string;
    state: string;
    district: string;
    fullAddress: string;
  }) => void;
}

export default function LeafletMap({ onAddressSelect }: LeafletMapProps) {
  const [marker, setMarker] = useState<[number, number] | null>(null);

  const defaultCenter: [number, number] = [20.5937, 78.9629]; // India

  const handleMapClick = async (e: L.LeafletMouseEvent) => {
    const lat = Number(e.latlng.lat.toFixed(6));
    const lng = Number(e.latlng.lng.toFixed(6));

    setMarker([lat, lng]);

    const geo = await reverseGeocode(lat, lng);

    if (geo) {
      onAddressSelect({
        lat: lat.toString(),
        lng: lng.toString(),
        country: geo.country,
        state: geo.state,
        district: geo.district,
        fullAddress: geo.fullAddress,
      });

      toast.success("Address updated from map");
    }
  };

  return (
    <div className="h-80 w-full rounded-xl overflow-hidden border border-white/20">
      <MapContainer
        center={defaultCenter}
        zoom={5}
        scrollWheelZoom
        className="w-full h-full"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {marker && <Marker position={marker} />}

        <MapClick onClick={handleMapClick} />
      </MapContainer>
    </div>
  );
}
