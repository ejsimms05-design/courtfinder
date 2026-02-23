"use client";

import { GoogleMap, useJsApiLoader, OverlayView } from "@react-google-maps/api";
import { Court, LatLng, Sport } from "../lib/types";
import { useCallback, useRef } from "react";

interface Props {
  center: LatLng;
  courts: Court[];
  selectedId: string | null;
  onSelectCourt: (placeId: string) => void;
  sport: Sport;
}

const MAP_STYLE = [
  { elementType: "geometry", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1f2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#8894b4" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#252d42" }] },
  { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: "#6b7494" }] },
  { featureType: "road.highway", elementType: "geometry", stylers: [{ color: "#2e3a58" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0d1117" }] },
  { featureType: "poi.park", elementType: "geometry", stylers: [{ color: "#1a2535" }] },
  { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
  { featureType: "administrative", elementType: "geometry", stylers: [{ color: "#2a3148" }] },
  { featureType: "administrative.locality", elementType: "labels.text.fill", stylers: [{ color: "#c4cbdf" }] },
];

const LIBRARIES: ("places" | "geometry")[] = ["places"];

export default function MapView({ center, courts, selectedId, onSelectCourt, sport }: Props) {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY ?? "",
    libraries: LIBRARIES,
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  if (!isLoaded) {
    return (
      <div className="w-full h-full flex items-center justify-center" style={{ background: "#1a1f2e" }}>
        <div className="text-center space-y-3">
          <div className="w-10 h-10 rounded-full animate-spin mx-auto" style={{ border: "2px solid #FF6B2B", borderTopColor: "transparent" }} />
          <p className="text-sm" style={{ color: "#6B7494" }}>Loading map...</p>
        </div>
      </div>
    );
  }

 const sportColor = sport === "basketball" ? "#fa9b72" : sport === "pickleball" ? "#EAB308" : "#2DD4A0";
const sportColorDark = sport === "basketball" ? "#ff8447" : sport === "pickleball" ? "#e7e07f" : "#1a9e76";

  return (
    <GoogleMap
      mapContainerStyle={{ width: "100%", height: "100%" }}
      center={center}
      zoom={13}
      onLoad={onLoad}
      options={{
        styles: MAP_STYLE,
        disableDefaultUI: true,
        zoomControl: true,
        clickableIcons: false,
        gestureHandling: "greedy",
      }}
    >
      <OverlayView position={center} mapPaneName="overlayLayer">
        <div style={{ transform: "translate(-50%, -50%)", pointerEvents: "none" }}>
          <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#4285F4", border: "2px solid white", boxShadow: "0 0 0 4px rgba(66,133,244,0.25)" }} />
        </div>
      </OverlayView>

      {courts.map((court) => {
        const isSelected = court.placeId === selectedId;
        return (
          <OverlayView
            key={court.placeId}
            position={{ lat: court.lat, lng: court.lng }}
            mapPaneName="overlayMouseTarget"
          >
            <div
              onClick={() => { console.log("clicked:", court.placeId); onSelectCourt(court.placeId); }}
              style={{
                transform: "translate(-50%, -100%)",
                cursor: "pointer",
                width: isSelected ? 44 : 36,
                height: isSelected ? 44 : 36,
                borderRadius: "50% 50% 50% 0",
                rotate: "-45deg",
                background: isSelected ? sportColor : sportColorDark,
                border: `2px solid ${isSelected ? "white" : sportColor}`,
                boxShadow: isSelected ? `0 0 0 3px ${sportColor}55, 0 4px 12px rgba(0,0,0,0.5)` : "0 2px 8px rgba(0,0,0,0.4)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <span style={{ rotate: "45deg", fontSize: isSelected ? 18 : 14 }}>
                {sport === "basketball" ? "🏀" : "🎾"}
              </span>
            </div>
          </OverlayView>
        );
      })}
    </GoogleMap>
  );
}
