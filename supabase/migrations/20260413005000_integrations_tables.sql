CREATE TABLE IF NOT EXISTS public.whatsapp_clicks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  phone_number TEXT NOT NULL,
  source TEXT NOT NULL,
  message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.whatsapp_clicks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_whatsapp_clicks" ON public.whatsapp_clicks;
CREATE POLICY "anon_insert_whatsapp_clicks" ON public.whatsapp_clicks FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_whatsapp_clicks" ON public.whatsapp_clicks;
CREATE POLICY "auth_read_whatsapp_clicks" ON public.whatsapp_clicks FOR SELECT TO authenticated USING (true);


CREATE TABLE IF NOT EXISTS public.sync_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type TEXT NOT NULL,
  entity_id TEXT NOT NULL,
  status TEXT NOT NULL,
  attempts INT DEFAULT 1,
  error_message TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE public.sync_logs ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_insert_sync_logs" ON public.sync_logs;
CREATE POLICY "anon_insert_sync_logs" ON public.sync_logs FOR INSERT TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_read_sync_logs" ON public.sync_logs;
CREATE POLICY "auth_read_sync_logs" ON public.sync_logs FOR SELECT TO authenticated USING (true);

DROP POLICY IF EXISTS "auth_update_sync_logs" ON public.sync_logs;
CREATE POLICY "auth_update_sync_logs" ON public.sync_logs FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
