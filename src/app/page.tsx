"use client";
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function DashboardHome() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [stats] = useState([
    { label: 'Vídeos Gerados', value: '12', icon: '📽️' },
    { label: 'Visualizações Est.', value: '14.2k', icon: '📈' },
    { label: 'Agendados', value: '3', icon: '📅' },
    { label: 'Créditos API', value: 'Infinity', icon: '♾️' },
  ]);

  const handleGenerate = async () => {
    if (!idea) return alert('Digite uma ideia primeiro!');
    setLoading(true);

    try {
      // 1. Buscar chaves do banco (Sempre o primeiro profile para o MVP)
      const { data: profile, error: profileError } = await supabase.from('profiles').select('*').limit(1).single();

      if (profileError || !profile) {
        throw new Error('Configure suas chaves nas Configurações primeiro.');
      }

      // 2. Disparar GitHub Action
      const [owner, repo] = profile.github_repo.split('/');
      const GITHUB_TOKEN = profile.github_token;

      const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/actions/workflows/viral_generate.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main', // Ou a branch padrão
          inputs: {
            idea: idea,
            gemini_key: profile.gemini_api_key,
            hf_key: profile.huggingface_api_key,
            elevenlabs_key: profile.elevenlabs_api_key,
            voice_id: profile.preferred_voice_id,
            yt_client_id: profile.yt_client_id,
            yt_client_secret: profile.yt_client_secret,
            yt_refresh_token: profile.yt_refresh_token,
          }
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(`Erro no GitHub: ${errData.message}`);
      }

      alert('🚀 Motor disparado no GitHub Actions! O vídeo estará pronto em alguns minutos.');
      setIdea('');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : String(error);
      alert('Erro: ' + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-10">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Bem-vindo, Criador 🚀</h1>
          <p className="text-zinc-400 mt-1">Sua fábrica de virais está pronta para rodar.</p>
        </div>
        <button className="btn-primary flex items-center gap-2">
          <span>+</span> Novo Vídeo
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <div key={stat.label} className="glass p-6 flex flex-col gap-2">
            <div className="text-2xl">{stat.icon}</div>
            <div className="text-3xl font-bold">{stat.value}</div>
            <div className="text-sm text-zinc-500 font-medium uppercase tracking-wider">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Main Action Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Quick Generation */}
        <div className="lg:col-span-2 glass p-8 flex flex-col gap-6">
          <h2 className="text-2xl font-bold">Gerar Vídeo Agora</h2>
          <div className="flex flex-col gap-4">
            <textarea
              className="input-field min-h-[120px] resize-none"
              placeholder="Qual a ideia de hoje? (Ex: A verdade oculta sobre as Pirâmides...)"
              value={idea}
              onChange={(e) => setIdea(e.target.value)}
            />
            <div className="flex gap-4">
              <select className="input-field max-w-[200px] bg-zinc-900">
                <option>História Curta</option>
                <option>Curiosidade Nerd</option>
                <option>Motivação Épica</option>
              </select>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Iniciando Cloud...' : 'Disparar Motor 🔥'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold">Atividade Recente</h2>
          <div className="flex flex-col gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center font-bold text-zinc-600">
                  {i}
                </div>
                <div>
                  <div className="font-medium text-sm">Mistério do Voo MH{120 + i}</div>
                  <div className="text-xs text-green-500">Concluído • Há {i}h</div>
                </div>
              </div>
            ))}
            <button className="text-blue-500 text-sm hover:underline mt-2">
              Ver todo o histórico →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
