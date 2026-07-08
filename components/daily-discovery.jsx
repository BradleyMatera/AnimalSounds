"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import animals, { HABITAT_DATA } from "@/data/animals";
import { withBasePath } from "@/lib/base-path";

export default function DailyDiscovery({ onPlay, onSelectHabitat }) {
  const daily = useMemo(() => {
    const daySeed = Math.floor(Date.now() / 86400000);
    const animal = animals[daySeed % animals.length];
    const habitat = HABITAT_DATA[daySeed % HABITAT_DATA.length];
    return { animal, habitat };
  }, []);

  return (
    <section className="rounded-3xl border border-white/10 bg-gradient-to-br from-nature-800/40 to-nature-950/60 p-6 md:p-8" aria-labelledby="daily-heading">
      <div className="mb-6 flex flex-col gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-ember-light">
          Daily Discovery
        </span>
        <h2 id="daily-heading" className="font-display text-2xl font-bold text-white md:text-3xl">
          Today’s Nature Spotlight
        </h2>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <motion.div
          whileHover={{ y: -4 }}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div className="absolute inset-0 opacity-30">
            <img
              src={withBasePath(daily.animal.fallbackImage)}
              alt=""
              className="h-full w-full object-cover"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/80 to-nature-950/40" />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-nature-300">Animal of the Day</p>
            <p className="mt-2 font-display text-2xl font-bold text-white">{daily.animal.name}</p>
            <p className="text-sm italic text-slate-300">{daily.animal.scientificName}</p>
            <p className="mt-2 line-clamp-2 text-xs text-slate-400">{daily.animal.funFact}</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ y: -4 }}
          onClick={() => onSelectHabitat?.(daily.habitat.name)}
          className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 text-left"
        >
          <div className={`absolute inset-0 bg-gradient-to-br ${daily.habitat.gradient} opacity-30`} aria-hidden="true" />
          <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/80 to-nature-950/40" />
          <div className="relative z-10">
            <p className="text-[10px] uppercase tracking-[0.2em] text-nature-300">Habitat of the Day</p>
            <p className="mt-2 font-display text-2xl font-bold text-white">{daily.habitat.name}</p>
            <p className="mt-2 line-clamp-2 text-xs text-slate-400">{daily.habitat.description}</p>
            <p className="mt-3 text-xs text-nature-300">Explore →</p>
          </div>
        </motion.button>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="flex flex-col justify-between rounded-2xl border border-white/10 bg-white/5 p-5"
        >
          <div>
            <p className="text-[10px] uppercase tracking-[0.2em] text-nature-300">Listening Streak</p>
            <p className="mt-2 font-display text-4xl font-bold text-white">3 days</p>
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="text-lg">🌿</span>
              <span>Forest Explorer badge earned</span>
            </div>
            <div className="flex items-center gap-3 text-xs text-slate-300">
              <span className="text-lg">🔊</span>
              <span>Played 12 sounds this week</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
