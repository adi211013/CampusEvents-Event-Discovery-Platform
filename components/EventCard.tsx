"use client";

import { useState } from "react";
import { MapPin, Heart } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";
import type { MockEvent } from "@/lib/mock-events";

const MONTHS = ["sty","lut","mar","kwi","maj","cze","lip","sie","wrz","paź","lis","gru"];

export default function EventCard({ event }: { event: MockEvent }) {
  const [saved, setSaved] = useState(false);
  const cat = CATEGORIES.find((c) => c.id === event.tags[0]);
  const date = new Date(event.start_date);
  const day = date.getDate();
  const month = MONTHS[date.getMonth()];

  return (
    <div>
      {/* Mobile — row layout */}
      <div className="flex md:hidden items-center gap-3 rounded-xl border border-border bg-surface px-3 py-3">
        <div
          className="w-12 shrink-0 rounded-lg flex flex-col items-center justify-center py-2.5"
          style={{ backgroundColor: cat?.bg, color: cat?.color }}
        >
          <span className="text-lg font-bold leading-none">{day}</span>
          <span className="text-[10px] font-medium uppercase">{month}</span>
        </div>
        <div className="flex-1 min-w-0">
          <span
            className="inline-block text-[11px] font-bold px-2 py-0.5 rounded-md mb-1"
            style={{ backgroundColor: cat?.bg, color: cat?.color }}
          >
            {cat?.label}
          </span>
          <p className="text-sm font-semibold text-text-1 leading-tight truncate">{event.title}</p>
          <div className="flex items-center gap-1 mt-0.5">
            <MapPin className="size-3 text-text-3 shrink-0" />
            <span className="text-xs text-text-2 truncate">{event.location}</span>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          {event.price === null ? (
            <span className="text-xs font-semibold text-green-600">Bezpłatne</span>
          ) : (
            <span className="text-xs font-semibold text-amber-500">{event.price} zł</span>
          )}
          <button onClick={() => setSaved(!saved)}>
            <Heart className={`size-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-text-3"}`} />
          </button>
        </div>
      </div>

      {/* Desktop — full card */}
      <div className="hidden md:flex flex-col rounded-xl border border-border bg-surface overflow-hidden">
        <div className={`h-[100px] bg-gradient-to-br ${cat?.gradient} relative shrink-0`}>
          <span className="absolute top-3 left-3 text-[11px] font-bold px-2 py-0.5 rounded-md bg-white/20 text-white backdrop-blur-sm">
            {cat?.label}
          </span>
          <div className="absolute bottom-3 left-3 bg-white rounded-lg px-2.5 py-1.5 flex flex-col items-center min-w-[40px]">
            <span className="text-base font-bold text-text-1 leading-none">{day}</span>
            <span className="text-[10px] text-text-2 uppercase">{month}</span>
          </div>
        </div>
        <div className="px-3.5 py-3 flex flex-col gap-2 flex-1">
          <p className="text-sm font-semibold text-text-1 leading-tight line-clamp-2">{event.title}</p>
          <div className="flex items-center gap-1">
            <MapPin className="size-3.5 text-text-3 shrink-0" />
            <span className="text-xs text-text-2 truncate">{event.location}</span>
          </div>
          <div className="flex items-center justify-between pt-1 mt-auto">
            {event.price === null ? (
              <span className="text-xs font-semibold text-green-600">Bezpłatne</span>
            ) : (
              <span className="text-xs font-semibold text-amber-500">{event.price} zł</span>
            )}
            <button onClick={() => setSaved(!saved)}>
              <Heart className={`size-4 transition-colors ${saved ? "fill-red-500 text-red-500" : "text-text-3"}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}