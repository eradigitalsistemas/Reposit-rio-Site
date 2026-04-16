CREATE TABLE IF NOT EXISTS public.certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    benefits JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.certificates ENABLE ROW LEVEL SECURITY;

CREATE POLICY "auth_read_certificates" ON public.certificates FOR SELECT TO authenticated, anon USING (true);
CREATE POLICY "admin_all_certificates" ON public.certificates FOR ALL TO authenticated USING (
    EXISTS (SELECT 1 FROM public.usuarios WHERE usuarios.id = auth.uid() AND usuarios.perfil = 'admin')
);

INSERT INTO public.certificates (id, title, description, benefits, created_at)
VALUES 
    ('0a555ddc-9d26-41d7-828a-a524cebe86af', 'e-CPF A3', 'Armazenado em token ou cartão, validade de 1 a 3 anos. Maior segurança física.', '["Armazenado em token/cartão", "Validade de 1 a 3 anos", "Alta segurança", "Portabilidade"]', '2026-04-16 18:05:15.467254+00'),
    ('124d48ab-0394-4a1f-bee9-9c08c46113da', 'e-CNPJ A3', 'Identidade PJ em mídia física, validade de 1 a 3 anos.', '["Mídia física (Token)", "Validade de até 3 anos", "Máxima segurança", "Uso restrito"]', '2026-04-16 18:05:15.467254+00'),
    ('866098b8-aab2-44b2-817c-26b020850bf2', 'e-CNPJ A1', 'Identidade digital da sua empresa no computador, validade de 1 ano.', '["Emissão de NF-e rápida", "Instalação em múltiplos PCs", "Validade de 1 ano", "Automação fácil"]', '2026-04-16 18:05:15.467254+00'),
    ('9063ee59-83f5-42e3-952c-54eb052649ce', 'e-CPF A1', 'Instalado no computador, validade de 1 ano. Ideal para pessoas físicas.', '["Instalado no computador", "Validade de 1 ano", "Emissão online", "Acesso rápido"]', '2026-04-16 18:05:15.467254+00')
ON CONFLICT (id) DO NOTHING;
