"use client";

import { MapPin, Heart } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useStore } from "@/lib/store";
import { useUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Event } from "@/lib/types";

const MONTHS = [
  "sty",
  "lut",
  "mar",
  "kwi",
  "maj",
  "cze",
  "lip",
  "sie",
  "wrz",
  "paź",
  "lis",
  "gru",
];

export default function EventCard({ event }: { event: Event }) {
  const user = useUser();
  const { savedIds, addSaved, removeSaved } = useStore();
  const isSaved = typeof event.id === "number" && savedIds.includes(event.id);

  const date = event.start_date ? new Date(event.start_date) : null;
  const day = date ? date.getDate() : "—";
  const month = date ? MONTHS[date.getMonth()] : "";

  async function handleToggle() {
    if (!user) {
      toast.error("Zaloguj się, aby zapisywać wydarzenia");
      return;
    }
    if (typeof event.id !== "number") return;
    const supabase = createClient();
    if (isSaved) {
      removeSaved(event.id);
      await supabase
        .from("saved_events")
        .delete()
        .eq("event_id", event.id)
        .eq("user_id", user.id);
    } else {
      addSaved(event.id);
      await supabase
        .from("saved_events")
        .insert({ event_id: event.id, user_id: user.id });
    }
  }

  return (
    <div>
      {/* Mobile — row layout */}
      <div className="flex md:hidden items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
        <div
          className="w-12 shrink-0 rounded-lg flex flex-col items-center justify-center py-2.5"
          style={{
            backgroundColor: CATEGORIES.find((c) => c.id === event.tags[0])?.bg,
            color: CATEGORIES.find((c) => c.id === event.tags[0])?.color,
          }}
        >
          <span className="text-lg font-bold leading-none">{day}</span>
          <span className="text-[10px] font-medium uppercase">{month}</span>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex gap-1 mb-1 flex-wrap">
            {event.tags.map((tag) => {
              const c = CATEGORIES.find((c) => c.id === tag);
              return c ? (
                <span
                  key={tag}
                  className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md"
                  style={{ backgroundColor: c.bg, color: c.color }}
                >
                  {c.label}
                </span>
              ) : null;
            })}
          </div>
          <p className="text-sm font-semibold text-text-1 leading-tight truncate">
            {event.title}
          </p>
          {event.location && (
            <div className="flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 text-text-3 shrink-0" />
              <span className="text-xs text-text-2 truncate">
                {event.location}
              </span>
            </div>
          )}
        </div>
        <button onClick={handleToggle} className="shrink-0">
          <Heart
            className={`size-4 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-text-3"}`}
          />
        </button>
      </div>

      {/* Desktop — full card */}
      <div className="hidden md:flex flex-col rounded-xl border border-border bg-surface overflow-hidden">
        <div
          className={`h-25 bg-linear-to-br ${CATEGORIES.find((c) => c.id === event.tags[0])?.gradient} relative shrink-0`}
        >
          <div className="absolute top-3 left-3 flex gap-1">
            {event.tags.map((tag) => {
              const c = CATEGORIES.find((c) => c.id === tag);
              return c ? (
                <span
                  key={tag}
                  className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm"
                >
                  {c.label}
                </span>
              ) : null;
            })}
          </div>
          <div className="absolute bottom-3 left-3 bg-white rounded-lg px-2.5 py-1.5 flex flex-col items-center min-w-10">
            <span className="text-base font-bold text-text-1 leading-none">
              {day}
            </span>
            <span className="text-[10px] text-text-2 uppercase">{month}</span>
          </div>
        </div>
        <div className="px-3.5 py-3 flex flex-col gap-2 flex-1">
          <p className="text-sm font-semibold text-text-1 leading-tight line-clamp-2">
            {event.title}
          </p>
          {event.location && (
            <div className="flex items-center gap-1">
              <MapPin className="size-3.5 text-text-3 shrink-0" />
              <span className="text-xs text-text-2 truncate">
                {event.location}
              </span>
            </div>
          )}
          <div className="flex justify-end pt-1 mt-auto">
            <button className="cursor-pointer" onClick={handleToggle}>
              <Heart
                className={`size-4 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-text-3"}`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
