-- leads_erp
DROP POLICY IF EXISTS "auth_delete_erp" ON public.leads_erp;
CREATE POLICY "auth_delete_erp" ON public.leads_erp
  FOR DELETE TO authenticated USING (true);

-- leads_certificados
DROP POLICY IF EXISTS "auth_delete_certificados" ON public.leads_certificados;
CREATE POLICY "auth_delete_certificados" ON public.leads_certificados
  FOR DELETE TO authenticated USING (true);

-- leads_parceiros
DROP POLICY IF EXISTS "auth_delete_parceiros" ON public.leads_parceiros;
CREATE POLICY "auth_delete_parceiros" ON public.leads_parceiros
  FOR DELETE TO authenticated USING (true);
