"use client";

import { motion } from "framer-motion";
import { withBasePath } from "@/lib/base-path";

export default function FavoritesBar({ favorites, onClear, onSelect }) {
  if (!favorites.length) {
    return null;
  }

  return (
    <motion.div
      id="favorites"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-4"
    >
      <div className="flex flex-wrap items-center gap-4">
        <div>
          <p className="font-display text-base font-semibold text-white">Your Favorites</p>
          <p className="text-xs text-slate-400">
            {favorites.length} saved sound{favorites.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {favorites.map((animal) => (
            <motion.button
              key={animal.id}
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSelect?.(animal)}
              className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 pl-1 pr-3 py-1 text-xs text-slate-200 transition-colors hover:bg-white/10 hover:text-white"
              aria-label={`Play ${animal.name}`}
            >
              <img
                src={withBasePath(animal.fallbackImage)}
                alt=""
                className="h-7 w-7 rounded-full object-cover"
              />
              {animal.name}
            </motion.button>
          ))}
        </div>

        <button
          onClick={onClear}
          className="ml-auto rounded-xl px-3 py-1.5 text-xs font-medium text-rose-300 transition-colors hover:bg-rose-500/10"
        >
          Clear
        </button>
      </div>
    </motion.div>
  );
}
