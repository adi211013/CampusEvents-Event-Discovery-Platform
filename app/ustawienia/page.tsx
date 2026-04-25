"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useUser, useDisplayName } from "@/components/UserProvider";
import {
  Settings,
  User,
  Mail,
  Lock,
  Music,
  Code2,
  BookOpen,
  Dumbbell,
  Palette,
  Briefcase,
  Wrench,
  Check,
  EyeOff,
  Eye,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/categories";
import { Switch } from "@/components/ui/switch";
import { z } from "zod";
import { toast } from "sonner";

const baseSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Imię i nazwisko musi mieć co najmniej 2 znaki" }),
});

const fullSchema = baseSchema.extend({
  email: z.email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z.string().refine((val) => val === "" || val.length >= 8, {
    message: "Hasło musi mieć co najmniej 8 znaków",
  }),
});

const CATEGORY_ICONS: Record<string, import("react").ReactNode> = {
  festiwal: <Music className="size-3.5" />,
  tech: <Code2 className="size-3.5" />,
  nauka: <BookOpen className="size-3.5" />,
  sport: <Dumbbell className="size-3.5" />,
  kultura: <Palette className="size-3.5" />,
  kariera: <Briefcase className="size-3.5" />,
  warsztaty: <Wrench className="size-3.5" />,
};

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
  const user = useUser();
  const displayName = useDisplayName();
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const supabase = createClient();

  const isGoogleUser = user?.app_metadata?.provider === "google";

  const originEmail = user?.email || "";

  const [originName, setOriginName] = useState(displayName);
  const [userName, setUserName] = useState(displayName);
  const [userEmail, setUserEmail] = useState(originEmail);
  const [userPass, setUserPass] = useState("");

  useEffect(() => {
    if (displayName) {
      setOriginName(displayName);
      setUserName(displayName);
    }
  }, [displayName]);

  const [interests, setInterests] = useState<string[]>([]);
  const [notifications, setNotifications] = useState({
    email: false,
    reminders: false,
    recommendations: false,
  });

  useEffect(() => {
    supabase
      .from("profiles")
      .select("interests, notif_email, notif_reminders, notif_recommendations")
      .single()
      .then(({ data }) => {
        if (!data) return;
        setInterests(data.interests ?? []);
        setNotifications({
          email: data.notif_email ?? false,
          reminders: data.notif_reminders ?? false,
          recommendations: data.notif_recommendations ?? false,
        });
      });
  }, []);

  async function toggleInterest(id: string) {
    const updated = interests.includes(id)
      ? interests.filter((i) => i !== id)
      : [...interests, id];
    setInterests(updated);
    await supabase
      .from("profiles")
      .update({ interests: updated })
      .eq("id", user!.id);
  }

  async function toggleNotification(
    key: keyof typeof notifications,
    value: boolean,
  ) {
    setNotifications((prev) => ({ ...prev, [key]: value }));
    await supabase
      .from("profiles")
      .update({ [`notif_${key}`]: value })
      .eq("id", user!.id);
  }

  const hasChanges = isGoogleUser
    ? userName !== originName
    : userName !== originName || userEmail !== originEmail || userPass !== "";

  async function handleLogout() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    router.push("/");
    router.refresh();
  }

  const [errors, setErrors] = useState<{
    name?: string;
    email?: string;
    password?: string;
  }>({});

  async function handleSaveProfile() {
    const schema = isGoogleUser ? baseSchema : fullSchema;
    const result = schema.safeParse({
      name: userName,
      email: userEmail,
      password: userPass,
    });

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      for (const issue of result.error.issues) {
        const key = issue.path[0] as string;
        if (key && !fieldErrors[key]) fieldErrors[key] = issue.message;
      }
      setErrors({
        name: fieldErrors.name,
        email: fieldErrors.email,
        password: fieldErrors.password,
      });
      return;
    }

    setErrors({});

    if (userName !== originName) {
      await supabase
        .from("profiles")
        .update({ display_name: userName })
        .eq("id", user!.id);
      setOriginName(userName);
    }

    const updates: Parameters<typeof supabase.auth.updateUser>[0] = {};
    if (!isGoogleUser && userName !== originName)
      updates.data = { full_name: userName };
    if (!isGoogleUser && userEmail !== originEmail) updates.email = userEmail;
    if (!isGoogleUser && userPass !== "") updates.password = userPass;

    const hasAuthUpdates = Object.keys(updates).length > 0;

    if (hasAuthUpdates) {
      const { error } = await supabase.auth.updateUser(updates);
      if (error) {
        if (error.status === 422) {
          toast.error("Ten adres e-mail jest już zajęty");
        } else {
          toast.error("Coś poszło nie tak, spróbuj ponownie później");
        }
        return;
      }
      if (updates.email) {
        toast.info("Wysłano link potwierdzający na nowy adres e-mail");
        setUserEmail(originEmail);
        return;
      }
    }

    toast.success("Zmieniono dane");
    setUserPass("");
    router.refresh();
  }

  function GoogleIcon({ className }: { className?: string }) {
    return (
      <svg className={className} viewBox="0 0 24 24">
        <path
          fill="#4285F4"
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        />
        <path
          fill="#34A853"
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        />
        <path
          fill="#FBBC05"
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        />
        <path
          fill="#EA4335"
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        />
      </svg>
    );
  }

  return (
    <div className="p-6 text-text-1">
      <div>
        <h3 className="text-xl font-bold">Ustawienia</h3>
        <span className={"text-sm text-text-2"}>Profil i personalizacja</span>
      </div>
      <div className={"grid grid-cols-1 lg:grid-cols-2 gap-6"}>
        <div className={"bg-surface rounded-lg p-4"}>
          <p className={"font-bold pb-4"}>Profil</p>
          <div className={"flex items-center border-b border-border pb-4"}>
            <div
              className={
                "w-10 h-10 rounded-full flex items-center justify-center text-accent font-bold bg-background"
              }
            >
              {displayName
                ? displayName
                    .split(" ")
                    .map((n: string) => n[0])
                    .join("")
                : "?"}
            </div>
            <p className={"pl-4"}>{displayName}</p>
          </div>
          <div className={"mt-4"}>
            <div>
              <p className={"text-sm text-text-2"}>Imie i nazwisko</p>
              <div className={"relative"}>
                <User
                  className={
                    "absolute left-3 top-1/2 -translate-y-1/2 text-text-3 size-4 pointer-events-none"
                  }
                />
                <Input
                  value={userName}
                  className={"focus-visible:ring-0 pl-10"}
                  onChange={(e) => setUserName(e.target.value)}
                />
              </div>
              {errors.name && (
                <p className="text-xs text-red-500 mt-1">{errors.name}</p>
              )}
            </div>
            {isGoogleUser ? (
              <div className="mt-4 flex items-center gap-2 px-3 py-2.5 rounded-lg border border-border bg-background text-sm text-text-2">
                <GoogleIcon className="size-5" />
                <span>
                  Konto Google — email i hasło zarządzane przez Google
                </span>
              </div>
            ) : (
              <>
                <div className={"mt-4"}>
                  <p className={"text-sm text-text-2"}>Email</p>
                  <div className={"relative"}>
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3 size-4 pointer-events-none" />
                    <Input
                      value={userEmail}
                      className={"focus-visible:ring-0 pl-10"}
                      onChange={(e) => setUserEmail(e.target.value)}
                    />
                  </div>
                  {errors.email && (
                    <p className="text-xs text-red-500 mt-1">{errors.email}</p>
                  )}
                </div>
                <div className={"mt-4"}>
                  <p className={"text-sm text-text-2"}>Nowe hasło</p>
                  <div className={"relative"}>
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-text-3 size-4 pointer-events-none" />
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={userPass}
                      placeholder={"Hasło nie zmienione"}
                      className={"focus-visible:ring-0 pl-10"}
                      onChange={(e) => setUserPass(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="text-text-3 cursor-pointer hover:text-text-2 transition-colors absolute right-2 top-1/2 -translate-y-1/2"
                    >
                      {showPassword ? (
                        <EyeOff className="size-5" />
                      ) : (
                        <Eye className="size-5" />
                      )}
                    </button>
                  </div>
                  {errors.password && (
                    <p className="text-xs text-red-500 mt-1">
                      {errors.password}
                    </p>
                  )}
                </div>
              </>
            )}
          </div>
          <div className={"flex"}>
            <Button
              disabled={!hasChanges}
              onClick={handleSaveProfile}
              className={`mt-4 p-5 min-w-33 ${hasChanges ? "cursor-pointer bg-accent" : "cursor-default"}`}
            >
              {hasChanges ? "Zapisz zmiany" : "Brak zmian"}
            </Button>
            <Button
              onClick={() => handleLogout()}
              className={"mt-4 ml-4 p-5 cursor-pointer bg-red-500"}
            >
              Wyloguj
            </Button>
          </div>
        </div>
        <div className={"flex flex-col gap-6"}>
          <div className={"bg-surface rounded-lg p-4"}>
            <p className={"font-bold"}>Zainteresowania</p>
            <span className={"text-sm text-text-2"}>
              Wybierz kategorie — dopasujemy rekomendacje
            </span>
            <div className="flex flex-wrap gap-2 mt-4">
              {CATEGORIES.map((cat) => {
                const active = interests.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    onClick={() => toggleInterest(cat.id)}
                    style={
                      active
                        ? {
                            backgroundColor: cat.bg,
                            color: cat.color,
                            borderColor: cat.color,
                          }
                        : {}
                    }
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border text-sm font-medium text-text-2 hover:border-border-md transition-colors cursor-pointer"
                  >
                    {active ? (
                      <Check className="size-3.5" />
                    ) : (
                      <span style={{ color: cat.color }}>
                        {CATEGORY_ICONS[cat.id]}
                      </span>
                    )}
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className={"bg-surface rounded-lg p-4"}>
            <p className={"font-bold pb-4"}>Powiadomienia e-mail</p>
            <div>
              <div className={"flex items-center justify-between mb-4"}>
                <div>
                  <p className={"font-bold text-sm"}>Powiadomienia</p>
                  <span className={"text-xs text-text-2"}>
                    Informacje o nowych wydarzeniach
                  </span>
                </div>
                <Switch
                  checked={notifications.email}
                  onCheckedChange={(val) => toggleNotification("email", val)}
                  className={"cursor-pointer"}
                />
              </div>
              <div className={"flex items-center justify-between mb-4"}>
                <div>
                  <p className={"font-bold text-sm"}>Przypomnienia</p>
                  <span className={"text-xs text-text-2"}>
                    24h przed wydarzeniem
                  </span>
                </div>
                <Switch
                  checked={notifications.reminders}
                  onCheckedChange={(val) =>
                    toggleNotification("reminders", val)
                  }
                  className={"cursor-pointer"}
                />
              </div>
              <div className={"flex items-center justify-between mb-4"}>
                <div>
                  <p className={"font-bold text-sm"}>Rekomendacje</p>
                  <span className={"text-xs text-text-2"}>
                    Cotygodniowe propozycje
                  </span>
                </div>
                <Switch
                  checked={notifications.recommendations}
                  onCheckedChange={(val) =>
                    toggleNotification("recommendations", val)
                  }
                  className={"cursor-pointer"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default function UstawieniaPage() {
  const user = useUser();
  return user ? <SettingsView /> : <GuestView />;
}
