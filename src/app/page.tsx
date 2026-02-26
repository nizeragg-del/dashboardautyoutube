"use client";
import React, { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation";

// Novos Componentes
import StepChat from '@/components/StepChat';
import StepTheme from '@/components/StepTheme';
import StepVoices from '@/components/StepVoices';
import StepLoading from '@/components/StepLoading';
import StepFinal from '@/components/StepFinal';
import SetupModal from '@/components/SetupModal';
import Sidebar from '@/components/Sidebar';

interface User {
  id: string;
  email?: string;
}

interface Profile {
  id: string;
  gemini_api_key?: string;
  elevenlabs_api_key?: string;
  huggingface_api_key?: string;
  yt_client_id?: string;
  yt_client_secret?: string;
  yt_refresh_token?: string;
  github_token?: string;
  github_repo?: string;
  preferred_voice_id?: string;
}

type StepType = 'chat' | 'theme' | 'voices' | 'loading' | 'final';

export default function DashboardHome() {
  const router = useRouter();

  const [step, setStep] = useState<StepType>('chat');
  const [idea, setIdea] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('history');
  const [selectedVoice, setSelectedVoice] = useState('pqHfZKP75CvOlQylNhV4');

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const loadProfile = useCallback(async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (data) {
      setProfile((prev: Profile | null) => ({
        ...prev,
        ...data
      } as Profile));
      if (!data.gemini_api_key || !data.elevenlabs_api_key) {
        setShowSetup(true);
      }
    } else {
      setShowSetup(true);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        loadProfile(session.user.id);
      }
    };
    checkUser();
  }, [router, loadProfile]);

  const handleTriggerEngine = async () => {
    if (!profile) return;
    setStep('loading');

    try {
      // 1. Inserir registro de vídeo
      const { data: videoData, error: videoError } = await supabase
        .from('videos')
        .insert([
          { user_id: user?.id, title: idea, status: 'pending', theme: selectedTheme }
        ])
        .select('id')
        .single();

      if (videoError) throw videoError;

      // 2. Disparar GitHub Action
      const response = await fetch(`https://api.github.com/repos/${profile.github_repo}/actions/workflows/viral_generate.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${profile.github_token}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            idea: idea || 'Ideia não fornecida',
            gemini_key: profile.gemini_api_key || '',
            hf_key: profile.huggingface_api_key || '',
            elevenlabs_key: profile.elevenlabs_api_key || '',
            voice_id: selectedVoice,
            yt_client_id: profile.yt_client_id || '',
            yt_client_secret: profile.yt_client_secret || '',
            yt_refresh_token: profile.yt_refresh_token || '',
            video_id: videoData.id,
            supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL || '',
            supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
          }
        })
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Falha ao disparar motor no GitHub: ${response.status} - ${errorText}`);
      }

      // Simulação de transição para "Final" após o disparo (o motor continuará rodando)
      // Em um app real, poderíamos via real-time do Supabase ouvir o status 'completed'
      setTimeout(() => setStep('final'), 10000);

    } catch (error: unknown) {
      alert('Erro: ' + (error instanceof Error ? error.message : String(error)));
      setStep('chat');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-12 h-12 border-4 border-white/10 border-t-[#FF0000] rounded-full animate-spin"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-youtube selection:text-white">
      {/* Header Minimalista */}
      <header className="fixed top-0 left-0 right-0 h-20 flex items-center justify-between px-8 z-40">
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

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/5 text-[10px] uppercase tracking-widest font-bold text-zinc-500">
            <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
            Motor Online
          </div>
        </div>
      </header>

      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <main className="relative pt-20 min-h-screen flex flex-col items-center justify-center overflow-hidden">
        {/* Background Glow */}
        <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/5 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="w-full max-w-4xl px-6 relative z-10">
          {step === 'chat' && (
            <StepChat
              initialValue={idea}
              onNext={(val: string) => { setIdea(val); setStep('theme'); }}
            />
          )}

          {step === 'theme' && (
            <StepTheme
              selectedTheme={selectedTheme}
              onBack={() => setStep('chat')}
              onNext={(val: string) => { setSelectedTheme(val); setStep('voices'); }}
            />
          )}

          {step === 'voices' && (
            <StepVoices
              selectedVoice={selectedVoice}
              onBack={() => setStep('theme')}
              onSelectVoice={(val: string) => setSelectedVoice(val)}
              onNext={() => handleTriggerEngine()}
            />
          )}

          {step === 'loading' && (
            <StepLoading idea={idea} />
          )}

          {step === 'final' && (
            <StepFinal onReset={() => { setIdea(''); setStep('chat'); }} />
          )}
        </div>
      </main>

      {showSetup && user && (
        <SetupModal
          userId={user.id}
          onComplete={() => { setShowSetup(false); loadProfile(user.id); }}
        />
      )}
    </div>
  );
}

