"use client";

import { Switch } from "@nextui-org/react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function SunIcon(props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M12 18a6 6 0 1 0 0-12a6 6 0 0 0 0 12Z"
      />
      <path
        fill="currentColor"
        d="M12 3a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0 20a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm9-9a1 1 0 0 1-1 1h-1a1 1 0 1 1 0-2h1a1 1 0 0 1 1 1ZM5 12a1 1 0 0 1-1 1H3a1 1 0 0 1 0-2h1a1 1 0 0 1 1 1Zm13.66 7.66a1 1 0 0 1-1.41 0l-.7-.7a1 1 0 1 1 1.41-1.42l.7.71a1 1 0 0 1 0 1.41ZM7.46 5.46a1 1 0 0 1-1.42 0l-.7-.7A1 1 0 0 1 6.75 3.3l.71.7a1 1 0 0 1 0 1.42Zm11.2-2.16a1 1 0 0 1 0 1.42l-.7.7A1 1 0 0 1 16.54 4.7l.7-.71a1 1 0 0 1 1.42 0ZM5.46 17.54a1 1 0 0 1-1.42 0l-.7-.7a1 1 0 0 1 1.41-1.42l.71.71a1 1 0 0 1 0 1.41Z"
      />
    </svg>
  );
}

function MoonIcon(props) {
  return (
    <svg
      aria-hidden="true"
      focusable="false"
      role="img"
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      {...props}
    >
      <path
        fill="currentColor"
        d="M21 12.79A9 9 0 0 1 11.21 3c0-.48.06-.95.16-1.41A1 1 0 0 0 10.35.06A10.99 10.99 0 1 0 23.94 13.65a1 1 0 0 0-1.53-1c-.46.1-.93.16-1.41.16Z"
      />
    </svg>
  );
}

export default function ThemeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const isDark = (theme ?? resolvedTheme) === "dark";
  const label = `Switch to ${isDark ? "light" : "dark"} mode`;

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-200 transition-colors hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-nature-400/50"
      aria-label={label}
      onClick={() => setTheme(isDark ? "light" : "dark")}
    >
      <motion.span
        key={isDark ? "moon" : "sun"}
        initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
        animate={{ rotate: 0, opacity: 1, scale: 1 }}
        exit={{ rotate: 90, opacity: 0, scale: 0.6 }}
        transition={{ duration: 0.2 }}
        className="text-lg"
      >
        {isDark ? <MoonIcon width="1.1em" height="1.1em" /> : <SunIcon width="1.1em" height="1.1em" />}
      </motion.span>
    </motion.button>
  );
}
