"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';

interface User {
    id: string;
    email?: string;
}

export default function SchedulerPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function loadUser() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUser(session.user);
        }
        loadUser();
    }, []);

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
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="relative pt-32 min-h-screen flex flex-col items-center overflow-hidden">
                <div className="max-w-4xl mx-auto w-full px-6 flex flex-col gap-8 relative z-10">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text">Agendamento Inteligente</h1>
                        <p className="text-zinc-400 mt-2">Planeje sua dominância no YouTube com automação total.</p>
                    </div>

                    <div className="glass p-12 flex flex-col items-center gap-6 text-center">
                        <div className="text-6xl animate-bounce">🗓️</div>
                        <h2 className="text-2xl font-bold">Em breve em sua conta Premium</h2>
                        <p className="text-zinc-500 max-w-lg">
                            Estamos finalizando o motor de agendamento por calendário. Em breve você poderá programar postagens semanais com temas diferentes e o ViralEngine cuidará de tudo sozinho.
                        </p>
                        <div className="flex gap-4">
                            <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-sm">📅 Calendário Drag & Drop</div>
                            <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-sm">⏰ Horários de Pico Automáticos</div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
