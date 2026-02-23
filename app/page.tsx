"use client";

import { useState, useEffect, useCallback } from "react";
import dynamic from "next/dynamic";
import { Court, LatLng, Sport } from "./lib/types";
import LocationGate from "./components/LocationGate";
import CourtList from "./components/CourtList";
import CourtModal from "./components/CourtModal";

const MapView = dynamic(() => import("./components/MapView"), { ssr: false });

export default function Home() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [locationLabel, setLocationLabel] = useState("");
  const [sport, setSport] = useState<Sport>("basketball");
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [view, setView] = useState<"map" | "list">("map");

  const fetchCourts = useCallback(async (loc: LatLng, s: Sport) => {
    setLoading(true);
    setError(null);
    setCourts([]);
    setSelectedId(null);
    try {
      const res = await fetch(`/api/courts?lat=${loc.lat}&lng=${loc.lng}&sport=${s}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      setCourts(data.courts);
    } catch (err: any) {
      setError(err.message ?? "Failed to load courts.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (location) fetchCourts(location, sport);
  }, [location, sport, fetchCourts]);

  function handleLocation(loc: LatLng, label: string) {
    setLocation(loc);
    setLocationLabel(label);
  }

  const accentColor = sport === "basketball" ? "#FF6B2B" : sport === "tennis" ? "#27b185" : "#c4960c";

  if (!location) return <LocationGate onLocation={handleLocation} />;

  return (
    <div className="flex flex-col h-dvh" style={{ background: "#0F1117" }}>

      {/* Navbar */}
      <header className="flex-shrink-0 flex items-center gap-4 px-5 z-10" style={{ background: "#181C27", borderBottom: "1px solid #2A3148", height: "52px" }}>
        <span className="text-base font-black uppercase mr-2" style={{ fontFamily: "'Oswald', sans-serif", color: "#E8ECF8", letterSpacing: "0.1em" }}>
          Court<span style={{ color: accentColor }}>Finder</span>
        </span>
        <div className="flex gap-2">
          <button onClick={() => setSport("basketball")} className={`sport-pill ${sport === "basketball" ? "active-basketball" : "inactive"}`}>Basketball</button>
          <button onClick={() => setSport("pickleball")} className={`sport-pill ${sport === "pickleball" ? "active-pickleball" : "inactive"}`}>Pickleball</button>
          <button onClick={() => setSport("tennis")} className={`sport-pill ${sport === "tennis" ? "active-tennis" : "inactive"}`}>Tennis</button>
        </div>
        <div className="ml-auto flex items-center gap-2">
          <span className="text-xs hidden sm:block truncate max-w-[180px]" style={{ color: "#6B7494" }}>📍 {locationLabel}</span>
          <button onClick={() => setLocation(null)} className="text-xs px-3 py-1.5 rounded font-semibold transition-colors hover:text-white" style={{ background: "#252D42", color: "#9AA3BF", border: "1px solid #2A3148" }}>
            Change
          </button>
        </div>
      </header>

      {error && (
        <div className="flex-shrink-0 px-4 py-2 text-sm text-center" style={{ background: "rgba(248,113,113,0.1)", color: "#F87171" }}>{error}</div>
      )}

      {/* Full screen area */}
      <div className="flex-1 relative overflow-hidden">

        {/* Floating pill toggle */}
        <div
          className="absolute z-20 flex items-center"
          style={{
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            background: "rgba(201, 201, 202, 0.92)",
            backdropFilter: "blur(8px)",
            border: "1px solid #2A3148",
            borderRadius: "9999px",
            boxShadow: "0 4px 24px rgba(0,0,0,0.5)",
            overflow: "hidden",
          }}
        >
          <button
            onClick={() => setView("map")}
            style={{
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: "0.08em",
              padding: "10px 0",
              width: "120px",
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              color: view === "map" ? accentColor : "#333436",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            Map
          </button>
          <div style={{ width: "1px", height: "18px", background: "#3A4260", flexShrink: 0 }} />
          <button
            onClick={() => setView("list")}
            style={{
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: "0.08em",
              padding: "10px 0",
              width: "120px",
              textAlign: "center",
              fontSize: "15px",
              fontWeight: "bold",
              color: view === "list" ? accentColor : "#333335",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              textTransform: "uppercase",
            }}
          >
            List {courts.length > 0 && `(${courts.length})`}
          </button>
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute top-20 left-1/2 -translate-x-1/2 z-10 px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2" style={{ background: "#13161d", border: "1px solid #2A3148", color: "#E8ECF8" }}>
            <div className="w-3 h-3 rounded-full animate-spin" style={{ border: `2px solid ${accentColor}`, borderTopColor: "transparent" }} />
            Finding courts...
          </div>
        )}

        {/* Map */}
        <div className={`${view === "map" ? "flex" : "hidden"} w-full h-full`}>
          <MapView center={location} courts={courts} selectedId={selectedId} onSelectCourt={setSelectedId} sport={sport} />
        </div>

        {/* List */}
        <div className={`${view === "list" ? "flex" : "hidden"} w-full h-full flex-col overflow-hidden`} style={{ background: "#0b0d14" }}>
          <div className="flex-shrink-0 px-4 py-3 border-b" style={{ borderColor: "#2A3148" }}>
            <p className="text-xs font-semibold uppercase tracking-widest" style={{ color: "#6B7494", fontFamily: "'Oswald', sans-serif" }}>
              {loading ? "Searching..." : `${courts.length} Courts Nearby`}
            </p>
          </div>
          <CourtList courts={courts} selectedId={selectedId} onSelect={(court) => { setSelectedId(court.placeId); setView("map"); }} loading={loading} sport={sport} />
        </div>
      </div>

      <CourtModal placeId={selectedId} sport={sport} originLat={location.lat} originLng={location.lng} onClose={() => setSelectedId(null)} />
    </div>
  );
}

