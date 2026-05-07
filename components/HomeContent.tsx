"use client";

import { useStore } from "@/lib/store";
import { useUser } from "@/components/UserProvider";
import type { MockEvent } from "@/lib/mock-events";
import HeroBanner from "@/components/HeroBanner";
import EventCard from "@/components/EventCard";
import EventRow from "@/components/EventRow";

export default function HomeContent({ events }: { events: MockEvent[] }) {
  const user = useUser();
  const activeFilters = useStore((s) => s.selectedCategories);

  const gridEvents =
    activeFilters.length === 0
      ? events.slice(0, 6)
      : events.filter((e) => e.tags.some((t) => activeFilters.includes(t))).slice(0, 6);

  const browseEvents =
    activeFilters.length === 0
      ? events
      : events.filter((e) => e.tags.some((t) => activeFilters.includes(t)));

  const hero = events[0];
  const sectionTitle = user ? "Dla Ciebie" : "Najnowsze wydarzenia";

  return (
    <div className="px-4 md:px-5 py-4 flex flex-col gap-6 pb-8">
      {hero && <HeroBanner event={hero} />}

      <section>
        <h2 className="text-[18px] md:text-[20px] font-bold text-text-1 mb-4">
          {sectionTitle}
        </h2>
        {gridEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {gridEvents.map((e) => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-2">Brak wydarzeń dla wybranych kategorii.</p>
        )}
      </section>

      <section>
        <h2 className="text-[18px] md:text-[20px] font-bold text-text-1 mb-4">
          Przeglądaj wszystkie
        </h2>
        {browseEvents.length > 0 ? (
          <div className="flex flex-col gap-2">
            {browseEvents.map((e) => (
              <EventRow key={e.id} event={e} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-2">Brak wydarzeń dla wybranych kategorii.</p>
        )}
      </section>
    </div>
  );
}