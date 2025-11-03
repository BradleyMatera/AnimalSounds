"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Divider } from "@nextui-org/react";
import animals, { continents } from "@/data/animals";
import { loadEvents, recordEvent, summarize } from "@/lib/analytics";
import AppNavbar from "@/components/navbar";
import Hero from "@/components/hero";
import Filters from "@/components/filters";
import FavoritesBar from "@/components/favorites-bar";
import SoundCard from "@/components/sound-card";
import StatsOverview from "@/components/stats-overview";

const FAVORITES_KEY = "animal-sounds-favorites";
const DEFAULT_STATS = {
  totalSessions: 0,
  totalInteractions: 0,
  favoriteCount: 0,
  lastPlayed: null
};

export default function HomePage() {
  const [searchValue, setSearchValue] = useState("");
  const [continentFilter, setContinentFilter] = useState("All");
  const [favorites, setFavorites] = useState([]);
  const [images, setImages] = useState({});
  const [stats, setStats] = useState(DEFAULT_STATS);
  const [playingId, setPlayingId] = useState(null);
  const audioRef = useRef(null);

  const track = useCallback((name, data = {}) => {
    const events = recordEvent(name, data);
    setStats(summarize(events));
  }, []);

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

  const filteredAnimals = useMemo(() => {
    const normalizedSearch = searchValue.trim().toLowerCase();

    return animals.filter((animal) => {
      const matchesContinent = continentFilter === "All" || animal.continent === continentFilter;
      if (!normalizedSearch) {
        return matchesContinent;
      }

      const haystack = [
        animal.name,
        animal.scientificName,
        animal.description,
        animal.habitat,
        animal.continent
      ]
        .join(" ")
        .toLowerCase();

      return matchesContinent && haystack.includes(normalizedSearch);
    });
  }, [continentFilter, searchValue]);

  const favoriteAnimals = useMemo(
    () => favorites.map((id) => animals.find((animal) => animal.id === id)).filter(Boolean),
    [favorites]
  );

  const handlePlay = useCallback(
    (animal) => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }

      if (playingId === animal.id) {
        setPlayingId(null);
        track("sound_stopped", { animal: animal.id });
        return;
      }

      const audio = new Audio(animal.audio);
      audioRef.current = audio;
      audio.play().catch((error) => console.warn("[audio] playback failed", error));
      audio.onended = () => {
        setPlayingId((current) => (current === animal.id ? null : current));
      };

      setPlayingId(animal.id);
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
    await Promise.all(
      animals.map(async (animal) => {
        try {
          const response = await fetch(`/api/images?animal=${encodeURIComponent(animal.name)}`, {
            signal
          });

          if (!response.ok) {
            return;
          }

          const payload = await response.json();
          const photo = payload.photos?.[0];
          if (photo) {
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
    return () => controller.abort();
  }, [loadImages]);

  const handleClearFavorites = useCallback(() => {
    setFavorites([]);
    track("favorites_cleared");
  }, [track]);

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <AppNavbar />
      <main className="mx-auto w-full max-w-6xl flex-1 space-y-16 px-4 py-10 sm:px-6 lg:px-8">
        <Hero />

        <section className="space-y-8" id="collection">
          <div className="space-y-3">
            <h2 className="text-2xl font-semibold text-foreground">Featured collection</h2>
            <p className="text-sm text-default-500">
              Filter by region or search across habitats, behaviors, and scientific names to find the perfect ambient
              soundscape.
            </p>
          </div>

          <Filters
            search={searchValue}
            onSearchChange={setSearchValue}
            continent={continentFilter}
            onContinentChange={setContinentFilter}
            continents={continents}
          />

          <FavoritesBar favorites={favoriteAnimals} onClear={handleClearFavorites} />

          <div className="grid gap-8 md:grid-cols-2">
            {filteredAnimals.map((animal) => (
              <SoundCard
                key={animal.id}
                animal={animal}
                isPlaying={playingId === animal.id}
                isFavorite={favorites.includes(animal.id)}
                onPlay={handlePlay}
                onToggleFavorite={handleToggleFavorite}
                image={images[animal.id]}
              />
            ))}
          </div>

          {filteredAnimals.length === 0 ? (
            <p className="text-center text-sm text-default-400">
              No animals match your filters just yet. Try another search term or reset the filters.
            </p>
          ) : null}
        </section>

        <section className="space-y-6" id="about">
          <Divider />
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr]">
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Crafted for accessibility & performance</h2>
              <p className="text-sm leading-relaxed text-default-500">
                This soundboard is rebuilt from the ground up with Next.js 14 App Router, powered by Bun, and styled with
                NextUI and Tailwind. It ships progressive enhancements, accessible interactions, keyboard-friendly
                controls, and resilient offline-ready audio so anyone can explore the wild wherever they are.
              </p>
              <ul className="grid gap-3 text-sm text-default-600 dark:text-default-500 sm:grid-cols-2">
                <li>• Adaptive color system with light/dark theming</li>
                <li>• Server-side image enrichment via the Pexels API</li>
                <li>• Local analytics with privacy-first insights</li>
                <li>• Offline-capable audio served from the public directory</li>
              </ul>
            </div>
            <StatsOverview stats={stats} />
          </div>
        </section>
      </main>
    </div>
  );
}
