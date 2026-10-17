"use client";

import { useEffect, useState } from "react";
import { Search, MapPin } from "lucide-react";
import { searchCities } from "../lib/weather";

export default function SearchBar({ onSearch, loading, error }) {
  const [city, setCity] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const value = city.trim();

    if (value.length < 2) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    let cancelled = false;

    const timer = setTimeout(async () => {
      const results = await searchCities(value);

      if (!cancelled) {
        setSuggestions(results);
        setShowSuggestions(true);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [city]);

  function handleSubmit(e) {
    e.preventDefault();

    if (!city.trim() || loading) return;

    setShowSuggestions(false);
    onSearch(city.trim());
  }

  function handleSelect(suggestion) {
    const cityName = suggestion.name;

    setCity(cityName);
    setSuggestions([]);
    setShowSuggestions(false);
    onSearch(cityName);
  }

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md flex-1">
      <div className="flex h-11 w-full items-center gap-3 rounded-xl border border-white/10 bg-[#12162d] px-4 transition focus-within:border-cyan-400/50">
        <input
          type="text"
          placeholder="Search for a city..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onFocus={() => {
            if (suggestions.length > 0) {
              setShowSuggestions(true);
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setShowSuggestions(false);
            }
          }}
          autoComplete="off"
          aria-label="Search for a city"
          aria-expanded={showSuggestions}
          className="w-full bg-transparent text-sm text-white placeholder:text-slate-400 outline-none"
        />

        <button
          type="submit"
          disabled={loading}
          aria-label="Search city"
          className="shrink-0 text-slate-400 transition hover:text-cyan-400 disabled:opacity-50"
        >
          <Search size={18} />
        </button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#12162d] shadow-xl">
          {suggestions.map((suggestion) => (
            <li key={suggestion.id}>
              <button
                type="button"
                onClick={() => handleSelect(suggestion)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover:bg-white/5"
              >
                <MapPin size={16} className="shrink-0 text-cyan-400" />

                <span className="min-w-0">
                  <span className="block truncate text-sm text-white">
                    {suggestion.name}
                  </span>

                  <span className="block truncate text-xs text-slate-400">
                    {[suggestion.admin1, suggestion.country]
                      .filter(Boolean)
                      .join(", ")}
                  </span>
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}

      {showSuggestions &&
        city.trim().length >= 2 &&
        suggestions.length === 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 rounded-xl border border-white/10 bg-[#12162d] px-4 py-3 text-sm text-slate-400 shadow-xl">
            No cities found.
          </div>
        )}

      {loading && (
        <p className="mt-2 text-sm text-cyan-400">Loading weather...</p>
      )}

      {error && <p className="mt-2 text-sm text-red-400">{error}</p>}
    </form>
  );
}
