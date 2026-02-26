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
        <div className="flex flex-col gap-8 max-w-4xl mx-auto w-full animate-in fade-in slide-in-from-right-4 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    Escolha o Estilo Visual
                </h1>
                <p className="text-zinc-400">O estilo determina a trilha sonora, as imagens e o ritmo do vídeo.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {themes.map((theme) => (
                    <button
                        key={theme.id}
                        onClick={() => onNext(theme.id)}
                        className={`relative group text-left p-6 rounded-2xl border transition-all duration-300 ${selectedTheme === theme.id
                            ? 'border-blue-500 bg-blue-500/10'
                            : 'border-white/5 bg-white/5 hover:border-white/20 hover:bg-white/10'
                            }`}
                    >
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${theme.color} flex items-center justify-center text-2xl mb-4 shadow-lg shadow-black/40 group-hover:scale-110 transition-transform`}>
                            {theme.preview}
                        </div>
                        <h3 className="text-xl font-bold mb-1">{theme.name}</h3>
                        <p className="text-sm text-zinc-500 leading-relaxed">{theme.description}</p>

                        {selectedTheme === theme.id && (
                            <div className="absolute top-4 right-4 text-blue-500">
                                <CheckCircle2 size={24} />
                            </div>
                        )}

                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
                    </button>
                ))}
            </div>

            <div className="flex justify-between items-center mt-4">
                <button
                    onClick={onBack}
                    className="text-zinc-500 hover:text-white transition-colors"
                >
                    Voltar para ideia
                </button>
                <div className="flex gap-2">
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                    <div className="w-8 h-2 rounded-full bg-blue-600"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                    <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                </div>
            </div>
        </div>
    );
};

export default StepTheme;
