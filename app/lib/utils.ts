 import { LatLng } from "./types";

export function distanceMiles(a: LatLng, b: LatLng): number {
  const R = 3958.8;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.asin(Math.sqrt(h));
}

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

export function formatDistance(miles: number): string {
  if (miles < 0.1) return "< 0.1 mi";
  if (miles < 10) return `${miles.toFixed(1)} mi`;
  return `${Math.round(miles)} mi`;
}

export function formatRating(rating: number): string {
  return rating.toFixed(1);
}

export function photoUrl(photoReference: string, maxWidth = 800): string {
  return `/api/photo?ref=${encodeURIComponent(photoReference)}&w=${maxWidth}`;
}

export const SEARCH_RADIUS_METERS = 8047;

export const SPORT_KEYWORDS: Record<string, string[]> = {
  basketball: ["basketball court", "basketball"],
  tennis: ["tennis court", "tennis"],
  pickleball: ["pickleball court", "pickleball"],
};

