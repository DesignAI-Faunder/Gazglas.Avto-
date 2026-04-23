// Edge Function для Supabase.
// ВАЖНО: OpenAI API Key хранится только в серверных переменных окружения.

interface ТелоЗапроса {
  snapshots: string[];
}

Deno.serve(async (request) => {
  if (request.method !== "POST") {
    return new Response("Метод не поддерживается", { status: 405 });
  }

  try {
    const { snapshots } = (await request.json()) as ТелоЗапроса;

    if (!Array.isArray(snapshots) || snapshots.length === 0) {
      return new Response(JSON.stringify({ error: "Нет снимков для анализа" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    const openAiKey = Deno.env.get("OPENAI_API_KEY");
    if (!openAiKey) {
      return new Response(JSON.stringify({ error: "Не настроен OPENAI_API_KEY" }), {
        status: 500,
        headers: { "Content-Type": "application/json" }
      });
    }

    // Заглушка: здесь будет обращение к OpenAI Vision + RAG по PDF-справочникам.
    return new Response(
      JSON.stringify({
        status: "ok",
        сообщение: "Анализ запущен на сервере",
        принятоСнимков: snapshots.length
      }),
      {
        headers: { "Content-Type": "application/json" }
      }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: "Ошибка обработки запроса", детали: String(error) }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" }
      }
    );
  }
});
