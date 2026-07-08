"use client";

import { useMemo, useRef } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { withBasePath } from "@/lib/base-path";
import { statusBadges } from "@/data/animals";
import WaveformBars from "@/components/waveform-bars";

export default function SoundCard({
  animal,
  isPlaying,
  isFavorite,
  onPlay,
  onToggleFavorite,
  image,
  compact = false,
  details
}) {
  const imageSrc = image?.url || withBasePath(animal.fallbackImage);
  const imageAlt = image?.alt || `${animal.name} in its natural habitat`;
  const statusColor = statusBadges[animal.status] || "default";
  const characteristics = details?.characteristics || animal.enriched?.characteristics;
  const hasAnimated = useRef(false);

  return (
    <motion.article
      initial={hasAnimated.current ? false : { opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      onViewportEnter={() => { hasAnimated.current = true; }}
      className={`card-nature group flex flex-col ${compact ? "max-w-[280px]" : ""}`}
      role="article"
      aria-label={`${animal.name}, ${animal.scientificName}`}
    >
      {/* Image area */}
      <div className="relative aspect-[16/10] overflow-hidden rounded-t-3xl">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${animal.accent} opacity-60 mix-blend-overlay`}
          aria-hidden="true"
        />
        <Image
          src={imageSrc}
          alt={imageAlt}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          priority={animal.id === "lion"}
          unoptimized={!image?.url}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-nature-950/90 via-nature-950/20 to-transparent" />

        {/* Top badges */}
        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <StatusBadge status={animal.status} color={statusColor} />
        </div>

        {/* Favorite button */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggleFavorite(animal.id)}
          aria-pressed={isFavorite}
          aria-label={isFavorite ? `Remove ${animal.name} from favorites` : `Save ${animal.name} to favorites`}
          className={`absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border transition-all ${
            isFavorite
              ? "border-ember-light/30 bg-ember-light/20 text-ember-light shadow-lg"
              : "border-white/20 bg-black/30 text-white/80 backdrop-blur-sm hover:bg-white/20"
          }`}
        >
          {isFavorite ? "★" : "☆"}
        </motion.button>

        {/* Play overlay */}
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPlay(animal)}
            className={`flex h-16 w-16 items-center justify-center rounded-full text-2xl text-white shadow-2xl transition-all ${
              isPlaying
                ? "bg-ember-500/90 animate-pulse-slow"
                : "bg-nature-500/90 hover:bg-nature-400"
            }`}
            aria-label={isPlaying ? `Stop ${animal.name} sound` : `Play ${animal.name} sound`}
          >
            {isPlaying ? "❚❚" : "▶"}
          </motion.button>
        </div>

        {/* Bottom caption */}
        <div className="absolute inset-x-0 bottom-0 p-4">
          <p className="text-xs text-white/60">
            {image?.photographer || "Wildlife Sounds"}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col gap-3 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold text-white">{animal.name}</h3>
            <p className="text-sm italic text-nature-300/80">{animal.scientificName}</p>
          </div>
          <span className="text-2xl" role="img" aria-hidden="true">
            {animal.emoji}
          </span>
        </div>

        <p className="line-clamp-2 text-sm leading-relaxed text-slate-300/90">
          {animal.description}
        </p>

        {characteristics && (
          <div className="flex flex-wrap gap-2 pt-1">
            {characteristics.diet && <MiniFact icon="🍖" value={characteristics.diet} />}
            {characteristics.lifespan && <MiniFact icon="⏳" value={characteristics.lifespan} />}
            {characteristics.top_speed && <MiniFact icon="⚡" value={characteristics.top_speed} />}
          </div>
        )}

        {/* Mini waveform */}
        <div className="flex items-center gap-3 py-1">
          <WaveformBars isPlaying={isPlaying} compact />
          <span className="text-xs font-medium text-nature-300/80 uppercase tracking-wider">
            {animal.soundType}
          </span>
        </div>

        {/* Tags */}
        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          <Tag>{animal.habitat}</Tag>
          <Tag>{animal.continent}</Tag>
        </div>
      </div>
    </motion.article>
  );
}

function StatusBadge({ status, color }) {
  const colorMap = {
    success: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
    warning: "bg-amber-500/20 text-amber-300 border-amber-500/30",
    danger: "bg-rose-500/20 text-rose-300 border-rose-500/30",
    primary: "bg-nature-500/20 text-nature-200 border-nature-500/30",
    default: "bg-white/10 text-slate-200 border-white/20"
  };

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider ${colorMap[color] || colorMap.default}`}
    >
      {status}
    </span>
  );
}

function Tag({ children }) {
  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider text-slate-300">
      {children}
    </span>
  );
}

function MiniFact({ icon, value }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-2 py-1 text-[10px] font-medium text-slate-300">
      <span aria-hidden="true">{icon}</span>
      {value}
    </span>
  );
}
