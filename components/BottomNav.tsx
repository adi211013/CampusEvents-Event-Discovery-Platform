"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, Plus, CalendarDays, Settings } from "lucide-react";
import { useStore } from "@/lib/store";

const leftItems = [
  { href: "/", icon: Home, label: "Home" },
  { href: "/odkrywaj", icon: Compass, label: "Odkrywaj" },
];

const rightItems = [
  { href: "/moje-wydarzenia", icon: CalendarDays, label: "Moje wydarzenia" },
  { href: "/ustawienia", icon: Settings, label: "Ustawienia" },
];

const BottomNav = () => {
  const pathname = usePathname();
  const openPropose = useStore((s) => s.openPropose);

  const navItem = ({
    href,
    icon: Icon,
    label,
  }: {
    href: string;
    icon: typeof Home;
    label: string;
  }) => {
    const active = pathname === href;
    return (
      <Link
        key={href}
        href={href}
        className="flex-1 flex flex-col items-center justify-center gap-0.5"
      >
        <Icon
          size={20}
          strokeWidth={active ? 2.5 : 1.8}
          className={active ? "text-accent" : "text-text-3"}
        />
        <span
          className={`text-[10px] leading-none ${active ? "text-accent font-semibold" : "text-text-3"}`}
        >
          {label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border h-15 flex md:hidden items-center">
      {leftItems.map(navItem)}

      <div className="flex-1 flex flex-col items-center justify-center gap-0.5">
        <button
          onClick={openPropose}
          className="w-11 h-11 rounded-full bg-accent flex items-center justify-center shadow-lg shadow-accent/30 -translate-y-3 cursor-pointer"
        >
          <Plus size={22} strokeWidth={2.5} className="text-white" />
        </button>
        <span className="text-[10px] select-none leading-none text-text-3 font-semibold -mt-3">
          Zaproponuj
        </span>
      </div>

      {rightItems.map(navItem)}
    </nav>
  );
};

export default BottomNav;
