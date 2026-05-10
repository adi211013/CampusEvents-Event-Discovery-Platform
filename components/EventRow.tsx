"use client";

import { Heart, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import { useStore } from "@/lib/store";
import { useUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import type { Event } from "@/lib/types";

const MONTHS = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];

export default function EventRow({ event }: { event: Event }) {
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
      await supabase.from("saved_events").delete().eq("event_id", event.id).eq("user_id", user.id);
    } else {
      addSaved(event.id);
      await supabase.from("saved_events").insert({ event_id: event.id, user_id: user.id });
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <div className="shrink-0 flex flex-col items-center w-8">
        <span className="text-base font-bold text-text-1 leading-none">{day}</span>
        <span className="text-[10px] text-text-2 uppercase">{month}</span>
      </div>
      <div className="w-px h-8 bg-border shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-text-1 truncate">{event.title}</p>
        {event.location && (
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="size-3 text-text-3 shrink-0" />
            <span className="text-xs text-text-2 truncate">{event.location}</span>
          </div>
        )}
      </div>
      <div className="hidden sm:flex gap-1 shrink-0">
        {event.tags.map((tag) => {
          const cat = CATEGORIES.find((c) => c.id === tag);
          return cat ? (
            <span key={tag} className="text-[11px] font-bold px-2 py-0.5 rounded-md" style={{ backgroundColor: cat.bg, color: cat.color }}>
              {cat.label}
            </span>
          ) : null;
        })}
      </div>
      <button onClick={handleToggle} className="shrink-0">
        <Heart className={`size-4 transition-colors ${isSaved ? "fill-red-500 text-red-500" : "text-text-3"}`} />
      </button>
    </div>
  );
}
