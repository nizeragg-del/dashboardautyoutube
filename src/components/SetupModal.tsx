"use client";
import React, { useState } from 'react';
import { Settings, ExternalLink, ShieldCheck, AlertCircle, Save } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface SetupModalProps {
    userId: string;
    onComplete: () => void;
}

const SetupModal: React.FC<SetupModalProps> = ({ userId, onComplete }) => {
    const [keys, setKeys] = useState({
        gemini: '',
        elevenlabs: '',
        huggingface: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSave = async () => {
        if (!keys.gemini || !keys.elevenlabs || !keys.huggingface) {
            return setError('Por favor, preencha todas as chaves.');
        }
        setLoading(true);
        setError('');

        try {
            const { error: upsertError } = await supabase.from('profiles').upsert({
                id: userId,
                gemini_api_key: keys.gemini,
                elevenlabs_api_key: keys.elevenlabs,
                huggingface_api_key: keys.huggingface,
                updated_at: new Date().toISOString()
            });

            if (upsertError) throw upsertError;
            onComplete();
        } catch (err: unknown) {
            setError('Erro ao salvar: ' + (err instanceof Error ? err.message : String(err)));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="relative w-full max-w-lg bg-[#0f0f0f] border border-white/10 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 to-indigo-600"></div>

                <div className="p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-blue-600/10 rounded-2xl">
                            <Settings className="text-blue-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold italic">Setup Inicial</h2>
                            <p className="text-zinc-500 text-sm">Configure suas chaves para começar a gerar.</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <label className="text-zinc-400">Gemini AI Key (Google)</label>
                                <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                                    Obter Chave <ExternalLink size={12} />
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="Cole sua chave Gemini aqui..."
                                value={keys.gemini}
                                onChange={(e) => setKeys({ ...keys, gemini: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <label className="text-zinc-400">ElevenLabs API Key</label>
                                <a href="https://elevenlabs.io/app/settings/api-keys" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                                    Obter Chave <ExternalLink size={12} />
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="Cole sua chave ElevenLabs aqui..."
                                value={keys.elevenlabs}
                                onChange={(e) => setKeys({ ...keys, elevenlabs: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm font-medium">
                                <label className="text-zinc-400">Hugging Face API Key (Imagens)</label>
                                <a href="https://huggingface.co/settings/tokens" target="_blank" rel="noreferrer" className="text-blue-500 hover:underline flex items-center gap-1 text-xs">
                                    Obter Chave <ExternalLink size={12} />
                                </a>
                            </div>
                            <input
                                type="password"
                                placeholder="Cole seu Read Token do Hugging Face..."
                                value={keys.huggingface}
                                onChange={(e) => setKeys({ ...keys, huggingface: e.target.value })}
                                className="w-full bg-zinc-900/50 border border-white/5 rounded-xl p-3 text-white focus:border-blue-500 transition-all outline-none"
                            />
                        </div>

                        <div className="p-4 bg-zinc-900/50 rounded-2xl border border-white/5 space-y-2">
                            <div className="flex items-center gap-2 text-xs font-bold text-zinc-500 uppercase tracking-widest">
                                <ShieldCheck size={14} className="text-green-500" /> Segurança
                            </div>
                            <p className="text-[11px] text-zinc-600 leading-relaxed">
                                Suas chaves são armazenadas de forma criptografada no Supabase e usadas apenas para processar seus vídeos via GitHub Actions.
                            </p>
                        </div>

                        {error && (
                            <div className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-500 text-sm">
                                <AlertCircle size={16} /> {error}
                            </div>
                        )}

                        <button
                            onClick={handleSave}
                            disabled={loading}
                            className="w-full bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-blue-600/20 flex items-center justify-center gap-2 active:scale-95"
                        >
                            {loading ? 'Salvando...' : <><Save size={20} /> Salvar e Começar</>}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SetupModal;
