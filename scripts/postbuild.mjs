#!/usr/bin/env bun

import { closeSync, mkdirSync, openSync, copyFileSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = "out";

mkdirSync(OUTPUT_DIR, { recursive: true });
const noJekyllPath = join(OUTPUT_DIR, ".nojekyll");
const handle = openSync(noJekyllPath, "w");
closeSync(handle);

// Ensure the build includes the pre-fetched API Ninjas cache for client-side loading
const enrichedSrc = join("public", "data", "animals-enriched.json");
const enrichedDest = join(OUTPUT_DIR, "data", "animals-enriched.json");
try {
  mkdirSync(join(OUTPUT_DIR, "data"), { recursive: true });
  copyFileSync(enrichedSrc, enrichedDest);
  console.log(`[postbuild] copied ${enrichedSrc} -> ${enrichedDest}`);
} catch (error) {
  console.warn("[postbuild] failed to copy enriched data", error.message);
}
