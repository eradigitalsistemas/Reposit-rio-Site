DO $do$
BEGIN
  -- Remove os currículos cadastrados com dados fictícios para iniciarmos a partir de dados reais
  DELETE FROM public.candidates;
  DELETE FROM public.users;
END $do$;
