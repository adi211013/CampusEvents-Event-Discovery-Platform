"use client";

import { useStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ProposeEventModal() {
  const { proposeOpen, closePropose } = useStore();

  return (
    <Dialog open={proposeOpen} onOpenChange={(o) => !o && closePropose()}>
      <DialogContent
        aria-describedby={undefined}
        className="sm:max-w-120 rounded-2xl"
      >
        <DialogHeader>
          <DialogTitle className="text-text-1 text-lg font-bold">
            Zaproponuj wydarzenie
          </DialogTitle>
          <p className="text-sm text-text-2">
            Wypełnij formularz, a my zajmiemy się resztą.
          </p>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-1">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-1">
              Tytuł <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="np. Hackathon PRz 2026"
              className="h-9 focus-visible:ring-0"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-text-1">
                Link do wydarzenia
              </label>
              <span className="text-[11px] text-text-3 bg-[#F3F4F6] px-1.5 py-0.5 rounded font-medium">
                opcjonalne
              </span>
            </div>
            <Input
              type="url"
              placeholder="https://..."
              className="h-9 focus-visible:ring-0"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-1">
                Data <span className="text-red-500">*</span>
              </label>
              <Input type="date" className="h-9 focus-visible:ring-0" />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-text-1">
                Lokalizacja <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="np. Aula PRz, bud. V"
                className="h-9 focus-visible:ring-0"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-text-1">
              Krótki opis <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={3}
              placeholder="Opisz wydarzenie w kilku zdaniach..."
              className="w-full min-w-0 resize-none rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-0"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            className="cursor-pointer"
            variant="outline"
            onClick={closePropose}
          >
            Anuluj
          </Button>
          <Button className="bg-accent hover:bg-accent/90 text-white font-semibold cursor-pointer">
            Wyślij propozycję
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
