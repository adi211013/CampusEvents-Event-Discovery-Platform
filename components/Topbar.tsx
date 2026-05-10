"use client";
import React from "react";
import { SlidersHorizontal } from "lucide-react";
import { useUser, useDisplayName } from "@/components/UserProvider";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { usePathname } from "next/navigation";
import { useStore } from "@/lib/store";

const Topbar = () => {
  const user = useUser();
  const displayName = useDisplayName();
  const pathname = usePathname();
  const isHome = pathname === "/";
  const openDrawer = useStore((s) => s.openDrawer);

  return (
    <div className="h-14 border-b border-border bg-surface flex items-center justify-end gap-3 px-4">
      {isHome && (
        <Button
          onClick={openDrawer}
          className="lg:hidden flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-lg h-9 px-3 cursor-pointer"
        >
          <SlidersHorizontal className="size-4 shrink-0" />
          <span className="hidden md:inline">Filtry</span>
        </Button>
      )}
      {user ? (
        <div className="flex items-center gap-3">
          <span className="text-sm text-text-1 hidden md:block">{displayName}</span>
          <div className="w-9 h-9 rounded-full flex items-center justify-center text-accent font-bold bg-background shrink-0">
            {displayName
              ? displayName.split(" ").map((n: string) => n[0]).join("")
              : "?"}
          </div>
        </div>
      ) : (
        <Link
          href="/logowanie"
          className="bg-accent hover:bg-accent/90 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors whitespace-nowrap"
        >
          Zaloguj lub załóż konto
        </Link>
      )}
    </div>
  );
};

export default Topbar;
