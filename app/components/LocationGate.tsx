"use client";

import { useState } from "react";
import { LatLng } from "../lib/types";

interface Props {
  onLocation: (loc: LatLng, label: string) => void;
}

const SPORTS = [
  { id: "basketball", label: "Basketball", color: "#FF6B2B", shadow: "rgba(255,107,43,0.3)" },
  { id: "pickleball", label: "Pickleball", color: "#EAB308", shadow: "rgba(234,179,8,0.3)" },
  { id: "tennis", label: "Tennis", color: "#2DD4A0", shadow: "rgba(45,212,160,0.3)" },
  { id: "sport4", label: "Coming Soon", color: "#6B7494", shadow: "none" },
];

export default function LocationGate({ onLocation }: Props) {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [geoLoading, setGeoLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  async function handleGeo() {
    setGeoLoading(true);
    setError(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }, "Your location");
        setGeoLoading(false);
      },
      () => {
        setError("Location access denied. Enter a city or zip code below.");
        setGeoLoading(false);
      },
      { timeout: 10000 }
    );
  }

  async function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    if (!query.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      onLocation({ lat: data.lat, lng: data.lng }, data.label);
    } catch (err: any) {
      setError(err.message ?? "Could not find that location.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="min-h-dvh flex flex-col items-center justify-center"
      style={{ background: "#0F1117", padding: "24px" }}
    >
      <div style={{ width: "100%", maxWidth: "440px" }}>

        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <h1 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "48px", fontWeight: 900, color: "#E8ECF8", letterSpacing: "0.06em", textTransform: "uppercase", margin: 0, lineHeight: 1 }}>
            Court<span style={{ color: "#72ca66" }}>Finder</span>
          </h1>
          <p style={{ color: "#6B7494", fontSize: "14px", marginTop: "8px" }}>Basketball &amp; tennis courts near you</p>
        </div>

        {/* Sport label */}
        <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "11px", color: "#6B7494", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>
          What sport are you looking for?
        </p>

        {/* Sport grid */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
          {SPORTS.map((s) => {
            const isDisabled = s.id === "sport3" || s.id === "sport4";
            const isSelected = selectedSport === s.id;
            return (
              <button
                key={s.id}
                onClick={() => !isDisabled && setSelectedSport(s.id)}
                disabled={isDisabled}
                style={{
                  fontFamily: "'Oswald', sans-serif",
                  fontSize: "18px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  textAlign: "center",
                  padding: "16px 0",
                  borderRadius: "9999px",
                  background: isSelected ? s.color + "22" : "#181C27",
                  border: `2px solid ${isSelected ? s.color : "#2A3148"}`,
                  color: isDisabled ? "#3A4260" : isSelected ? s.color : "#6B7494",
                  boxShadow: isSelected ? `0 0 20px ${s.shadow}` : "none",
                  cursor: isDisabled ? "default" : "pointer",
                  transition: "all 0.2s",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Location label */}
        <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "11px", color: "#6B7494", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "12px", textAlign: "center" }}>
          Select your area
        </p>

        {/* Use my location */}
        <button
          onClick={handleGeo}
          disabled={geoLoading}
          style={{
            width: "100%",
            padding: "14px 0",
            borderRadius: "9999px",
            background: "#72ca66",
            color: "white",
            fontFamily: "'Oswald', sans-serif",
            fontSize: "18px",
            fontWeight: 700,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
            border: "none",
            cursor: "pointer",
            marginBottom: "12px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
            opacity: geoLoading ? 0.6 : 1,
          }}
        >
          {geoLoading ? "Detecting..." : "Use My Location"}
        </button>

        {/* Divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
          <div style={{ flex: 1, height: "1px", background: "#2A3148" }} />
          <span style={{ color: "#6B7494", fontSize: "11px", letterSpacing: "0.12em", textTransform: "uppercase" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#2A3148" }} />
        </div>

        {/* ZIP input */}
        <form onSubmit={handleSearch} style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="City or ZIP code"
            style={{
              flex: 1,
              padding: "13px 20px",
              borderRadius: "9999px",
              background: "#181C27",
              border: "1px solid #2A3148",
              color: "#E8ECF8",
              fontSize: "14px",
              outline: "none",
            }}
          />
          <button
            type="submit"
            disabled={loading || !query.trim()}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.boxShadow = "0 0 20px rgba(50, 212, 45, 0.7), 0 0 40px rgba(64, 212, 45, 0.3)";
              btn.style.borderColor = "#72ca66";
              btn.style.color = "#72ca66";
              btn.style.background = "#2dd42d22";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.boxShadow = "none";
btn.style.borderColor = "#2A3148";
btn.style.color = "#E8ECF8";
btn.style.background = "#181C27";
              btn.style.background = "#181C27";
            }}
            style={{
              padding: "13px 24px",
              borderRadius: "9999px",
              background: "#181C27",
              border: "2px solid #2A3148",
              color: "#E8ECF8",
              fontFamily: "'Oswald', sans-serif",
              fontSize: "18px",
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              cursor: "pointer",
              opacity: loading || !query.trim() ? 0.5 : 1,
              transition: "box-shadow 0.2s, border-color 0.2s, color 0.2s",
            }}
          >
            {loading ? "..." : "Go"}
          </button>
        </form>

        {error && <p style={{ color: "#F87171", fontSize: "13px", textAlign: "center", marginTop: "12px" }}>{error}</p>}
      </div>
    </div>
  );
}
