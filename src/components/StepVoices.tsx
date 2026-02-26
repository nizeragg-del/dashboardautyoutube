"use client";
import React, { useState } from 'react';
import { Play, Pause, CheckCircle2 } from 'lucide-react';

interface Voice {
    id: string;
    name: string;
    preview_url: string;
    tags: string[];
}

interface StepVoicesProps {
    onNext: () => void;
    onBack: () => void;
    onSelectVoice: (voiceId: string) => void;
    selectedVoice?: string;
}

const StepVoices: React.FC<StepVoicesProps> = ({ onNext, onBack, onSelectVoice, selectedVoice }) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const voices: Voice[] = [
        { id: '21m00Tcm4TlvDq8ikWAM', name: 'Rachel (Suave)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3', tags: ['Calma', 'Explicativa'] },
        { id: '29vD33N1CtxCmqQRPOHJ', name: 'Drew (Noticiário)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/29vD33N1CtxCmqQRPOHJ.mp3', tags: ['Sério', 'Profissional'] },
        { id: '2EiwWnXFnvU5JabPnv8n', name: 'Clyde (Épico)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/2EiwWnXFnvU5JabPnv8n.mp3', tags: ['Dramático', 'Voz Grave'] },
        { id: 'EXAVITQu4vr4ARTe9EBX', name: 'Bella (Entusiasta)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/EXAVITQu4vr4ARTe9EBX.mp3', tags: ['Energética', 'Jovem'] }
    ];

    const togglePlay = (voice: Voice) => {
        if (playingId === voice.id) {
            audio?.pause();
            setPlayingId(null);
        } else {
            audio?.pause();
            const newAudio = new Audio(voice.preview_url);
            newAudio.play();
            newAudio.onended = () => setPlayingId(null);
            setAudio(newAudio);
            setPlayingId(voice.id);
        }
    };

    return (
        <div className="flex flex-col gap-12 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight gradient-text">
                    Narração AI
                </h1>
                <p className="text-zinc-500 text-lg font-medium">Capture a atenção do seu público com o timbre perfeito.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {voices.map((voice) => (
                    <div
                        key={voice.id}
                        onClick={() => onSelectVoice(voice.id)}
                        className={`relative group p-8 rounded-3xl border transition-all duration-500 flex items-center justify-between cursor-pointer ${selectedVoice === voice.id
                            ? 'border-[#FF0000] bg-[#FF0000]/5 shadow-[0_0_30px_rgba(255,0,0,0.05)]'
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                            }`}
                    >
                        <div className="flex items-center gap-6">
                            <button
                                onClick={(e) => { e.stopPropagation(); togglePlay(voice); }}
                                className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${playingId === voice.id ? 'bg-[#FF0000] text-white shadow-[0_0_20px_rgba(255,0,0,0.4)] animate-pulse' : 'bg-zinc-900 border border-white/5 text-zinc-400 hover:text-white hover:scale-110'
                                    }`}
                            >
                                {playingId === voice.id ? <Pause size={24} /> : <Play size={24} className="ml-1" />}
                            </button>
                            <div>
                                <h3 className="font-extrabold text-xl mb-2">{voice.name}</h3>
                                <div className="flex gap-2">
                                    {voice.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold tracking-widest text-zinc-600 bg-white/[0.03] px-3 py-1 rounded-full border border-white/5">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                        <div
                            className={`p-3 rounded-2xl transition-all ${selectedVoice === voice.id ? 'text-[#FF0000]' : 'text-zinc-700'}`}
                        >
                            <CheckCircle2 size={32} />
                        </div>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center px-4">
                <button
                    onClick={onBack}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-all"
                >
                    ← Voltar
                </button>

                <button
                    onClick={onNext}
                    className="flex items-center gap-3 px-8 py-4 rounded-full bg-[#FF0000] hover:bg-[#CC0000] transition-all font-bold text-white shadow-[0_0_30px_rgba(255,0,0,0.15)] active:scale-95"
                >
                    Continuar →
                </button>
            </div>
        </div >
    );
};

export default StepVoices;
