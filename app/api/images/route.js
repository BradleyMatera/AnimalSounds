import { NextResponse } from "next/server";

const isDisabled = process.env.NEXT_DISABLE_PEXELS_API === "1";
export const dynamic = isDisabled ? "force-static" : "force-dynamic";
export const revalidate = isDisabled ? false : 60 * 60 * 6;

function mapPexelsPhoto(animalName, photo) {
  const url = photo?.src?.landscape || photo?.src?.large2x || photo?.src?.original;
  if (!url) return null;

  return {
    url,
    alt: photo?.alt || `${animalName} photo`,
    photographer: photo?.photographer || "Pexels",
    photographerUrl: photo?.photographer_url || null
  };
}

function mapPixabayPhoto(animalName, hit) {
  const url = hit?.webformatURL || hit?.largeImageURL;
  if (!url) return null;

  return {
    url,
    alt: hit?.tags || `${animalName} photo`,
    photographer: hit?.user || "Pixabay",
    photographerUrl: hit?.user_id ? `https://pixabay.com/users/${hit.user_id}/` : null
  };
}

async function fetchPexels(animalName, apiKey) {
  const response = await fetch(
    `https://api.pexels.com/v1/search?query=${encodeURIComponent(animalName)}&orientation=landscape&per_page=3`,
    {
      headers: { Authorization: apiKey },
      next: { revalidate }
    }
  );

  if (!response.ok) return [];

  const payload = await response.json();
  return payload?.photos
    ?.map((photo) => mapPexelsPhoto(animalName, photo))
    .filter(Boolean) ?? [];
}

async function fetchPixabay(animalName, apiKey) {
  const response = await fetch(
    `https://pixabay.com/api/?key=${encodeURIComponent(apiKey)}&q=${encodeURIComponent(animalName)}&image_type=photo&orientation=horizontal&per_page=3`,
    { next: { revalidate } }
  );

  if (!response.ok) return [];

  const payload = await response.json();
  return payload?.hits
    ?.map((hit) => mapPixabayPhoto(animalName, hit))
    .filter(Boolean) ?? [];
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
  const pexelsKey = process.env.PEXELS_API_KEY;
  const pixabayKey = process.env.PIXABAY_API_KEY;

  if (!pexelsKey && !pixabayKey) {
    return NextResponse.json({
      photos: [],
      message: "No image API keys are configured."
    });
  }

  try {
    // Try Pexels first, then fall back to Pixabay to fill gaps
    let photos = [];
    if (pexelsKey) {
      photos = await fetchPexels(animalName, pexelsKey);
    }

    if (photos.length === 0 && pixabayKey) {
      photos = await fetchPixabay(animalName, pixabayKey);
    }

    return NextResponse.json({ photos });
  } catch (error) {
    console.error("[images] failed to enrich images", error);
    return NextResponse.json(
      {
        photos: [],
        message: "Image enrichment failed."
      },
      { status: 502 }
    );
  }
}
