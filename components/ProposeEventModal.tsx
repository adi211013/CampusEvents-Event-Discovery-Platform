"use client";

import { useState } from "react";
import { useStore } from "@/lib/store";
import { useUser } from "@/components/UserProvider";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import Link from "next/link";

type FormErrors = { title?: string; date?: string; location?: string; description?: string };

export default function ProposeEventModal() {
  const { proposeOpen, closePropose } = useStore();
  const user = useUser();
  const supabase = createClient();
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", date: "", location: "", description: "" });
  const [errors, setErrors] = useState<FormErrors>({});

  function handleClose() {
    setForm({ title: "", url: "", date: "", location: "", description: "" });
    setErrors({});
    closePropose();
  }

  function validate(): boolean {
    const e: FormErrors = {};
    if (!form.title.trim()) e.title = "Tytuł jest wymagany";
    if (!form.date) e.date = "Data jest wymagana";
    if (!form.location.trim()) e.location = "Lokalizacja jest wymagana";
    if (!form.description.trim()) e.description = "Krótki opis jest wymagany";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setSending(true);
    const { error } = await supabase.from("events").insert({
      title: form.title.trim(),
      url: form.url.trim() || null,
      start_date: form.date,
      location: form.location.trim(),
      short_description: form.description.trim(),
      status: "proposed",
      tags: [],
    });
    setSending(false);
    if (error) { toast.error("Coś poszło nie tak, spróbuj ponownie"); return; }
    toast.success("Propozycja wysłana — dziękujemy!");
    handleClose();
  }

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: { target: { value: string } }) =>
      setForm((p) => ({ ...p, [key]: e.target.value })),
  });

  if (!user) {
    return (
      <Dialog open={proposeOpen} onOpenChange={(o) => !o && closePropose()}>
        <DialogContent aria-describedby={undefined} className="sm:max-w-sm rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-text-1 text-lg font-bold">Zaproponuj wydarzenie</DialogTitle>
            <p className="text-sm text-text-2">Musisz być zalogowany, aby zaproponować wydarzenie.</p>
          </DialogHeader>
          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <Link
              href="/logowanie"
              onClick={closePropose}
              className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold py-2.5 rounded-xl text-center transition-colors"
            >
              Zaloguj lub załóż konto
            </Link>
            <Button variant="outline" className="w-full cursor-pointer" onClick={closePropose}>
              Anuluj
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={proposeOpen} onOpenChange={(o) => !o && handleClose()}>
      <DialogContent aria-describedby={undefined} className="sm:max-w-120 rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-text-1 text-lg font-bold">
            Zaproponuj wydarzenie
          </DialogTitle>
          <p className="text-sm text-text-2">Wypełnij formularz, a my zajmiemy się resztą.</p>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-1">
              Tytuł <span className="text-red-500">*</span>
            </label>
            <Input
              {...field("title")}
              placeholder="np. Hackathon PRz 2026"
              className={`h-9 focus-visible:ring-0 ${errors.title ? "border-red-400" : ""}`}
            />
            {errors.title && <p className="text-xs text-red-500">{errors.title}</p>}
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-1">Link do wydarzenia</label>
              <span className="text-[11px] text-text-3 bg-[#F3F4F6] px-1.5 py-0.5 rounded font-medium">
                opcjonalne
              </span>
            </div>
            <Input
              type="url"
              {...field("url")}
              placeholder="https://..."
              className="h-9 focus-visible:ring-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-1">
                Data <span className="text-red-500">*</span>
              </label>
              <Input
                type="date"
                {...field("date")}
                className={`h-9 focus-visible:ring-0 ${errors.date ? "border-red-400" : ""}`}
              />
              {errors.date && <p className="text-xs text-red-500">{errors.date}</p>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-1">
                Lokalizacja <span className="text-red-500">*</span>
              </label>
              <Input
                {...field("location")}
                placeholder="np. Aula PRz, bud. V"
                className={`h-9 focus-visible:ring-0 ${errors.location ? "border-red-400" : ""}`}
              />
              {errors.location && <p className="text-xs text-red-500">{errors.location}</p>}
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-1">
              Krótki opis <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              {...field("description")}
              placeholder="Opisz wydarzenie w kilku zdaniach..."
              className={`w-full min-w-0 resize-none rounded-lg border bg-transparent px-2.5 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:border-accent ${errors.description ? "border-red-400" : "border-input"}`}
            />
            {errors.description && <p className="text-xs text-red-500">{errors.description}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button className="cursor-pointer" variant="outline" onClick={handleClose}>
            Anuluj
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={sending}
            className="bg-accent hover:bg-accent/90 text-white font-semibold cursor-pointer"
          >
            {sending ? "Wysyłanie…" : "Wyślij propozycję"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}