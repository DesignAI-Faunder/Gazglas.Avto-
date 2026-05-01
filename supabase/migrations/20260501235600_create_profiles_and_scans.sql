create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  tariff text not null check (tariff in ('Разовый', 'Оптимальный', 'Премиум', 'Бизнес')),
  total_scans integer not null check (total_scans in (4, 20, 200, 2000)),
  used_scans integer not null default 0,
  created_at timestamptz not null default now(),
  constraint profiles_used_scans_check check (used_scans >= 0 and used_scans <= total_scans)
);

create table if not exists public.scans (
  id bigint generated always as identity primary key,
  profile_id uuid references public.profiles(id) on delete set null,
  car_number text not null,
  photo_urls jsonb not null default '[]'::jsonb,
  ai_report jsonb,
  cert_level text not null check (cert_level in ('Silver', 'Gold', 'Platinum')),
  created_at timestamptz not null default now()
);
