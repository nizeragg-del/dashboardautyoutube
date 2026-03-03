-- Criação da Tabela de Automações Semanais (Piloto Automático)
CREATE TABLE IF NOT EXISTS public.automations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    theme TEXT DEFAULT 'Aleatório',
    days_of_week INTEGER[] DEFAULT '{}', -- 0 = Domingo, 1 = Segunda, ..., 6 = Sábado
    time_of_day TIME DEFAULT '18:00',
    is_active BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Configura RLS (Row Level Security)
ALTER TABLE public.automations ENABLE ROW LEVEL SECURITY;

-- Políticas de Segurança
CREATE POLICY "Users can view their own automations" 
ON public.automations FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own automations" 
ON public.automations FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own automations" 
ON public.automations FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own automations" 
ON public.automations FOR DELETE 
USING (auth.uid() = user_id);

-- Função para atualizar o `updated_at` automaticamente
CREATE OR REPLACE FUNCTION update_automations_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_automations_updated_at
    BEFORE UPDATE ON public.automations
    FOR EACH ROW
    EXECUTE FUNCTION update_automations_updated_at_column();
