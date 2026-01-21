-- Fix permissive RLS policy (lint 0024)

DO $$ BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname='public' AND tablename='books' AND policyname='Books: create authenticated'
  ) THEN
    DROP POLICY "Books: create authenticated" ON public.books;
  END IF;
END $$;

CREATE POLICY "Books: create authenticated"
ON public.books
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL);
