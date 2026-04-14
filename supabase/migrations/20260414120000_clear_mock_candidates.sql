DO $$
BEGIN
  -- Remove all mock/test candidates to start fresh with real data
  DELETE FROM public.candidates;
END $$;
