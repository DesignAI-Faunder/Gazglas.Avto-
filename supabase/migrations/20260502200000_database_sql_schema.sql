-- Aligns public.profiles and public.scans with root database.sql.
-- Idempotent: safe for repeated runs from deploy-supabase-db.yml.

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.tables
    WHERE table_schema = 'public' AND table_name = 'profiles'
  ) THEN
    -- Таблица профилей пользователей и их лимитов по тарифам
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY,
      email TEXT,
      tariff TEXT, -- Разовый, Оптимальный, Премиум, Бизнес
      total_scans INTEGER, -- Общее количество (4, 20, 200, 2000)
      used_scans INTEGER DEFAULT 0 -- Потрачено замеров
    );

    -- Таблица истории замеров и сертификации
    CREATE TABLE public.scans (
      id UUID PRIMARY KEY,
      car_number TEXT, -- Госномер автомобиля
      images TEXT[], -- Массив ссылок на 5 фотографий
      ai_report TEXT, -- Полный вердикт от OpenAI
      cert_level TEXT, -- Статус: Silver, Gold, Platinum
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  ELSIF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'email'
  ) THEN
    DROP TABLE IF EXISTS public.scans CASCADE;
    DROP TABLE IF EXISTS public.profiles CASCADE;

    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY,
      email TEXT,
      tariff TEXT,
      total_scans INTEGER,
      used_scans INTEGER DEFAULT 0
    );

    CREATE TABLE public.scans (
      id UUID PRIMARY KEY,
      car_number TEXT,
      images TEXT[],
      ai_report TEXT,
      cert_level TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
  END IF;
END $$;
