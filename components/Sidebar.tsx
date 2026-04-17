"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  CalendarDays,
  Settings,
  Plus,
  GraduationCap,
} from "lucide-react";

const navItems = [
  { href: "/", label: "Strona główna", icon: Home },
  { href: "/discover", label: "Odkryj", icon: Compass },
  { href: "/my-events", label: "Moje wydarzenia", icon: CalendarDays },
  { href: "/settings", label: "Ustawienia", icon: Settings },
];

export default function Sidebar() {
  const pathname = usePathname();

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

      <div className="p-2 shrink-0">
        <Link
          href="/events/new"
          className="flex items-center justify-center gap-2 w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold py-2 rounded-lg transition-colors"
        >
          <Plus className="size-4 shrink-0" />
          <span className="hidden lg:block">Zaproponuj</span>
        </Link>
      </div>
    </div>
  );
}
