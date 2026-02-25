"use client";
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation";

interface User {
    id: string;
    email?: string;
}

export default function SettingsPage() {
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [keys, setKeys] = useState({
        gemini: '',
        elevenlabs: '',
        huggingface: '',
        voice_id: 'pqHfZKP75CvOlQylNhV4',
        github_token: '',
        github_repo: '',
        yt_client_id: '',
        yt_client_secret: '',
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
                setKeys({
                    gemini: data.gemini_api_key || '',
                    elevenlabs: data.elevenlabs_api_key || '',
                    huggingface: data.huggingface_api_key || '',
                    voice_id: data.preferred_voice_id || 'pqHfZKP75CvOlQylNhV4',
                    github_token: data.github_token || '',
                    github_repo: data.github_repo || '',
                    yt_client_id: data.yt_client_id || '',
                    yt_client_secret: data.yt_client_secret || '',
                    yt_refresh_token: data.yt_refresh_token || '',
                });
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
                yt_client_id: keys.yt_client_id,
                yt_client_secret: keys.yt_client_secret,
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
                message = (error as any).message || (error as any).error_description || JSON.stringify(error);
            } else {
                message = String(error);
            }
            alert('Erro ao salvar: ' + message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto flex flex-col gap-8">
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
                                type="password"
                                className="input-field"
                                value={keys.gemini}
                                onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                                placeholder="sk-..."
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500 mb-1 block">ElevenLabs API Key</label>
                            <input
                                type="password"
                                className="input-field"
                                value={keys.elevenlabs}
                                onChange={(e) => setKeys({ ...keys, elevenlabs: e.target.value })}
                                placeholder="eleven_..."
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500 mb-1 block">Hugging Face Token</label>
                            <input
                                type="password"
                                className="input-field"
                                value={keys.huggingface}
                                onChange={(e) => setKeys({ ...keys, huggingface: e.target.value })}
                                placeholder="hf_..."
                            />
                        </div>
                    </div>
                </div>

                {/* GitHub Integration Card */}
                <div className="glass p-8 flex flex-col gap-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        🐙 Execução (GitHub Actions)
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-zinc-500 mb-1 block">GitHub Personal Access Token (PAT)</label>
                            <input
                                type="password"
                                className="input-field"
                                value={keys.github_token}
                                onChange={(e) => setKeys({ ...keys, github_token: e.target.value })}
                                placeholder="ghp_..."
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500 mb-1 block">Repositório (usuário/repo)</label>
                            <input
                                type="text"
                                className="input-field"
                                value={keys.github_repo}
                                onChange={(e) => setKeys({ ...keys, github_repo: e.target.value })}
                                placeholder="nizera/viral-engine"
                            />
                        </div>
                    </div>
                </div>

                {/* YouTube Integration Card */}
                <div className="glass p-8 flex flex-col gap-6">
                    <h2 className="text-xl font-semibold flex items-center gap-2">
                        📺 Publicação (YouTube OAuth)
                    </h2>

                    <div className="flex flex-col gap-4">
                        <div>
                            <label className="text-sm text-zinc-500 mb-1 block">YouTube Client ID</label>
                            <input
                                type="text"
                                className="input-field"
                                value={keys.yt_client_id}
                                onChange={(e) => setKeys({ ...keys, yt_client_id: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500 mb-1 block">YouTube Client Secret</label>
                            <input
                                type="password"
                                className="input-field"
                                value={keys.yt_client_secret}
                                onChange={(e) => setKeys({ ...keys, yt_client_secret: e.target.value })}
                            />
                        </div>
                        <div>
                            <label className="text-sm text-zinc-500 mb-1 block">YouTube Refresh Token</label>
                            <input
                                type="password"
                                className="input-field"
                                value={keys.yt_refresh_token}
                                onChange={(e) => setKeys({ ...keys, yt_refresh_token: e.target.value })}
                            />
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
                                onChange={(e) => setKeys({ ...keys, voice_id: e.target.value })}
                            >
                                <option value="pqHfZKP75CvOlQylNhV4">Bill (Sábio/Maduro)</option>
                                <option value="onwK4e9ZLuTAKqD09mOe">Narrador Padrão</option>
                            </select>
                        </div>

                        <div className="p-4 bg-blue-600/5 border border-blue-600/20 rounded-lg text-sm text-blue-400">
                            💡 <strong>Dica:</strong> O motor rodará como um Workflow no GitHub Actions. Certifique-se de que o Workflow Dispatch está ativado no repo.
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    onClick={saveSettings}
                    disabled={loading}
                    className="btn-primary"
                >
                    {loading ? 'Salvando...' : 'Salvar Alterações'}
                </button>
            </div>
        </div>
    );
}
