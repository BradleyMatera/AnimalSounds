# Animal Sounds Soundboard

Static Next.js 14 + Bun soundboard deployed to GitHub Pages with NextUI and Tailwind. Audio ships from `public/audio`, imagery from bundled assets with optional Pexels enrichment, and analytics/favorites persist locally in the browser.

## Features
- Next.js App Router with Bun scripts
- NextUI 2 + Tailwind; light/dark/system themes via next-themes
- Offline-ready MP3s in `public/audio`
- Client-side favorites and local analytics stored in `localStorage`
- Optional Pexels photo enrichment (fallback to bundled images)
- Base-path aware asset loading for GitHub Pages deployments

## Getting Started
1) Install dependencies (Bun):
```bash
bun install
```

2) Configure environment:
```bash
cp .env.example .env.local
```
Optional: add `PEXELS_API_KEY` and set `NEXT_PUBLIC_ENABLE_PEXELS=true` for live photos in dev.

3) Run development server:
```bash
bun run dev
```
Visit http://localhost:3000.

4) Build static export:
```bash
bun run build
```
Output is written to `out/` with `.nojekyll` for Pages.

## Project Structure
```
app/
  api/images/route.js      # Pexels proxy (disabled when NEXT_DISABLE_PEXELS_API=1)
  layout.jsx               # Metadata + providers
  page.jsx                 # Main soundboard UI (filters, audio, favorites, stats)
  globals.css              # Tailwind layers + theme tokens
components/
  navbar.jsx, hero.jsx, filters.jsx, favorites-bar.jsx,
  sound-card.jsx, stats-overview.jsx, theme-toggle.jsx, providers.jsx
data/
  animals.js               # Catalog with audio paths and fallback images
lib/
  base-path.js             # Base path resolution for static hosting
  analytics.js             # Local analytics load/save/summarize
public/
  audio/                   # MP3 assets
  images/                  # Fallback photography/illustrations
scripts/postbuild.mjs      # Adds .nojekyll to out/
```

## Environment Variables
| Variable | Description |
|----------|-------------|
| `PEXELS_API_KEY` | Optional Pexels key for image enrichment (used when enabled). |
| `NEXT_PUBLIC_ENABLE_PEXELS` | `true` to fetch Pexels images in dev; leave false/unset for static deploys. |
| `NEXT_PUBLIC_BASE_PATH` | Base path for static hosting (e.g., `/AnimalSounds`); set in CI for Pages. |
| `NEXT_PUBLIC_SITE_URL` | Canonical site origin for metadata (e.g., `https://bradleymatera.github.io`). |
| `NEXT_DISABLE_PEXELS_API` | Set to `1` during static export (build script sets this). |

Create `.env.local` from `.env.example`. Without a Pexels key, bundled images are used.

## Development Notes
- `bun run dev` for local; `bun run build` for static export.
- Audio/image URLs are base-path aware via `lib/base-path.js`; ensure `NEXT_PUBLIC_BASE_PATH` matches your hosting subpath.
- Analytics and favorites stay in `localStorage`; there is no server persistence.

## Deployment (GitHub Pages)
- Workflow injects `NEXT_PUBLIC_BASE_PATH=/${{ github.event.repository.name }}` and `NEXT_PUBLIC_SITE_URL=https://${{ github.repository_owner }}.github.io` during build.
- Static export goes to `out/` and includes `.nojekyll`.

## License
MIT © Bradley Matera
