"use client";

export default function SchedulerPage() {
    return (
        <div className="flex flex-col gap-8">
            <div>
                <h1 className="text-4xl font-bold gradient-text">Agendamento Inteligente</h1>
                <p className="text-zinc-400 mt-2">Planeje sua dominância no YouTube com automação total.</p>
            </div>

            <div className="glass p-12 flex flex-col items-center gap-6 text-center">
                <div className="text-6xl animate-bounce">🗓️</div>
                <h2 className="text-2xl font-bold">Em breve em sua conta Premium</h2>
                <p className="text-zinc-500 max-w-lg">
                    Estamos finalizando o motor de agendamento por calendário. Em breve você poderá programar postagens semanais com temas diferentes e o ViralEngine cuidará de tudo sozinho.
                </p>
                <div className="flex gap-4">
                    <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-sm">📅 Calendário Drag & Drop</div>
                    <div className="px-6 py-2 bg-zinc-900 border border-zinc-800 rounded-full text-zinc-400 text-sm">⏰ Horários de Pico Automáticos</div>
                </div>
            </div>
        </div>
    );
}
