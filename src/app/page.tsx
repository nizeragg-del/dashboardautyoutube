"use client";
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from "next/navigation";

export default function DashboardHome() {
  const [idea, setIdea] = useState('');
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState([
    { label: 'Vídeos Gerados', value: '0', icon: '📽️' },
    { label: 'Visualizações Est.', value: '0', icon: '📈' },
    { label: 'Agendados', value: '0', icon: '📅' },
    { label: 'Créditos API', value: 'Infinity', icon: '♾️' },
  ]);
  const [recentVideos, setRecentVideos] = useState<any[]>([]);
  const router = useRouter();

  const fetchDashboardData = useCallback(async (userId: string) => {
    setDataLoading(true);
    try {
      // 1. Contar vídeos gerados
      const { count: videoCount } = await supabase
        .from('videos')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId);

      // 2. Contar agendamentos
      const { count: scheduleCount } = await supabase
        .from('schedules')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)
        .eq('status', 'scheduled');

      // 3. Buscar vídeos recentes
      const { data: videos } = await supabase
        .from('videos')
        .order('created_at', { ascending: false })
        .eq('user_id', userId)
        .limit(3);

      setStats([
        { label: 'Vídeos Gerados', value: (videoCount || 0).toString(), icon: '📽️' },
        { label: 'Visualizações Est.', value: '0', icon: '📈' }, // Placeholder por enquanto
        { label: 'Agendados', value: (scheduleCount || 0).toString(), icon: '📅' },
        { label: 'Créditos API', value: 'Infinity', icon: '♾️' },
      ]);

      if (videos) setRecentVideos(videos);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push("/login");
      } else {
        setUser(session.user);
        fetchDashboardData(session.user.id);
      }
    };
    checkUser();
  }, [router, fetchDashboardData]);

  const handleGenerate = async () => {
    if (!idea) return alert('Digite uma ideia primeiro!');
    if (!user) return alert('Você precisa estar logado.');
    setLoading(true);

    try {
      // 1. Buscar perfil para pegar chaves e repo
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError || !profile || !profile.gemini_api_key) {
        throw new Error('Configure suas chaves nas Configurações primeiro.');
      }

      if (!profile.github_token || !profile.github_repo) {
        throw new Error('Configure seu Token e Repositório do GitHub nas Configurações.');
      }

      // 2. Inserir registro de vídeo pendente
      const { data: newVideo, error: videoError } = await supabase
        .from('videos')
        .insert([
          { user_id: user.id, title: idea, status: 'pending', theme: 'História Curta' }
        ])
        .select()
        .single();

      if (videoError) throw videoError;

      // 3. Disparar GitHub Action
      const repoPath = profile.github_repo;
      const GITHUB_TOKEN = profile.github_token;

      const response = await fetch(`https://api.github.com/repos/${repoPath}/actions/workflows/viral_generate.yml/dispatches`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${GITHUB_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ref: 'main',
          inputs: {
            idea: idea,
            gemini_key: profile.gemini_api_key,
            hf_key: profile.huggingface_api_key,
            elevenlabs_key: profile.elevenlabs_api_key,
            voice_id: profile.preferred_voice_id || 'pqHfZKP75CvOlQylNhV4',
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
      fetchDashboardData(user.id); // Atualiza lista
    } catch (error: any) {
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (dataLoading) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-bold">Bem-vindo, {user?.email?.split('@')[0]} 🚀</h1>
          <p className="text-zinc-400 mt-1">Sua fábrica de virais está pronta para rodar.</p>
        </div>
        <button className="btn-primary flex items-center gap-2" onClick={() => router.push('/settings')}>
          <span>⚙️</span> Configurações
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
              <select className="input-field max-w-[200px] bg-zinc-900 border-zinc-800 text-white">
                <option>História Curta</option>
                <option>Curiosidade Nerd</option>
                <option>Motivação Épica</option>
              </select>
              <button
                onClick={handleGenerate}
                disabled={loading}
                className="btn-primary flex-1"
              >
                {loading ? 'Disparando...' : 'Disparar Motor 🔥'}
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="glass p-8 flex flex-col gap-6">
          <h2 className="text-xl font-bold">Atividade Recente</h2>
          <div className="flex flex-col gap-4">
            {recentVideos.length > 0 ? recentVideos.map((video, i) => (
              <div key={video.id} className="flex items-center gap-4 p-3 hover:bg-zinc-900 rounded-lg transition-all cursor-pointer">
                <div className="w-12 h-12 bg-zinc-800 rounded-md flex items-center justify-center font-bold text-zinc-600">
                  {i + 1}
                </div>
                <div>
                  <div className="font-medium text-sm truncate max-w-[150px]">{video.title}</div>
                  <div className={`text-xs ${video.status === 'completed' ? 'text-green-500' : 'text-yellow-500'}`}>
                    {video.status === 'completed' ? 'Concluído' : 'Processando'}
                  </div>
                </div>
              </div>
            )) : (
              <p className="text-zinc-500 text-sm">Nenhum vídeo gerado ainda.</p>
            )}
            <button className="text-blue-500 text-sm hover:underline mt-2" onClick={() => router.push('/videos')}>
              Ver todo o histórico →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

