"use client";

import { X } from "lucide-react";
import { useStore } from "@/lib/store";
import RightSide from "@/components/RightSide";
import type { Event } from "@/lib/types";

export default function PanelDrawer({ events, filterEvents }: { events: Event[]; filterEvents?: Event[] }) {
  const { drawerOpen, closeDrawer } = useStore();

  if (!drawerOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40 bg-black/35 backdrop-blur-sm"
        onClick={closeDrawer}
      />
      <div className="fixed top-0 right-0 z-50 h-full w-75 bg-surface shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-4 py-3 border-b border-border">
          <span className="font-semibold text-text-1">Kalendarz</span>
          <button
            onClick={closeDrawer}
            className="text-text-2 hover:text-text-1 transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          <RightSide inline events={events} filterEvents={filterEvents} />
        </div>
      </div>
    </>
  );
}
