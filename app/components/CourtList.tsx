"use client";

import { Court, Sport } from "../lib/types";
import { formatDistance, formatRating } from "../lib/utils";

interface Props {
  courts: Court[];
  selectedId: string | null;
  onSelect: (court: Court) => void;
  loading: boolean;
  sport: Sport;
}

export default function CourtList({ courts, selectedId, onSelect, loading, sport }: Props) {
  const accentColor = sport === "basketball" ? "#FF6B2B" : "#2DD4A0";

  if (loading) {
    return (
      <div className="flex flex-col gap-3 p-4">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="rounded-xl p-4 animate-pulse" style={{ background: "#1E2333" }}>
            <div className="h-4 rounded w-3/4 mb-2" style={{ background: "#2A3148" }} />
            <div className="h-3 rounded w-1/2 mb-3" style={{ background: "#2A3148" }} />
            <div className="h-3 rounded w-1/4" style={{ background: "#2A3148" }} />
          </div>
        ))}
      </div>
    );
  }

  if (courts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full p-8 text-center">
        <span className="text-5xl mb-4">{sport === "basketball" ? "🏀" : "🎾"}</span>
        <p className="font-semibold text-white mb-1">No courts found nearby</p>
        <p className="text-sm" style={{ color: "#6B7494" }}>Try searching a different location.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 overflow-y-auto h-full">
      <p className="text-xs uppercase tracking-widest px-1 mb-1" style={{ color: "#6B7494" }}>
        {courts.length} court{courts.length !== 1 ? "s" : ""} nearby
      </p>
      {courts.map((court, idx) => {
        const isSelected = court.placeId === selectedId;
        return (
          <button
            key={court.placeId}
            onClick={() => onSelect(court)}
            className="w-full text-left rounded-xl p-4 transition-all duration-150 border focus:outline-none"
            style={{
              background: isSelected ? "#252d42" : "#1E2333",
              borderColor: isSelected ? accentColor : "#2A3148",
              boxShadow: isSelected ? `0 0 0 1px ${accentColor}` : "none",
            }}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className="text-xs font-bold w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                    style={{ background: accentColor + "22", color: accentColor }}
                  >
                    {idx + 1}
                  </span>
                  <p className="font-semibold text-sm text-white truncate">{court.name}</p>
                </div>
                <p className="text-xs ml-7 truncate" style={{ color: "#6B7494" }}>{court.address}</p>
              </div>
              <div className="flex-shrink-0 text-right">
                <p className="text-xs font-semibold" style={{ color: accentColor }}>
                  {formatDistance(court.distanceMiles)}
                </p>
                {court.rating && (
                  <div className="flex items-center gap-1 justify-end mt-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="text-xs text-white">{formatRating(court.rating)}</span>
                  </div>
                )}
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}

