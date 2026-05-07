"use client";
import React from "react";
import { Input } from "@/components/ui/input";
import { Search, SlidersHorizontal } from "lucide-react";
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
    <div className={"h-14 border-b border-border bg-surface flex"}>
      <div className="w-full flex items-center justify-center">
        <div className="relative w-11/12">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-text-3 pointer-events-none" />
          <Input
            placeholder="Wyszukaj eventy"
            className="pl-9 bg-background focus-visible:ring-0 focus-visible:border-border"
          />
        </div>
      </div>
      {isHome && (
        <div className="lg:hidden flex items-center pr-2">
          <Button
            onClick={openDrawer}
            className="flex items-center gap-2 bg-accent hover:bg-accent/90 text-white text-sm font-semibold rounded-lg h-9 px-3 cursor-pointer"
          >
            <SlidersHorizontal className="size-4 shrink-0" />
            <span className="hidden md:inline">Filtry</span>
          </Button>
        </div>
      )}
      {user ? (
        <div className="w-80 flex items-center justify-end pr-5">
          <div className={"pr-4"}>{displayName}</div>
          <div
            className={
              "w-9 h-9 rounded-full flex items-center justify-center text-accent font-bold bg-background"
            }
          >
            {displayName
              ? displayName
                  .split(" ")
                  .map((n: string) => n[0])
                  .join("")
              : "?"}
          </div>
        </div>
      ) : (
        <div className={"w-80 flex items-center justify-end pr-5"}>
          <Link
            href="/logowanie"
            className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold py-2 rounded-xl text-center transition-colors"
          >
            Zaloguj lub załóż konto
          </Link>
        </div>
      )}
    </div>
  );
};

export default Topbar;
