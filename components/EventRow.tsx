"use client";

import { useState } from "react";
import { Heart, Share2, MapPin } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { MockEvent } from "@/lib/mock-events";

const MONTHS = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];

export default function EventRow({ event }: { event: MockEvent }) {
  const [saved, setSaved] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === event.tags[0]);
  const date = new Date(event.start_date);
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
        <p className="text-sm font-semibold text-text-1 truncate">{event.title}</p>
        <div className="flex items-center gap-1 mt-0.5">
          <MapPin className="size-3 text-text-3 shrink-0" />
          <span className="text-xs text-text-2 truncate">{event.organizer}</span>
        </div>
      </div>
      <span
        className="hidden sm:block text-[11px] font-bold px-2 py-0.5 rounded-md shrink-0"
        style={{ backgroundColor: cat?.bg, color: cat?.color }}
      >
        {cat?.label}
      </span>
      <button onClick={() => setSaved(!saved)} className="shrink-0">
        <Heart className={`size-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-text-3"}`} />
      </button>
      <button className="shrink-0">
        <Share2 className="size-4 text-text-3 hover:text-text-2 transition-colors" />
      </button>
    </div>
  );
}