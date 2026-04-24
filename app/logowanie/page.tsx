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
  email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
  password: z
    .string()
    .min(8, { message: "Hasło musi mieć co najmniej 8 znaków" }),
});

const registerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Imię i nazwisko musi mieć co najmniej 2 znaki" }),
    email: z.string().email({ message: "Podaj prawidłowy adres e-mail" }),
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

export default function Page() {
  const [mode, setMode] = useState<Mode>("login");

  async function SignInWithGoogle() {
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
            onClick={() => SignInWithGoogle()}
            className="w-full flex items-center justify-center cursor-pointer gap-3 border border-border hover:border-border-md bg-surface text-text-1 text-sm font-semibold py-3 rounded-xl transition-colors"
          >
            Kontynuuj z Google
          </button>
        </div>
      </div>
    </div>
  );
}
