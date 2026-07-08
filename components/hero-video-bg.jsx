"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HERO_VIDEOS, HERO_VIDEO_DURATION_MS } from "@/lib/hero-videos";

export default function HeroVideoBackground() {
  const [index, setIndex] = useState(0);
  const [mounted, setMounted] = useState(false);
  const videoRefs = useRef([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Advance slideshow every HERO_VIDEO_DURATION_MS
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => {
      setIndex((prev) => (prev + 1) % HERO_VIDEOS.length);
    }, HERO_VIDEO_DURATION_MS);
    return () => clearInterval(id);
  }, [mounted]);

  // Play the active video and pause the others
  useEffect(() => {
    videoRefs.current.forEach((video, i) => {
      if (!video) return;
      if (i === index) {
        video.currentTime = 0;
        video.muted = true;
        video.volume = 0;
        video.playbackRate = 0.85;
        const playPromise = video.play();
        if (playPromise) playPromise.catch(() => {});
      } else {
        video.pause();
        try {
          video.currentTime = 0;
        } catch {}
      }
    });
  }, [index]);

  if (!mounted) {
    return (
      <div
        className="absolute inset-0 bg-nature-900"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
      <AnimatePresence mode="popLayout">
        {HERO_VIDEOS.map((video, i) =>
          i === index ? (
            <motion.div
              key={video.id}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-0"
            >
              <video
                ref={(el) => { videoRefs.current[i] = el; }}
                src={video.mp4}
                poster={video.poster}
                muted
                loop
                playsInline
                autoPlay
                preload="auto"
                disablePictureInPicture
                disableRemotePlayback
                className="h-full w-full object-cover"
                onLoadedMetadata={(e) => {
                  const v = e.currentTarget;
                  v.muted = true;
                  v.volume = 0;
                  v.play().catch(() => {});
                }}
              />
            </motion.div>
          ) : null
        )}
      </AnimatePresence>

      {/* Darkening overlay so text remains readable */}
      <div className="absolute inset-0 bg-nature-950/60" />
      <div className="absolute inset-0 bg-gradient-to-t from-nature-950 via-nature-950/40 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-r from-nature-950/50 via-transparent to-nature-950/50" />
    </div>
  );
}
