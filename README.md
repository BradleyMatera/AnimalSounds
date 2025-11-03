# Animal Sounds Soundboard (Next.js + Bun + NextUI)

A modern, accessible animal soundboard rebuilt with **Next.js 14**, **Bun**, and **NextUI 2**. Explore curated wildlife calls, rich imagery powered by the Pexels API, and a refined interface that feels native on every device.

## Features

- ⚡ **App Router + Bun runtime** for fast developer experience and streaming-ready performance
- 🎨 **NextUI 2 + Tailwind** theming with adaptive light/dark palettes
- 🔊 **Offline-ready audio** served directly from `public/audio`
- 🧠 **Privacy-friendly analytics** persisted entirely in the browser
- 🖼️ **Dynamic photography** via Pexels with graceful fallbacks
- ♿ **Accessibility-first** semantics, keyboard flows, and motion controls

## Getting Started

1. **Install dependencies** (Bun recommended):

    ```bash
    bun install
    ```

2. **Configure environment variables**:

    ```bash
    cp .env.example .env.local
    ```

    Update `.env.local` with your Pexels API key (optional).

3. **Run the development server**:

    ```bash
    bun run dev
    ```

    Visit [http://localhost:3000](http://localhost:3000) to explore the soundboard.

4. **Build for production**:

    ```bash
    bun run build
    bun run start
    ```

## Project Structure

```text
app/
  api/images/route.js      # Pexels proxy with caching hints
  layout.jsx               # Metadata + global providers
  page.jsx                 # Main soundboard experience
  globals.css              # Tailwind layers + design tokens
components/
  favorites-bar.jsx        # Quick access avatar rail
  filters.jsx              # Search + region filters
  hero.jsx                 # Landing hero section
  navbar.jsx               # Top navigation with theme toggle
  providers.jsx            # NextUI + next-themes wrappers
  sound-card.jsx           # Rich audio cards
  stats-overview.jsx       # Local analytics snapshot
  theme-toggle.jsx         # Adaptive light/dark switch
lib/
  analytics.js             # Local analytics helpers
public/
  audio/                   # MP3 assets for offline playback
  images/                  # Fallback photography
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `PEXELS_API_KEY` | Optional key for enriching cards with live Pexels photography. |

Create `.env.local` from `.env.example`. Without a key the UI continues to rely on bundled imagery.

## Technology Stack

- [Next.js 14](https://nextjs.org/) App Router
- [Bun](https://bun.sh/) task + package manager
- [NextUI](https://nextui.org/) 2.x component system
- [Tailwind CSS](https://tailwindcss.com/) utility styling
- [next-themes](https://github.com/pacocoursey/next-themes) for adaptive theming

## Roadmap

- 🗺️ Expanded taxonomy filters and sound journeys
- 📈 Optional cloud sync for analytics and favorites
- 🔊 Spatial audio + waveform visualizations
- 🌍 Internationalization and localized content

## Contributing

Issues and PRs are welcome! Please:

- Keep components accessible (ARIA, keyboard navigation)
- Maintain responsive layouts
- Add/update tests or manual QA notes when possible

## License

MIT © Bradley Matera

