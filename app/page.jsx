"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Divider } from "@nextui-org/react";
import animals, { continents, habitats, soundTypes } from "@/data/animals";
import { withBasePath } from "@/lib/base-path";
import { loadEvents, recordEvent, summarize } from "@/lib/analytics";
import { loadEnrichedData, mergeAnimal } from "@/lib/enriched-data";
import AppNavbar from "@/components/navbar";
import Hero from "@/components/hero";
import HabitatExplorer from "@/components/habitat-explorer";
import DailyDiscovery from "@/components/daily-discovery";
import DiscoverSection from "@/components/discover-section";
import Filters from "@/components/filters";
import FavoritesBar from "@/components/favorites-bar";
import SoundCard from "@/components/sound-card";
import SoundPlayer from "@/components/sound-player";
import StatsOverview from "@/components/stats-overview";

const FAVORITES_KEY = "animal-sounds-favorites";
const DEFAULT_STATS = {
  totalSessions: 0,
  totalInteractions: 0,
  favoriteCount: 0,
  lastPlayed: null
};
const ENABLE_IMAGE_ENRICHMENT =
  process.env.NEXT_PUBLIC_ENABLE_PEXELS === "true" && process.env.NEXT_DISABLE_PEXELS_API !== "1";

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  const [continentFilter, setContinentFilter] = useState("All");
  const [habitatFilter, setHabitatFilter] = useState("All");
  const [soundTypeFilter, setSoundTypeFilter] = useState("All");
  const [sortBy, setSortBy] = useState("name");
  const [favorites, setFavorites] = useState([]);
  const [images, setImages] = useState({});
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [playingId, setPlayingId] = useState(null);
  const [playerOpen, setPlayerOpen] = useState(false);
  const [playerAnimal, setPlayerAnimal] = useState(null);
  const [enrichedData, setEnrichedData] = useState(null);
  const audioRef = useRef(null);

  const track = useCallback(
    (name, data = {}) => {
      const events = recordEvent(name, data);
      setStats((current) => ({
        ...summarize(events),
        favoriteCount: favorites.length || current.favoriteCount
      }));
    },
    [favorites.length]
  );

  // Load persisted stats on first paint
  useEffect(() => {
    setStats(summarize(loadEvents()));
  }, []);

  // Load favorites on first paint
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem(FAVORITES_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setFavorites(parsed);
        }
      }
    } catch (error) {
      console.warn("[favorites] Failed to load", error);
    }
  }, []);

  // Persist favorites whenever they change
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      window.localStorage.setItem(FAVORITES_KEY, JSON.stringify(favorites));
    } catch (error) {
      console.warn("[favorites] Failed to save", error);
    }
  }, [favorites]);

  // Track session on mount
  useEffect(() => {
    track("session_start", {
      locale: typeof navigator !== "undefined" ? navigator.language : "en",
      userAgent: typeof navigator !== "undefined" ? navigator.userAgent : "unknown",
      themePreference: typeof window !== "undefined" ? window.matchMedia("(prefers-color-scheme: dark)").matches : false
    });

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, [track]);

  const mergedAnimals = useMemo(() => {
    const merged = animals.map((animal) => mergeAnimal(animal, enrichedData?.[animal.id]));
    if (typeof window !== "undefined") {
      window.__wildlifeAnimals = merged;
    }
    return merged;
  }, [enrichedData]);

  const filteredAnimals = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    const base = mergedAnimals.filter((animal) => {
      const matchesContinent = continentFilter === "All" || animal.continent === continentFilter;
      const matchesHabitat = habitatFilter === "All" || animal.habitat === habitatFilter;
      const matchesSoundType = soundTypeFilter === "All" || animal.soundType === soundTypeFilter;

      if (!normalizedSearch) {
        return matchesContinent && matchesHabitat && matchesSoundType;
      }

      const haystack = [
        animal.name,
        animal.scientificName,
        animal.description,
        animal.habitat,
        animal.continent,
        animal.soundType,
        animal.region
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesContinent && matchesHabitat && matchesSoundType && haystack.includes(normalizedSearch);
    });

    const sorted = [...base];
    if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortBy === "habitat") {
      sorted.sort((a, b) => a.habitat.localeCompare(b.habitat) || a.name.localeCompare(b.name));
    } else if (sortBy === "continent") {
      sorted.sort((a, b) => a.continent.localeCompare(b.continent) || a.name.localeCompare(b.name));
    }

    return sorted;
  }, [continentFilter, habitatFilter, soundTypeFilter, searchValue, sortBy]);

  const favoriteAnimals = useMemo(
    () => favorites.map((id) => mergedAnimals.find((animal) => animal.id === id)).filter(Boolean),
    [favorites, mergedAnimals]
  );

  const handlePlay = useCallback(
    (animal) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (playingId === animal.id) {
        setPlayingId(null);
        setPlayerOpen(false);
        setPlayerAnimal(null);
        track("sound_stopped", { animal: animal.id });
        return;
      }

      const audio = new Audio(withBasePath(animal.audio));
      audioRef.current = audio;
      if (typeof window !== "undefined") {
        window.__wildlifeAudio = audio;
      }
      audio.play().catch((error) => console.warn("[audio] playback failed", error));
      audio.onended = () => {
        setPlayingId((current) => (current === animal.id ? null : current));
      };

      setPlayingId(animal.id);
      setPlayerAnimal(animal);
      setPlayerOpen(true);
      track("sound_played", { animal: animal.name, id: animal.id });
    },
    [playingId, track]
  );

  const handleToggleFavorite = useCallback(
    (animalId) => {
      setFavorites((prev) => {
        if (prev.includes(animalId)) {
          track("favorite_toggled", { animal: animalId, isFavorite: false });
          return prev.filter((id) => id !== animalId);
        }
        track("favorite_toggled", { animal: animalId, isFavorite: true });
        return [...prev, animalId];
      });
    },
    [track]
  );

  const loadImages = useCallback(async (signal) => {
    if (!ENABLE_IMAGE_ENRICHMENT) {
      return;
    }

    await Promise.all(
      animals.map(async (animal) => {
        try {
          const response = await fetch(
            withBasePath(`/api/images?animal=${encodeURIComponent(animal.name)}`),
            {
              signal
            }
          );

          if (!response.ok) {
            return;
          }

          const payload = await response.json();
          const photo = payload.photos?.[0];
          if (photo) {
            // Preload the remote image so the browser has it ready before scroll reveals
            if (typeof window !== "undefined" && photo.url) {
              const preload = new Image();
              preload.src = photo.url;
            }
            setImages((prev) => ({ ...prev, [animal.id]: photo }));
          }
        } catch (error) {
          if (error.name !== "AbortError") {
            console.warn(`[images] Failed to load for ${animal.id}`, error);
          }
        }
      })
    );
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadImages(controller.signal);
    loadEnrichedData(controller.signal).then((data) => {
      if (data) setEnrichedData(data);
    });
    return () => controller.abort();
  }, [loadImages]);

  const handleClearFavorites = useCallback(() => {
    setFavorites([]);
    track("favorites_cleared");
  }, [track]);

  useEffect(() => {
    setStats((current) => ({ ...current, favoriteCount: favorites.length }));
  }, [favorites]);

  return (
    <div className="flex min-h-screen flex-col bg-nature-950 text-slate-50">
      <AppNavbar />
      <main className="w-full flex-1">
        <Hero />

        <div className="mx-auto max-w-7xl space-y-24 px-4 py-20 sm:px-6 lg:px-8">
          <DailyDiscovery onPlay={handlePlay} onSelectHabitat={setHabitatFilter} />

          <HabitatExplorer onSelectHabitat={setHabitatFilter} activeHabitat={habitatFilter} />

          <DiscoverSection
            playingId={playingId}
            favorites={favorites}
            animals={mergedAnimals}
            onPlay={handlePlay}
            onToggleFavorite={handleToggleFavorite}
          />

          <section className="space-y-8" id="collection">
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-nature-400">
                The collection
              </span>
              <h2 className="font-display text-3xl font-bold text-white md:text-4xl">
                All Wildlife Sounds
              </h2>
              <p className="max-w-2xl text-sm text-slate-400">
                Filter by region, habitat, sound type, or search across names and scientific classifications.
              </p>
            </div>

            <Filters
              search={searchValue}
              onSearchChange={setSearchValue}
              continent={continentFilter}
              onContinentChange={setContinentFilter}
              continents={continents}
              habitat={habitatFilter}
              onHabitatChange={setHabitatFilter}
              habitats={habitats}
              soundType={soundTypeFilter}
              onSoundTypeChange={setSoundTypeFilter}
              soundTypes={soundTypes}
              sort={sortBy}
              onSortChange={setSortBy}
            />

            <FavoritesBar
              favorites={favoriteAnimals}
              onClear={handleClearFavorites}
              onSelect={handlePlay}
            />

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredAnimals.map((animal) => (
                <SoundCard
                  key={animal.id}
                  animal={animal}
                  isPlaying={playingId === animal.id}
                  isFavorite={favorites.includes(animal.id)}
                  onPlay={handlePlay}
                  onToggleFavorite={handleToggleFavorite}
                  image={images[animal.id]}
                  details={animal.enriched}
                  scientificName={animal.scientificName}
                />
              ))}
            </div>

            {filteredAnimals.length === 0 ? (
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-12 text-center">
                <p className="font-display text-xl font-semibold text-white">No wildlife found</p>
                <p className="mt-2 text-sm text-slate-400">
                  Try adjusting your filters or search terms to find the perfect soundscape.
                </p>
                <button
                  onClick={() => {
                    setSearchValue("");
                    setContinentFilter("All");
                    setHabitatFilter("All");
                    setSoundTypeFilter("All");
                  }}
                  className="mt-5 rounded-full bg-nature-600 px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-nature-500"
                >
                  Reset filters
                </button>
              </div>
            ) : null}
          </section>

          <section className="space-y-8" id="about">
            <Divider className="bg-white/10" />
            <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
              <div className="space-y-4">
                <h2 className="font-display text-3xl font-bold text-white">
                  Crafted for accessibility & performance
                </h2>
                <p className="text-sm leading-relaxed text-slate-400">
                  This wildlife explorer is built with Next.js 14, Bun, Framer Motion, and Tailwind CSS.
                  It features keyboard navigation, ARIA labels, reduced-motion support, lazy-loaded imagery,
                  and resilient offline-ready audio so anyone can experience nature wherever they are.
                </p>
                <ul className="grid gap-3 text-sm text-slate-400 sm:grid-cols-2">
                  <li className="flex items-start gap-2"><span className="text-nature-400">✦</span> Immersive dark nature theme</li>
                  <li className="flex items-start gap-2"><span className="text-nature-400">✦</span> Glassmorphism & animated lighting</li>
                  <li className="flex items-start gap-2"><span className="text-nature-400">✦</span> Privacy-first local analytics</li>
                  <li className="flex items-start gap-2"><span className="text-nature-400">✦</span> Offline-capable local audio</li>
                </ul>
              </div>
              <StatsOverview stats={stats} />
            </div>
          </section>
        </div>
      </main>

      <SoundPlayer
        animal={playerAnimal}
        isOpen={playerOpen}
        onClose={() => setPlayerOpen(false)}
        isPlaying={!!playingId}
        onTogglePlay={handlePlay}
        onToggleFavorite={handleToggleFavorite}
        isFavorite={playerAnimal ? favorites.includes(playerAnimal.id) : false}
      />
    </div>
  );
}
