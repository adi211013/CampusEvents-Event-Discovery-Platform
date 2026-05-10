"use client";

import { useUser } from "@/components/UserProvider";
import { useStore } from "@/lib/store";
import type { Event } from "@/lib/types";
import HeroBanner from "@/components/HeroBanner";
import EventCard from "@/components/EventCard";
import EventRow from "@/components/EventRow";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

type Props = {
  gridEvents: Event[];
  browseEvents: Event[];
};

export default function HomeContent({ gridEvents, browseEvents }: Props) {
  const user = useUser();
  const activeFilters = useStore((s) => s.selectedCategories);
  const sectionTitle = user ? "Dla Ciebie" : "Najnowsze wydarzenia";
  const hero = gridEvents[0];

  const filtered = activeFilters.length === 0
    ? gridEvents
    : gridEvents.filter((e) => (e.tags ?? []).some((t) => activeFilters.includes(t as any)));

  const filteredBrowse = activeFilters.length === 0
    ? browseEvents
    : browseEvents.filter((e) => (e.tags ?? []).some((t) => activeFilters.includes(t as any)));

  return (
    <div className="px-4 md:px-5 py-4 flex flex-col gap-6 pb-8">
      {hero && <HeroBanner event={hero} />}

      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[18px] md:text-[20px] font-bold text-text-1">{sectionTitle}</h2>
          <Link
            href="/odkrywaj"
            className="flex items-center gap-1 text-sm font-medium text-accent hover:text-accent/80 transition-colors"
          >
            Zobacz wszystkie
            <ArrowRight className="size-4" />
          </Link>
        </div>
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {filtered.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-2">Brak wydarzeń dla wybranych kategorii.</p>
        )}
      </section>

      {filteredBrowse.length > 0 && (
        <section>
          <h2 className="text-[18px] md:text-[20px] font-bold text-text-1 mb-4">Nadchodzące</h2>
          <div className="flex flex-col gap-2">
            {filteredBrowse.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
