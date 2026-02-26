"use client";
import React from 'react';
import { CheckCircle2, Youtube, Share2 } from 'lucide-react';

interface StepFinalProps {
    onReset: () => void;
}

const StepFinal: React.FC<StepFinalProps> = ({ onReset }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-12 max-w-2xl mx-auto w-full py-12 animate-in slide-in-from-bottom-12 duration-1000 ease-out">
            <div className="relative">
                <div className="absolute inset-0 bg-green-500 rounded-full blur-[60px] opacity-10 animate-pulse"></div>
                <div className="relative w-28 h-28 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center shadow-2xl">
                    <CheckCircle2 size={56} className="text-green-500" />
                </div>
            </div>

            <div className="text-center space-y-4">
                <h1 className="text-5xl font-extrabold tracking-tight">Postado com Sucesso!</h1>
                <p className="text-zinc-500 text-lg font-medium max-w-sm mx-auto">
                    Sua obra-prima já está a caminho do YouTube e será um sucesso viral.
                </p>
            </div>

            <div className="glass p-10 rounded-[32px] border border-white/5 w-full flex flex-col gap-10 bg-[#0a0a0a]/50 shadow-2xl">
                <div className="flex items-center justify-between pb-2">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-2xl flex items-center justify-center shadow-inner">
                            <Youtube size={40} className="text-[#FF0000]" />
                        </div>
                        <div>
                            <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-[0.2em] mb-1">Destino Final</p>
                            <h3 className="text-2xl font-bold">Meu Canal Viral</h3>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 p-5 rounded-full bg-white/[0.03] border border-white/5 hover:bg-white/[0.06] transition-all font-bold text-sm tracking-wide">
                        <Share2 size={20} /> Compartilhar Link
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-3 p-5 rounded-full bg-[#FF0000] hover:bg-[#CC0000] transition-all font-bold text-sm text-white shadow-[0_0_30px_rgba(255,0,0,0.15)] active:scale-95"
                    >
                        Criar Outro Vídeo
                    </button>
                </div>
            </div>

            <p className="text-zinc-600 text-xs font-medium uppercase tracking-widest text-center">
                Processando 4K no YouTube • Otimizado
            </p>
        </div>
    );
};

export default StepFinal;
