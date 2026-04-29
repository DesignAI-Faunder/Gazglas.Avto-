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
            <HeroIntro />
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
            <AutoHealthCertificate />
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

function HeroIntro() {
  return (
    <div className="text-center">
      <h1 className="text-xl font-semibold leading-tight text-slate-50 sm:text-2xl">
        Узнайте состояние двигателя и качество топлива за 15 секунд
      </h1>
      <p className="mx-auto mt-3 max-w-3xl text-sm leading-relaxed text-slate-300">
        Мгновенная ИИ-диагностика Computer Vision по структуре и цвету выхлопных газов с выводом результата
        на экран и формированием PDF-отчета.
      </p>
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
  const [идетСканирование, setИдетСканирование] = useState(false);
  const [режимСканирования, setРежимСканирования] = useState(null);
  const [показатьPartialReport, setПоказатьPartialReport] = useState(false);
  const [показатьПолныйОтчет, setПоказатьПолныйОтчет] = useState(false);
  const [логКадра, setЛогКадра] = useState([]);

  const линзы = [
    { id: "бензин", подпись: "Бензин" },
    { id: "дизель", подпись: "Дизель" },
    { id: "газ", подпись: "Газ" }
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

  useEffect(() => {
    if (таймер === 0) {
      setИдетСканирование(false);
      if (режимСканирования === "demo") {
        setПоказатьPartialReport(true);
      }
      if (режимСканирования === "full") {
        setПоказатьПолныйОтчет(true);
      }
      setРежимСканирования(null);
    }
  }, [таймер, режимСканирования]);

  useEffect(() => {
    if (!идетСканирование) return undefined;
    const обновитьЛог = () => {
      const кадр = Math.floor(1000 + Math.random() * 8999);
      const ch = (0.2 + Math.random() * 1.3).toFixed(2);
      const lambda = (0.8 + Math.random() * 0.25).toFixed(2);
      const temp = Math.floor(220 + Math.random() * 35);
      return `FRAME-${кадр} | CH:${ch} | λ:${lambda} | T:${temp}C`;
    };
    setЛогКадра(Array.from({ length: 4 }, обновитьЛог));
    const интервалЛога = setInterval(() => {
      setЛогКадра((предыдущий) => [обновитьЛог(), ...предыдущий].slice(0, 4));
    }, 380);
    return () => clearInterval(интервалЛога);
  }, [идетСканирование]);

  const воспроизвестиЗвукСканирования = () => {
    try {
      const Контекст = window.AudioContext || window.webkitAudioContext;
      if (!Контекст) return;

      const контекст = new Контекст();
      const сейчас = контекст.currentTime;

      const щелчок = контекст.createOscillator();
      const усилительЩелчка = контекст.createGain();
      щелчок.type = "square";
      щелчок.frequency.setValueAtTime(1400, сейчас);
      усилительЩелчка.gain.setValueAtTime(0.0001, сейчас);
      усилительЩелчка.gain.exponentialRampToValueAtTime(0.28, сейчас + 0.01);
      усилительЩелчка.gain.exponentialRampToValueAtTime(0.0001, сейчас + 0.08);
      щелчок.connect(усилительЩелчка);
      усилительЩелчка.connect(контекст.destination);
      щелчок.start(сейчас);
      щелчок.stop(сейчас + 0.09);

      const гул = контекст.createOscillator();
      const усилительГула = контекст.createGain();
      гул.type = "sawtooth";
      гул.frequency.setValueAtTime(58, сейчас + 0.1);
      усилительГула.gain.setValueAtTime(0.0001, сейчас + 0.1);
      усилительГула.gain.linearRampToValueAtTime(0.08, сейчас + 0.35);
      усилительГула.gain.linearRampToValueAtTime(0.0001, сейчас + 2.2);
      гул.connect(усилительГула);
      усилительГула.connect(контекст.destination);
      гул.start(сейчас + 0.1);
      гул.stop(сейчас + 2.3);
    } catch {
      // Заглушка звука: если браузер блокирует автозапуск, интерфейс продолжит сканирование без аудио.
    }
  };

  const запуститьСканирование = () => {
    if (!выбранноеТопливо || идетСканирование) return;
    setПоказатьPartialReport(false);
    setИдетСканирование(true);
    setРежимСканирования("full");
    setТаймер(10);
    воспроизвестиЗвукСканирования();
  };

  const запуститьDemoСканирование = () => {
    if (идетСканирование) return;
    setПоказатьПолныйОтчет(false);
    setПоказатьPartialReport(false);
    setИдетСканирование(true);
    setРежимСканирования("demo");
    setТаймер(5);
    воспроизвестиЗвукСканирования();
  };

  const отчетПараметров = [
    {
      параметр: "Ритмичность потока",
      результат: "Обнаружена прерывистость",
      эталон: "Норма: стабильная струя",
      рекомендация: "Диагностика ГРМ и клапанов"
    },
    {
      параметр: "Дисперсность капель топлива",
      результат: "Отклонение от нормы на 22%",
      эталон: "Стандарт Bosch 2.0",
      рекомендация: "Проверка износа сопла форсунки"
    },
    {
      параметр: "Коэффициент избытка воздуха (Lambda)",
      результат: "Показатель 0.85 (богатая смесь)",
      эталон: "СТБ 1641-2006, п. 5.2",
      рекомендация: "Калибровка подачи воздуха и топлива"
    },
    {
      параметр: "Фракции несгоревших углеводородов (CH)",
      результат: "Превышение нормы в 1.5 раза",
      эталон: "СТБ 1641-2006",
      рекомендация: "Проверка опережения зажигания"
    },
    {
      параметр: "Дымность/дисперсность сажи",
      результат: "Выход за пределы ГОСТ",
      эталон: "ГОСТ 33997-2016",
      рекомендация: "Профилактика EGR и очистка тракта"
    },
    {
      параметр: "Стабильность факела распыла",
      результат: "Асимметрия в 4-м цилиндре",
      эталон: "Bosch Injector Pattern",
      рекомендация: "Стендовая проверка ТНВД"
    }
  ];

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-50">Виртуальный анализатор</h2>
      <div className="mt-4 rounded-3xl border border-white/15 bg-slate-950/70 p-4 shadow-[0_0_45px_rgba(14,165,233,0.12)]">
        <div
          className={`relative mx-auto h-[22rem] w-full max-w-3xl overflow-hidden rounded-3xl border bg-gradient-to-b from-slate-900/80 to-slate-950/90 p-4 sm:h-[24rem] ${
            режимСканирования === "full" && идетСканирование
              ? "border-cyan-300/45 animate-pulse"
              : "border-white/20"
          }`}
        >
          <div className="grid h-full grid-rows-[1fr_1fr] gap-8">
            <div className="flex items-start justify-center pt-2">
              <LensItem
                линза={линзы[0]}
                выбрано={выбранноеТопливо}
                естьВыбор={Boolean(выбранноеТопливо)}
                setВыбранноеТопливо={setВыбранноеТопливо}
              />
            </div>
            <div className="grid grid-cols-2 gap-5 sm:gap-10">
              <div className="flex items-end justify-center lg:-translate-y-3">
                <LensItem
                  линза={линзы[1]}
                  выбрано={выбранноеТопливо}
                  естьВыбор={Boolean(выбранноеТопливо)}
                  setВыбранноеТопливо={setВыбранноеТопливо}
                />
              </div>
              <div className="flex items-end justify-center lg:-translate-y-3">
                <LensItem
                  линза={линзы[2]}
                  выбрано={выбранноеТопливо}
                  естьВыбор={Boolean(выбранноеТопливо)}
                  setВыбранноеТопливо={setВыбранноеТопливо}
                />
              </div>
            </div>
          </div>

          {идетСканирование ? (
            <div className="absolute inset-0">
              <div className="absolute inset-0 bg-gradient-to-b from-slate-900/45 to-slate-950/70 backdrop-blur-md" />
              {Array.from({ length: 10 }, (_, i) => (
                <span
                  key={i}
                  className="absolute rounded-full bg-slate-200/15 blur-xl animate-pulse"
                  style={{
                    left: `${5 + i * 9}%`,
                    bottom: `${8 + (i % 3) * 10}%`,
                    width: `${56 + (i % 4) * 14}px`,
                    height: `${40 + (i % 5) * 9}px`,
                    animationDelay: `${i * 0.16}s`
                  }}
                />
              ))}
              <div className="absolute inset-y-0 left-0 w-[2px] bg-gradient-to-b from-cyan-200/0 via-cyan-300 to-cyan-200/0 shadow-[0_0_26px_rgba(34,211,238,0.9)] animate-pulse" />
              <div className="absolute left-3 top-3 h-8 w-8 border-l-2 border-t-2 border-cyan-300/80" />
              <div className="absolute right-3 top-3 h-8 w-8 border-r-2 border-t-2 border-cyan-300/80" />
              <div className="absolute bottom-3 left-3 h-8 w-8 border-b-2 border-l-2 border-cyan-300/80" />
              <div className="absolute bottom-3 right-3 h-8 w-8 border-b-2 border-r-2 border-cyan-300/80" />

              <div className="absolute right-2 top-2 w-[56%] rounded-xl border border-white/20 bg-slate-950/75 p-2 text-[10px] text-cyan-100 sm:w-72 sm:text-xs">
                <p className="mb-1 text-slate-300">CV Spectrum Log</p>
                <div className="space-y-1 font-mono">
                  {логКадра.map((запись) => (
                    <p key={запись}>{запись}</p>
                  ))}
                </div>
              </div>
            </div>
          ) : null}

          {показатьPartialReport ? (
            <div className="absolute inset-0 flex items-center justify-center bg-slate-950/70 p-3 backdrop-blur-md">
              <div className="max-h-[85%] w-full max-w-xl overflow-y-auto rounded-2xl border border-white/20 bg-slate-950/85 p-4 sm:p-5">
                <h3 className="text-lg font-semibold text-cyan-200">Partial Report</h3>
                <div className="mt-3 space-y-2 text-sm text-slate-200">
                  <p className="rounded-lg border border-emerald-300/30 bg-emerald-300/10 px-3 py-2">
                    CO2 уровень: Норма
                  </p>
                  <p className="rounded-lg border border-cyan-300/30 bg-cyan-300/10 px-3 py-2">
                    Температура выхлопа: 240°C
                  </p>
                  {Array.from({ length: 4 }, (_, i) => (
                    <p
                      key={i}
                      className="flex items-center justify-between rounded-lg border border-white/10 bg-slate-900/65 px-3 py-2 text-slate-300"
                    >
                      <span className="blur-[3px]">Параметр скрыт в демо-режиме</span>
                      <span className="ml-2">🔒</span>
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-sm text-amber-300">Полный анализ доступен во всех платных тарифах</p>
                <div className="mt-3 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setПоказатьPartialReport(false)}
                    className="text-sm text-slate-300 underline decoration-white/40 underline-offset-4 transition-all hover:text-cyan-200 hover:decoration-cyan-200"
                  >
                    Закрыть
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>

      <div className="mt-5 flex flex-col items-center gap-3">
        <button
          type="button"
          onClick={запуститьDemoСканирование}
          disabled={идетСканирование}
          className="w-full max-w-sm rounded-2xl border border-emerald-300/40 bg-emerald-300/10 px-5 py-3 text-sm font-semibold text-emerald-100 transition-all hover:bg-emerald-300/20"
        >
          Попробовать бесплатно
        </button>
        <p className="-mt-2 text-xs text-slate-400">Без PDF-отчета и сохранения истории</p>

        <button
          type="button"
          disabled={!выбранноеТопливо || идетСканирование}
          onClick={запуститьСканирование}
          className="w-full max-w-sm rounded-2xl border border-cyan-300/40 bg-cyan-300/15 px-6 py-3 text-sm font-semibold tracking-[0.2em] text-cyan-100 transition-all hover:bg-cyan-300/25 disabled:cursor-not-allowed disabled:border-white/20 disabled:bg-slate-700/30 disabled:text-slate-500"
        >
          СКАНИРОВАТЬ
        </button>
        <p className="min-h-6 text-sm text-slate-300">
          {таймер > 0 && режимСканирования === "full"
            ? `Идет глубокий анализ... ${таймер} с`
            : таймер > 0 && режимСканирования === "demo"
              ? `Идет demo-анализ... ${таймер} с`
              : "Выберите тип топлива и запустите сканирование."}
        </p>
      </div>

      {показатьПолныйОтчет ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-950/85 p-4 backdrop-blur-md">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-white/20 bg-slate-950/55 p-3 shadow-2xl backdrop-blur-xl sm:p-4">
            <div className="rounded-2xl bg-[#FCFCFC] p-4 text-[#1F2937] sm:p-6">
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 pb-4">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-300 bg-white shadow-sm">
                    <svg viewBox="0 0 24 24" className="h-5 w-5 text-sky-600" fill="none" stroke="currentColor" strokeWidth="1.8">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M7 14l3-3 2 2 4-5" />
                    </svg>
                  </span>
                  <div>
                    <h3 className="text-xl font-semibold text-[#1F2937] sm:text-2xl">GazGlas.AI</h3>
                    <p className="text-sm text-slate-500">Expert Diagnostic Sheet</p>
                  </div>
                </div>
                <div className="text-right text-xs text-slate-500 sm:text-sm">
                  <p className="font-medium text-slate-600">TX: 0xA19C-7F42-9BDE</p>
                  <p>{new Date().toLocaleDateString("ru-RU")}</p>
                </div>
              </div>

              <p className="mt-4 text-sm leading-relaxed text-slate-700 sm:text-base">
                Вердикт GazGlas Computer Vision: анализ выполнен на базе паттернов износа ДВС с опорой на отраслевые эталоны.
              </p>

              <div className="mt-4 overflow-x-auto rounded-xl border border-slate-200">
                <table className="min-w-[780px] w-full border-collapse text-sm sm:text-[14px]">
                  <thead className="bg-slate-100">
                    <tr>
                      <th className="px-3 py-3 text-left font-semibold text-[#1F2937]">Параметр</th>
                      <th className="px-3 py-3 text-left font-semibold text-[#1F2937]">Результат</th>
                      <th className="px-3 py-3 text-left font-semibold text-[#1F2937]">Эталон (СТБ/Bosch)</th>
                      <th className="px-3 py-3 text-left font-semibold text-[#1F2937]">Рекомендация</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white">
                    {отчетПараметров.map((пункт) => (
                      <tr key={пункт.параметр} className="border-t border-slate-200 align-top">
                        <td className="px-3 py-3 font-medium text-[#1F2937]">{пункт.параметр}</td>
                        <td className="px-3 py-3 text-black">{пункт.результат}</td>
                        <td className="px-3 py-3 text-black">{пункт.эталон}</td>
                        <td className="px-3 py-3 text-black">{пункт.рекомендация}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <p className="mt-4 text-sm text-slate-700 sm:text-base">
                Заключение сформировано алгоритмом GazGlas Computer Vision. Непредвзятая оценка
              </p>

              <div className="mt-5 flex items-start justify-end gap-3">
                <span className="text-xs text-slate-500 sm:text-sm">Лист 1 / 1</span>
              </div>
            </div>
            <div className="mt-3 flex items-start justify-end gap-3 px-1">
              <button
                type="button"
                onClick={() => setПоказатьПолныйОтчет(false)}
                className="rounded-lg border border-white/20 px-3 py-1 text-sm text-slate-200 transition-all hover:bg-white/10"
              >
                Закрыть
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function LensItem({ линза, выбрано, естьВыбор, setВыбранноеТопливо }) {
  const активна = выбрано === линза.id;
  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => setВыбранноеТопливо(линза.id)}
        className={`relative h-24 w-24 rounded-full border-4 border-slate-300/90 bg-slate-900/85 transition-all duration-300 sm:h-32 sm:w-32 ${
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
      <p
        className={`rounded-full border px-3 py-1 text-xs sm:text-sm ${
          активна
            ? "border-cyan-300/60 bg-cyan-400/10 text-cyan-200"
            : "border-white/15 bg-slate-900/35 text-slate-300"
        }`}
      >
        {линза.подпись}
      </p>
    </div>
  );
}

function SmokeAnimation() {
  const облака = Array.from({ length: 8 }, (_, i) => i);

  return (
    <div className="relative h-full w-full">
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900/80 to-slate-950/90" />
      {облака.map((облако) => (
        <span
          key={облако}
          className="absolute bottom-6 rounded-full bg-slate-300/20 blur-xl animate-pulse"
          style={{
            left: `${10 + облако * 11}%`,
            width: `${52 + (облако % 3) * 18}px`,
            height: `${52 + (облако % 2) * 20}px`,
            animationDelay: `${облако * 0.2}s`
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">
        <p className="rounded-full border border-cyan-300/30 bg-slate-900/55 px-4 py-2 text-sm text-cyan-200">
          Дымовой паттерн анализируется ИИ...
        </p>
      </div>
    </div>
  );
}

function PricingSection() {
  const тарифы = [
    {
      название: "РАЗОВЫЙ",
      цена: "10 BYN / 300 RUR",
      описание: "4 фото-замера + отправка детального чек-листа в формате PDF на вашу почту."
    },
    {
      название: "ОПТИМАЛЬНЫЙ",
      цена: "30 BYN / 900 RUR",
      описание: "До 20 замеров в месяц, полная история в облаке, PDF-отчеты и динамика состояния двигателя.",
      хит: true
    },
    {
      название: "ПРЕМИУМ",
      цена: "150 BYN / 4500 RUR",
      описание: "Безлимитный контроль (до 200 замеров), приоритетная поддержка ИИ-консультанта."
    },
    {
      название: "БИЗНЕС",
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
            <button
              type="button"
              className="mt-4 w-full rounded-xl border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition-all hover:bg-cyan-300/25"
            >
              Оплатить
            </button>
          </article>
        ))}
      </div>
    </div>
  );
}

function AutoHealthCertificate() {
  const [показатьПодсказку, setПоказатьПодсказку] = useState(false);
  const радиус = 56;
  const длинаОкружности = 2 * Math.PI * радиус;
  const прогресс = 0.4;
  const смещение = длинаОкружности * (1 - прогресс);
  const стартовоеСмещение = длинаОкружности;

  return (
    <div>
      <h2 className="text-2xl font-semibold text-slate-50">Ликвидность авто</h2>
      <p className="mt-2 text-sm leading-relaxed text-slate-300">
        Приобрети тариф &quot;Премиум&quot; и получи блокчейн-сертификат. Добавь +15% к цене своего авто.
      </p>
      <style>{`
        @keyframes liquidityArcCycle {
          0% { stroke-dashoffset: var(--arc-start); }
          75% { stroke-dashoffset: var(--arc-end); }
          88% { stroke-dashoffset: var(--arc-end); }
          100% { stroke-dashoffset: var(--arc-start); }
        }

        @keyframes liquidityBonusPulse {
          0%, 72%, 100% { transform: scale(1); opacity: 1; }
          80% { transform: scale(1.1); opacity: 0.85; }
        }
      `}</style>

      <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-lg sm:p-5">
        <div className="flex flex-col gap-4 sm:gap-5">
          <div className="rounded-2xl border border-white/10 bg-slate-900/35 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Platinum Dashboard</p>
            <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
              <div className="relative h-40 w-40">
                <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
                  <defs>
                    <linearGradient id="liquidityArcGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="#cffafe">
                        <animate
                          attributeName="stop-color"
                          values="#cffafe;#38bdf8;#cffafe"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </stop>
                      <stop offset="100%" stopColor="#1d4ed8">
                        <animate
                          attributeName="stop-color"
                          values="#1d4ed8;#0ea5e9;#1d4ed8"
                          dur="4s"
                          repeatCount="indefinite"
                        />
                      </stop>
                    </linearGradient>
                  </defs>
                  <circle cx="70" cy="70" r={радиус} fill="none" stroke="rgba(148,163,184,0.2)" strokeWidth="10" />
                  <circle
                    cx="70"
                    cy="70"
                    r={радиус}
                    fill="none"
                    stroke="url(#liquidityArcGradient)"
                    strokeWidth="10"
                    strokeLinecap="round"
                    strokeDasharray={длинаОкружности}
                    strokeDashoffset={стартовоеСмещение}
                    className="will-change-[stroke-dashoffset]"
                    style={{
                      "--arc-start": стартовоеСмещение,
                      "--arc-end": смещение,
                      animation: "liquidityArcCycle 4s ease-in-out infinite",
                      filter: "drop-shadow(0 0 8px rgba(56,189,248,0.75)) drop-shadow(0 0 16px rgba(29,78,216,0.45))"
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className="text-xs text-slate-400">Прогресс</p>
                  <p className="text-xl font-semibold text-cyan-200">40%</p>
                </div>
              </div>
              <div className="w-full max-w-xs rounded-xl border border-white/10 bg-slate-950/45 p-3 text-sm text-slate-300">
                <p className="text-slate-200">◯ → 🟡 Gold → 💎 Platinum</p>
                <p className="mt-2 text-cyan-200">До Gold Health осталось 18 проверок</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/35 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Прогноз</p>
            <p
              className="mt-2 text-2xl font-semibold text-emerald-300 will-change-transform sm:text-3xl"
              style={{ animation: "liquidityBonusPulse 4s ease-in-out infinite" }}
            >
              Бонус к цене продажи авто: +4100 BYN
            </p>
          </div>

          <div className="relative rounded-2xl border border-white/10 bg-slate-900/35 p-4">
            <p className="text-xs uppercase tracking-[0.18em] text-slate-400">Активация</p>
            <button
              type="button"
              onClick={() => setПоказатьПодсказку((текущее) => !текущее)}
              className="mt-3 inline-flex items-center gap-2 rounded-xl border border-cyan-300/40 bg-cyan-300/15 px-4 py-2 text-sm font-semibold text-cyan-100 transition-all hover:bg-cyan-300/25 animate-pulse"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8">
                <path d="M12 3l7 3v6c0 4.5-2.9 7.7-7 9-4.1-1.3-7-4.5-7-9V6l7-3z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              Активировать Shield
            </button>
            {показатьПодсказку ? (
              <div className="mt-3 rounded-xl border border-cyan-200/30 bg-slate-950/85 px-3 py-2 text-sm text-cyan-100">
                Оплати тариф &quot;Премиум&quot; и активируй фиксацию данных в блокчейне для Platinum-сертификата
              </div>
            ) : null}
          </div>
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
