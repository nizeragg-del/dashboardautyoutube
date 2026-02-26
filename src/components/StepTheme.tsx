"use client";
import React from 'react';
import { CheckCircle2 } from 'lucide-react';

interface Theme {
    id: string;
    name: string;
    description: string;
    color: string;
    preview: string;
}

interface StepThemeProps {
    onNext: (theme: string) => void;
    onBack: () => void;
    selectedTheme?: string;
}

const StepTheme: React.FC<StepThemeProps> = ({ onNext, onBack, selectedTheme }) => {
    const themes: Theme[] = [
        {
            id: 'history',
            name: 'História Curta',
            description: 'Documentários imersivos e fatos históricos.',
            color: 'from-amber-600 to-orange-700',
            preview: '📜'
        },
        {
            id: 'curiosity',
            name: 'Curiosidade Nerd',
            description: 'Fatos bizarros, ciência e tecnologia.',
            color: 'from-purple-600 to-indigo-700',
            preview: '🧠'
        },
        {
            id: 'motivation',
            name: 'Motivação Épica',
            description: 'Frases poderosas e visuais inspiradores.',
            color: 'from-blue-600 to-cyan-700',
            preview: '🔥'
        },
        {
            id: 'horror',
            name: 'Terror Noturno',
            description: 'Creepypastas e mistérios assustadores.',
            color: 'from-red-900 to-zinc-900',
            preview: '💀'
        }
    ];

    return (
        <div className="flex flex-col gap-12 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-right-8 duration-1000 ease-out">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight gradient-text">
                    Estilo Visual
                </h1>
                <p className="text-zinc-500 text-lg font-medium">O estilo define a atmosfera, trilha sonora e o ritmo do seu vídeo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onNext(theme.id)}
                        className={`relative group text-left p-8 rounded-3xl border transition-all duration-500 ${selectedTheme === theme.id
                            ? 'border-[#FF0000] bg-[#FF0000]/5 shadow-[0_0_30px_rgba(255,0,0,0.05)]'
                            : 'border-white/5 bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                            }`}
                    >
                        <div className={`w-14 h-14 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center text-3xl mb-6 shadow-xl group-hover:scale-110 transition-transform`}>
                            {theme.preview}
                        </div>
                        <h3 className="text-2xl font-bold mb-2">{theme.name}</h3>
                        <p className="text-zinc-500 font-medium leading-relaxed">{theme.description}</p>

                        {selectedTheme === theme.id && (
                            <div className="absolute top-6 right-6 text-[#FF0000]">
                                <CheckCircle2 size={32} />
                            </div>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center px-4">
                <button
                    onClick={onBack}
                    className="text-[10px] font-bold uppercase tracking-[0.2em] text-zinc-600 hover:text-white transition-all"
                >
                    ← Voltar
                </button>
                <div className="flex gap-3">
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                    <div className="w-8 h-2 rounded-full bg-[#FF0000]"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                </div>
            </div>
        </div>
    );
};

export default StepTheme;
