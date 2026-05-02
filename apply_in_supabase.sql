-- Вставь весь файл в Supabase: SQL Editor → вставка → Run. Больше ничего не копируй.

CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid PRIMARY KEY,
  email text,
  tariff text,
  total_scans integer,
  used_scans integer DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.scans (
  id uuid PRIMARY KEY,
  car_number text,
  images text[],
  ai_report text,
  cert_level text,
  created_at timestamptz DEFAULT now()
);
