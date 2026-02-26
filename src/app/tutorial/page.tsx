"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { KeyRound, ShieldAlert, Youtube, Mic, BrainCircuit, ExternalLink } from 'lucide-react';
import Link from 'next/link';

interface User {
    id: string;
    email?: string;
}

export default function TutorialPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function loadUser() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUser(session.user);
        }
        loadUser();
    }, []);

    const sections = [
        {
            id: 'gemini',
            title: '1. API do Google Gemini (Texto/Roteiro)',
            icon: <BrainCircuit className="text-blue-500" size={32} />,
            steps: [
                'Acesse o Google AI Studio (aistudio.google.com).',
                'Faça login com sua conta Google.',
                'Clique em "Get API Key" no menu lateral.',
                'Crie uma chave e copie. O acesso é totalmente gratuito até certos limites.'
            ],
            link: 'https://aistudio.google.com/app/apikey'
        },
        {
            id: 'elevenlabs',
            title: '2. API do ElevenLabs (Vozes Ultra Realistas)',
            icon: <Mic className="text-purple-500" size={32} />,
            steps: [
                'Acesse elevenlabs.io e crie uma conta gratuita.',
                'Clique no seu Perfil (canto superior direito) > Profile.',
                'Sua chave está escondida sob o ícone do olho na seção "API Key".',
                'Atenção: A conta grátis possui limite de 10.000 caracteres mensais.'
            ],
            link: 'https://elevenlabs.io/app/api-keys'
        },
        {
            id: 'huggingface',
            title: '3. Token do Hugging Face (Geração de Imagens)',
            icon: <ShieldAlert className="text-yellow-500" size={32} />,
            steps: [
                'Acesse huggingface.co e crie sua conta.',
                'Vá em Settings > Access Tokens.',
                'Crie um novo token com permissão de "Read" (leitura).',
                'Copie e cole este token para liberar o gerador de cenas.'
            ],
            link: 'https://huggingface.co/settings/tokens'
        },
        {
            id: 'youtube',
            title: '4. Integração Definitiva com YouTube',
            icon: <Youtube className="text-[#FF0000]" size={32} />,
            steps: [
                'Va no Google Cloud Console (console.cloud.google.com).',
                'Crie um Projeto. Na biblioteca (Library), ative "YouTube Data API v3".',
                'Em "Credenciais", crie um novo "OAuth Client ID" (App Web). Configure "http://localhost:3000" como Origem JavaScript autorizada e URI de redirecionamento para facilitar os testes.',
                'Copie o Client ID e Client Secret. Use um script Python local simples para pegar o Refresh Token (não expira).',
                'Anotamos o Refresh Token para a máquina nunca parar de apostar automaticamente.'
            ],
            link: 'https://console.cloud.google.com/apis/library/youtube.googleapis.com'
        }
    ];

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-youtube selection:text-white pb-20">
            {/* Header Minimalista */}
            <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-black"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                    </button>
                    <div className="text-xl font-bold tracking-tighter gradient-text">ViralEngine</div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <Link href="/settings" className="flex items-center gap-2 px-6 py-2 bg-[#FF0000]/10 border border-[#FF0000]/30 text-[#FF0000] rounded-full font-bold text-sm tracking-wide hover:bg-[#FF0000]/20 transition-all">
                        <KeyRound size={16} />
                        Inserir Chaves
                    </Link>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="relative pt-32 min-h-screen max-w-5xl mx-auto px-6 z-10 flex flex-col gap-12">

                <div className="text-center space-y-4">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight gradient-text">Guia de Implantação</h1>
                    <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
                        O ViralEngine utiliza inteligência artificial de ponta e sistemas de publicação direta. Por ser o seu próprio motor SaaS privado, você precisa das suas chaves de API.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {sections.map((section) => (
                        <div key={section.id} className="glass p-8 rounded-3xl border border-white/5 bg-white/[0.02] flex flex-col gap-6 relative group overflow-hidden hover:border-white/10 transition-colors">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 blur-[50px] -mr-16 -mt-16 group-hover:bg-white/10 transition-colors pointer-events-none"></div>

                            <div className="flex items-center gap-4">
                                <div className="p-4 bg-zinc-900 border border-white/5 rounded-2xl">
                                    {section.icon}
                                </div>
                                <h2 className="text-xl font-bold font-heading">{section.title}</h2>
                            </div>

                            <ul className="space-y-4 flex-1">
                                {section.steps.map((step, idx) => (
                                    <li key={idx} className="flex gap-3 text-zinc-400 text-sm leading-relaxed">
                                        <span className="text-zinc-600 font-bold">{idx + 1}.</span>
                                        {step}
                                    </li>
                                ))}
                            </ul>

                            <a
                                href={section.link}
                                target="_blank"
                                rel="noreferrer"
                                className="flex items-center justify-center gap-2 w-full py-4 mt-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] border border-white/5 transition-all text-sm font-bold tracking-wide"
                            >
                                Acessar Painel <ExternalLink size={16} />
                            </a>
                        </div>
                    ))}
                </div>

            </main>
        </div>
    );
}
