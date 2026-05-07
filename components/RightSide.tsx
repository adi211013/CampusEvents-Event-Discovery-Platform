"use client";

import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { pl } from "react-day-picker/locale";
import { CATEGORIES } from "@/lib/categories";
import { useStore } from "@/lib/store";
import { mockEvents } from "@/lib/mock-events";

const RightSide = ({ inline = false }: { inline?: boolean }) => {
  const eventDates = mockEvents.map((e) => new Date(e.start_date));
  const { selectedCategories, toggleCategory } = useStore();

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
        locale={pl}
        showOutsideDays={false}
        modifiers={{ event: eventDates }}
        modifiersClassNames={{ event: "calendar-event" }}
        className={`rounded-xl border [--cell-size:--spacing(6)] bg-surface${inline ? " w-full" : ""}`}
      />

      <div
        className={`rounded-xl border border-border bg-surface px-3 py-3${inline ? " w-full" : " w-46"}`}
      >
        <p className="text-sm font-semibold text-text-1 mb-3">
          Filtruj po kategorii
        </p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => {
            const checked = selectedCategories.includes(cat.id);
            return (
              <label
                key={cat.id}
                htmlFor={`cat-${cat.id}`}
                className="flex items-center gap-2.5 cursor-pointer group"
              >
                <Checkbox
                  id={`cat-${cat.id}`}
                  checked={checked}
                  onCheckedChange={() => toggleCategory(cat.id)}
                  className="shrink-0 data-checked:bg-accent data-checked:border-accent cursor-pointer"
                />
                <span className="text-sm text-text-2 group-hover:text-text-1 transition-colors flex-1">
                  {cat.label}
                </span>
                <span className="text-xs text-text-3">
                  {mockEvents.filter((e) => e.tags.includes(cat.id)).length}
                </span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightSide;
