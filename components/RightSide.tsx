"use client";

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { pl } from "react-day-picker/locale";
import { CATEGORIES, type CategoryId } from "@/lib/categories";

const RightSide = () => {
  const eventDates = [new Date(2026, 3, 28), new Date(2026, 3, 30)];
  const [selected, setSelected] = useState<CategoryId[]>([]);

  const toggle = (id: CategoryId) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );

  return (
    <div className="w-50 shrink-0 overflow-y-auto flex flex-col items-center pt-4 gap-3">
      <Calendar
        mode="single"
        locale={pl}
        showOutsideDays={false}
        modifiers={{ event: eventDates }}
        modifiersClassNames={{ event: "calendar-event" }}
        className="rounded-xl border [--cell-size:--spacing(6)] bg-surface"
      />

      <div className="w-46 rounded-xl border border-border bg-surface px-3 py-3">
        <p className="text-sm font-semibold text-text-1 mb-3">
          Filtruj po kategorii
        </p>
        <div className="flex flex-col gap-2">
          {CATEGORIES.map((cat) => {
            const checked = selected.includes(cat.id);
            return (
              <label
                key={cat.id}
                className="flex items-center gap-2.5 cursor-pointer group"
                onClick={() => toggle(cat.id)}
              >
                <Checkbox checked={checked} className="shrink-0" />
                <span className="text-sm text-text-2 group-hover:text-text-1 transition-colors flex-1">
                  {cat.label}
                </span>
                <span className="text-xs text-text-3">0</span>
              </label>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RightSide;
