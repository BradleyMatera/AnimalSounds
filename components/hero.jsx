"use client";

import { useMemo, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@nextui-org/react";
import Link from "next/link";
import animals from "@/data/animals";
import HeroVideoBackground from "@/components/hero-video-bg";

export default function Hero() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const dailyAnimal = useMemo(() => {
    const daySeed = Math.floor(Date.now() / 86400000);
    return animals[daySeed % animals.length];
  }, []);

  return (
    <section
      id="explore"
      className="relative flex min-h-[100svh] items-center justify-center overflow-hidden"
      aria-label="Explore wildlife through sound"
    >
      {/* Slideshow video background */}
      <HeroVideoBackground />

      {/* Animated fog layers */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -inset-[10%] animate-fog-drift bg-[radial-gradient(ellipse_60%_40%_at_30%_80%,rgba(148,163,184,0.12),transparent)]" />
        <div className="absolute -inset-[10%] animate-fog-drift bg-[radial-gradient(ellipse_50%_35%_at_70%_85%,rgba(109,215,147,0.10),transparent)]" style={{ animationDirection: "reverse", animationDuration: "40s" }} />
      </div>

      {/* Dust particles */}
      {mounted && <DustParticles />}

      {/* Sunlight rays */}
      <div className="pointer-events-none absolute inset-0" aria-hidden="true">
        <div className="absolute -left-1/4 -top-1/4 h-[150%] w-[50%] rotate-12 bg-gradient-to-b from-ember-light/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute -right-1/4 -top-1/4 h-[150%] w-[40%] -rotate-12 bg-gradient-to-b from-nature-300/8 via-transparent to-transparent blur-3xl" />
      </div>

      {/* Hero content */}
      <div className="relative z-10 mx-auto max-w-5xl px-4 text-center sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 backdrop-blur-sm"
        >
          <span className="h-2 w-2 rounded-full bg-nature-400 animate-pulse" />
          <span className="text-xs font-medium uppercase tracking-[0.15em] text-nature-200">Daily discovery: {dailyAnimal.name}</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="font-display text-5xl font-bold leading-[1.05] tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl"
        >
          Explore Wildlife{" "}
          <span className="text-gradient">Through Sound</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-slate-300 sm:text-xl"
        >
          Discover hundreds of professionally recorded animal sounds from around the world.
          Immerse yourself in nature with elegant design and tactile interaction.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Button
            as={Link}
            href="#collection"
            size="lg"
            className="h-14 rounded-full bg-gradient-to-r from-nature-500 to-nature-600 px-8 text-base font-semibold text-white shadow-glow transition-all hover:shadow-glow-lg hover:scale-[1.02]"
          >
            Start Exploring
          </Button>
          <Button
            as={Link}
            href="#collection"
            size="lg"
            variant="bordered"
            className="h-14 rounded-full border-white/20 px-8 text-base font-semibold text-white transition-all hover:bg-white/10 hover:scale-[1.02]"
          >
            Random Animal
          </Button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 1 }}
          className="mt-16 grid grid-cols-3 gap-6 border-t border-white/10 pt-8 sm:gap-10"
        >
          <Stat value="6+" label="Animals" />
          <Stat value="4" label="Habitats" />
          <Stat value="∞" label="Wonder" />
        </motion.div>
      </div>

      <div className="pointer-events-none absolute inset-0 bg-hero-vignette" aria-hidden="true" />

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 z-10 flex -translate-x-1/2 gap-2" aria-hidden="true">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-1 w-8 rounded-full bg-white/30"
          />
        ))}
      </div>
    </section>
  );
}

function Stat({ value, label }) {
  return (
    <div className="text-center">
      <p className="font-display text-3xl font-bold text-white sm:text-4xl">{value}</p>
      <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{label}</p>
    </div>
  );
}

function DustParticles() {
  const particles = useMemo(() => {
    const rand = (seed) => {
      let s = seed % 2147483647;
      if (s <= 0) s += 2147483646;
      return () => (s = (s * 16807) % 2147483647) / 2147483647;
    };
    const rng = rand(7);
    return Array.from({ length: 24 }, (_, i) => ({
      id: i,
      size: 1 + Math.floor(rng() * 3),
      left: Math.floor(rng() * 100),
      top: Math.floor(rng() * 100),
      opacity: 0.1 + rng() * 0.3,
      distanceY: 20 + Math.floor(rng() * 60),
      distanceX: Math.floor((rng() - 0.5) * 40),
      duration: 10 + rng() * 10,
      delay: rng() * 5
    }));
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {particles.map((p, i) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-white"
          style={{
            width: p.size,
            height: p.size,
            left: `${p.left}%`,
            top: `${p.top}%`,
            opacity: p.opacity,
            filter: "blur(0.5px)"
          }}
          animate={{
            y: [0, -p.distanceY],
            x: [0, p.distanceX],
            opacity: [0.1, 0.6, 0.1]
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: p.delay
          }}
        />
      ))}
    </div>
  );
}
