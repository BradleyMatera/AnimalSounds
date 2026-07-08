"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "@nextui-org/react";
import ThemeToggle from "@/components/theme-toggle";

const navLinks = [
  { label: "Explore", href: "#explore" },
  { label: "Habitats", href: "#habitats" },
  { label: "Animals", href: "#collection" },
  { label: "Favorites", href: "#favorites" },
  { label: "About", href: "#about" }
];

export default function AppNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120, damping: 20 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-nature-950/75 backdrop-blur-2xl border-b border-white/10 shadow-lg shadow-black/20"
          : "bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="#" className="group flex items-center gap-3 text-slate-50">
          <motion.span
            className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-nature-500 to-nature-700 text-xl shadow-glow"
            whileHover={{ scale: 1.05, rotate: -4 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
            aria-hidden="true"
          >
            🦌
          </motion.span>
          <div className="flex flex-col">
            <span className="font-display text-lg font-semibold tracking-tight">Wildlife Sounds</span>
            <span className="text-[11px] uppercase tracking-[0.2em] text-nature-300/80">Nature through sound</span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {navLinks.map((item) => (
            <NavLink key={item.href} href={item.href}>
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <button
            className="lg:hidden relative z-50 flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5"
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            onClick={() => setMobileOpen((v) => !v)}
          >
            <span className="sr-only">Menu</span>
            <div className="flex h-4 w-5 flex-col justify-between">
              <motion.span
                animate={mobileOpen ? { rotate: 45, y: 7 } : { rotate: 0, y: 0 }}
                className="h-0.5 w-full bg-slate-100 origin-center"
              />
              <motion.span
                animate={mobileOpen ? { opacity: 0 } : { opacity: 1 }}
                className="h-0.5 w-full bg-slate-100"
              />
              <motion.span
                animate={mobileOpen ? { rotate: -45, y: -7 } : { rotate: 0, y: 0 }}
                className="h-0.5 w-full bg-slate-100 origin-center"
              />
            </div>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden overflow-hidden border-b border-white/10 bg-nature-950/95 backdrop-blur-2xl"
          >
            <div className="flex flex-col gap-2 px-4 pb-6 pt-2">
              {navLinks.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  className="rounded-xl px-4 py-3 text-sm font-medium text-slate-200 transition-colors hover:bg-white/5 hover:text-white"
                  onClick={() => setMobileOpen(false)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

function NavLink({ href, children }) {
  return (
    <a
      href={href}
      className="group relative px-4 py-2 text-sm font-medium text-slate-300 transition-colors hover:text-white"
    >
      {children}
      <span className="absolute bottom-0 left-1/2 h-0.5 w-0 -translate-x-1/2 rounded-full bg-nature-400 transition-all duration-300 group-hover:w-3/4" />
    </a>
  );
}
