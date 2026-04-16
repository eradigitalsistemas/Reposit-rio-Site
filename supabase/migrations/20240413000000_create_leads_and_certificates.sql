-- Create leads table
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  company text NOT NULL,
  details text NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create leads_certificados table for specialized certificate form submissions
CREATE TABLE IF NOT EXISTS public.leads_certificados (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  nome text NOT NULL,
  email text NOT NULL,
  telefone text NOT NULL,
  tipo_certificado text NOT NULL,
  data_contato timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Create certificates table
CREATE TABLE IF NOT EXISTS public.certificates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  benefits text[] NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads_certificados ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

-- Allow public insert to leads tables
CREATE POLICY "Allow public insert to leads" ON public.leads FOR INSERT TO public WITH CHECK (true);
CREATE POLICY "Allow public insert to leads_certificados" ON public.leads_certificados FOR INSERT TO public WITH CHECK (true);

-- Allow public read access to certificates
CREATE POLICY "Allow public select from certificates" ON public.certificates FOR SELECT TO public USING (true);

-- Populate certificates with initial data if empty
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM public.certificates) THEN
    INSERT INTO public.certificates (title, description, benefits) VALUES
    ('e-CPF A1', 'Instalado no computador, validade de 1 ano. Ideal para pessoas físicas.', ARRAY['Instalado no computador', 'Validade de 1 ano', 'Emissão online', 'Acesso rápido']),
    ('e-CPF A3', 'Armazenado em token ou cartão, validade de 1 a 3 anos. Maior segurança física.', ARRAY['Armazenado em token/cartão', 'Validade de 1 a 3 anos', 'Alta segurança', 'Portabilidade']),
    ('e-CNPJ A1', 'Identidade digital da sua empresa no computador, validade de 1 ano.', ARRAY['Emissão de NF-e rápida', 'Instalação em múltiplos PCs', 'Validade de 1 ano', 'Automação fácil']),
    ('e-CNPJ A3', 'Identidade PJ em mídia física, validade de 1 a 3 anos.', ARRAY['Mídia física (Token)', 'Validade de até 3 anos', 'Máxima segurança', 'Uso restrito']);
  END IF;
END $$;
