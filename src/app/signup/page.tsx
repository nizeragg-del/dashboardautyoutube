"use client";

import React, { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { Rocket } from "lucide-react";

export default function SignupPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");

        // Cadastro no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            setMessage(`Erro: ${authError.message}`);
            setLoading(false);
            return;
        }

        if (authData.user) {
            // Criar perfil na tabela profiles (assumindo que o trigger do Supabase possa não estar configurado)
            // O Supabase geralmente lida com isso se houver um trigger, mas vamos garantir ou informar o sucesso.
            setMessage("Cadastro realizado com sucesso! Verifique seu e-mail para confirmar.");
            setTimeout(() => router.push("/login"), 3000);
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

                <h1 className="text-2xl font-bold mb-2 text-center">Crie sua fábrica</h1>
                <p className="text-gray-400 text-sm mb-8 text-center">Comece a automatizar seus vídeos hoje mesmo</p>

                <form onSubmit={handleSignup} className="space-y-4">
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
                        {loading ? "Criando conta..." : "Criar Conta Free"}
                    </button>
                </form>

                {message && (
                    <p className={`mt-4 text-center text-sm py-2 rounded ${message.includes("sucesso") ? "text-green-500 bg-green-500/10" : "text-red-500 bg-red-500/10"}`}>
                        {message}
                    </p>
                )}

                <p className="mt-8 text-center text-gray-400 text-sm">
                    Já tem uma conta?{" "}
                    <Link href="/login" className="text-blue-500 hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}
