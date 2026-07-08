"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

export default function WaveformBars({ isPlaying, compact = false, barCount = compact ? 24 : 48, className = "" }) {
  const bars = useMemo(() => {
    const rand = seededRandom(42);
    return Array.from({ length: barCount }, (_, i) => {
      const height = 25 + rand() * 75;
      const duration = 0.5 + rand() * 0.5;
      return { id: i, height, duration };
    });
  }, [barCount]);

  return (
    <div
      className={`flex items-center gap-[2px] ${compact ? "h-6" : "h-10"} ${className}`}
      aria-hidden="true"
    >
      {bars.map(({ id, height, duration }) => {
        const delay = id * 0.04;
        return (
          <motion.div
            key={id}
            className="w-[3px] rounded-full bg-current"
            style={{
              height: `${height}%`,
              color: "inherit"
            }}
            animate={
              isPlaying
                ? {
                    height: [`${height * 0.3}%`, `${height}%`, `${height * 0.5}%`, `${height * 0.8}%`]
                  }
                : { height: `${height}%` }
            }
            transition={
              isPlaying
                ? {
                    duration,
                    repeat: Infinity,
                    repeatType: "reverse",
                    ease: "easeInOut",
                    delay
                  }
                : { duration: 0.3 }
            }
          />
        );
      })}
    </div>
  );
}
