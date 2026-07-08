import { writeFileSync, readFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import animals from "../data/animals.js";
import { ANIMAL_LOOKUP } from "../data/animal-lookup.js";

const __dirname = dirname(fileURLToPath(import.meta.url));
const API_NINJAS_KEY = process.env.API_NINJA_KEY;

if (!API_NINJAS_KEY) {
  console.error("[enrich] API_NINJA_KEY is not set. Skipping enrichment.");
  process.exit(0);
}

const OUT_DIR = join(__dirname, "..", "public", "data");
const OUT_FILE = join(OUT_DIR, "animals-enriched.json");

async function fetchSingle(term) {
  try {
    const response = await fetch(
      `https://api.api-ninjas.com/v1/animals?name=${encodeURIComponent(term)}`,
      {
        headers: { "X-Api-Key": API_NINJAS_KEY },
        signal: AbortSignal.timeout(15000)
      }
    );

    if (!response.ok) {
      console.warn(`[enrich] API Ninjas returned ${response.status} for "${term}"`);
      return null;
    }

    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0) return null;
    return data;
  } catch (error) {
    console.warn(`[enrich] Failed to fetch "${term}":`, error.message);
    return null;
  }
}

async function fetchAnimal(animal) {
  const lookup = ANIMAL_LOOKUP[animal.id];

  // Some animals are better served by curated data than API Ninjas generic matches
  if (lookup?.override) {
    console.log(`[enrich] Using curated data for "${animal.name}"`);
    return lookup.override;
  }

  const terms = lookup?.searchTerms || [animal.name];

  for (const term of terms) {
    const data = await fetchSingle(term);
    if (!data) continue;

    // Prefer exact name match, then scientific name match, then first result
    const exact = data.find(
      (item) =>
        item.name?.toLowerCase() === term.toLowerCase() ||
        item.taxonomy?.scientific_name?.toLowerCase() === term.toLowerCase()
    );
    const result = exact || data[0];
    if (result) return result;
  }

  console.warn(`[enrich] No results for "${animal.name}"`);
  return null;
}

async function main() {
  mkdirSync(OUT_DIR, { recursive: true });

  const existing = existsSync(OUT_FILE)
    ? JSON.parse(readFileSync(OUT_FILE, "utf-8"))
    : {};

  const enriched = { ...existing, _generatedAt: new Date().toISOString() };
  let calls = 0;

  for (const animal of animals) {
    // Force refresh for animals with known bad matches
    const forceRefresh = ANIMAL_LOOKUP[animal.id] && enriched[animal.id] && !enriched[animal.id]._refreshed;

    if (enriched[animal.id] && enriched[animal.id]._fetchedAt && !forceRefresh) {
      console.log(`[enrich] Using cached data for "${animal.name}"`);
      continue;
    }

    console.log(`[enrich] Fetching "${animal.name}"...`);
    const data = await fetchAnimal(animal);
    calls += 1;

    if (data) {
      enriched[animal.id] = {
        _fetchedAt: new Date().toISOString(),
        _refreshed: true,
        name: data.name,
        taxonomy: data.taxonomy,
        locations: data.locations,
        characteristics: data.characteristics
      };
    }

    // Be polite to the API
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  writeFileSync(OUT_FILE, JSON.stringify(enriched, null, 2));
  console.log(`[enrich] Saved ${OUT_FILE} (${calls} API call${calls === 1 ? "" : "s"})`);
}

main().catch((error) => {
  console.error("[enrich] Error:", error);
  process.exit(1);
});
