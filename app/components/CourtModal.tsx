"use client";

import { useEffect, useState } from "react";
import { CourtDetail, Sport } from "../lib/types";

interface Props {
  placeId: string | null;
  sport: Sport;
  originLat: number;
  originLng: number;
  onClose: () => void;
}

export default function CourtModal({ placeId, sport, originLat, originLng, onClose }: Props) {
  const [court, setCourt] = useState<CourtDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [photoIndex, setPhotoIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  const accentColor = sport === "basketball" ? "#FF6B2B" : sport === "pickleball" ? "#EAB308" : "#2DD4A0";

  useEffect(() => {
    if (!placeId) {
      setIsVisible(false);
      return;
    }
    setIsVisible(true);
    setLoading(true);
    setPhotoIndex(0);
    setCourt(null);
    fetch(`/api/court/${placeId}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.court) setCourt(data.court);
      })
      .finally(() => setLoading(false));
  }, [placeId]);

  if (!placeId) return null;

  const photoUrl = (ref: string) => `/api/photo?ref=${encodeURIComponent(ref)}&maxwidth=800`;

  const stars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;
    return Array.from({ length: 5 }, (_, i) => {
      if (i < full) return "★";
      if (i === full && half) return "½";
      return "☆";
    }).join("");
  };

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        right: 0,
        height: "100%",
        width: "360px",
        zIndex: 40,
        background: "#181C27",
        borderLeft: "1px solid #2A3148",
        boxShadow: "-8px 0 32px rgba(0,0,0,0.4)",
        transform: isVisible ? "translateX(0)" : "translateX(100%)",
        transition: "transform 0.3s ease",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* X button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: "12px",
          right: "12px",
          width: "32px",
          height: "32px",
          borderRadius: "50%",
          background: "rgba(0,0,0,0.5)",
          border: "1px solid #2A3148",
          color: "#9AA3BF",
          fontSize: "16px",
          cursor: "pointer",
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        ✕
      </button>

      {loading ? (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div
            style={{
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              border: `3px solid ${accentColor}`,
              borderTopColor: "transparent",
              animation: "spin 0.8s linear infinite",
            }}
          />
        </div>
      ) : court ? (
        <div style={{ flex: 1, overflowY: "auto" }}>

          {/* Photo */}
          <div style={{ position: "relative", width: "100%", height: "220px", background: "#0F1117" }}>
            {court.photos && court.photos.length > 0 ? (
              <>
                <img
                  src={photoUrl(court.photos[photoIndex])}
                  alt={court.name}
                  style={{ width: "100%", height: "220px", objectFit: "cover", display: "block" }}
                />
                {court.photos.length > 1 && (
                  <>
                    <button
                      onClick={() => setPhotoIndex((i) => (i - 1 + court.photos.length) % court.photos.length)}
                      style={{ position: "absolute", left: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", color: "white", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px" }}
                    >‹</button>
                    <button
                      onClick={() => setPhotoIndex((i) => (i + 1) % court.photos.length)}
                      style={{ position: "absolute", right: "8px", top: "50%", transform: "translateY(-50%)", background: "rgba(0,0,0,0.6)", border: "none", color: "white", borderRadius: "50%", width: "32px", height: "32px", cursor: "pointer", fontSize: "18px" }}
                    >›</button>
                    <div style={{ position: "absolute", bottom: "8px", left: "50%", transform: "translateX(-50%)", display: "flex", gap: "4px" }}>
                      {court.photos.slice(0, 8).map((_, i) => (
                        <div
                          key={i}
                          onClick={() => setPhotoIndex(i)}
                          style={{ width: "6px", height: "6px", borderRadius: "50%", background: i === photoIndex ? accentColor : "rgba(255,255,255,0.4)", cursor: "pointer" }}
                        />
                      ))}
                    </div>
                  </>
                )}
              </>
            ) : (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100%", color: "#3A4260", fontSize: "14px" }}>
                No photos available
              </div>
            )}
          </div>

          {/* Info */}
          <div style={{ padding: "16px" }}>
            <h2 style={{ fontFamily: "'Oswald', sans-serif", fontSize: "20px", fontWeight: 700, color: accentColor, margin: 0, letterSpacing: "0.04em", textTransform: "uppercase", lineHeight: 1.2 }}>
              {court.name}
            </h2>
            <p style={{ color: "#6B7494", fontSize: "13px", margin: "4px 0 0 0" }}>{court.address}</p>

            {court.rating && (
              <div style={{ display: "flex", alignItems: "center", gap: "6px", marginTop: "6px" }}>
                <span style={{ color: "#EAB308", fontSize: "14px" }}>{stars(court.rating)}</span>
                <span style={{ color: "#9AA3BF", fontSize: "12px" }}>{court.rating.toFixed(1)} ({court.reviewCount} reviews)</span>
              </div>
            )}

            <div style={{ display: "flex", gap: "8px", marginTop: "12px", marginBottom: "16px", flexWrap: "wrap" }}>
              {court.openNow !== undefined && (
                <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "9999px", background: court.openNow ? "rgba(45,212,160,0.15)" : "rgba(248,113,113,0.15)", color: court.openNow ? "#2DD4A0" : "#F87171", border: `1px solid ${court.openNow ? "#2DD4A0" : "#F87171"}` }}>
                  {court.openNow ? "Open Now" : "Closed"}
                </span>
              )}
              {court.distanceMiles !== undefined && (
                <span style={{ fontSize: "12px", fontWeight: 600, padding: "3px 10px", borderRadius: "9999px", background: "rgba(255,255,255,0.05)", color: "#9AA3BF", border: "1px solid #2A3148" }}>
                  {court.distanceMiles.toFixed(1)} mi away
                </span>
              )}
            </div>

            
            <a
              href={court.googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              style={{ display: "block", width: "100%", padding: "12px 0", borderRadius: "9999px", background: accentColor, color: "#0F1117", fontFamily: "'Oswald', sans-serif", fontSize: "15px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", textAlign: "center", textDecoration: "none", marginBottom: "20px" }}
            >
              Get Directions
            </a>

            {court.reviews && court.reviews.length > 0 && (
              <div>
                <p style={{ fontFamily: "'Oswald', sans-serif", fontSize: "11px", color: "#6B7494", letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "10px" }}>Reviews</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {court.reviews.slice(0, 3).map((review, i) => (
                    <div key={i} style={{ padding: "12px", borderRadius: "12px", background: "#0F1117", border: "1px solid #2A3148" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                        <span style={{ color: "#E8ECF8", fontSize: "13px", fontWeight: 600 }}>{review.author}</span>
                        <span style={{ color: "#EAB308", fontSize: "12px" }}>{"★".repeat(review.rating)}</span>
                      </div>
                      <p style={{ color: "#9AA3BF", fontSize: "12px", margin: 0, lineHeight: 1.5 }}>{review.text}</p>
                      <p style={{ color: "#3A4260", fontSize: "11px", margin: "6px 0 0 0" }}>{review.relativeTime}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", color: "#6B7494", fontSize: "14px" }}>
          Could not load court details.
        </div>
      )}
    </div>
  );
}
