import { useEffect, useMemo, useRef, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { ЦЕНЫ_ТАРИФОВ } from "./constants/pricing";
import { получитьКачествоВоздуха } from "./services/airQualityMock";

const ЭКРАНЫ = {
  ГЛАВНЫЙ: "главный",
  КАМЕРА: "камера",
  ТАРИФЫ: "тарифы",
  КАРТА: "карта",
  ИСТОРИЯ: "история"
};

const ТЕХНО_ЛОГИ = [
  "Анализ частиц сажи...",
  "Проверка плотности пара...",
  "Сверка с базой данных (RAG)..."
];

const ИСТОРИЯ_CO2_ЗА_НЕДЕЛЮ = [
  { день: "ПН", co2: 184 },
  { день: "ВТ", co2: 176 },
  { день: "СР", co2: 191 },
  { день: "ЧТ", co2: 168 },
  { день: "ПТ", co2: 160 },
  { день: "СБ", co2: 154 },
  { день: "ВС", co2: 149 }
];

const ИСТОРИЯ_CO2_ЗА_30_ДНЕЙ = Array.from({ length: 30 }, (_, index) => {
  const номерДня = index + 1;
  const базовое = 205 - index * 1.9;
  const шум = Math.sin(index * 0.7) * 8;
  return {
    день: `${номерДня}`,
    co2: Math.max(132, Math.round(базовое + шум))
  };
});

const ШАГИ_КАК_ЭТО_РАБОТАЕТ = [
  {
    иконка: "⚙",
    текст: "Запустите двигатель и прогрейте до 3000 оборотов."
  },
  {
    иконка: "▶",
    текст: "Нажмите кнопку \"ТЕСТ ВЫХЛОПА\"."
  },
  {
    иконка: "📷",
    текст: "Удерживайте камеру у среза выхлопной трубы 10 секунд."
  },
  {
    иконка: "ИИ",
    текст: "ИИ проанализирует плотность пара и наличие сажи."
  }
];

function App() {
  const [экран, setЭкран] = useState(ЭКРАНЫ.ГЛАВНЫЙ);
  const [воздух, setВоздух] = useState(null);
  const [идетЗагрузкаВоздуха, setИдетЗагрузкаВоздуха] = useState(true);

  const [таймер, setТаймер] = useState(10);
  const [идетТест, setИдетТест] = useState(false);
  const [снимки, setСнимки] = useState([]);
  const [логИндекс, setЛогИндекс] = useState(0);
  const [периодГрафика, setПериодГрафика] = useState("7");
  const [данныеГрафика, setДанныеГрафика] = useState(ИСТОРИЯ_CO2_ЗА_НЕДЕЛЮ);

  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const mediaStreamRef = useRef(null);

  useEffect(() => {
    let активен = true;

    получитьКачествоВоздуха()
      .then((данные) => {
        if (активен) {
          setВоздух(данные);
        }
      })
      .finally(() => {
        if (активен) {
          setИдетЗагрузкаВоздуха(false);
        }
      });

    return () => {
      активен = false;
    };
  }, []);

  useEffect(() => {
    if (экран !== ЭКРАНЫ.КАМЕРА) {
      остановитьПоток();
      return undefined;
    }

    async function включитьКамеру() {
      try {
        const поток = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false
        });

        mediaStreamRef.current = поток;
        if (videoRef.current) {
          videoRef.current.srcObject = поток;
        }
      } catch (error) {
        console.error("Не удалось включить камеру:", error);
      }
    }

    включитьКамеру();
    return () => остановитьПоток();
  }, [экран]);

  useEffect(() => {
    if (!идетТест) return undefined;

    setСнимки([]);
    setТаймер(10);
    setЛогИндекс(0);

    const интервалТаймера = setInterval(() => {
      setТаймер((предыдущее) => {
        if (предыдущее <= 1) {
          setИдетТест(false);
          return 0;
        }
        return предыдущее - 1;
      });
    }, 1000);

    const интервалЛогов = setInterval(() => {
      setЛогИндекс((предыдущее) => (предыдущее + 1) % ТЕХНО_ЛОГИ.length);
    }, 1300);

    const интервалСнимков = setInterval(() => {
      сделатьСнимок();
    }, 2000);

    return () => {
      clearInterval(интервалТаймера);
      clearInterval(интервалЛогов);
      clearInterval(интервалСнимков);
    };
  }, [идетТест]);

  useEffect(() => {
    const базовыеДанные =
      периодГрафика === "7" ? ИСТОРИЯ_CO2_ЗА_НЕДЕЛЮ : ИСТОРИЯ_CO2_ЗА_30_ДНЕЙ;
    setДанныеГрафика(базовыеДанные);
  }, [периодГрафика]);

  useEffect(() => {
    const интервалАнимации = setInterval(() => {
      setДанныеГрафика((текущие) =>
        текущие.map((точка) => {
          const дрейф = Math.floor(Math.random() * 7) - 3;
          const новоеЗначение = Math.max(120, Math.min(260, точка.co2 + дрейф));
          return { ...точка, co2: новоеЗначение };
        })
      );
    }, 2200);

    return () => clearInterval(интервалАнимации);
  }, []);

  function остановитьПоток() {
    const поток = mediaStreamRef.current;
    if (поток) {
      поток.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
  }

  function сделатьСнимок() {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const контекст = canvas.getContext("2d");
    if (!контекст) return;

    контекст.drawImage(video, 0, 0, canvas.width, canvas.height);
    const base64 = canvas.toDataURL("image/jpeg", 0.75);

    setСнимки((предыдущее) => [...предыдущее, base64]);
  }

  const текущийЛог = useMemo(() => {
    if (!идетТест) return "Готов к запуску диагностики";
    return ТЕХНО_ЛОГИ[логИндекс];
  }, [идетТест, логИндекс]);

  const метрикиГрафика = useMemo(() => {
    if (!данныеГрафика.length) {
      return {
        трендТекст: "Нет данных",
        трендСимвол: "•",
        трендКласс: "text-zinc-400",
        уровеньТекст: "Нет данных",
        уровеньКласс: "text-zinc-400"
      };
    }

    const первый = данныеГрафика[0].co2;
    const последний = данныеГрафика[данныеГрафика.length - 1].co2;
    const разница = последний - первый;
    const среднее = Math.round(
      данныеГрафика.reduce((сумма, точка) => сумма + точка.co2, 0) / данныеГрафика.length
    );

    let трендТекст = "Стабильно";
    let трендСимвол = "→";
    let трендКласс = "text-zinc-300";

    if (разница <= -3) {
      трендТекст = "Улучшение";
      трендСимвол = "↓";
      трендКласс = "text-lime-300";
    } else if (разница >= 3) {
      трендТекст = "Ухудшение";
      трендСимвол = "↑";
      трендКласс = "text-red-400";
    }

    let уровеньТекст = "Низкий";
    let уровеньКласс = "text-lime-300";

    if (среднее >= 190) {
      уровеньТекст = "Высокий";
      уровеньКласс = "text-red-400";
    } else if (среднее >= 160) {
      уровеньТекст = "Средний";
      уровеньКласс = "text-amber-300";
    }

    return { трендТекст, трендСимвол, трендКласс, уровеньТекст, уровеньКласс };
  }, [данныеГрафика]);

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col bg-coal px-4 pb-6 pt-4 text-zinc-100">
      <header className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-wide text-neon">GasGlaz.AI</h1>
        <button
          className="rounded-md border border-neon px-3 py-1 text-xs text-neon"
          onClick={() => setЭкран(ЭКРАНЫ.ТАРИФЫ)}
        >
          Тарифы
        </button>
      </header>

      {экран === ЭКРАНЫ.ГЛАВНЫЙ && (
        <>
          <section className="неон-рамка mb-6 rounded-xl bg-black/60 p-4">
            <p className="text-sm text-neon">Качество воздуха в районе</p>
            {идетЗагрузкаВоздуха ? (
              <p className="mt-2 text-sm text-zinc-400">Загрузка данных...</p>
            ) : (
              <>
                <p className="mt-2 text-lg font-semibold">{воздух?.индекс}</p>
                <p className="text-sm text-zinc-300">
                  PM2.5: {воздух?.pm25} | Температура: {воздух?.температура}°C
                </p>
                <p className="mt-1 text-xs text-zinc-500">{воздух?.источник}</p>
              </>
            )}
          </section>

          <main className="flex flex-1 items-center justify-center">
            <button
              className="неон-рамка w-full rounded-2xl bg-zinc-900 px-6 py-12 text-center text-2xl font-bold uppercase text-neon active:scale-[0.99]"
              onClick={() => setЭкран(ЭКРАНЫ.КАМЕРА)}
            >
              [ ТЕСТ ВЫХЛОПА (3000 RPM) ]
            </button>
          </main>

          <section className="неон-рамка mt-4 rounded-xl bg-black/60 p-4">
            <p className="text-sm text-neon">Сервис контролирует экологичность выхлопа автомобиля.</p>
            <p className="mt-2 text-sm text-zinc-300">
              Нажмите кнопку теста, удерживайте 3000 RPM в течение 10 секунд и получите
              интеллектуальную оценку с рекомендациями.
            </p>
          </section>

          <section className="неон-рамка mt-4 rounded-xl bg-black/70 p-4">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-neon">
                История выбросов CO2 за {периодГрафика === "7" ? "неделю" : "30 дней"}
              </h3>
              <span className="text-xs text-zinc-400">г/км</span>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2 rounded-lg border border-zinc-800 bg-black/60 p-2 text-xs">
              <div>
                <p className="text-zinc-400">Тренд</p>
                <p className={`mt-1 font-semibold ${метрикиГрафика.трендКласс}`}>
                  {метрикиГрафика.трендСимвол} {метрикиГрафика.трендТекст}
                </p>
              </div>
              <div>
                <p className="text-zinc-400">Уровень выбросов</p>
                <p className={`mt-1 font-semibold ${метрикиГрафика.уровеньКласс}`}>
                  {метрикиГрафика.уровеньТекст}
                </p>
              </div>
            </div>
            <div className="mb-3 grid grid-cols-2 gap-2">
              <button
                className={`rounded-md border px-3 py-2 text-sm ${
                  периодГрафика === "7"
                    ? "border-neon bg-neon/20 text-neon shadow-neon"
                    : "border-zinc-700 text-zinc-300"
                }`}
                onClick={() => setПериодГрафика("7")}
              >
                7 дней
              </button>
              <button
                className={`rounded-md border px-3 py-2 text-sm ${
                  периодГрафика === "30"
                    ? "border-neon bg-neon/20 text-neon shadow-neon"
                    : "border-zinc-700 text-zinc-300"
                }`}
                onClick={() => setПериодГрафика("30")}
              >
                30 дней
              </button>
            </div>
            <div className="h-44 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={данныеГрафика}>
                  <defs>
                    <linearGradient id="цветCO2" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#00ff66" stopOpacity={0.75} />
                      <stop offset="95%" stopColor="#00ff66" stopOpacity={0.05} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#1c1c1c" strokeDasharray="4 4" />
                  <XAxis dataKey="день" stroke="#6b7280" tickLine={false} axisLine={false} />
                  <YAxis stroke="#6b7280" tickLine={false} axisLine={false} width={34} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "#020202",
                      border: "1px solid #00ff66",
                      borderRadius: "10px",
                      color: "#00ff66"
                    }}
                    formatter={(value) => [`${value} г/км`, "CO2"]}
                    labelFormatter={(label) => `День: ${label}`}
                  />
                  <Area
                    type="monotone"
                    dataKey="co2"
                    stroke="#00ff66"
                    strokeWidth={3}
                    fill="url(#цветCO2)"
                    isAnimationActive
                    animationDuration={900}
                    animationEasing="ease-in-out"
                    activeDot={{ r: 6, stroke: "#00ff66", fill: "#00ff66" }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </section>

          <section className="mt-4 rounded-xl border border-neon bg-black/75 p-4 shadow-neon">
            <h3 className="text-base font-semibold text-neon">Как это работает?</h3>
            <div className="mt-3 grid gap-2">
              {ШАГИ_КАК_ЭТО_РАБОТАЕТ.map((шаг, index) => (
                <div
                  key={шаг.текст}
                  className="rounded-lg border border-neon/80 bg-zinc-950/80 p-3 shadow-[0_0_10px_rgba(0,255,102,0.2)]"
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-neon bg-black text-sm font-bold text-neon shadow-neon">
                      {шаг.иконка}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-neon">Шаг {index + 1}</p>
                      <p className="mt-1 text-sm leading-relaxed text-zinc-200">{шаг.текст}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <footer className="mt-6 grid grid-cols-2 gap-3">
            <button
              className="rounded-xl border border-neon py-4 text-lg font-semibold text-neon"
              onClick={() => setЭкран(ЭКРАНЫ.КАРТА)}
            >
              Карта АЗС
            </button>
            <button
              className="rounded-xl border border-neon py-4 text-lg font-semibold text-neon"
              onClick={() => setЭкран(ЭКРАНЫ.ИСТОРИЯ)}
            >
              История чеков
            </button>
          </footer>
        </>
      )}

      {экран === ЭКРАНЫ.ТАРИФЫ && (
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neon">Тарифы</h2>
          <div className="space-y-3">
            <КарточкаТарифа название="Разовый" цена={ЦЕНЫ_ТАРИФОВ.razoviy} />
            <КарточкаТарифа название="Пакет 5" цена={ЦЕНЫ_ТАРИФОВ.paket5} />
            <КарточкаТарифа название="Годовой" цена={ЦЕНЫ_ТАРИФОВ.godovoy} />
          </div>
          <p className="text-sm text-zinc-300">Оплата в BYN по курсу вашего банка</p>
          <button
            className="mt-2 w-full rounded-lg border border-neon py-3 text-neon"
            onClick={() => setЭкран(ЭКРАНЫ.ГЛАВНЫЙ)}
          >
            Назад
          </button>
        </section>
      )}

      {экран === ЭКРАНЫ.КАМЕРА && (
        <section className="flex h-full flex-1 flex-col">
          <h2 className="mb-3 text-lg font-semibold text-neon">Диагностика выхлопа</h2>
          <div className="relative mb-3 overflow-hidden rounded-xl border border-neon bg-black">
            <video ref={videoRef} autoPlay playsInline muted className="h-72 w-full object-cover opacity-80" />
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <div className="h-40 w-56 border-2 border-neon shadow-neon" />
            </div>
          </div>

          <canvas ref={canvasRef} className="hidden" />

          <div className="неон-рамка mb-3 rounded-lg bg-black/70 p-3">
            <p className="text-sm text-zinc-300">Осталось: {таймер} сек</p>
            <p className="mt-1 text-sm text-neon">{текущийЛог}</p>
            <p className="mt-1 text-xs text-zinc-400">Снимков: {снимки.length}</p>
          </div>

          <div className="mt-auto grid grid-cols-2 gap-3">
            <button
              className="rounded-lg bg-neon py-3 font-semibold text-black disabled:opacity-40"
              disabled={идетТест}
              onClick={() => setИдетТест(true)}
            >
              Старт 10 сек
            </button>
            <button
              className="rounded-lg border border-neon py-3 text-neon"
              onClick={() => setЭкран(ЭКРАНЫ.ГЛАВНЫЙ)}
            >
              На главный
            </button>
          </div>
        </section>
      )}

      {(экран === ЭКРАНЫ.КАРТА || экран === ЭКРАНЫ.ИСТОРИЯ) && (
        <section className="mt-6 rounded-xl border border-neon p-5">
          <p className="text-lg text-neon">
            {экран === ЭКРАНЫ.КАРТА ? "Карта АЗС" : "История чеков"}
          </p>
          <p className="mt-2 text-sm text-zinc-300">Раздел в разработке</p>
          <button
            className="mt-4 rounded-lg border border-neon px-4 py-2 text-neon"
            onClick={() => setЭкран(ЭКРАНЫ.ГЛАВНЫЙ)}
          >
            Вернуться
          </button>
        </section>
      )}
    </div>
  );
}

function КарточкаТарифа({ название, цена }) {
  return (
    <div className="rounded-xl border border-neon bg-black/50 p-4">
      <p className="text-lg font-semibold text-neon">{название}</p>
      <p className="mt-1 text-base text-zinc-100">
        {цена.byn} BYN / {цена.rub} RUB
      </p>
    </div>
  );
}

export default App;
