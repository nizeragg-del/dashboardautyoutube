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
  github_token?: string;
  github_repo?: string;
  preferred_voice_id?: string;
}

type StepType = 'chat' | 'theme' | 'voices' | 'loading' | 'final';

export default function DashboardHome() {
  const [step, setStep] = useState<StepType>('chat');
  const [idea, setIdea] = useState('');
  const [selectedTheme, setSelectedTheme] = useState('history');
  const [selectedVoice, setSelectedVoice] = useState('pqHfZKP75CvOlQylNhV4');

  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

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
            gemini_key: profile.gemini_api_key,
            elevenlabs_key: profile.elevenlabs_api_key,
            voice_id: selectedVoice,
            video_id: videoData.id,
            supabase_url: process.env.NEXT_PUBLIC_SUPABASE_URL,
            supabase_key: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          }
        })
      });

      if (!response.ok) throw new Error('Falha ao disparar motor no GitHub.');

      // Simulação de transição para "Final" após o disparo (o motor continuará rodando)
      // Em um app real, poderíamos via real-time do Supabase ouvir o status 'completed'
      setTimeout(() => setStep('final'), 10000);

    } catch (error: unknown) {
      alert('Erro: ' + (error instanceof Error ? error.message : String(error)));
      setStep('chat');
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">
      <Sidebar />

      <main className="ml-64 p-8 min-h-screen flex flex-col items-center justify-center">
        <div className="w-full max-w-5xl">
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
              onNext={(val: string) => { setSelectedVoice(val); handleTriggerEngine(); }}
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

