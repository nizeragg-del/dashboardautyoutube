"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Calendar as CalendarIcon, Clock, CheckCircle2 } from 'lucide-react';

interface User {
    id: string;
    email?: string;
}

interface Video {
    id: string;
    title: string;
    created_at: string;
    status: string;
    scheduled_for?: string | null;
}

interface Automation {
    id: string;
    theme: string;
    days_of_week: number[];
    time_of_day: string;
    is_active: boolean;
}

export default function SchedulerPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isMounted, setIsMounted] = useState(false); // Prevents hydration mismatch with dnd

    const [automation, setAutomation] = useState<Automation | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    // Status local form
    const [theme, setTheme] = useState('');
    const [daysOfWeek, setDaysOfWeek] = useState<number[]>([]);
    const [timeOfDay, setTimeOfDay] = useState('18:00');
    const [isActive, setIsActive] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        async function loadData() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);

                // Fetch videos
                const { data: vData } = await supabase
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false });
                if (vData) setVideos(vData as Video[]);

                // Fetch automations
                const { data: aData } = await supabase
                    .from('automations')
                    .select('*')
                    .eq('user_id', session.user.id)
                    .single();

                if (aData) {
                    setAutomation(aData as Automation);
                    setTheme(aData.theme);
                    setDaysOfWeek(aData.days_of_week || []);
                    setTimeOfDay(aData.time_of_day || '18:00');
                    setIsActive(aData.is_active || false);
                }
            }
        }
        loadData();
    }, []);

    const toggleDay = (day: number) => {
        setDaysOfWeek(prev =>
            prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day].sort()
        );
    };

    const handleSaveAutomation = async () => {
        if (!user) return;
        setIsSaving(true);

        try {
            const payload = {
                user_id: user.id,
                theme: theme || 'Aleatório',
                days_of_week: daysOfWeek,
                time_of_day: timeOfDay,
                is_active: isActive
            };

            if (automation) {
                // Update
                const { data, error } = await supabase.from('automations').update(payload).eq('id', automation.id).select().single();
                if (!error && data) setAutomation(data as Automation);
            } else {
                // Insert
                const { data, error } = await supabase.from('automations').insert([payload]).select().single();
                if (!error && data) setAutomation(data as Automation);
            }
            alert("Automação Semanal Salva com Sucesso! 🚀");
        } catch (error) {
            console.error("Erro ao salvar automação", error);
        } finally {
            setIsSaving(false);
        }
    };


    // Filtra os vídeos já agendados/publicados para mostrar no calendário
    const scheduledVideos = videos.filter(v => v.scheduled_for);

    if (!isMounted) return null;

    return (
        <div className="min-h-screen bg-[#050505] text-white selection:bg-youtube selection:text-white pb-20">
            {/* Header Minimalista */}
            <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-40 bg-[#050505]/80 backdrop-blur-md border-b border-white/5">
                <div className="flex items-center gap-6">
                    <button
                        onClick={() => setIsSidebarOpen(true)}
                        className="w-10 h-10 rounded-full bg-gradient-to-br from-zinc-800 to-zinc-950 border border-white/10 flex items-center justify-center hover:scale-110 transition-transform shadow-lg shadow-black"
                    >
                        <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-xs font-bold text-white">
                            {user?.email?.[0].toUpperCase() || 'U'}
                        </div>
                    </button>
                    <div className="text-xl font-bold tracking-tighter gradient-text">ViralEngine</div>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    <button className="flex items-center gap-2 px-6 py-2 bg-zinc-900 border border-white/10 rounded-full font-bold text-sm tracking-wide hover:bg-zinc-800 transition-all">
                        <div className="w-2 h-2 rounded-full bg-[#FF0000] animate-pulse"></div>
                        Automator Pro
                    </button>
                </div>
            </header>

            <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

            <main className="relative pt-32 min-h-screen max-w-7xl mx-auto px-6 relative z-10 flex flex-col gap-8">
                <div>
                    <h1 className="text-4xl font-bold gradient-text">Piloto Automático (Routine)</h1>
                    <p className="text-zinc-400 mt-2">Configure os dias, o nicho e deixe o sistema criar e publicar vídeos sem você encostar o dedo.</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* COLUNA ESQUERDA: Configurações do Automator */}
                    <div className="col-span-1 lg:col-span-1 border border-white/5 bg-white/[0.02] rounded-[32px] p-8 flex flex-col gap-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-[#FF0000]/5 rounded-full blur-[100px] pointer-events-none"></div>

                        <div className="flex items-center justify-between border-b border-white/5 pb-4">
                            <h3 className="font-bold text-xl flex items-center gap-2">
                                <Clock size={24} className={isActive ? "text-[#FF0000]" : "text-zinc-500"} />
                                Settings
                            </h3>
                            <div className="flex items-center gap-3">
                                <span className="text-sm text-zinc-400 font-bold">{isActive ? 'ATIVADO' : 'PAUSADO'}</span>
                                <button
                                    onClick={() => setIsActive(!isActive)}
                                    className={`w-12 h-6 rounded-full flex items-center p-1 transition-all ${isActive ? 'bg-[#FF0000]' : 'bg-zinc-800'}`}
                                >
                                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${isActive ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                </button>
                            </div>
                        </div>

                        {/* TEMA */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-400">Nicho / Tema da Semana</label>
                            <input
                                type="text"
                                value={theme}
                                onChange={(e) => setTheme(e.target.value)}
                                placeholder="ex: Curiosidades Históricas, Fatos Ocultos..."
                                className="w-full bg-zinc-900 border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-[#FF0000] focus:ring-1 focus:ring-[#FF0000] transition-all"
                            />
                        </div>

                        {/* HORARIO */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-400">Horário de Publicação (Local)</label>
                            <input
                                type="text"
                                value="08:00"
                                readOnly
                                className="w-full bg-zinc-900/50 border border-white/10 rounded-xl p-4 text-zinc-500 cursor-not-allowed focus:outline-none transition-all"
                            />
                        </div>

                        {/* DIAS DA SEMANA */}
                        <div className="flex flex-col gap-2">
                            <label className="text-sm font-bold text-zinc-400">Dias de Geração e Postagem</label>
                            <div className="flex gap-2 flex-wrap">
                                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((day, ix) => (
                                    <button
                                        key={day}
                                        onClick={() => toggleDay(ix)}
                                        className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${daysOfWeek.includes(ix) ? 'bg-[#FF0000] text-white shadow-lg shadow-[#FF0000]/20 scale-105' : 'bg-zinc-900 border border-white/10 text-zinc-400 hover:bg-white/5 hover:text-white'}`}
                                    >
                                        {day}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handleSaveAutomation}
                            disabled={isSaving}
                            className="w-full mt-4 py-4 rounded-2xl bg-white text-black font-bold uppercase tracking-wider hover:bg-zinc-200 hover:scale-[1.02] transition-all shadow-[0_0_30px_rgba(255,255,255,0.1)] flex items-center justify-center gap-2"
                        >
                            {isSaving ? 'Salvando...' : 'Salvar Automação'}
                            <CheckCircle2 size={18} />
                        </button>
                    </div>

                    {/* COLUNA DIREITA: Calendário (Visualização Passiva) */}
                    <div className="col-span-1 lg:col-span-2 border border-white/5 bg-white/[0.02] rounded-[32px] p-8 flex flex-col gap-8">
                        <div className="flex w-full justify-between items-end border-b border-white/5 pb-4">
                            <div>
                                <h3 className="font-bold text-2xl">Mesa Visível</h3>
                                <p className="text-zinc-500 text-sm mt-1">Veja quais dias possuem ações programadas (destaque em vermelho). Clicar no dia carrega a fila.</p>
                            </div>
                            <div className="text-right">
                                <p className="text-zinc-400 font-bold text-lg">{selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione'}</p>
                            </div>
                        </div>

                        <div className="flex flex-col md:flex-row gap-8 w-full">
                            <div className="calendar-wrapper bg-zinc-900 border border-white/5 rounded-3xl p-4 shadow-xl">
                                <style dangerouslySetInnerHTML={{
                                    __html: `
                                    .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #FF0000; --rdp-background-color: rgba(255, 0, 0, 0.1); margin: 0; }
                                    .rdp-day_selected { font-weight: bold; background-color: #FF0000!important; color: white!important; border-radius: 8px;}
                                    .rdp-day_today { font-weight: 900; color: #FF0000;}
                                    .day-is-routine { position: relative; }
                                    .day-is-routine::after { content: ''; position: absolute; bottom: 4px; left: 50%; width: 4px; height: 4px; background: #FF0000; border-radius: 50%; transform: translateX(-50%); }
                                    .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: rgba(255,255,255,0.05); }
                                    `}}
                                />
                                <DayPicker
                                    mode="single"
                                    selected={selectedDate}
                                    onSelect={setSelectedDate}
                                    locale={ptBR}
                                    showOutsideDays
                                    className="text-white"
                                    modifiers={{
                                        routine: (date) => !!(isActive && daysOfWeek.includes(date.getDay()))
                                    }}
                                    modifiersClassNames={{
                                        routine: 'day-is-routine'
                                    }}
                                />
                            </div>

                            <div className="flex-1 flex flex-col gap-4 p-6 rounded-3xl border border-white/10 bg-zinc-900 overflow-y-auto max-h-[350px]">
                                <div className="flex items-center gap-3 text-zinc-400 mb-2">
                                    <CalendarIcon size={20} />
                                    <h4 className="font-bold text-sm uppercase tracking-widest">Postagens daquele dia</h4>
                                </div>

                                {scheduledVideos.filter(v => v.scheduled_for && new Date(v.scheduled_for).toDateString() === selectedDate?.toDateString()).length === 0 ? (
                                    <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-2 text-center opacity-50 mt-10">
                                        <p className="text-sm font-medium">Nenhum vídeo publicado/pendente para este dia exato.</p>
                                        {(isActive && selectedDate && daysOfWeek.includes(selectedDate.getDay())) && (
                                            <p className="text-xs text-[#FF0000] mt-2 border border-[#FF0000]/20 bg-[#FF0000]/10 px-3 py-1 rounded-full">O Piloto Automático vai agir nesta data!</p>
                                        )}
                                    </div>
                                ) : (
                                    scheduledVideos
                                        .filter(v => v.scheduled_for && new Date(v.scheduled_for).toDateString() === selectedDate?.toDateString())
                                        .map((video) => (
                                            <div key={video.id} className="p-4 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 border border-white/5 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-[#FF0000]/10 flex items-center justify-center">
                                                        <CheckCircle2 size={16} className="text-[#FF0000]" />
                                                    </div>
                                                    <div className="flex flex-col">
                                                        <p className="text-sm font-bold text-white line-clamp-1">{video.title}</p>
                                                        <span className="text-xs text-zinc-500 uppercase">{video.status}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}

