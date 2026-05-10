"use client";

import { useState, useEffect, useCallback } from "react";
import { useUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { CATEGORIES, type CategoryId } from "@/lib/categories";
import { reviewEvent } from "./actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  MapPin,
  Calendar,
  Link as LinkIcon,
  FileText,
  Check,
  ShieldOff,
} from "lucide-react";

type ProposedEvent = {
  id: number;
  title: string;
  url: string | null;
  start_date: string | null;
  location: string | null;
  short_description: string | null;
  tags: string[];
  created_at: string;
};

type EditState = {
  title: string;
  url: string;
  start_date: string;
  location: string;
  short_description: string;
  tags: CategoryId[];
};

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

function formatDate(iso: string) {
  const d = new Date(iso);
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function ReviewModal({
  event,
  onClose,
  onAction,
}: {
  event: ProposedEvent;
  onClose: () => void;
  onAction: (
    id: number,
    status: "approved" | "ignored",
    data: EditState,
  ) => Promise<void>;
}) {
  const [form, setForm] = useState<EditState>({
    title: event.title,
    url: event.url ?? "",
    start_date: event.start_date ? event.start_date.slice(0, 10) : "",
    location: event.location ?? "",
    short_description: event.short_description ?? "",
    tags: (event.tags ?? []).filter((t): t is CategoryId =>
      CATEGORIES.some((c) => c.id === t),
    ),
  });
  const [saving, setSaving] = useState(false);

  const toggleTag = (id: CategoryId) => {
    setForm((prev) => {
      if (prev.tags.includes(id))
        return { ...prev, tags: prev.tags.filter((t) => t !== id) };
      if (prev.tags.length >= 2) return prev;
      return { ...prev, tags: [...prev.tags, id] };
    });
  };

  const canApprove = form.title.trim() !== "" && form.tags.length >= 1;

  async function handle(status: "approved" | "ignored") {
    setSaving(true);
    await onAction(event.id, status, form);
    setSaving(false);
  }

  return (
    <Dialog open onOpenChange={(o) => !o && onClose()}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-lg rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-text-1 text-lg font-bold">
            Przejrzyj propozycję
          </DialogTitle>
          <p className="text-xs text-text-3">
            Zgłoszone {formatDate(event.created_at)}
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-3 py-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-1 flex items-center gap-1.5">
              <FileText className="size-3.5 text-text-3" /> Tytuł{" "}
              <span className="text-red-500">*</span>
            </label>
            <Input
              value={form.title}
              onChange={(e) =>
                setForm((p) => ({ ...p, title: e.target.value }))
              }
              className="h-9 focus-visible:ring-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-1 flex items-center gap-1.5">
                <Calendar className="size-3.5 text-text-3" /> Data
              </label>
              <Input
                type="date"
                value={form.start_date}
                onChange={(e) =>
                  setForm((p) => ({ ...p, start_date: e.target.value }))
                }
                className="h-9 focus-visible:ring-0"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-1 flex items-center gap-1.5">
                <MapPin className="size-3.5 text-text-3" /> Lokalizacja
              </label>
              <Input
                value={form.location}
                onChange={(e) =>
                  setForm((p) => ({ ...p, location: e.target.value }))
                }
                className="h-9 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-1 flex items-center gap-1.5">
              <LinkIcon className="size-3.5 text-text-3" /> Link
            </label>
            <Input
              type="url"
              value={form.url}
              onChange={(e) => setForm((p) => ({ ...p, url: e.target.value }))}
              placeholder="https://..."
              className="h-9 focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-1">Opis</label>
            <textarea
              rows={3}
              value={form.short_description}
              onChange={(e) =>
                setForm((p) => ({ ...p, short_description: e.target.value }))
              }
              className="w-full resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-accent"
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-text-1">
              Tagi <span className="text-red-500">*</span>
              <span className="text-text-3 font-normal ml-1">
                (min. 1, maks. 2)
              </span>
            </label>
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map((cat) => {
                const active = form.tags.includes(cat.id);
                const disabled = !active && form.tags.length >= 2;
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleTag(cat.id)}
                    disabled={disabled}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                    style={
                      active
                        ? {
                            backgroundColor: cat.bg,
                            color: cat.color,
                            borderColor: cat.color,
                          }
                        : { color: "#6B7280", borderColor: "#E5E7EB" }
                    }
                  >
                    {active && <Check className="size-3.5" />}
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={() => handle("ignored")}
            disabled={saving}
            className="cursor-pointer text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <ShieldOff className="size-4 mr-1.5" />
            Archiwizuj
          </Button>
          <Button
            onClick={() => handle("approved")}
            disabled={!canApprove || saving}
            className="cursor-pointer bg-accent hover:bg-accent/90 text-white font-semibold"
          >
            <Check className="size-4 mr-1.5" />
            Zatwierdź
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function AdminPanel() {
  const supabase = createClient();
  const [events, setEvents] = useState<ProposedEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<ProposedEvent | null>(null);

  const fetchEvents = useCallback(async () => {
    const { data } = await supabase
      .from("events")
      .select(
        "id, title, url, start_date, location, short_description, tags, created_at",
      )
      .eq("status", "proposed")
      .order("created_at", { ascending: false });
    setEvents((data as ProposedEvent[]) ?? []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  async function handleAction(
    id: number,
    status: "approved" | "ignored",
    form: EditState,
  ) {
    await reviewEvent(id, status, form);
    setEvents((prev) => prev.filter((e) => e.id !== id));
    setSelected(null);
  }

  return (
    <div className="px-4 md:px-5 py-4 pb-8 flex flex-col gap-5">
      <div>
        <h1 className="text-[18px] md:text-[20px] font-bold text-text-1">
          Panel admina
        </h1>
        <p className="text-sm text-text-2 mt-0.5">
          Propozycje wydarzeń do zatwierdzenia
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col gap-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-16 rounded-xl border border-border bg-surface animate-pulse"
            />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-2">
          <Check className="size-10 text-green-500" />
          <p className="font-semibold text-text-1">Wszystko przejrzane</p>
          <p className="text-sm text-text-2">Brak oczekujących propozycji.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {events.map((e) => (
            <button
              key={e.id}
              onClick={() => setSelected(e)}
              className="flex items-center gap-4 rounded-xl border border-border bg-surface px-4 py-3 text-left hover:border-accent transition-colors cursor-pointer"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-text-1 truncate">
                  {e.title}
                </p>
                <div className="flex items-center gap-3 mt-0.5">
                  {e.location && (
                    <span className="flex items-center gap-1 text-xs text-text-2">
                      <MapPin className="size-3 text-text-3" />
                      {e.location}
                    </span>
                  )}
                  <span className="text-xs text-text-3">
                    {formatDate(e.created_at)}
                  </span>
                </div>
              </div>
              <span className="shrink-0 text-[11px] font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-600">
                Do przejrzenia
              </span>
            </button>
          ))}
        </div>
      )}

      {selected && (
        <ReviewModal
          event={selected}
          onClose={() => setSelected(null)}
          onAction={handleAction}
        />
      )}
    </div>
  );
}

function UnauthorizedView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-surface rounded-2xl border border-border p-10 flex flex-col items-center text-center max-w-sm w-full">
        <div className="bg-red-50 rounded-full p-4 mb-4">
          <ShieldOff className="size-8 text-red-500" />
        </div>
        <h2 className="text-xl font-bold text-text-1 mb-2">Brak dostępu</h2>
        <p className="text-text-2 text-sm">
          Ta strona jest dostępna tylko dla administratorów.
        </p>
      </div>
    </div>
  );
}

export default function AdminPage() {
  const user = useUser();
  const supabase = createClient();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    supabase
      .from("profiles")
      .select("is_admin")
      .single()
      .then(({ data }) => {
        setIsAdmin(data?.is_admin ?? false);
      });
  }, [user]);

  if (isAdmin === null) return null;
  if (!isAdmin) return <UnauthorizedView />;
  return <AdminPanel />;
}
