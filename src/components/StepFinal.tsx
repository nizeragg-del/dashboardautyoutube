"use client";
import React from 'react';
import { CheckCircle2, Youtube, Share2, ArrowRight } from 'lucide-react';

interface StepFinalProps {
    onReset: () => void;
}

const StepFinal: React.FC<StepFinalProps> = ({ onReset }) => {
    return (
        <div className="flex flex-col items-center justify-center gap-8 max-w-2xl mx-auto w-full py-12 animate-in slide-in-from-bottom-8 duration-1000">
            <div className="w-24 h-24 bg-green-500/10 border border-green-500/20 rounded-full flex items-center justify-center">
                <CheckCircle2 size={48} className="text-green-500" />
            </div>

            <div className="text-center space-y-3">
                <h1 className="text-4xl font-bold">Vídeo Gerado com Sucesso!</h1>
                <p className="text-zinc-400 max-w-md mx-auto">
                    Sua obra-prima foi enviada para o canal selecionado e está sendo processada pelo YouTube.
                </p>
            </div>

            <div className="glass p-8 rounded-3xl border border-white/5 w-full flex flex-col gap-6 bg-gradient-to-br from-white/5 to-transparent">
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-zinc-800 rounded-xl flex items-center justify-center">
                            <Youtube size={32} className="text-red-600" />
                        </div>
                        <div>
                            <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest">Canal Destino</p>
                            <h3 className="text-lg font-bold">Meu Canal Viral</h3>
                        </div>
                    </div>
                    <button className="bg-zinc-800 hover:bg-zinc-700 text-white p-3 px-6 rounded-xl transition-all flex items-center gap-2 font-medium">
                        Ver Lab <ArrowRight size={18} />
                    </button>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <button className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all font-medium text-sm">
                        <Share2 size={18} /> Compartilhar Link
                    </button>
                    <button
                        onClick={onReset}
                        className="flex items-center justify-center gap-3 p-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-bold text-sm shadow-xl shadow-blue-600/20"
                    >
                        Criar Outro Vídeo
                    </button>
                </div>
            </div>

            <p className="text-zinc-600 text-sm italic">
                Nota: O YouTube pode levar alguns minutos para processar a versão 4K.
            </p>
        </div>
    );
};

export default StepFinal;
