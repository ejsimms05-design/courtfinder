import { NextRequest, NextResponse } from "next/server";
import { CourtDetail, Sport } from "@/app/lib/types";
import { distanceMiles, photoUrl } from "@/app/lib/utils";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

const FIELDS = [
  "place_id", "name", "formatted_address", "geometry",
  "rating", "user_ratings_total", "reviews", "photos",
  "website", "formatted_phone_number", "opening_hours", "url",
].join(",");

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ placeId: string }> }
) {
  const { placeId } = await context.params;
  const { searchParams } = new URL(req.url);
  const sport = searchParams.get("sport") as Sport;
  const originLat = parseFloat(searchParams.get("lat") ?? "");
  const originLng = parseFloat(searchParams.get("lng") ?? "");

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/details/json");
  url.searchParams.set("place_id", placeId);
  url.searchParams.set("fields", FIELDS);
  url.searchParams.set("key", API_KEY);

  let data: any;
  try {
    const res = await fetch(url.toString());
    data = await res.json();
  } catch {
    return NextResponse.json({ error: "Failed to reach Google Places API" }, { status: 502 });
  }

  if (data.status !== "OK") {
    return NextResponse.json({ error: `Places API: ${data.status}` }, { status: 502 });
  }

  const p = data.result;
  const placeLat = p.geometry.location.lat;
  const placeLng = p.geometry.location.lng;

  const detail: CourtDetail = {
    placeId: p.place_id,
    name: p.name,
    address: p.formatted_address ?? "",
    lat: placeLat,
    lng: placeLng,
    rating: p.rating,
    reviewCount: p.user_ratings_total,
    sport: sport ?? "basketball",
    distanceMiles: !isNaN(originLat) && !isNaN(originLng)
      ? distanceMiles({ lat: originLat, lng: originLng }, { lat: placeLat, lng: placeLng })
      : 0,
    photos: (p.photos ?? []).slice(0, 6).map((photo: any) =>
      photoUrl(photo.photo_reference, 800)
    ),
    photoReference: p.photos?.[0]?.photo_reference,
    reviews: (p.reviews ?? []).slice(0, 5).map((r: any) => ({
      author: r.author_name,
      rating: r.rating,
      text: r.text,
      relativeTime: r.relative_time_description,
    })),
    website: p.website,
    phone: p.formatted_phone_number,
    googleMapsUrl: p.url ?? `https://www.google.com/maps/place/?q=place_id:${p.place_id}`,
    openNow: p.opening_hours?.open_now,
  };

  return NextResponse.json({ detail });
}
