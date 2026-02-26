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
        <div className="flex flex-col items-center justify-center gap-12 max-w-2xl mx-auto w-full min-h-[400px] animate-in zoom-in-95 duration-700">
            <div className="relative">
                <div className="absolute inset-0 bg-blue-600 rounded-full blur-[60px] opacity-20 animate-pulse"></div>
                <div className="relative w-32 h-32 bg-zinc-900 border border-white/10 rounded-full flex items-center justify-center shadow-2xl">
                    <Rocket size={48} className="text-blue-500 animate-bounce" />
                    <div className="absolute inset-0 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
            </div>

            <div className="text-center space-y-4 w-full">
                <h2 className="text-3xl font-bold italic">&ldquo;{idea}&rdquo;</h2>
                <p className="text-zinc-500 flex items-center justify-center gap-2">
                    <Loader2 size={16} className="animate-spin" /> {currentStatus}
                </p>

                <div className="mt-8 space-y-2">
                    <div className="flex justify-between text-xs font-bold text-zinc-500 uppercase tracking-tighter">
                        <span>Progresso Real</span>
                        <span>{Math.floor(progress)}%</span>
                    </div>
                    <div className="h-3 w-full bg-zinc-900 rounded-full overflow-hidden border border-white/5 p-0.5">
                        <div
                            className="h-full bg-gradient-to-r from-blue-600 via-indigo-500 to-blue-400 rounded-full transition-all duration-500 ease-out shadow-[0_0_20px_rgba(37,99,235,0.4)]"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-8 w-full mt-4">
                <div className="flex flex-col items-center gap-2 opacity-40">
                    <Sparkles className="text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Roteiro</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-100">
                    <Wand2 className="text-blue-500 animate-pulse" />
                    <span className="text-[10px] uppercase font-bold tracking-widest text-blue-500">Produção</span>
                </div>
                <div className="flex flex-col items-center gap-2 opacity-40">
                    <Film className="text-zinc-400" />
                    <span className="text-[10px] uppercase font-bold tracking-widest">Upload</span>
                </div>
            </div>
        </div>
    );
};

export default StepLoading;
