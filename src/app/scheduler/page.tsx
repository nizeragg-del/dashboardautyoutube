"use client";
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Calendar as CalendarIcon, Clock, GripVertical, CheckCircle2 } from 'lucide-react';

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

export default function SchedulerPage() {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [user, setUser] = useState<User | null>(null);
    const [videos, setVideos] = useState<Video[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
    const [isMounted, setIsMounted] = useState(false); // Prevents hydration mismatch with dnd

    useEffect(() => {
        setIsMounted(true);
        async function loadData() {
            const { data: { session } } = await supabase.auth.getSession();
            if (session) {
                setUser(session.user);
                // Fetch videos that are pending schedule (using status != published for now)
                const { data } = await supabase
                    .from('videos')
                    .select('*')
                    .order('created_at', { ascending: false });

                if (data) setVideos(data as Video[]);
            }
        }
        loadData();
    }, []);

    // Filter videos by queue (not scheduled) and scheduled
    const queueVideos = videos.filter(v => !v.scheduled_for);
    const scheduledVideos = videos.filter(v => v.scheduled_for);

    // Mock handler for Drop
    const onDragEnd = async (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, draggableId } = result;

        // Arrastando da Fila para o Calendário
        if (source.droppableId === 'queue' && destination.droppableId === 'calendar') {
            if (!selectedDate) return;

            // Otimista UI Update
            const scheduledDateStr = selectedDate.toISOString();
            setVideos(prev => prev.map(v => v.id === draggableId ? { ...v, scheduled_for: scheduledDateStr } : v));

            // Update no DB (Silencioso)
            await supabase.from('videos').update({ scheduled_for: scheduledDateStr }).eq('id', draggableId);
        }

        // Arrastando do Calendário de volta para a Fila (Remover agendamento)
        if (source.droppableId === 'calendar' && destination.droppableId === 'queue') {
            setVideos(prev => prev.map(v => v.id === draggableId ? { ...v, scheduled_for: null } : v));
            await supabase.from('videos').update({ scheduled_for: null }).eq('id', draggableId);
        }
    };

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
                    <h1 className="text-4xl font-bold gradient-text">Agendamento Inteligente</h1>
                    <p className="text-zinc-400 mt-2">Arraste seus vídeos finalizados para a data de publicação no YouTube.</p>
                </div>

                <DragDropContext onDragEnd={onDragEnd}>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Coluna da Esquerda: Fila de Vídeos Pendentes */}
                        <div className="col-span-1 border border-white/5 bg-white/[0.02] rounded-[32px] p-6 flex flex-col gap-6">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-lg flex items-center gap-2">
                                    <Clock size={20} className="text-[#FF0000]" />
                                    Fila Fria
                                </h3>
                                <span className="text-xs bg-white/5 px-3 py-1 rounded-full text-zinc-400 font-bold">{queueVideos.length} pendentes</span>
                            </div>

                            <Droppable droppableId="queue">
                                {(provided, snapshot) => (
                                    <div
                                        {...provided.droppableProps}
                                        ref={provided.innerRef}
                                        className={`flex-1 min-h-[400px] flex flex-col gap-3 p-2 rounded-2xl transition-colors ${snapshot.isDraggingOver ? 'bg-white/5' : ''}`}
                                    >
                                        {queueVideos.length === 0 ? (
                                            <div className="h-full flex items-center justify-center text-zinc-600 text-sm font-medium text-center p-8">
                                                Nenhum vídeo pendente na fila. Gere mais conteúdo no Dashboard!
                                            </div>
                                        ) : (
                                            queueVideos.map((video, index) => (
                                                <Draggable key={video.id} draggableId={video.id} index={index}>
                                                    {(provided, snapshot) => (
                                                        <div
                                                            ref={provided.innerRef}
                                                            {...provided.draggableProps}
                                                            {...provided.dragHandleProps}
                                                            className={`p-4 rounded-2xl border flex items-center gap-4 transition-all ${snapshot.isDragging ? 'bg-[#FF0000]/10 border-[#FF0000]/30 shadow-2xl scale-105 z-50' : 'bg-zinc-900 border-white/5 hover:bg-white/[0.05]'}`}
                                                        >
                                                            <GripVertical size={20} className="text-zinc-600" />
                                                            <div className="flex-1 min-w-0">
                                                                <p className="text-sm font-bold truncate">{video.title}</p>
                                                                <p className="text-[10px] text-zinc-500 uppercase tracking-wider">{video.status}</p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </Draggable>
                                            ))
                                        )}
                                        {provided.placeholder}
                                    </div>
                                )}
                            </Droppable>
                        </div>

                        {/* Coluna da Direita: Agenda / Calendar */}
                        <div className="col-span-1 lg:col-span-2 border border-white/5 bg-white/[0.02] rounded-[32px] p-8 flex flex-col items-center gap-8 relative overflow-hidden">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-[#FF0000]/5 rounded-full blur-[100px] pointer-events-none"></div>

                            <div className="flex w-full justify-between items-end border-b border-white/5 pb-6 relative z-10">
                                <div>
                                    <h3 className="font-bold text-2xl">Mesa Estratégica</h3>
                                    <p className="text-zinc-500 text-sm mt-1">Selecione o dia e solte os vídeos aqui.</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[#FF0000] font-bold text-lg">{selectedDate ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR }) : 'Selecione'}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row gap-8 w-full relative z-10">
                                {/* Componente do Calendário Visual */}
                                <div className="calendar-wrapper bg-zinc-900 border border-white/5 rounded-3xl p-4 shadow-xl">
                                    <style dangerouslySetInnerHTML={{
                                        __html: `
                                        .rdp { --rdp-cell-size: 40px; --rdp-accent-color: #FF0000; --rdp-background-color: rgba(255, 0, 0, 0.1); margin: 0; }
                                        .rdp-day_selected { font-weight: bold; }
                                        .rdp-button:hover:not([disabled]):not(.rdp-day_selected) { background-color: rgba(255,255,255,0.05); }
                                     `}} />
                                    <DayPicker
                                        mode="single"
                                        selected={selectedDate}
                                        onSelect={setSelectedDate}
                                        locale={ptBR}
                                        showOutsideDays
                                        className="text-white"
                                    />
                                </div>

                                {/* Zona de Drop do Dia Selecionado */}
                                <Droppable droppableId="calendar">
                                    {(provided, snapshot) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                            className={`flex-1 flex flex-col gap-4 p-6 rounded-3xl border-2 border-dashed transition-all min-h-[300px] ${snapshot.isDraggingOver ? 'border-[#FF0000] bg-[#FF0000]/5' : 'border-white/10 bg-white/[0.01]'}`}
                                        >
                                            <div className="flex items-center gap-3 text-zinc-400 mb-2">
                                                <CalendarIcon size={20} />
                                                <h4 className="font-bold text-sm uppercase tracking-widest">Publicações do Dia</h4>
                                            </div>

                                            {scheduledVideos.filter(v => v.scheduled_for && new Date(v.scheduled_for).toDateString() === selectedDate?.toDateString()).length === 0 ? (
                                                <div className="flex-1 flex flex-col items-center justify-center text-zinc-600 gap-2 text-center opacity-50">
                                                    <p className="text-sm font-medium">Solte vídeos da fila aqui</p>
                                                </div>
                                            ) : (
                                                scheduledVideos
                                                    .filter(v => v.scheduled_for && new Date(v.scheduled_for).toDateString() === selectedDate?.toDateString())
                                                    .map((video, index) => (
                                                        <Draggable key={video.id} draggableId={video.id} index={index}>
                                                            {(provided) => (
                                                                <div
                                                                    ref={provided.innerRef}
                                                                    {...provided.draggableProps}
                                                                    {...provided.dragHandleProps}
                                                                    className="p-4 rounded-xl bg-gradient-to-r from-zinc-900 to-[#FF0000]/10 border border-[#FF0000]/20 flex items-center justify-between"
                                                                >
                                                                    <div className="flex items-center gap-3">
                                                                        <GripVertical size={16} className="text-[#FF0000]/50" />
                                                                        <p className="text-sm font-bold text-white max-w-[200px] truncate">{video.title}</p>
                                                                    </div>
                                                                    <CheckCircle2 size={18} className="text-[#FF0000]" />
                                                                </div>
                                                            )}
                                                        </Draggable>
                                                    ))
                                            )}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </div>
                        </div>

                    </div>
                </DragDropContext>
            </main>
        </div>
    );
}

