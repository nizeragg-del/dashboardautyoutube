"use client";
import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

interface StepChatProps {
    onNext: (idea: string) => void;
    initialValue?: string;
}

const StepChat: React.FC<StepChatProps> = ({ onNext, initialValue = '' }) => {
    const [idea, setIdea] = useState(initialValue);

    const suggestions = [
        "A verdade oculta sobre as Pirâmides",
        "5 curiosidades sobre o Japão que você não sabia",
        "A história não contada de Nikola Tesla",
        "O que aconteceria se a Lua desaparecesse?"
    ];

    return (
        <div className="flex flex-col gap-8 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="text-center space-y-2">
                <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-indigo-500">
                    O que vamos criar hoje?
                </h1>
                <p className="text-zinc-400">Transforme qualquer ideia em um vídeo viral em segundos.</p>
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative glass p-6 rounded-2xl border border-white/10 flex flex-col gap-4">
                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Digite aqui sua ideia ou um tema geral..."
                        className="w-full bg-transparent border-none focus:ring-0 text-lg min-h-[150px] resize-none placeholder:text-zinc-600"
                    />
                    <div className="flex justify-between items-center bg-black/20 -m-6 mt-2 p-4 px-6 rounded-b-2xl border-t border-white/5">
                        <span className="text-xs text-zinc-500 flex items-center gap-1">
                            <Sparkles size={12} className="text-blue-500" /> Use a Gemini AI para expandir sua ideia
                        </span>
                        <button
                            onClick={() => idea.trim() && onNext(idea)}
                            disabled={!idea.trim()}
                            className="bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:hover:bg-blue-600 text-white p-3 px-6 rounded-xl transition-all flex items-center gap-2 font-semibold shadow-lg shadow-blue-600/20 active:scale-95"
                        >
                            Próximo <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <p className="text-sm font-medium text-zinc-500 uppercase tracking-widest">Sugestões para você</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => setIdea(suggestion)}
                            className="text-left p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-white/10 transition-all text-sm text-zinc-300 active:scale-[0.98]"
                        >
                            {suggestion}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default StepChat;
