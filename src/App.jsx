import { useEffect, useState } from "react";

const МИНИМАЛЬНЫЙ_AQI = 30;
const МАКСИМАЛЬНЫЙ_AQI = 120;
const ДЛИТЕЛЬНОСТЬ_ЦИКЛА = 5000;

function App() {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-4 text-slate-100">
      <div className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-md flex-col">
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

          <section className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-4 backdrop-blur-xl transition-all">
            <div className="max-h-40 overflow-y-auto pr-1">
              <h2 className="text-center text-xl font-semibold leading-tight text-slate-50">
                Узнайте состояние двигателя и качество топлива за 15 секунд
              </h2>
              <p className="mt-3 text-center text-sm leading-relaxed text-slate-300">
                Мгновенная ИИ-диагностика Computer Vision по структуре и цвету выхлопных газов. Чек-лист PDF
              </p>
            </div>
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
