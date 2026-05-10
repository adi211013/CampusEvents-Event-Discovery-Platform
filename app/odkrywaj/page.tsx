"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, X } from "lucide-react";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { createClient } from "@/lib/supabase/client";
import { mockEvents } from "@/lib/mock-events";
import type { Event } from "@/lib/types";
import EventCard from "@/components/EventCard";

export default function DiscoverPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<CategoryId[]>([]);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from("events")
      .select("id, title, location, start_date, short_description, tags, url")
      .eq("status", "approved")
      .order("start_date", { ascending: true })
      .then(({ data }) => {
        const real = (data as Event[]) ?? [];
        setEvents(real.length > 0 ? real : (mockEvents as Event[]));
        setLoading(false);
      });
  }, []);

  const toggleCategory = (id: CategoryId) =>
    setSelectedCategories((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );

  const results = useMemo(() => {
    return events.filter((e) => {
      const matchesQuery = query === "" || e.title.toLowerCase().includes(query.toLowerCase());
      const matchesCategory =
        selectedCategories.length === 0 || e.tags.some((t) => selectedCategories.includes(t as CategoryId));
      return matchesQuery && matchesCategory;
    });
  }, [events, query, selectedCategories]);

  return (
    <div className="px-4 md:px-5 py-4 pb-8 flex flex-col gap-5">
      <div>
        <h1 className="text-[18px] md:text-[20px] font-bold text-text-1 mb-4">
          Odkrywaj wydarzenia
        </h1>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-3 pointer-events-none" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj wydarzeń, organizatorów, miejsc..."
            className="w-full h-11 pl-10 pr-10 rounded-xl border border-border bg-surface text-sm text-text-1 placeholder:text-text-3 outline-none focus:border-accent transition-colors"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-3 hover:text-text-2"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {CATEGORIES.map((cat) => {
            const active = selectedCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                onClick={() => toggleCategory(cat.id)}
                className="shrink-0 text-[12px] font-semibold px-3 py-1.5 rounded-lg border transition-colors"
                style={
                  active
                    ? { backgroundColor: cat.bg, color: cat.color, borderColor: cat.color }
                    : { backgroundColor: "transparent", color: "#6B7280", borderColor: "#E5E7EB" }
                }
              >
                {cat.label}
              </button>
            );
          })}
        </div>
        <div className="flex justify-end">
          <span className="text-xs text-text-3">
            {loading ? "Ładowanie…" : `${results.length} ${results.length === 1 ? "wydarzenie" : "wydarzeń"}`}
          </span>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-40 rounded-xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {results.map((e) => (
            <EventCard key={e.id} event={e} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-text-1 font-semibold">Brak wyników</p>
          <p className="text-sm text-text-2">Spróbuj zmienić filtry lub wyszukiwaną frazę.</p>
        </div>
      )}
    </div>
  );
}
