"use client";

import { motion } from "framer-motion";

const STAT_LAYOUT = [
  { key: "totalSessions", label: "Sessions", accent: "text-nature-300" },
  { key: "totalInteractions", label: "Sounds played", accent: "text-river" },
  { key: "favoriteCount", label: "Favorites", accent: "text-ember-light" }
];

export default function StatsOverview({ stats }) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 backdrop-blur-md">
      <div className="mb-5 flex flex-col gap-1">
        <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Your activity</span>
        <h3 className="font-display text-xl font-semibold text-white">Personal listening stats</h3>
      </div>

      <dl className="grid gap-4 sm:grid-cols-3">
        {STAT_LAYOUT.map((item, i) => (
          <motion.div
            key={item.key}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl bg-white/5 p-4"
          >
            <dt className="text-[10px] uppercase tracking-[0.2em] text-slate-500">{item.label}</dt>
            <dd className={`font-display text-3xl font-bold ${item.accent}`}>
              {stats[item.key] ?? 0}
            </dd>
          </motion.div>
        ))}
      </dl>

      {stats.lastPlayed ? (
        <p className="mt-5 text-sm text-slate-400">
          Last played sound: <span className="font-semibold text-white">{stats.lastPlayed}</span>
        </p>
      ) : (
        <p className="mt-5 text-sm text-slate-400">
          Press play on any card to start building your personal history.
        </p>
      )}
    </div>
  );
}
