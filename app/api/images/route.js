import { NextResponse } from "next/server";

const isDisabled = process.env.NEXT_DISABLE_PEXELS_API === "1";
export const dynamic = isDisabled ? "force-static" : "force-dynamic";
export const revalidate = isDisabled ? false : 60 * 60 * 6;

function mapPhoto(animalName, photo) {
  const url = photo?.src?.landscape || photo?.src?.large2x || photo?.src?.original;
  if (!url) return null;

  return {
    url,
    alt: photo?.alt || `${animalName} photo`,
    photographer: photo?.photographer || "Pexels",
    photographerUrl: photo?.photographer_url || null
  };
}

export async function GET(request) {
  if (isDisabled) {
    return NextResponse.json({
      photos: [],
      message: "Image enrichment is disabled for static exports."
    });
  }

  const searchParams = request.nextUrl?.searchParams ?? new URL(request.url).searchParams;
  const animalName = searchParams.get("animal")?.trim() || "wildlife";
  const apiKey = process.env.PEXELS_API_KEY;

  if (!apiKey) {
    return NextResponse.json({
      photos: [],
      message: "PEXELS_API_KEY is not configured."
    });
  }

  try {
    const response = await fetch(
      `https://api.pexels.com/v1/search?query=${encodeURIComponent(animalName)}&orientation=landscape&per_page=1`,
      {
        headers: {
          Authorization: apiKey
        },
        next: { revalidate }
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        {
          photos: [],
          message: `Pexels responded with ${response.status}`
        },
        { status: 502 }
      );
    }

    const payload = await response.json();
    const photos =
      payload?.photos
        ?.map((photo) => mapPhoto(animalName, photo))
        .filter(Boolean) ?? [];

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("[images] failed to fetch Pexels", error);
    return NextResponse.json(
      {
        photos: [],
        message: "Image enrichment failed."
      },
      { status: 502 }
    );
  }
}
