// src/components/MapClickHandler.tsx
"use client";

import { useMapEvents } from "react-leaflet";

interface MapClickHandlerProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onMapClick: (e: any) => void;
}

export default function MapClickHandler({ onMapClick }: MapClickHandlerProps) {
  useMapEvents({
    click: onMapClick,
  });

  return null;
}
