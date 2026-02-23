 import { NextRequest, NextResponse } from "next/server";
import { Court, Sport } from "@/app/lib/types";
import { distanceMiles, SEARCH_RADIUS_METERS, SPORT_KEYWORDS } from "@/app/lib/utils";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get("lat") ?? "");
  const lng = parseFloat(searchParams.get("lng") ?? "");
  const sport = searchParams.get("sport") as Sport;

  if (isNaN(lat) || isNaN(lng) || !sport) {
    return NextResponse.json({ error: "Missing lat, lng, or sport" }, { status: 400 });
  }

  if (!API_KEY) {
    return NextResponse.json({ error: "API key not configured" }, { status: 500 });
  }

  const keyword = SPORT_KEYWORDS[sport].join(" ");
  const url = new URL("https://maps.googleapis.com/maps/api/place/nearbysearch/json");
  url.searchParams.set("location", `${lat},${lng}`);
  url.searchParams.set("radius", String(SEARCH_RADIUS_METERS));
  url.searchParams.set("keyword", keyword);
  url.searchParams.set("type", "park");
  url.searchParams.set("key", API_KEY);

  let data: any;
  try {
    const res = await fetch(url.toString());
    data = await res.json();
  } catch {
    return NextResponse.json({ error: "Failed to reach Google Places API" }, { status: 502 });
  }

  if (data.status !== "OK" && data.status !== "ZERO_RESULTS") {
    return NextResponse.json({ error: `Places API returned: ${data.status}` }, { status: 502 });
  }

  const origin = { lat, lng };
  const courts: Court[] = (data.results ?? []).map((place: any) => {
    const placeLat = place.geometry.location.lat;
    const placeLng = place.geometry.location.lng;
    return {
      placeId: place.place_id,
      name: place.name,
      address: place.vicinity ?? "",
      lat: placeLat,
      lng: placeLng,
      rating: place.rating ?? undefined,
      reviewCount: place.user_ratings_total ?? undefined,
      sport,
      distanceMiles: distanceMiles(origin, { lat: placeLat, lng: placeLng }),
      photoReference: place.photos?.[0]?.photo_reference ?? undefined,
    };
  });

  courts.sort((a, b) => a.distanceMiles - b.distanceMiles);
  return NextResponse.json({ courts });
}

