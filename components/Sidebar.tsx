"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  Home,
  Compass,
  CalendarDays,
  Settings,
  Plus,
  GraduationCap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

const navItems = [
  { href: "/", label: "Strona główna", icon: Home },
  { href: "/odkrywaj", label: "Odkryj", icon: Compass },
  { href: "/moje-wydarzenia", label: "Moje wydarzenia", icon: CalendarDays },
  { href: "/ustawienia", label: "Ustawienia", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="hidden md:flex flex-col fixed h-screen w-15 lg:w-50 bg-surface border-r border-border z-40">
      <div className="flex items-center justify-center gap-2 px-3 lg:px-4 h-14 border-b border-border shrink-0">
        <GraduationCap className="size-6 text-accent shrink-0" />
        <span className="hidden lg:block font-bold text-text-1 text-sm leading-tight">
          CampusEvents
        </span>
      </div>

      <nav className="flex flex-col gap-1 p-2 flex-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                active
                  ? "bg-accent-light border-accent text-accent font-semibold"
                  : "border-transparent text-text-2 hover:bg-accent-light hover:text-accent",
              ].join(" ")}
            >
              <Icon className="size-5 shrink-0" />
              <span className="hidden lg:block">{label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-2">
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-lg transition-colors h-10 cursor-pointer">
              <Plus className="size-4 shrink-0" />
              <span className="hidden lg:block">Zaproponuj</span>
            </Button>
          </DialogTrigger>
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
                  placeholder="np. Hackathon PRz 2025"
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
                className={"cursor-pointer"}
                variant="outline"
                onClick={() => setOpen(false)}
              >
                Anuluj
              </Button>
              <Button className="bg-accent hover:bg-accent/90 text-white font-semibold cursor-pointer">
                Wyślij propozycję
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
