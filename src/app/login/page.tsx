"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Rocket } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMessage(`Erro: ${error.message}`);
    } else {
      router.push("/");
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#121212] border border-[#222] p-8 rounded-2xl shadow-2xl">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <Rocket className="text-blue-500 w-8 h-8" />
          <span className="text-2xl font-bold tracking-tight">ViralEngine</span>
        </div>

        <h1 className="text-2xl font-bold mb-2 text-center">Bem-vindo de volta</h1>
        <p className="text-gray-400 text-sm mb-8 text-center">Acesse sua conta para gerenciar seus virais</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">E-mail</label>
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Senha</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
              className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 focus:outline-none focus:border-blue-500 transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-all transform active:scale-95 disabled:opacity-50"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        {message && <p className="mt-4 text-center text-red-500 text-sm bg-red-500/10 py-2 rounded">{message}</p>}

        <p className="mt-8 text-center text-gray-400 text-sm">
          Não tem uma conta?{" "}
          <Link href="/signup" className="text-blue-500 hover:underline">
            Cadastre-se
          </Link>
        </p>
      </div>
    </div>
  );
}
