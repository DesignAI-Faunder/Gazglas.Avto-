import { useEffect, useState } from "react";

const МИНИМАЛЬНЫЙ_AQI = 30;
const МАКСИМАЛЬНЫЙ_AQI = 120;
const ДЛИТЕЛЬНОСТЬ_ЦИКЛА = 5000;

function App() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col">
        <header className="rounded-3xl border border-white/10 bg-white/10 px-4 py-5 shadow-2xl backdrop-blur-xl transition-all">
          <h1 className="text-center font-mono text-3xl font-bold tracking-[0.18em] text-cyan-300">
            GazGlaz.AI
          </h1>
          <p className="mt-2 text-center text-[11px] tracking-wide text-slate-300">
            Нейросетевой мониторинг экосферы ДВС автомобиля
          </p>
        </header>

        <main className="mt-5 flex-1">
          <section className="flex h-[60vh] items-center justify-center rounded-3xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 px-4 backdrop-blur-lg transition-all">
            <AirQualityScanner />
          </section>

          <section className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition-all">
            <HowItWorks />
          </section>

          <section className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition-all">
            <VirtualAnalyzer />
          </section>

          <section className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition-all">
            <PricingSection />
          </section>

          <section className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl transition-all">
            <GasStationRating />
          </section>
        </main>

        <footer className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition-all">
          <div className="mb-3 flex items-center gap-4 text-sm text-slate-300">
            <a href="#" className="transition-all hover:text-cyan-300">
              Политика
            </a>
            <a href="#" className="transition-all hover:text-cyan-300">
              Оферта
            </a>
          </div>
          <div className="mb-3 flex flex-wrap gap-2 text-xs">
            {["VISA", "Mastercard", "МИР", "Apple Pay", "Google Pay"].map((иконка) => (
              <span
                key={иконка}
                className="rounded-full border border-white/20 bg-slate-900/60 px-3 py-1 text-slate-200"
              >
                {иконка}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-400">© 2026 GazGlaz.AI | Будущее чистого движения</p>
        </footer>
      </div>
    </div>
  );
}

function HowItWorks() {
  const шаги = [
    {
      заголовок: "Шаг 1: Запуск сканера",
      текст: "Откройте доступ к камере и направьте объектив на выхлопную трубу прогретого авто."
    },
    {
      заголовок: "Шаг 2: Фиксация оборотов",
      текст: "Удерживайте педаль газа на 3000 об/мин. Это нужно для захвата эталонной структуры газа."
    },
    {
      заголовок: "Шаг 3: ИИ-анализ",
      текст: "Нейросеть Computer Vision анализирует плотность, цвет и фракции выхлопа в режиме реального времени."
    },
    {
      заголовок: "Шаг 4: Результат",
      текст: "Получите мгновенный вердикт на экран или детальный PDF-отчет о состоянии форсунок и качестве топлива."
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-50">Как это работает</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {шаги.map((шаг) => (
          <article
            key={шаг.заголовок}
            className="rounded-2xl border border-white/10 bg-slate-900/45 p-4 transition-all hover:border-cyan-300/35"
          >
            <h3 className="text-base font-semibold text-cyan-300">{шаг.заголовок}</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{шаг.текст}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function VirtualAnalyzer() {
  const [выбранноеТопливо, setВыбранноеТопливо] = useState(null);
  const [таймер, setТаймер] = useState(0);

  const линзы = [
    { id: "бензин", подпись: "Бензин", позиция: "left-[18%] top-[14%]" },
    { id: "дизель", подпись: "Дизель", позиция: "right-[18%] top-[14%]" },
    { id: "газ", подпись: "Газ", позиция: "left-1/2 top-[54%] -translate-x-1/2" }
  ];

  useEffect(() => {
    if (таймер <= 0) return undefined;

    const интервал = setInterval(() => {
      setТаймер((текущее) => {
        if (текущее <= 1) {
          clearInterval(интервал);
          return 0;
        }
        return текущее - 1;
      });
    }, 1000);

    return () => clearInterval(интервал);
  }, [таймер]);

  const запуститьСканирование = () => {
    if (!выбранноеТопливо) return;
    setТаймер(10);
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-50">Виртуальный анализатор</h2>
      <div className="mt-4 rounded-3xl border border-white/15 bg-slate-950/70 p-4 shadow-[0_0_45px_rgba(14,165,233,0.12)]">
        <div className="relative mx-auto h-[20rem] w-full max-w-3xl rounded-3xl border border-white/10 bg-gradient-to-b from-slate-900/80 to-slate-950/90">
          {линзы.map((линза) => {
            const активна = выбранноеТопливо === линза.id;
            const естьВыбор = Boolean(выбранноеТопливо);

            return (
              <button
                key={линза.id}
                type="button"
                onClick={() => setВыбранноеТопливо(линза.id)}
                className={`absolute ${линза.позиция} h-28 w-28 rounded-full border-4 border-slate-300/90 bg-slate-900/85 transition-all duration-300 sm:h-36 sm:w-36 ${
                  активна
                    ? "scale-110 shadow-[0_0_36px_rgba(34,211,238,0.75)]"
                    : естьВыбор
                      ? "scale-90 opacity-45 blur-[1px]"
                      : "scale-100 opacity-100"
                }`}
              >
                <span className="absolute inset-3 rounded-full border border-white/35 bg-gradient-to-br from-cyan-200/20 via-slate-800/80 to-black/90" />
                <span className="absolute inset-[36%] rounded-full bg-cyan-100/20 blur-md" />
              </button>
            );
          })}
        </div>
        <div className="mx-auto mt-3 grid max-w-3xl grid-cols-3 gap-2 text-center text-sm text-slate-300">
          {линзы.map((линза) => (
            <p
              key={линза.id}
              className={`rounded-full border px-2 py-1 ${
                выбранноеТопливо === линза.id
                  ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
                  : "border-white/15 bg-slate-900/35"
              }`}
            >
              {линза.подпись}
            </p>
          ))}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="button"
          disabled={!выбранноеТопливо}
          onClick={запуститьСканирование}
          className="w-full max-w-sm rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-6 py-3 text-sm font-semibold tracking-[0.2em] text-cyan-100 transition-all hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-slate-700/30 disabled:text-slate-500"
        >
          СКАНИРОВАТЬ
        </button>
        <p className="min-h-6 text-sm text-slate-300">
          {таймер > 0 ? `Идет структурный анализ... ${таймер} с` : "Выберите тип топлива для старта анализа."}
        </p>
      </div>
    </div>
  );
}

function PricingSection() {
  const тарифы = [
    {
      название: "ТЕСТ",
      цена: "0 BYN",
      описание: "Один замер, мгновенный результат на экране без сохранения истории."
    },
    {
      название: "РАЗОВЫЙ",
      цена: "10 BYN / 300 RUR",
      описание: "4 фото-замера + отправка детального чек-листа в формате PDF на вашу почту."
    },
    {
      название: "МЕСЯЧНЫЙ",
      цена: "30 BYN / 900 RUR",
      описание: "До 20 замеров в месяц, полная история в облаке, PDF-отчеты и динамика состояния двигателя.",
      хит: true
    },
    {
      название: "ГОДОВОЙ",
      цена: "150 BYN / 4500 RUR",
      описание: "Безлимитный контроль (до 200 замеров), приоритетная поддержка ИИ-консультанта."
    },
    {
      название: "КОРПОРАТИВ",
      цена: "1000 BYN / 30000 RUR",
      описание: "Профиль на 10 автомобилей, до 2000 замеров, бизнес-аналитика для автопарка."
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-50">Тарифы</h2>
      <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {тарифы.map((тариф) => (
          <article
            key={тариф.название}
            className={`rounded-2xl border p-4 ${
              тариф.хит
                ? "border-cyan-300/55 bg-cyan-400/10 shadow-[0_0_28px_rgba(34,211,238,0.25)]"
                : "border-white/10 bg-slate-900/45"
            }`}
          >
            <div className="flex items-center justify-between gap-2">
              <h3 className="text-base font-semibold text-cyan-200">{тариф.название}</h3>
              {тариф.хит ? (
                <span className="rounded-full border border-cyan-200/60 bg-cyan-200/20 px-2 py-1 text-[10px] font-semibold text-cyan-100">
                  ХИТ ПРОДАЖ
                </span>
              ) : null}
            </div>
            <p className="mt-3 text-lg font-semibold text-white">{тариф.цена}</p>
            <p className="mt-2 text-sm leading-relaxed text-slate-300">{тариф.описание}</p>
          </article>
        ))}
      </div>
    </div>
  );
}

function GasStationRating() {
  const [строки, setСтроки] = useState([
    { id: 1, сеть: "Белнефть", чистота: 96, вердикт: "Топливо стабильно чистое" },
    { id: 2, сеть: "Лукойл", чистота: 88, вердикт: "Рекомендуется контроль присадок" },
    { id: 3, сеть: "Газпромнефть", чистота: 81, вердикт: "Возможны фракционные отклонения" }
  ]);

  const переключитьСтроку = (id) => {
    setСтроки((предыдущие) =>
      предыдущие.map((строка) =>
        строка.id === id
          ? {
              ...строка,
              чистота: строка.чистота > 90 ? строка.чистота - 7 : строка.чистота + 8,
              вердикт:
                строка.чистота > 90
                  ? "Данные обновлены: контроль в норме"
                  : "Данные обновлены: нужен повторный замер"
            }
          : строка
      )
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-50">Рейтинг АЗС</h2>
      <p className="mt-2 text-sm text-slate-300">Нажмите на строку для демонстрационного обновления показателей.</p>

      <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/40">
        <div className="grid grid-cols-[1.1fr_0.6fr_1fr] border-b border-white/10 bg-slate-900/65 px-3 py-2 text-xs uppercase tracking-[0.08em] text-slate-300 sm:px-4 sm:text-sm">
          <span>Сеть АЗС</span>
          <span>Чистота (%)</span>
          <span>Вердикт ИИ</span>
        </div>
        <div className="divide-y divide-white/10">
          {строки.map((строка) => (
            <button
              key={строка.id}
              type="button"
              onClick={() => переключитьСтроку(строка.id)}
              className="grid w-full grid-cols-[1.1fr_0.6fr_1fr] px-3 py-3 text-left text-xs text-slate-200 transition-all hover:bg-cyan-300/10 sm:px-4 sm:text-sm"
            >
              <span>{строка.сеть}</span>
              <span>{строка.чистота}</span>
              <span>{строка.вердикт}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function AirQualityScanner() {
  const [aqi, setAqi] = useState(МИНИМАЛЬНЫЙ_AQI);

  useEffect(() => {
    let начало = performance.now();
    let началоЗначения = МИНИМАЛЬНЫЙ_AQI;
    let цель = МАКСИМАЛЬНЫЙ_AQI;
    let кадр = 0;

    const обновить = (время) => {
      const прогресс = Math.min((время - начало) / ДЛИТЕЛЬНОСТЬ_ЦИКЛА, 1);
      const плавность = 0.5 - Math.cos(Math.PI * прогресс) / 2;
      const значение = началоЗначения + (цель - началоЗначения) * плавность;
      setAqi(Math.round(значение));

      if (прогресс >= 1) {
        начало = время;
        началоЗначения = цель;
        цель = цель === МАКСИМАЛЬНЫЙ_AQI ? МИНИМАЛЬНЫЙ_AQI : МАКСИМАЛЬНЫЙ_AQI;
      }

      кадр = requestAnimationFrame(обновить);
    };

    кадр = requestAnimationFrame(обновить);
    return () => cancelAnimationFrame(кадр);
  }, []);

  const тревога = aqi > 90;
  const умеренно = aqi >= 50 && aqi <= 90;

  const тема = тревога
    ? {
        оттенок: "#ef4444",
        вторичный: "#fca5a5",
        статус: "Тревожный уровень",
        пульсация: "animate-pulse"
      }
    : умеренно
      ? {
          оттенок: "#f59e0b",
          вторичный: "#fcd34d",
          статус: "Повышенный фон",
          пульсация: "animate-pulse"
        }
      : {
          оттенок: "#10b981",
          вторичный: "#6ee7b7",
          статус: "Оптимальный уровень",
          пульсация: "animate-pulse"
        };

  return (
    <div className="flex w-full flex-col items-center justify-center gap-4 text-center">
      <div
        className={`relative rounded-full p-4 transition-all duration-500 ${тема.пульсация} ${
          тревога ? "scale-105" : "scale-100"
        }`}
      >
        <svg viewBox="0 0 280 280" className="h-64 w-64 drop-shadow-[0_0_40px_rgba(56,189,248,0.22)]">
          <defs>
            <radialGradient id="ядроСканера" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={тема.вторичный} stopOpacity="0.85" />
              <stop offset="60%" stopColor={тема.оттенок} stopOpacity="0.35" />
              <stop offset="100%" stopColor={тема.оттенок} stopOpacity="0.12" />
            </radialGradient>
          </defs>
          <circle cx="140" cy="140" r="105" fill="url(#ядроСканера)" />
          <circle cx="140" cy="140" r="97" fill="none" stroke={тема.оттенок} strokeWidth="2" opacity="0.7" />
          <circle
            cx="140"
            cy="140"
            r="84"
            fill="none"
            stroke={тема.вторичный}
            strokeWidth="1.5"
            strokeDasharray="8 8"
            opacity="0.8"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <p className="text-xs uppercase tracking-[0.25em] text-slate-300">AQI</p>
          <p className="mt-1 text-5xl font-semibold text-white">{aqi}</p>
          <p className="mt-2 text-xs text-slate-300">{тема.статус}</p>
        </div>
      </div>
      <p className="text-xs text-slate-400">
        Демонстрационный сканер обновляет индекс каждые 5 секунд в диапазоне 30–120.
      </p>
    </div>
  );
}

export default App;
