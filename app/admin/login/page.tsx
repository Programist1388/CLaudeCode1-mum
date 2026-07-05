"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Wrap } from "@/components/layout/Wrap";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError("Неверный email или пароль");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-bg">
      <Wrap className="w-full max-w-[380px]">
        <div className="rounded-[8px] border border-line bg-card p-8">
          <h1 className="mb-6 font-serif text-2xl font-semibold text-text">
            Вход в админ-панель
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <label className="text-sm text-text-dim">
              Email
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
              />
            </label>

            <label className="text-sm text-text-dim">
              Пароль
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-2 w-full rounded-[8px] border border-line bg-bg-soft p-3 text-text focus:border-gold focus:outline-none"
              />
            </label>

            {error && <p className="text-sm text-rose">{error}</p>}

            <button
              type="submit"
              disabled={loading}
              className="mt-2 rounded-full bg-gold px-6 py-3 text-sm font-semibold tracking-[0.03em] text-bg uppercase transition-transform hover:-translate-y-0.5 disabled:opacity-60"
            >
              {loading ? "Входим..." : "Войти"}
            </button>
          </form>
        </div>
      </Wrap>
    </main>
  );
}
