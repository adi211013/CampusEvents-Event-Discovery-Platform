"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { GraduationCap, Mail, Lock, User, Eye, EyeOff } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "register";

const loginSchema = z.object({
  email: z.email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z
    .string()
    .min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Imię i nazwisko musi mieć co najmniej 2 znaki" }),
    email: z.email({ message: "Podaj prawidłowy adres e-mail" }),
    password: z
      .string()
      .min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
    confirm: z.string(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Hasła muszą być identyczne",
    path: ["confirm"],
  });

type LoginData = z.infer<typeof loginSchema>;
type RegisterData = z.infer<typeof registerSchema>;

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red mt-1">{message}</p>;
}

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginData>({ resolver: zodResolver(loginSchema) });

  const onSubmit = async (data: LoginData) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });
    if (error) {
      setServerError("Nieprawidłowy e-mail lub hasło.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-text-3 mb-1.5 block">E-mail</label>
        <div
          className={`flex items-center gap-3 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors ${errors.email ? "border-red" : "border-border"}`}
        >
          <Mail className="size-4 text-text-3 shrink-0" />
          <input
            {...register("email")}
            type="email"
            placeholder="j.kowalski@stud.prz.edu.pl"
            className="flex-1 text-sm text-text-1 bg-transparent outline-none placeholder:text-text-3"
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label className="text-xs text-text-3 mb-1.5 block">Hasło</label>
        <div
          className={`flex items-center gap-3 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors ${errors.password ? "border-red" : "border-border"}`}
        >
          <Lock className="size-4 text-text-3 shrink-0" />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="flex-1 text-sm text-text-1 bg-transparent outline-none placeholder:text-text-3"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-text-3 cursor-pointer hover:text-text-2 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      <div className="text-right">
        <button
          type="button"
          className="text-xs cursor-pointer text-accent hover:underline"
        >
          Zapomniałeś hasła?
        </button>
      </div>

      {serverError && (
        <p className="text-xs text-red text-center">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 cursor-pointer text-white text-sm font-semibold py-3 rounded-xl transition-colors mt-1"
      >
        {isSubmitting ? "Logowanie..." : "Zaloguj się"}
      </button>
    </form>
  );
}

function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterData) => {
    setServerError(null);
    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: { data: { full_name: data.name } },
    });
    if (error) {
      setServerError(error.message);
      return;
    }
    router.push("/");
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
      <div>
        <label className="text-xs text-text-3 mb-1.5 block">
          Imię i nazwisko
        </label>
        <div
          className={`flex items-center gap-3 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors ${errors.name ? "border-red" : "border-border"}`}
        >
          <User className="size-4 text-text-3 shrink-0" />
          <input
            {...register("name")}
            type="text"
            placeholder="Jan Kowalski"
            className="flex-1 text-sm text-text-1 bg-transparent outline-none placeholder:text-text-3"
          />
        </div>
        <FieldError message={errors.name?.message} />
      </div>

      <div>
        <label className="text-xs text-text-3 mb-1.5 block">E-mail</label>
        <div
          className={`flex items-center gap-3 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors ${errors.email ? "border-red" : "border-border"}`}
        >
          <Mail className="size-4 text-text-3 shrink-0" />
          <input
            {...register("email")}
            type="email"
            placeholder="j.kowalski@stud.prz.edu.pl"
            className="flex-1 text-sm text-text-1 bg-transparent outline-none placeholder:text-text-3"
          />
        </div>
        <FieldError message={errors.email?.message} />
      </div>

      <div>
        <label className="text-xs text-text-3 mb-1.5 block">Hasło</label>
        <div
          className={`flex items-center gap-3 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors ${errors.password ? "border-red" : "border-border"}`}
        >
          <Lock className="size-4 text-text-3 shrink-0" />
          <input
            {...register("password")}
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            className="flex-1 text-sm text-text-1 bg-transparent outline-none placeholder:text-text-3"
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="text-text-3 cursor-pointer hover:text-text-2 transition-colors"
          >
            {showPassword ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <FieldError message={errors.password?.message} />
      </div>

      <div>
        <label className="text-xs text-text-3 mb-1.5 block">
          Potwierdź hasło
        </label>
        <div
          className={`flex items-center gap-3 border rounded-xl px-3 py-2.5 focus-within:border-accent transition-colors ${errors.confirm ? "border-red" : "border-border"}`}
        >
          <Lock className="size-4 text-text-3 shrink-0" />
          <input
            {...register("confirm")}
            type={showConfirm ? "text" : "password"}
            placeholder="••••••••"
            className="flex-1 text-sm text-text-1 bg-transparent outline-none placeholder:text-text-3"
          />
          <button
            type="button"
            onClick={() => setShowConfirm((v) => !v)}
            className="text-text-3 cursor-pointer hover:text-text-2 transition-colors"
          >
            {showConfirm ? (
              <EyeOff className="size-4" />
            ) : (
              <Eye className="size-4" />
            )}
          </button>
        </div>
        <FieldError message={errors.confirm?.message} />
      </div>

      {serverError && (
        <p className="text-xs text-red text-center">{serverError}</p>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-accent hover:bg-accent/90 disabled:opacity-60 cursor-pointer text-white text-sm font-semibold py-3 rounded-xl transition-colors mt-1"
      >
        {isSubmitting ? "Rejestracja..." : "Zarejestruj się"}
      </button>
    </form>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

export default function Page() {
  const [mode, setMode] = useState<Mode>("login");

  async function signInWithGoogle() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
  }

  return (
    <div className="flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-2">
            <GraduationCap className="size-7 text-accent" />
            <span className="font-bold text-text-1 text-xl">CampusEvents</span>
          </div>
          <p className="text-text-3 text-sm">Politechnika Rzeszowska</p>
        </div>

        <div className="bg-surface rounded-2xl border border-border p-8">
          <div className="flex rounded-xl bg-background p-1 mb-6">
            <button
              onClick={() => setMode("login")}
              className={[
                "flex-1 cursor-pointer py-2 text-sm font-semibold rounded-lg transition-colors",
                mode === "login"
                  ? "bg-surface text-text-1 shadow-sm"
                  : "text-text-2 hover:text-text-1",
              ].join(" ")}
            >
              Zaloguj się
            </button>
            <button
              onClick={() => setMode("register")}
              className={[
                "flex-1 cursor-pointer py-2 text-sm font-semibold rounded-lg transition-colors",
                mode === "register"
                  ? "bg-surface text-text-1 shadow-sm"
                  : "text-text-2 hover:text-text-1",
              ].join(" ")}
            >
              Zarejestruj się
            </button>
          </div>

          {mode === "login" ? <LoginForm /> : <RegisterForm />}

          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px bg-border" />
            <span className="text-xs text-text-3">lub</span>
            <div className="flex-1 h-px bg-border" />
          </div>
          <button
            onClick={signInWithGoogle}
            className="w-full flex items-center justify-center cursor-pointer gap-3 border border-border hover:border-border-md bg-surface text-text-1 text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            <GoogleIcon className="size-5" />
            Kontynuuj z Google
          </button>
        </div>
      </div>
    </div>
  );
}
