"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

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
    <main className="min-h-screen bg-cream flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-12">
          <p className="font-display text-3xl font-light italic text-charcoal mb-1">
            Anthony &amp; Alexandra
          </p>
          <p className="text-sm uppercase tracking-[0.2em] text-silver-dark font-sans">
            Panel de Administración
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-5">
          <Input
            id="email"
            type="email"
            label="Correo Electrónico"
            placeholder="alexa@ejemplo.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <Input
            id="password"
            type="password"
            label="Contraseña"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <p className="text-xs text-red-500 font-sans text-center">{error}</p>
          )}

          <Button type="submit" size="lg" loading={loading} className="w-full mt-2">
            Iniciar Sesión
          </Button>
        </form>
      </div>
    </main>
  );
}
