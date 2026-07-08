"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { withBasePath } from "@/lib/base-path";
import WaveformBars from "@/components/waveform-bars";

export default function SoundPlayer({
  animal,
  isOpen,
  onClose,
  isPlaying,
  onTogglePlay,
  onToggleFavorite,
  isFavorite
}) {
  const progressRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);

  const characteristics = animal?.enriched?.characteristics || animal?.enriched?.characteristics || {};

  useEffect(() => {
    if (!isOpen || !animal) return;
    const update = () => {
      const audio = window.__wildlifeAudio;
      if (audio) {
        setCurrentTime(audio.currentTime || 0);
        setDuration(audio.duration || 0);
      }
    };
    const id = setInterval(update, 250);
    return () => clearInterval(id);
  }, [isOpen, animal]);

  const handleSeek = (e) => {
    const audio = window.__wildlifeAudio;
    if (!audio || !duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const pct = clamp((e.clientX - rect.left) / rect.width, 0, 1);
    audio.currentTime = pct * duration;
    setCurrentTime(pct * duration);
  };

  const handleVolume = (e) => {
    const audio = window.__wildlifeAudio;
    const value = Number(e.target.value);
    setVolume(value);
    if (audio) audio.volume = value;
  };

  const handleRate = () => {
    const audio = window.__wildlifeAudio;
    const rates = [0.75, 1, 1.25, 1.5];
    const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
    setPlaybackRate(next);
    if (audio) audio.playbackRate = next;
  };

  if (!animal) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ y: 120, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 120, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className="fixed inset-x-0 bottom-0 z-50 mx-3 mb-3 rounded-3xl border border-white/15 bg-nature-900/85 p-4 shadow-2xl backdrop-blur-2xl md:mx-6 md:mb-6 md:p-5"
          role="region"
          aria-label="Now playing"
        >
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6">
            <div className="flex items-center gap-4 md:w-1/4">
              <div className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-2xl md:h-20 md:w-20">
                <Image
                  src={withBasePath(animal.fallbackImage)}
                  alt={animal.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                  unoptimized
                />
              </div>
              <div className="min-w-0">
                <p className="truncate font-display text-lg font-bold text-white">{animal.name}</p>
                <p className="truncate text-xs italic text-nature-300/80">{animal.scientificName}</p>
                <p className="truncate text-[10px] uppercase tracking-wider text-slate-400">
                  {animal.region || animal.continent}
                </p>
                {characteristics?.slogan && (
                  <p className="truncate text-[10px] italic text-nature-300/70">{characteristics.slogan}</p>
                )}
              </div>
            </div>

            {/* Controls */}
            <div className="flex flex-1 flex-col gap-3">
              <div className="flex items-center justify-center gap-4">
                <PlayerButton active={shuffle} onClick={() => setShuffle((s) => !s)} ariaLabel="Toggle shuffle">
                  ⇄
                </PlayerButton>
                <PlayerButton onClick={() => {}} ariaLabel="Previous">
                  ⏮
                </PlayerButton>
                <motion.button
                  whileHover={{ scale: 1.08 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => onTogglePlay(animal)}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white text-nature-900 text-xl shadow-lg"
                  aria-label={isPlaying ? "Pause" : "Play"}
                >
                  {isPlaying ? "❚❚" : "▶"}
                </motion.button>
                <PlayerButton onClick={() => {}} ariaLabel="Next">
                  ⏭
                </PlayerButton>
                <PlayerButton active={repeat} onClick={() => setRepeat((r) => !r)} ariaLabel="Toggle repeat">
                  ↻
                </PlayerButton>
              </div>

              <div className="flex items-center gap-3">
                <span className="w-10 text-right text-[10px] text-slate-400">{formatTime(currentTime)}</span>
                <div
                  ref={progressRef}
                  onClick={handleSeek}
                  className="relative h-1.5 flex-1 cursor-pointer rounded-full bg-white/10"
                  role="slider"
                  aria-label="Seek"
                  aria-valuenow={currentTime}
                  aria-valuemax={duration || 0}
                  tabIndex={0}
                >
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-nature-400 to-ember-light"
                    style={{ width: `${duration ? (currentTime / duration) * 100 : 0}%` }}
                  />
                </div>
                <span className="w-10 text-[10px] text-slate-400">{formatTime(duration)}</span>
              </div>
            </div>

            {/* Right side extras */}
            <div className="flex items-center justify-between gap-4 md:w-1/4 md:justify-end">
              <WaveformBars isPlaying={isPlaying} compact className="text-nature-300/60" />

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-400">🔊</span>
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={handleVolume}
                  aria-label="Volume"
                  className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-white/20 accent-nature-400"
                />
              </div>

              <div className="flex items-center gap-2">
                <PlayerButton onClick={() => onToggleFavorite(animal.id)} active={isFavorite} ariaLabel="Favorite">
                  {isFavorite ? "★" : "☆"}
                </PlayerButton>
                <PlayerButton onClick={handleRate} ariaLabel="Playback speed">
                  {playbackRate}x
                </PlayerButton>
                <PlayerButton onClick={onClose} ariaLabel="Close player">
                  ✕
                </PlayerButton>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function PlayerButton({ children, onClick, active, ariaLabel }) {
  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={onClick}
      aria-label={ariaLabel}
      aria-pressed={active}
      className={`flex h-9 w-9 items-center justify-center rounded-full text-sm transition-colors ${
        active
          ? "bg-nature-500/30 text-nature-200"
          : "text-slate-300 hover:bg-white/10 hover:text-white"
      }`}
    >
      {children}
    </motion.button>
  );
}

function formatTime(seconds) {
  if (!seconds || !isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function clamp(n, min, max) {
  return Math.min(Math.max(n, min), max);
}
