"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';

interface User {
    id: string;
    email?: string;
}

interface Video {
    id: string;
    title: string;
    created_at: string;
    status: string;
    [key: string]: unknown;
}

export default function VideosPage() {
    const [videos, setVideos] = useState<Video[]>([]);
    const [loading, setLoading] = useState(true);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        async function loadUser() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) setUser(session.user);
        }
        loadUser();
        async function fetchVideos() {
            const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
            if (data) setVideos(data as Video[]);
            setLoading(false);
        }
        fetchVideos();
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
                <div className="max-w-6xl mx-auto w-full px-6 flex flex-col gap-8 relative z-10">
                    <div>
                        <h1 className="text-4xl font-bold gradient-text">Histórico de Vídeos</h1>
                        <p className="text-zinc-400 mt-2">Veja e gerencie todas as produções da sua conta.</p>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-20 text-zinc-600 animate-pulse">Carregando galeria...</div>
                    ) : videos.length === 0 ? (
                        <div className="glass p-20 flex flex-col items-center gap-4 text-center">
                            <div className="text-4xl">🎬</div>
                            <div className="text-xl font-medium text-zinc-300">Nenhum vídeo gerado ainda.</div>
                            <p className="text-zinc-500 max-w-sm">Comece a criar sua primeira história viral agora mesmo no Dashboard!</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {videos.map((video) => (
                                <div key={video.id} className="glass overflow-hidden flex flex-col group cursor-pointer">
                                    <div className="aspect-video bg-zinc-900 flex items-center justify-center text-3xl group-hover:bg-zinc-800 transition-all">
                                        🖼️
                                    </div>
                                    <div className="p-6 flex flex-col gap-2">
                                        <h3 className="font-bold text-lg truncate">{video.title}</h3>
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-zinc-500">{new Date(video.created_at).toLocaleDateString()}</span>
                                            <span className="px-2 py-1 bg-green-950 text-green-500 rounded-md text-xs font-bold uppercase">{video.status}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
