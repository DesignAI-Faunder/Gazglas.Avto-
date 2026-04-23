export async function получитьКачествоВоздуха() {
  await new Promise((resolve) => setTimeout(resolve, 700));

  return {
    индекс: "Нормальный",
    pm25: 12,
    температура: 18,
    источник: "Имитация OpenWeather API"
  };
}
