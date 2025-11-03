import { NextResponse } from "next/server";

const PEXELS_ENDPOINT = "https://api.pexels.com/v1/search";

export async function GET(request) {
  const url = new URL(request.url);
  const animal = url.searchParams.get("animal");
  const limit = Number(url.searchParams.get("limit") || 1);

  if (!animal) {
    return NextResponse.json(
      { error: "Missing `animal` query parameter" },
      { status: 400 }
    );
  }

  const apiKey = process.env.PEXELS_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        photos: [],
        message: "Pexels API key is not configured; returning fallback imagery"
      },
      { status: 200 }
    );
  }

  try {
    const params = new URLSearchParams({
      query: `${animal} animal portrait`,
      per_page: Math.min(Math.max(limit, 1), 4).toString(),
      orientation: "landscape"
    });

    const response = await fetch(`${PEXELS_ENDPOINT}?${params.toString()}`, {
      headers: {
        Authorization: apiKey
      },
      next: { revalidate: 60 * 60 }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.warn("[images] Pexels request failed", response.status, errorText);
      return NextResponse.json(
        {
          photos: [],
          message: "Failed to fetch from Pexels"
        },
        { status: 200 }
      );
    }

    const payload = await response.json();
    const photos = (payload.photos || []).map((photo) => ({
      id: photo.id,
      url: photo.src?.large2x || photo.src?.large,
      photographer: photo.photographer,
      photographerUrl: photo.photographer_url,
      alt: photo.alt || `${animal} photography`
    }));

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("[images]", error);
    return NextResponse.json(
      {
        photos: [],
        message: "Unexpected error fetching images"
      },
      { status: 200 }
    );
  }
}
