"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { CalendarDays, MapPin, Heart, Bookmark, History } from "lucide-react";
import { useUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES } from "@/lib/categories";

type SavedEvent = {
  id: string;
  event_id: number;
  saved_at: string;
  events: {
    id: number;
    title: string;
    location: string;
    start_date: string;
    tags: string[];
  };
};

const MONTHS = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];

function EventItem({ item, onUnsave }: { item: SavedEvent; onUnsave: (id: number) => void }) {
  const cat = CATEGORIES.find((c) => item.events.tags.includes(c.id));
  const date = new Date(item.events.start_date);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <div className="shrink-0 flex flex-col items-center w-8">
        <span className="text-base font-bold text-text-1 leading-none">{day}</span>
        <span className="text-[10px] text-text-2 uppercase">{month}</span>
      </div>
      <div className="w-px h-8 bg-border shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-1 truncate">{item.events.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="size-3 text-text-3 shrink-0" />
          <span className="text-xs text-text-2 truncate">{item.events.location}</span>
        </div>
      </div>
      {cat && (
        <span
          className="hidden sm:block text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0"
          style={{ backgroundColor: cat.bg, color: cat.color }}
        >
          {cat.label}
        </span>
      )}
      <button onClick={() => onUnsave(item.event_id)} className="shrink-0 group">
        <Heart className="size-4 fill-red-500 text-red-500 group-hover:fill-transparent group-hover:text-text-3 transition-colors" />
      </button>
    </div>
  );
}

function GuestView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-surface rounded-2xl border border-border p-10 flex flex-col items-center text-center max-w-sm w-full">
        <div className="bg-accent-light rounded-full p-4 mb-4">
          <CalendarDays className="size-8 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-1 mb-2">Moje wydarzenia</h2>
        <p className="text-text-2 text-sm mb-6">
          Zaloguj się, aby zapisywać wydarzenia i przeglądać historię.
        </p>
        <Link
          href="/logowanie"
          className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold py-3 rounded-xl text-center transition-colors mb-3"
        >
          Zaloguj lub załóż konto
        </Link>
        <Link
          href="/odkrywaj"
          className="w-full border border-border hover:border-border-md text-text-1 text-sm font-semibold py-3 rounded-xl text-center transition-colors"
        >
          Przeglądaj wydarzenia
        </Link>
      </div>
    </div>
  );
}

function MyEventsView() {
  const user = useUser();
  const supabase = createClient();
  const [tab, setTab] = useState<"saved" | "history">("saved");
  const [items, setItems] = useState<SavedEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSaved = useCallback(async () => {
    const { data } = await supabase
      .from("saved_events")
      .select("id, event_id, saved_at, events(id, title, location, start_date, tags)")
      .order("saved_at", { ascending: true });
    const sorted = ((data as unknown as SavedEvent[]) ?? []).sort(
      (a, b) => new Date(a.events.start_date).getTime() - new Date(b.events.start_date).getTime()
    );
    setItems(sorted);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSaved();
  }, [fetchSaved]);

  async function handleUnsave(eventId: number) {
    setItems((prev) => prev.filter((i) => i.event_id !== eventId));
    await supabase
      .from("saved_events")
      .delete()
      .eq("event_id", eventId)
      .eq("user_id", user!.id);
  }

  const now = new Date();
  const saved = items.filter((i) => new Date(i.events.start_date) >= now);
  const history = items.filter((i) => new Date(i.events.start_date) < now);
  const current = tab === "saved" ? saved : history;

  return (
    <div className="px-4 md:px-5 py-4 pb-8 flex flex-col gap-5">
      <h1 className="text-[18px] md:text-[20px] font-bold text-text-1">Moje wydarzenia</h1>

      <div className="flex gap-1 bg-background rounded-xl p-1 w-fit">
        <button
          onClick={() => setTab("saved")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "saved"
              ? "bg-surface text-text-1 shadow-sm"
              : "text-text-2 hover:text-text-1"
          }`}
        >
          <Bookmark className="size-4" />
          Zapisane
          {saved.length > 0 && (
            <span className="bg-accent text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {saved.length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab("history")}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            tab === "history"
              ? "bg-surface text-text-1 shadow-sm"
              : "text-text-2 hover:text-text-1"
          }`}
        >
          <History className="size-4" />
          Historia
          {history.length > 0 && (
            <span className="bg-background border border-border text-text-2 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none">
              {history.length}
            </span>
          )}
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 rounded-xl border border-border bg-surface animate-pulse" />
          ))}
        </div>
      ) : current.length > 0 ? (
        <div className="flex flex-col gap-2">
          {current.map((item) => (
            <EventItem key={item.id} item={item} onUnsave={handleUnsave} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <p className="text-text-1 font-semibold">
            {tab === "saved" ? "Brak zapisanych wydarzeń" : "Brak historii"}
          </p>
          <p className="text-sm text-text-2">
            {tab === "saved"
              ? "Kliknij serduszko przy wydarzeniu, aby je zapisać."
              : "Tutaj pojawią się wydarzenia, w których wziąłeś udział."}
          </p>
          {tab === "saved" && (
            <Link
              href="/odkrywaj"
              className="mt-2 text-sm font-semibold text-accent hover:text-accent/80 transition-colors"
            >
              Przeglądaj wydarzenia →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

export default function MyEventsPage() {
  const user = useUser();
  return user ? <MyEventsView /> : <GuestView />;
}