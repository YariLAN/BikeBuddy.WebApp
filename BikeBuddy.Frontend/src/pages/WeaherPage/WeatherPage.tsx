import { CloudSun, Wind, Droplets, Thermometer, Eye, ArrowDown, Sun, Cloud, CloudRain } from "lucide-react";

interface WeatherDay {
  day: string;
  date: string;
  icon: React.ElementType;
  temp: number;
  tempMin: number;
  condition: string;
  wind: number;
  humidity: number;
  precipitation: number;
}

const forecast: WeatherDay[] = [
  { day: "Сегодня", date: "8 мар", icon: Sun, temp: 5, tempMin: -1, condition: "Ясно", wind: 12, humidity: 55, precipitation: 0 },
  { day: "Вторник", date: "9 мар", icon: Cloud, temp: 3, tempMin: -2, condition: "Облачно", wind: 15, humidity: 65, precipitation: 10 },
  { day: "Среда", date: "10 мар", icon: CloudSun, temp: 6, tempMin: 0, condition: "Переменная облачность", wind: 10, humidity: 50, precipitation: 5 },
  { day: "Четверг", date: "11 мар", icon: CloudRain, temp: 2, tempMin: -1, condition: "Дождь", wind: 20, humidity: 85, precipitation: 80 },
  { day: "Пятница", date: "12 мар", icon: Sun, temp: 7, tempMin: 1, condition: "Ясно", wind: 8, humidity: 45, precipitation: 0 },
  { day: "Суббота", date: "13 мар", icon: CloudSun, temp: 8, tempMin: 2, condition: "Малооблачно", wind: 11, humidity: 52, precipitation: 5 },
  { day: "Воскресенье", date: "14 мар", icon: Sun, temp: 9, tempMin: 3, condition: "Ясно", wind: 7, humidity: 40, precipitation: 0 },
];

const upcomingRidesWeather = [
  {
    ride: "Вечерняя прогулка по набережной",
    date: "12 марта, 19:00",
    temp: 5,
    wind: 8,
    condition: "Ясно",
    icon: Sun,
    recommendation: "Отличная погода для заезда!",
    color: "text-primary",
  },
  {
    ride: "Выходной марафон: Петергоф",
    date: "15 марта, 10:00",
    temp: 8,
    wind: 11,
    condition: "Малооблачно",
    icon: CloudSun,
    recommendation: "Хорошие условия, возьмите ветровку.",
    color: "text-info",
  },
  {
    ride: "Ночной заезд по центру",
    date: "18 марта, 22:00",
    temp: 2,
    wind: 20,
    condition: "Дождь",
    icon: CloudRain,
    recommendation: "Возможен дождь, рекомендуется дождевик.",
    color: "text-destructive",
  },
];

function getRideScore(temp: number, wind: number, precipitation: number): { score: number; label: string } {
  let score = 100;
  if (temp < 0) score -= 30;
  else if (temp < 5) score -= 10;
  if (wind > 15) score -= 25;
  else if (wind > 10) score -= 10;
  score -= precipitation * 0.5;
  score = Math.max(0, Math.min(100, Math.round(score)));
  const label = score >= 80 ? "Отлично" : score >= 60 ? "Хорошо" : score >= 40 ? "Приемлемо" : "Неблагоприятно";
  return { score, label };
}

const WeatherPage : React.FC = () => {
  const today = forecast[0];
  const { score: todayScore } = getRideScore(today.temp, today.wind, today.precipitation);

  return (
    
      <div className="p-6 max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="font-display text-2xl font-bold flex items-center gap-2">
            <CloudSun className="h-7 w-7 text-info" />
            Погода для заездов
          </h1>
          <p className="text-muted-foreground mt-1">Санкт-Петербург и Ленинградская область</p>
        </div>

        {/* Current weather */}
        <div className="rounded-2xl bg-gradient-hero p-8 text-primary-foreground relative overflow-hidden">
          <div className="absolute right-8 top-8 opacity-10">
            <today.icon className="h-40 w-40" />
          </div>
          <div className="relative z-10">
            <p className="text-sm text-primary-foreground/60 mb-1">Сейчас</p>
            <div className="flex items-end gap-4">
              <p className="font-display text-7xl font-bold">{today.temp}°</p>
              <div className="mb-2">
                <p className="text-lg font-medium">{today.condition}</p>
                <p className="text-sm text-primary-foreground/60">Ощущается как {today.temp - 2}°</p>
              </div>
            </div>
            <div className="flex gap-6 mt-6">
              <div className="flex items-center gap-2 text-sm">
                <Wind className="h-4 w-4 text-primary-foreground/60" />
                <span>{today.wind} м/с</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Droplets className="h-4 w-4 text-primary-foreground/60" />
                <span>{today.humidity}%</span>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Eye className="h-4 w-4 text-primary-foreground/60" />
                <span>Индекс заезда: {todayScore}/100</span>
              </div>
            </div>
          </div>
        </div>

        {/* 7-day forecast */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Прогноз на 7 дней</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {forecast.map((day, i) => {
              const { score, label } = getRideScore(day.temp, day.wind, day.precipitation);
              return (
                <div
                  key={day.date}
                  className={`rounded-xl bg-card border shadow-soft p-4 text-center transition-all hover:shadow-medium ${
                    i === 0 ? "ring-2 ring-primary" : ""
                  }`}
                >
                  <p className="text-xs font-medium text-muted-foreground">{day.day}</p>
                  <p className="text-[10px] text-muted-foreground">{day.date}</p>
                  <day.icon className="h-8 w-8 mx-auto my-2 text-info" />
                  <p className="font-display font-bold text-lg">{day.temp}°</p>
                  <p className="text-xs text-muted-foreground">{day.tempMin}°</p>
                  <div className="mt-2">
                    <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{
                          width: `${score}%`,
                          background: score >= 80
                            ? "hsl(160, 84%, 39%)"
                            : score >= 60
                            ? "hsl(36, 100%, 50%)"
                            : "hsl(0, 72%, 51%)",
                        }}
                      />
                    </div>
                    <p className="text-[10px] text-muted-foreground mt-1">{label}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Weather for upcoming rides */}
        <div>
          <h2 className="font-display text-lg font-bold mb-4">Погода для ваших заездов</h2>
          <div className="space-y-3">
            {upcomingRidesWeather.map((r) => (
              <div
                key={r.ride}
                className="rounded-xl bg-card border shadow-soft p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className="h-12 w-12 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <r.icon className="h-6 w-6 text-info" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-medium text-sm truncate">{r.ride}</p>
                    <p className="text-xs text-muted-foreground">{r.date}</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="flex items-center gap-1">
                    <Thermometer className="h-4 w-4 text-muted-foreground" />
                    <span className="font-display font-bold">{r.temp}°</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Wind className="h-4 w-4 text-muted-foreground" />
                    <span>{r.wind} м/с</span>
                  </div>
                </div>
                <p className={`text-xs font-medium ${r.color}`}>{r.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    
  );
};

export default WeatherPage;