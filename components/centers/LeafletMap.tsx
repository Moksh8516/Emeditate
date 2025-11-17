// src/components/LeafletMap.tsx
"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import type { LeafletMouseEvent } from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix default icon ONLY on client
import { Icon } from "leaflet";

// This block must NOT run on server
if (typeof window !== "undefined") {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  delete (Icon.Default.prototype as any)._getIconUrl;
  Icon.Default.mergeOptions({
    iconRetinaUrl:
      "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  });
}

interface LeafletMapProps {
  center?: [number, number];
  zoom?: number;
  markerPosition?: [number, number] | null;
  onMapClick?: (lat: number, lng: number) => void;
  children?: React.ReactNode;
}

// MapClickHandler must be inside the same component tree that uses MapContainer
function MapClickHandler({
  onClick,
}: {
  onClick: (lat: number, lng: number) => void;
}) {
  useMapEvents({
    click: (e: LeafletMouseEvent) => {
      onClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function LeafletMap({
  center = [20.5937, 78.9629],
  zoom = 5,
  markerPosition = null,
  onMapClick,
  children,
}: LeafletMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Skip rendering on server
  if (!mounted) {
    return <div className="w-full h-full bg-gray-200 animate-pulse" />;
  }

  return (
    <MapContainer
      center={center}
      zoom={zoom}
      scrollWheelZoom
      className="w-full h-full"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {markerPosition && <Marker position={markerPosition} />}
      {onMapClick && <MapClickHandler onClick={onMapClick} />}
      {children}
    </MapContainer>
  );
}
