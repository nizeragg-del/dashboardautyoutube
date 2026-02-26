"use client";
import React, { useState, useEffect } from 'react';
import { Rocket, Loader2, Sparkles, Wand2, Film } from 'lucide-react';

interface StepLoadingProps {
    idea: string;
}

const StepLoading: React.FC<StepLoadingProps> = ({ idea }) => {
    const [progress, setProgress] = useState(0);
    const [currentStatus, setCurrentStatus] = useState('Iniciando motores...');

    const statuses = [
        { t: 0, s: 'Analisando sua ideia fascinante...' },
        { t: 15, s: 'Expandindo roteiro com Gemini AI...' },
        { t: 30, s: 'Sintetizando narração profissional...' },
        { t: 50, s: 'Buscando visuais cinematográficos...' },
        { t: 70, s: 'Renderizando frames e legendas...' },
        { t: 90, s: 'Finalizando e enviando para o YouTube...' },
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    return 100;
                }
                const next = prev + 0.5;
                const status = statuses.findLast(s => next >= s.t);
                if (status) setCurrentStatus(status.s);
                return next;
            });
        }, 1000); // Simulação de 200 segundos (aprox 3 min) para demonstração visual
        return () => clearInterval(interval);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center gap-16 max-w-2xl mx-auto w-full min-h-[500px] animate-in zoom-in-95 duration-1000 ease-out">
            <div className="relative">
                <div className="absolute inset-0 bg-[#FF0000] rounded-full blur-[80px] opacity-10 animate-pulse"></div>
                <div className="relative w-40 h-40 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center shadow-2xl">
                    <Rocket size={64} className="text-[#FF0000] animate-bounce" />
                    <div className="absolute inset-0 border-2 border-[#FF0000] border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>

            <div className="text-center space-y-6 w-full">
                <div className="space-y-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-600">Criando sua obra prima</p>
                    <h2 className="text-3xl font-extrabold italic text-white tracking-tight">&ldquo;{idea}&rdquo;</h2>
                </div>

                <p className="text-zinc-500 font-medium flex items-center justify-center gap-3">
                    <Loader2 size={18} className="animate-spin text-[#FF0000]" /> {currentStatus}
                </p>

                <div className="mt-12 space-y-3">
                    <div className="flex justify-between text-[10px] font-bold text-zinc-600 uppercase tracking-widest">
                        <span>Status da Produção</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-2 w-full bg-zinc-900/50 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <div
                            className="h-full bg-[#FF0000] rounded-full transition-all duration-700 ease-out shadow-[0_0_15px_rgba(255,0,0,0.3)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-12 w-full mt-8">
                <div className="flex flex-col items-center gap-3 opacity-30">
                    <Sparkles size={20} className="text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Roteiro</span>
                </div>
                <div className="flex flex-col items-center gap-3">
                    <Wand2 size={24} className="text-[#FF0000] animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em] text-[#FF0000]">Produção</span>
                </div>
                <div className="flex flex-col items-center gap-3 opacity-30">
                    <Film size={20} className="text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold tracking-[0.2em]">Upload</span>
                </div>
            </div>
        </div>
    );
};

export default StepLoading;
