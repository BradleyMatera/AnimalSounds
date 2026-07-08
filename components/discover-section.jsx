"use client";

import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { withBasePath } from "@/lib/base-path";

const DISCOVER_SECTIONS = [
  { id: "trending", title: "Trending Animals", filter: () => true },
  { id: "africa", title: "Sounds of Africa", filter: (a) => a.continent === "Africa" },
  { id: "forest", title: "Forest Choir", filter: (a) => a.habitat === "Forest" },
  { id: "recently", title: "Recently Added", filter: () => true }
];

export default function DiscoverSection({ animals, onPlay, onToggleFavorite, favorites, playingId }) {
  const [shuffled, setShuffled] = useState(animals);

  useEffect(() => {
    const copy = [...animals];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    setShuffled(copy);
  }, [animals]);

  return (
    <section className="space-y-12" aria-labelledby="discover-heading">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-nature-400">
          Curated for you
        </span>
        <h2 id="discover-heading" className="font-display text-3xl font-bold text-white md:text-4xl">
          Discover
        </h2>
      </div>

      {DISCOVER_SECTIONS.map((section) => (
        <DiscoverRow
          key={section.id}
          title={section.title}
          items={shuffled.filter(section.filter).slice(0, 8)}
          onPlay={onPlay}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          playingId={playingId}
        />
      ))}
    </section>
  );
}

function DiscoverRow({ title, items, onPlay, onToggleFavorite, favorites, playingId }) {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: direction * 280, behavior: "smooth" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-display text-xl font-semibold text-white">{title}</h3>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            aria-label={`Scroll ${title} left`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
          >
            ←
          </button>
          <button
            onClick={() => scroll(1)}
            aria-label={`Scroll ${title} right`}
            className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white transition-colors hover:bg-white/10"
          >
            →
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide scroll-smooth"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((animal, i) => (
          <CompactCard
            key={`${title}-${animal.id}`}
            animal={animal}
            index={i}
            isPlaying={playingId === animal.id}
            isFavorite={favorites.includes(animal.id)}
            onPlay={onPlay}
            onToggleFavorite={onToggleFavorite}
          />
        ))}
      </div>
    </div>
  );
}

function CompactCard({ animal, index, isPlaying, isFavorite, onPlay, onToggleFavorite }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.05 }}
      className="group relative w-[260px] flex-shrink-0 overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-all hover:-translate-y-1 hover:border-white/20 hover:shadow-card-hover"
    >
      <div className="relative aspect-square overflow-hidden">
        <Image
          src={withBasePath(animal.fallbackImage)}
          alt={animal.name}
          fill
          sizes="260px"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          unoptimized
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/30 to-transparent" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(animal.id);
          }}
          aria-label={isFavorite ? `Remove ${animal.name} from favorites` : `Save ${animal.name}`}
          className={`absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full border transition-all ${
            isFavorite ? "border-ember-light/30 bg-ember-light/20 text-ember-light" : "border-white/20 bg-black/30 text-white/70 hover:bg-white/20"
          }`}
        >
          {isFavorite ? "★" : "☆"}
        </button>

        <button
          onClick={() => onPlay(animal)}
          aria-label={isPlaying ? `Pause ${animal.name}` : `Play ${animal.name}`}
          className={`absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-xl text-white shadow-2xl transition-all hover:scale-110 ${
            isPlaying ? "bg-ember-500/90 animate-pulse-slow" : "bg-nature-500/90 opacity-0 group-hover:opacity-100"
          }`}
        >
          {isPlaying ? "❚❚" : "▶"}
        </button>
      </div>

      <div className="p-4">
        <p className="font-display text-lg font-semibold text-white">{animal.name}</p>
        <p className="text-xs italic text-nature-300/80">{animal.scientificName}</p>
        <div className="mt-3 flex items-center gap-2 text-[10px] uppercase tracking-wider text-slate-400">
          <span className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5">{animal.habitat}</span>
          <span>{animal.soundType}</span>
        </div>
      </div>
    </motion.div>
  );
}
