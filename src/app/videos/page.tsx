"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export default function VideosPage() {
    const [videos, setVideos] = useState<Record<string, any>[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchVideos() {
            const { data } = await supabase.from('videos').select('*').order('created_at', { ascending: false });
            if (data) setVideos(data);
            setLoading(false);
        }
        fetchVideos();
    }, []);

    return (
        <div className="flex flex-col gap-8">
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
    );
}
