CREATE OR REPLACE FUNCTION public.trigger_send_email_notification()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
AS $function$
DECLARE
    edge_function_url TEXT := 'https://fyiukfacrniwpzchpzpx.supabase.co/functions/v1/send-notification';
    payload JSONB;
BEGIN
    payload := jsonb_build_object(
        'type', TG_OP,
        'table', TG_TABLE_NAME,
        'record', to_jsonb(NEW)
    );
    
    PERFORM net.http_post(
        url := edge_function_url,
        headers := '{"Content-Type": "application/json", "x-webhook-secret": "super-secret-webhook-key-123"}'::jsonb,
        body := payload
    );

    RETURN NEW;
END;
$function$;

DROP TRIGGER IF EXISTS on_lead_inserted ON public.leads;
CREATE TRIGGER on_lead_inserted
  AFTER INSERT ON public.leads
  FOR EACH ROW EXECUTE FUNCTION public.trigger_send_email_notification();

DROP TRIGGER IF EXISTS on_lead_erp_inserted ON public.leads_erp;
CREATE TRIGGER on_lead_erp_inserted
  AFTER INSERT ON public.leads_erp
  FOR EACH ROW EXECUTE FUNCTION public.trigger_send_email_notification();

DROP TRIGGER IF EXISTS on_lead_certificados_inserted ON public.leads_certificados;
CREATE TRIGGER on_lead_certificados_inserted
  AFTER INSERT ON public.leads_certificados
  FOR EACH ROW EXECUTE FUNCTION public.trigger_send_email_notification();

DROP TRIGGER IF EXISTS on_candidate_inserted_notify ON public.candidates;
CREATE TRIGGER on_candidate_inserted_notify
  AFTER INSERT ON public.candidates
  FOR EACH ROW EXECUTE FUNCTION public.trigger_send_email_notification();
