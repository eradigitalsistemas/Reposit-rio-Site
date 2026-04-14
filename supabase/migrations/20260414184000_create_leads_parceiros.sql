CREATE TABLE IF NOT EXISTS public.leads_parceiros (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  email TEXT NOT NULL,
  telefone TEXT NOT NULL,
  profissao TEXT NOT NULL,
  data_criacao TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.leads_parceiros ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_parceiros" ON public.leads_parceiros;
CREATE POLICY "anon_insert_parceiros" ON public.leads_parceiros
  FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_parceiros" ON public.leads_parceiros;
CREATE POLICY "auth_read_parceiros" ON public.leads_parceiros
  FOR SELECT TO authenticated USING (true);
