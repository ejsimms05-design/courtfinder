 import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.GOOGLE_PLACES_API_KEY;

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ref = searchParams.get("ref");
  const w = searchParams.get("w") ?? "800";

  if (!ref || !API_KEY) {
    return new NextResponse("Bad request", { status: 400 });
  }

  const url = new URL("https://maps.googleapis.com/maps/api/place/photo");
  url.searchParams.set("photo_reference", ref);
  url.searchParams.set("maxwidth", w);
  url.searchParams.set("key", API_KEY);

  try {
    const res = await fetch(url.toString());
    const buffer = await res.arrayBuffer();
    const contentType = res.headers.get("content-type") ?? "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new NextResponse("Failed to fetch photo", { status: 502 });
  }
}

