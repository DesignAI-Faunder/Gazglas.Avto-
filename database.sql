-- Таблица профилей пользователей и их лимитов по тарифам
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  email TEXT,
  tariff TEXT, -- Разовый, Оптимальный, Премиум, Бизнес
  total_scans INTEGER, -- Общее количество (4, 20, 200, 2000)
  used_scans INTEGER DEFAULT 0 -- Потрачено замеров
);

-- Таблица истории замеров и сертификации
CREATE TABLE scans (
  id UUID PRIMARY KEY,
  car_number TEXT, -- Госномер автомобиля
  images TEXT[], -- Массив ссылок на 5 фотографий
  ai_report TEXT, -- Полный вердикт от OpenAI
  cert_level TEXT, -- Статус: Silver, Gold, Platinum
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
