#!/usr/bin/env bun

import { closeSync, mkdirSync, openSync } from "fs";
import { join } from "path";

const OUTPUT_DIR = "out";

mkdirSync(OUTPUT_DIR, { recursive: true });
const noJekyllPath = join(OUTPUT_DIR, ".nojekyll");
const handle = openSync(noJekyllPath, "w");
closeSync(handle);
