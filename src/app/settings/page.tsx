'use client';
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation";
import Sidebar from '@/components/Sidebar';

interface User {
    id: string;
    email?: string;
}

interface Profile {
    gemini_api_key?: string;
    elevenlabs_api_key?: string;
    huggingface_api_key?: string;
    preferred_voice_id?: string;
    github_token?: string;
    github_repo?: string;
    yt_refresh_token?: string;
}

export default function SettingsPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [keys, setKeys] = useState<Record<string, string>>({
        gemini: '',
        elevenlabs: '',
        huggingface: '',
        voice_id: 'pqHfZKP75CvOlQylNhV4',
        github_token: '',
        github_repo: '',
        yt_refresh_token: '',
    });
    const router = useRouter();

    useEffect(() => {
        async function loadProfile() {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                router.push("/login");
                return;
            }
            setUser(session.user);

            const { data } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .single();

            if (data) {
                const profile = data as Profile;
                const tempToken = sessionStorage.getItem('yt_refresh_token');

                setKeys({
                    gemini: profile.gemini_api_key || '',
                    elevenlabs: profile.elevenlabs_api_key || '',
                    huggingface: profile.huggingface_api_key || '',
                    voice_id: profile.preferred_voice_id || 'pqHfZKP75CvOlQylNhV4',
                    github_token: profile.github_token || '',
                    github_repo: profile.github_repo || '',
                    yt_refresh_token: tempToken || profile.yt_refresh_token || '',
                });

                if (tempToken) {
                    sessionStorage.removeItem('yt_refresh_token');
                }
            }
        }
        loadProfile();
    }, [router]);

    const saveSettings = async () => {
        if (!user) return;
        setLoading(true);
        try {
            const { error } = await supabase.from('profiles').upsert({
                id: user.id,
                gemini_api_key: keys.gemini,
                elevenlabs_api_key: keys.elevenlabs,
                huggingface_api_key: keys.huggingface,
                preferred_voice_id: keys.voice_id,
                github_token: keys.github_token,
                github_repo: keys.github_repo,
                yt_refresh_token: keys.yt_refresh_token,
                updated_at: new Date().toISOString(),
            });

            if (error) throw error;
            alert('Configurações salvas com sucesso!');
        } catch (error: unknown) {
            console.error("Erro detalhado:", error);
            let message = "Erro inesperado";
            if (error instanceof Error) {
                message = error.message;
            } else if (typeof error === 'object' && error !== null) {
                const errObj = error as Record<string, unknown>;
                message = String(errObj.message || errObj.error_description || JSON.stringify(error));
            } else {
                message = String(error);
            }
            alert('Erro ao salvar: ' + message);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setKeys((prev: Record<string, string>) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setKeys(prev => ({ ...prev, voice_id: e.target.value }));
    };

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
                        <h1 className="text-4xl font-bold gradient-text">Configurações SaaS</h1>
                        <p className="text-zinc-400 mt-2">Gerencie suas chaves de API e preferências do motor.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* API Keys Card */}
                        <div className="glass p-8 flex flex-col gap-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                🔑 Gerenciamento de Chaves (IA)
                            </h2>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm text-zinc-500 mb-1 block">Gemini API Key</label>
                                    <input
                                        name="gemini"
                                        type="password"
                                        className="input-field"
                                        value={keys.gemini}
                                        onChange={handleInputChange}
                                        placeholder="sk-..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-500 mb-1 block">ElevenLabs API Key</label>
                                    <input
                                        name="elevenlabs"
                                        type="password"
                                        className="input-field"
                                        value={keys.elevenlabs}
                                        onChange={handleInputChange}
                                        placeholder="eleven_..."
                                    />
                                </div>
                                <div>
                                    <label className="text-sm text-zinc-500 mb-1 block">Hugging Face Token</label>
                                    <input
                                        name="huggingface"
                                        type="password"
                                        className="input-field"
                                        value={keys.huggingface}
                                        onChange={handleInputChange}
                                        placeholder="hf_..."
                                    />
                                </div>
                            </div>
                        </div>

                        {/* GitHub Integration - Oculto/Automático */}
                        <div className="hidden">
                            <input name="github_token" value={keys.github_token} readOnly />
                            <input name="github_repo" value={keys.github_repo} readOnly />
                        </div>

                        {/* YouTube Integration Card */}
                        <div className="glass p-8 flex flex-col gap-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                📺 Publicação (YouTube OAuth)
                            </h2>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm text-zinc-500 mb-1 block">Status do Canal</label>
                                    <div className="flex items-center justify-between p-4 bg-zinc-900/50 border border-white/5 rounded-xl">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${keys.yt_refresh_token ? 'bg-green-500' : 'bg-red-500'} animate-pulse`}></div>
                                            <span className="font-medium text-sm">
                                                {keys.yt_refresh_token ? 'Canal Conectado e Autorizado' : 'Nenhum canal vinculado'}
                                            </span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => window.location.href = '/api/youtube/auth'}
                                            className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-bold transition-colors"
                                        >
                                            {keys.yt_refresh_token ? 'Reconectar Canal' : 'Vincular YouTube'}
                                        </button>
                                    </div>
                                    {keys.yt_refresh_token && (
                                        <p className="text-xs text-green-500/80 mt-2 ml-1">✓ Token de renovação capturado em segurança.</p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Voice Settings */}
                        <div className="glass p-8 flex flex-col gap-6">
                            <h2 className="text-xl font-semibold flex items-center gap-2">
                                🎙️ Preferências de Áudio
                            </h2>

                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="text-sm text-zinc-500 mb-1 block">Voz Preferida (ElevenLabs ID)</label>
                                    <select
                                        className="input-field bg-zinc-900"
                                        value={keys.voice_id}
                                        onChange={handleSelectChange}
                                    >
                                        <option value="pqHfZKP75CvOlQylNhV4">Bill (Sábio/Maduro)</option>
                                        <option value="pNInz6obpgdqG0uD9nnd">Narrador Padrão (Adam)</option>
                                    </select>
                                </div>

                                <div className="p-4 bg-blue-600/5 border border-blue-600/20 rounded-lg text-sm text-blue-400">
                                    💡 <strong>Dica:</strong> O motor rodará como um Workflow no GitHub Actions. Certifique-se de que o Workflow Dispatch está ativado no repo.
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pb-10">
                        <button
                            onClick={saveSettings}
                            disabled={loading}
                            className="bg-[#FF0000] hover:bg-[#CC0000] disabled:opacity-50 text-white font-bold py-3 px-8 rounded-full transition-all tracking-wide shadow-[0_0_20px_rgba(255,0,0,0.2)] active:scale-95"
                        >
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
