const URL_SUPABASE_EDGE = import.meta.env.VITE_SUPABASE_EDGE_URL;

export async function отправитьСнимкиНаАнализ(snapshotsBase64) {
  if (!URL_SUPABASE_EDGE) {
    throw new Error("Не задан URL Supabase Edge Function");
  }

  const ответ = await fetch(`${URL_SUPABASE_EDGE}/analyze-exhaust`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ snapshots: snapshotsBase64 })
  });

  if (!ответ.ok) {
    throw new Error("Ошибка анализа выхлопа на сервере");
  }

  return ответ.json();
}
