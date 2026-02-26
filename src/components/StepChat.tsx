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
        <div className="flex flex-col gap-12 max-w-3xl mx-auto w-full animate-in fade-in slide-in-from-bottom-8 duration-1000 ease-out">
            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight gradient-text">
                    O que vamos criar hoje?
                </h1>
                <p className="text-zinc-500 text-lg font-medium">Transforme qualquer ideia em um vídeo viral em segundos.</p>
            </div>

            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-white/10 to-white/5 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>
                <div className="relative glass p-8 rounded-3xl border border-white/5 flex flex-col gap-6 shadow-2xl bg-[#0a0a0a]/50">
                    <textarea
                        value={idea}
                        onChange={(e) => setIdea(e.target.value)}
                        placeholder="Digite sua ideia aqui..."
                        className="w-full bg-transparent border-none focus:ring-0 text-xl min-h-[120px] resize-none placeholder:text-zinc-700 font-medium leading-relaxed"
                    />
                    <div className="flex justify-between items-center bg-black/40 -m-8 mt-4 p-5 px-8 rounded-b-3xl border-t border-white/5">
                        <div className="flex items-center gap-2 text-[10px] text-zinc-500 uppercase tracking-widest font-bold">
                            <Sparkles size={14} className="text-zinc-400" /> Powered by Gemini AI
                        </div>
                        <button
                            onClick={() => idea.trim() && onNext(idea)}
                            disabled={!idea.trim()}
                            className="bg-[#FF0000] hover:bg-[#CC0000] disabled:opacity-30 disabled:grayscale text-white px-8 py-3 rounded-full transition-all flex items-center gap-2 font-bold shadow-[0_0_20px_rgba(255,0,0,0.2)] active:scale-95"
                        >
                            Gerar Vídeo <Send size={18} />
                        </button>
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-[0.3em] text-center">Sugestões de Temas</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {suggestions.map((suggestion) => (
                        <button
                            key={suggestion}
                            onClick={() => setIdea(suggestion)}
                            className="text-left p-5 rounded-2xl border border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-white/10 transition-all text-sm text-zinc-400 font-medium active:scale-[0.98] glow-card"
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
