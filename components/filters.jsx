"use client";

import { useState, useRef, useEffect, useId } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Input, Select, SelectItem } from "@nextui-org/react";

const popularSearches = ["Lion", "Elephant", "Bird", "Frog", "Roar", "Forest"];

export default function Filters({
  search,
  onSearchChange,
  continent,
  onContinentChange,
  continents,
  habitat,
  onHabitatChange,
  habitats,
  soundType,
  onSoundTypeChange,
  soundTypes,
  onSortChange,
  sort,
  sortOptions
}) {
  const searchId = useId();
  const [recentSearches, setRecentSearches] = useState([]);
  const [focused, setFocused] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const stored = window.localStorage.getItem("wildlife-sounds-recent-searches");
      if (stored) setRecentSearches(JSON.parse(stored).slice(0, 4));
    } catch {}
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setFocused(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const commitSearch = (value) => {
    onSearchChange(value);
    setFocused(false);
    if (!value.trim()) return;
    setRecentSearches((prev) => {
      const next = [value, ...prev.filter((s) => s.toLowerCase() !== value.toLowerCase())].slice(0, 4);
      try {
        window.localStorage.setItem("wildlife-sounds-recent-searches", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const clearSearch = () => {
    onSearchChange("");
    setFocused(false);
  };

  return (
    <div className="space-y-5" ref={wrapperRef}>
      <div className="grid gap-4 lg:grid-cols-[1fr_200px_200px_200px_160px]">
        <div className="relative">
          <Input
            id={searchId}
            value={search}
            onValueChange={onSearchChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") commitSearch(search);
            }}
            onFocus={() => setFocused(true)}
            type="search"
            variant="bordered"
            label="Search wildlife"
            placeholder="Name, habitat, sound type, or region..."
            classNames={{
              inputWrapper:
                "bg-white/5 border-white/10 hover:border-white/20 rounded-2xl h-12 text-slate-100",
              label: "text-slate-400"
            }}
            startContent={<span aria-hidden="true" className="text-lg">🔍</span>}
            endContent={
              search ? (
                <button
                  onClick={clearSearch}
                  aria-label="Clear search"
                  className="text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              ) : null
            }
          />

          <AnimatePresence>
            {focused && !search && (recentSearches.length > 0 || popularSearches.length > 0) && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                className="absolute left-0 right-0 top-full z-20 mt-2 rounded-2xl border border-white/10 bg-nature-900/95 backdrop-blur-xl p-4 shadow-2xl"
              >
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">Recent</p>
                    <div className="flex flex-wrap gap-2">
                      {recentSearches.map((term) => (
                        <button
                          key={term}
                          onClick={() => commitSearch(term)}
                          className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <div>
                  <p className="mb-2 text-[10px] uppercase tracking-[0.2em] text-slate-500">Popular</p>
                  <div className="flex flex-wrap gap-2">
                    {popularSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => commitSearch(term)}
                        className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300 hover:bg-white/10 hover:text-white"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <Select
          variant="bordered"
          selectedKeys={[continent]}
          onSelectionChange={(keys) => onContinentChange(Array.from(keys)[0] || "All")}
          label="Region"
          classNames={{
            trigger:
              "bg-white/5 border-white/10 hover:border-white/20 rounded-2xl h-12 text-slate-100",
            label: "text-slate-400",
            popoverContent: "bg-nature-900 border-white/10"
          }}
        >
          {continents.map((option) => (
            <SelectItem key={option} value={option} className="text-slate-100 data-[hover=true]:bg-white/10">
              {option}
            </SelectItem>
          ))}
        </Select>

        <Select
          variant="bordered"
          selectedKeys={[habitat || "All"]}
          onSelectionChange={(keys) => onHabitatChange?.(Array.from(keys)[0] || "All")}
          label="Habitat"
          classNames={{
            trigger:
              "bg-white/5 border-white/10 hover:border-white/20 rounded-2xl h-12 text-slate-100",
            label: "text-slate-400",
            popoverContent: "bg-nature-900 border-white/10"
          }}
        >
          {(habitats || []).map((option) => (
            <SelectItem key={option} value={option} className="text-slate-100 data-[hover=true]:bg-white/10">
              {option}
            </SelectItem>
          ))}
        </Select>

        <Select
          variant="bordered"
          selectedKeys={[soundType || "All"]}
          onSelectionChange={(keys) => onSoundTypeChange?.(Array.from(keys)[0] || "All")}
          label="Sound Type"
          classNames={{
            trigger:
              "bg-white/5 border-white/10 hover:border-white/20 rounded-2xl h-12 text-slate-100",
            label: "text-slate-400",
            popoverContent: "bg-nature-900 border-white/10"
          }}
        >
          {soundTypes.map((option) => (
            <SelectItem key={option} value={option} className="text-slate-100 data-[hover=true]:bg-white/10">
              {option}
            </SelectItem>
          ))}
        </Select>

        <Select
          variant="bordered"
          selectedKeys={[sort || "name"]}
          onSelectionChange={(keys) => onSortChange?.(Array.from(keys)[0] || "name")}
          label="Sort"
          classNames={{
            trigger:
              "bg-white/5 border-white/10 hover:border-white/20 rounded-2xl h-12 text-slate-100",
            label: "text-slate-400",
            popoverContent: "bg-nature-900 border-white/10"
          }}
        >
          {(sortOptions || [
            { key: "name", label: "Name" },
            { key: "habitat", label: "Habitat" },
            { key: "continent", label: "Region" }
          ]).map((option) => (
            <SelectItem key={option.key} value={option.key} className="text-slate-100 data-[hover=true]:bg-white/10">
              {option.label}
            </SelectItem>
          ))}
        </Select>
      </div>
    </div>
  );
}


