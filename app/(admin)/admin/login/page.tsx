"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Input } from "@/components/ui/Input";
import { PearlButton } from "@/components/ui/pearl-button";

// Entrada al panel de los novios. Celular: la foto de los novios arriba, fundida en el
// fondo claro, y el formulario debajo. Computadora: foto a la izquierda y formulario a la derecha.
// La foto es love-06.jpeg sin la franja izquierda, donde había un letrero de estacionamiento.
export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Correo o contraseña incorrectos.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-[100svh] bg-cream lg:grid lg:grid-cols-2">
      <div className="relative h-[46svh] min-h-64 lg:sticky lg:top-0 lg:h-[100svh]">
        <Image
          src="/images/panel/login-novios.jpg"
          alt="Anthony y Alexandra abrazados"
          fill
          priority
          sizes="(min-width: 1024px) 50vw, 100vw"
          className="object-cover object-[50%_18%]"
        />
        <div
          className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(58,43,36,0)_45%,rgba(246,230,222,0.55)_75%,#faf5ef_100%)] lg:bg-[linear-gradient(to_right,rgba(58,43,36,0)_60%,rgba(250,245,239,0.6)_88%,#faf5ef_100%)]"
          aria-hidden="true"
        />
      </div>

      <div className="relative -mt-16 flex justify-center px-6 pb-10 lg:mt-0 lg:items-center lg:px-12">
        <div className="w-full max-w-sm">
          <div className="mb-7 text-center">
            <p className="font-script text-[2.75rem] leading-none text-gold-dark [text-shadow:0_1px_0_rgba(255,253,249,0.8)] lg:text-6xl">
              Anthony &amp; Alexandra
            </p>
            <p className="mt-2 text-[0.68rem] uppercase tracking-[0.3em] text-muted">Panel de los novios</p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-4">
            <Input
              id="email"
              type="email"
              label="Correo"
              autoComplete="email"
              placeholder="tu@correo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              id="password"
              type="password"
              label="Contraseña"
              autoComplete="current-password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            {error && (
              <p role="alert" className="text-center font-body text-sm text-red-700">
                {error}
              </p>
            )}

            <PearlButton type="submit" disabled={loading} label={loading ? "Entrando…" : "Entrar"} className="mt-2 w-full" />
          </form>
        </div>
      </div>
    </main>
  );
}
