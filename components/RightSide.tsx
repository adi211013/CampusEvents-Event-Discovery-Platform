"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { pl } from "react-day-picker/locale";
import { CATEGORIES } from "@/lib/categories";
import { useStore } from "@/lib/store";
import type { Event } from "@/lib/types";

const MONTHS = ["stycznia","lutego","marca","kwietnia","maja","czerwca","lipca","sierpnia","września","października","listopada","grudnia"];

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

type Props = {
  inline?: boolean;
  events?: Event[];
  filterEvents?: Event[];
};

const RightSide = ({ inline = false, events = [], filterEvents }: Props) => {
  const countEvents = filterEvents ?? events;
  const [selectedDay, setSelectedDay] = useState<Date | undefined>();
  const { selectedCategories, toggleCategory } = useStore();

  const eventDates = events
    .filter((e) => e.start_date)
    .map((e) => new Date(e.start_date!));

  const dayEvents = selectedDay
    ? events.filter((e) => e.start_date && isSameDay(new Date(e.start_date), selectedDay))
    : [];

  return (
    <div
      className={
        inline
          ? "flex flex-col gap-3"
          : "w-50 shrink-0 overflow-y-auto hidden lg:flex flex-col items-center pt-4 gap-3"
      }
    >
      <Calendar
        mode="single"
        selected={selectedDay}
        onSelect={setSelectedDay}
        locale={pl}
        showOutsideDays={false}
        modifiers={{ event: eventDates }}
        modifiersClassNames={{ event: "calendar-event" }}
        className={`rounded-xl border [--cell-size:--spacing(6)] bg-surface${inline ? " w-full" : ""}`}
      />

      {selectedDay && (
        <div className={`rounded-xl border border-border bg-surface px-3 py-3${inline ? " w-full" : " w-46"}`}>
          <p className="text-xs font-semibold text-text-2 mb-2">
            {selectedDay.getDate()} {MONTHS[selectedDay.getMonth()]}
          </p>
          {dayEvents.length > 0 ? (
            <div className="flex flex-col gap-2">
              {dayEvents.map((e) => {
                const cat = CATEGORIES.find((c) => c.id === e.tags[0]);
                const time = e.start_date
                  ? new Date(e.start_date).toLocaleTimeString("pl-PL", { hour: "2-digit", minute: "2-digit" })
                  : null;
                return (
                  <div key={e.id} className="flex flex-col gap-0.5">
                    {cat && (
                      <span className="text-[10px] font-bold" style={{ color: cat.color }}>
                        {cat.label}{time && time !== "00:00" ? ` · ${time}` : ""}
                      </span>
                    )}
                    <p className="text-xs font-medium text-text-1 leading-tight line-clamp-2">{e.title}</p>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-text-3">Brak wydarzeń tego dnia.</p>
          )}
        </div>
      )}

      <div className={`rounded-xl border border-border bg-surface px-3 py-3${inline ? " w-full" : " w-46"}`}>
        <p className="text-sm font-semibold text-text-1 mb-3">Filtruj po kategorii</p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => {
            const checked = selectedCategories.includes(cat.id);
            const count = countEvents.filter((e) => (e.tags ?? []).includes(cat.id)).length;
            const disabled = count === 0 && !checked;
            return (
              <label
                key={cat.id}
                htmlFor={`cat-${cat.id}`}
                className={`flex items-center gap-2.5 ${disabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer group"}`}
              >
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={checked}
                  disabled={disabled}
                  onCheckedChange={() => toggleCategory(cat.id)}
                  className="shrink-0 data-checked:bg-accent data-checked:border-accent cursor-pointer"
                />
                <span className="text-sm text-text-2 group-hover:text-text-1 transition-colors flex-1">
                  {cat.label}
                </span>
                <span className="text-xs text-text-3">{count}</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightSide;
