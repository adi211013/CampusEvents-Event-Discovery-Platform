"use client";

import { useState } from "react";
import Link from "next/link";
import { useUser } from "@/components/UserProvider";
import {
  User,
  Mail,
  Lock,
  LogOut,
  Settings,
  Music,
  Code,
  FlaskConical,
  Dumbbell,
  Theater,
  Briefcase,
  Wrench,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

const categories = [
  {
    id: "festiwal",
    label: "Festiwal",
    icon: Music,
    color: "#F59E0B",
    bg: "#FEF3C7",
  },
  {
    id: "tech",
    label: "Tech & IT",
    icon: Code,
    color: "#1D5EF3",
    bg: "#EEF3FE",
  },
  {
    id: "nauka",
    label: "Nauka",
    icon: FlaskConical,
    color: "#10B981",
    bg: "#D1FAE5",
  },
  {
    id: "sport",
    label: "Sport",
    icon: Dumbbell,
    color: "#F97316",
    bg: "#FED7AA",
  },
  {
    id: "kultura",
    label: "Kultura",
    icon: Theater,
    color: "#8B5CF6",
    bg: "#EDE9FE",
  },
  {
    id: "kariera",
    label: "Kariera",
    icon: Briefcase,
    color: "#0891B2",
    bg: "#CFFAFE",
  },
  {
    id: "warsztaty",
    label: "Warsztaty",
    icon: Wrench,
    color: "#059669",
    bg: "#A7F3D0",
  },
];

function GuestView() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
      <div className="bg-surface rounded-2xl border border-border p-10 flex flex-col items-center text-center max-w-sm w-full">
        <div className="bg-accent-light rounded-full p-4 mb-4">
          <Settings className="size-8 text-accent" />
        </div>
        <h2 className="text-xl font-bold text-text-1 mb-2">Ustawienia konta</h2>
        <p className="text-text-2 text-sm mb-6">
          Zaloguj się, aby zarządzać profilem, zainteresowaniami i
          powiadomieniami.
        </p>
        <Link
          href="/logowanie"
          className="w-full bg-accent hover:bg-accent/90 text-white text-sm font-semibold py-3 rounded-xl text-center transition-colors mb-3"
        >
          Zaloguj lub załóż konto
        </Link>
        <Link
          href="/"
          className="w-full border border-border hover:border-border-md hover:bg-surface text-text-1 text-sm font-semibold py-3 rounded-xl text-center transition-colors"
        >
          Przeglądaj wydarzenia
        </Link>
      </div>
    </div>
  );
}

function SettingsView() {
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const supabase = createClient();
  const user = useUser();

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      setServerError(error.message);
      console.log(error);
    }
    router.push("/");
    router.refresh();
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Ustawienia dla {user?.email}</h2>
      <button
        onClick={() => handleLogout()}
        className="flex items-center cursor-pointer gap-2 px-4 py-2 mt-4 bg-red-100 text-red-600 rounded-lg font-medium transition-colors"
      >
        <LogOut className="size-4" />
        Wyloguj
      </button>
    </div>
  );
}
export default function UstawieniaPage() {
  const user = useUser();
  return user ? <SettingsView /> : <GuestView />;
}
