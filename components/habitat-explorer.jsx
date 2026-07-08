"use client";

import { motion } from "framer-motion";
import { HABITAT_DATA } from "@/data/animals";

export default function HabitatExplorer({ onSelectHabitat, activeHabitat = "All" }) {
  return (
    <section id="habitats" className="space-y-6" aria-labelledby="habitats-heading">
      <div className="flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-nature-400">
          Browse by world
        </span>
        <h2 id="habitats-heading" className="font-display text-3xl font-bold text-white md:text-4xl">
          Habitat Explorer
        </h2>
        <p className="max-w-2xl text-sm text-slate-400">
          Every habitat has a unique soundscape. Choose one to filter the collection.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <motion.button
          whileHover={{ y: -6, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectHabitat("All")}
          className={`relative overflow-hidden rounded-3xl border p-5 text-left transition-all ${
            activeHabitat === "All"
              ? "border-nature-400/40 bg-gradient-to-br from-nature-500/20 to-nature-700/10"
              : "border-white/10 bg-white/[0.03] hover:border-white/20"
          }`}
        >
          <div className="relative z-10">
            <p className="font-display text-lg font-semibold text-white">All Habitats</p>
            <p className="mt-1 text-xs text-slate-400">Explore every soundscape</p>
          </div>
        </motion.button>

        {HABITAT_DATA.map((habitat, index) => (
          <HabitatCard
            key={habitat.id}
            habitat={habitat}
            index={index}
            isActive={activeHabitat === habitat.name}
            onClick={() => onSelectHabitat(habitat.name)}
          />
        ))}
      </div>
    </section>
  );
}

function HabitatCard({ habitat, index, isActive, onClick }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative overflow-hidden rounded-3xl border p-5 text-left transition-all ${
        isActive ? "border-white/30 shadow-glow" : "border-white/10 hover:border-white/25"
      }`}
    >
      <div className={`absolute inset-0 bg-gradient-to-br ${habitat.gradient} opacity-40`} aria-hidden="true" />
      <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/60 to-transparent" aria-hidden="true" />

      <div className="relative z-10 flex h-full flex-col">
        <div className="mb-3 flex items-center justify-between">
          <span className="rounded-full border border-white/20 bg-white/10 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-white">
            {habitat.animalCount} animals
          </span>
          {isActive && (
            <span className="h-2 w-2 rounded-full bg-nature-400 animate-pulse" aria-hidden="true" />
          )}
        </div>

        <div className="mt-auto">
          <p className="font-display text-2xl font-bold text-white">{habitat.name}</p>
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-slate-300">{habitat.description}</p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-medium uppercase tracking-wider text-nature-300">
            <span>{habitat.soundCount} sounds</span>
            <span className="text-white/30">•</span>
            <span className="transition-transform group-hover:translate-x-1">Explore →</span>
          </div>
        </div>
      </div>
    </motion.button>
  );
}
