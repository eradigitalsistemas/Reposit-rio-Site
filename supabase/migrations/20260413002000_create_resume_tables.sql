DO $$
BEGIN
  -- Criação da tabela users (candidatos)
  CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    nome TEXT NOT NULL,
    telefone TEXT NOT NULL,
    data_nascimento DATE,
    foto_url TEXT,
    endereco TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Criação da tabela educations
  CREATE TABLE IF NOT EXISTS public.educations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    instituicao TEXT,
    curso TEXT,
    data_inicio TEXT,
    data_fim TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Criação da tabela experiences
  CREATE TABLE IF NOT EXISTS public.experiences (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    empresa TEXT,
    cargo TEXT,
    data_inicio TEXT,
    data_fim TEXT,
    descricao TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Criação da tabela disc_results
  CREATE TABLE IF NOT EXISTS public.disc_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    tipo_perfil TEXT,
    pontuacao_d INT,
    pontuacao_i INT,
    pontuacao_s INT,
    pontuacao_c INT,
    data_teste TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Criação da tabela leads_certificados
  CREATE TABLE IF NOT EXISTS public.leads_certificados (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    tipo_certificado TEXT,
    telefone TEXT,
    data_contato TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Criação da tabela leads_erp
  CREATE TABLE IF NOT EXISTS public.leads_erp (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT,
    empresa TEXT,
    telefone TEXT,
    data_contato TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );

  -- Criação da tabela emails_sent para auditoria dos emails transacionais
  CREATE TABLE IF NOT EXISTS public.emails_sent (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
  );
END $$;

-- Criação de Índices
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_emails_sent_status ON public.emails_sent(status);

-- Função de Trigger para updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Aplicar Triggers
DROP TRIGGER IF EXISTS set_public_users_updated_at ON public.users;
CREATE TRIGGER set_public_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

DROP TRIGGER IF EXISTS set_public_emails_sent_updated_at ON public.emails_sent;
CREATE TRIGGER set_public_emails_sent_updated_at
  BEFORE UPDATE ON public.emails_sent
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at_timestamp();

-- Configuração de Row Level Security (RLS)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.educations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experiences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disc_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_erp ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.emails_sent ENABLE ROW LEVEL SECURITY;

-- Políticas de INSERT para todos (usuários públicos submetendo currículos)
DROP POLICY IF EXISTS "anon_insert_users" ON public.users;
CREATE POLICY "anon_insert_users" ON public.users FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_educations" ON public.educations;
CREATE POLICY "anon_insert_educations" ON public.educations FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_experiences" ON public.experiences;
CREATE POLICY "anon_insert_experiences" ON public.experiences FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_disc" ON public.disc_results;
CREATE POLICY "anon_insert_disc" ON public.disc_results FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_certificados" ON public.leads_certificados;
CREATE POLICY "anon_insert_certificados" ON public.leads_certificados FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_erp" ON public.leads_erp;
CREATE POLICY "anon_insert_erp" ON public.leads_erp FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_insert_emails_sent" ON public.emails_sent;
CREATE POLICY "anon_insert_emails_sent" ON public.emails_sent FOR INSERT TO anon, authenticated WITH CHECK (true);

-- Políticas de SELECT (apenas para usuários internos autenticados)
DROP POLICY IF EXISTS "auth_read_users" ON public.users;
CREATE POLICY "auth_read_users" ON public.users FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_educations" ON public.educations;
CREATE POLICY "auth_read_educations" ON public.educations FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_experiences" ON public.experiences;
CREATE POLICY "auth_read_experiences" ON public.experiences FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_disc" ON public.disc_results;
CREATE POLICY "auth_read_disc" ON public.disc_results FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_certificados" ON public.leads_certificados;
CREATE POLICY "auth_read_certificados" ON public.leads_certificados FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_erp" ON public.leads_erp;
CREATE POLICY "auth_read_erp" ON public.leads_erp FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_read_emails_sent" ON public.emails_sent;
CREATE POLICY "auth_read_emails_sent" ON public.emails_sent FOR SELECT TO authenticated USING (true);
