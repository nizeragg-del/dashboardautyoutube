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
    onNext: (voiceId: string) => void;
    onBack: () => void;
    selectedVoice?: string;
}

const StepVoices: React.FC<StepVoicesProps> = ({ onNext, onBack, selectedVoice }) => {
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

    const voices: Voice[] = [
        { id: 'pqHfZKP75CvOlQylNhV4', name: 'Bill (Narrador)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/21m00Tcm4TlvDq8ikWAM.mp3', tags: ['Sério', 'Profundo'] },
        { id: 'AZnzlk1XvdDHEbmvDth8', name: 'Nicole (Suave)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/AZnzlk1XvdDHEbmvDth8.mp3', tags: ['Calma', 'Explicativa'] },
        { id: 'EXAVITQu4vr4ARTe9EBX', name: 'Bella (Entusiasta)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/EXAVITQu4vr4ARTe9EBX.mp3', tags: ['Energética', 'Jovem'] },
        { id: 'Lcf7eeHS9WT78S9fS3yL', name: 'Marcus (Épico)', preview_url: 'https://storage.googleapis.com/eleven-public-prod/previews/Lcf7eeHS9WT78S9fS3yL.mp3', tags: ['Dramático', 'Voz Grave'] }
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
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    A Voz do seu Viral
                </h1>
                <p className="text-zinc-400">Escolha o timbre perfeito para capturar a atenção do seu público.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {voices.map((voice) => (
                    <div
                        key={voice.id}
                        className={`relative group p-6 rounded-2xl border transition-all duration-300 flex items-center justify-between ${selectedVoice === voice.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                    >
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => togglePlay(voice)}
                                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${playingId === voice.id ? 'bg-blue-600 text-white animate-pulse' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700 hover:text-white'
                                    }`}
                            >
                                {playingId === voice.id ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
                            </button>
                            <div>
                                <h3 className="font-bold text-lg">{voice.name}</h3>
                                <div className="flex gap-2 mt-1">
                                    {voice.tags.map(tag => (
                                        <span key={tag} className="text-[10px] uppercase font-bold tracking-tighter text-zinc-600 bg-zinc-800/50 px-2 py-0.5 rounded">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={() => onNext(voice.id)}
                            className={`p-3 rounded-xl transition-all ${selectedVoice === voice.id ? 'text-blue-500 bg-blue-500/10' : 'text-zinc-600 hover:text-white'
                                }`}
                        >
                            <CheckCircle2 size={24} />
                        </button>
                    </div>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={onBack}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    Voltar para estilo
                </button>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                    <div className="w-8 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                </div>
            </div>
        </div>
    );
};

export default StepVoices;
