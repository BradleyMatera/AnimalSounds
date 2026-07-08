const ENRICHED_DATA_PATH = "/data/animals-enriched.json";
const STORAGE_KEY = "wildlife-sounds-enriched-cache";
const CACHE_TTL_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

function safeWindow() {
  return typeof window !== "undefined" ? window : undefined;
}

function loadFromStorage() {
  try {
    const win = safeWindow();
    if (!win) return null;
    if (win.clearWildlifeCache) {
      win.localStorage.removeItem(STORAGE_KEY);
      win.clearWildlifeCache = false;
      return null;
    }
    const raw = win.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed._generatedAt) return null;
    const age = Date.now() - new Date(parsed._generatedAt).getTime();
    if (age > CACHE_TTL_MS) return null;
    return parsed;
  } catch (error) {
    console.warn("[enriched] Failed to load from storage", error);
    return null;
  }
}

function saveToStorage(data) {
  try {
    const win = safeWindow();
    if (!win) return;
    win.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.warn("[enriched] Failed to save to storage", error);
  }
}

export async function loadEnrichedData(signal) {
  // Prefer localStorage cache first to avoid repeated fetches
  const cached = loadFromStorage();
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(ENRICHED_DATA_PATH, { signal });
    if (!response.ok) {
      throw new Error(`Failed to load enriched data: ${response.status}`);
    }
    const data = await response.json();
    saveToStorage(data);
    return data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.warn("[enriched] Failed to load enriched data", error);
    }
    return null;
  }
}

export function getAnimalDetails(enrichedData, animalId) {
  if (!enrichedData) return null;
  return enrichedData[animalId] || null;
}

export function mergeAnimal(animal, details) {
  if (!details) return animal;

  const characteristics = details.characteristics || {};
  const taxonomy = details.taxonomy || {};

  return {
    ...animal,
    scientificName: taxonomy.scientific_name || animal.scientificName,
    description: characteristics.slogan
      ? `${animal.description} ${characteristics.slogan}`
      : animal.description,
    enriched: {
      name: details.name,
      taxonomy,
      locations: details.locations || [],
      characteristics
    }
  };
}
