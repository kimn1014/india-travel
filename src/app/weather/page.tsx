"use client";

import { useState, useEffect, useCallback } from "react";
import { cityColors } from "@/lib/tripData";

const cities = [
  { name: "Delhi", nameKo: "델리", lat: 28.6139, lng: 77.209, days: "D1, D10", cityId: "delhi" },
  { name: "Jaisalmer", nameKo: "자이살메르", lat: 26.9157, lng: 70.9083, days: "D2-D3", cityId: "jaisalmer" },
  { name: "Udaipur", nameKo: "우다이푸르", lat: 24.5854, lng: 73.7125, days: "D4-D5", cityId: "udaipur" },
  { name: "Jaipur", nameKo: "자이푸르", lat: 26.9124, lng: 75.7873, days: "D6-D7", cityId: "jaipur" },
  { name: "Varanasi", nameKo: "바라나시", lat: 25.3176, lng: 82.9739, days: "D8-D9", cityId: "varanasi" },
];

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  windSpeed: number;
  weatherCode: number;
}

interface DailyForecast {
  date: string;
  maxTemp: number;
  minTemp: number;
  weatherCode: number;
}

const weatherCodes: Record<number, string> = {
  0: "맑음", 1: "대체로 맑음", 2: "부분적 흐림", 3: "흐림",
  45: "안개", 48: "짙은 안개",
  51: "가벼운 이슬비", 53: "이슬비", 55: "강한 이슬비",
  61: "가벼운 비", 63: "비", 65: "강한 비",
  71: "가벼운 눈", 73: "눈", 75: "강한 눈",
  80: "소나기", 81: "강한 소나기", 82: "매우 강한 소나기",
  95: "뇌우",
};

const getWeatherEmoji = (code: number): string => {
  if (code === 0) return "☀️";
  if (code <= 2) return "🌤️";
  if (code === 3) return "☁️";
  if (code <= 48) return "🌫️";
  if (code <= 55) return "🌦️";
  if (code <= 65) return "🌧️";
  if (code <= 75) return "❄️";
  if (code <= 82) return "🌧️";
  return "⛈️";
};

const getTempGradient = (temp: number): string => {
  if (temp > 30) return "bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-950/30 dark:to-red-950/30";
  if (temp >= 20) return "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30";
  if (temp >= 10) return "bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30";
  return "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-950/40 dark:to-indigo-950/40";
};

const formatTime = (date: Date, timeZone: string): string => {
  return date.toLocaleTimeString("ko-KR", {
    timeZone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  });
};

const formatDate = (date: Date, timeZone: string): string => {
  return date.toLocaleDateString("ko-KR", {
    timeZone,
    month: "long",
    day: "numeric",
    weekday: "short",
  });
};

const formatForecastDate = (dateStr: string): string => {
  const date = new Date(dateStr + "T00:00:00");
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];
  return `${month}/${day} (${weekday})`;
};

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [weatherCache, setWeatherCache] = useState<Record<string, WeatherData>>({});
  const [allCityWeather, setAllCityWeather] = useState<Record<string, { temp: number; code: number }>>({});
  const [allCityLoading, setAllCityLoading] = useState(true);
  const [dailyForecast, setDailyForecast] = useState<DailyForecast[]>([]);
  const [forecastLoading, setForecastLoading] = useState(false);
  const [now, setNow] = useState(new Date());

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchWeather = useCallback(async (city: typeof cities[0], background = false) => {
    if (!background) {
      // Show cached data immediately if available
      if (weatherCache[city.name]) {
        setWeather(weatherCache[city.name]);
      }
      setLoading(!weatherCache[city.name]);
      setError("");
      setSelectedCity(city);
    }

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Kolkata`
      );

      if (!response.ok) throw new Error("날씨 정보를 불러올 수 없습니다");

      const data = await response.json();
      const current = data.current;

      const weatherData: WeatherData = {
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        description: weatherCodes[current.weather_code] || "알 수 없음",
        windSpeed: current.wind_speed_10m,
        weatherCode: current.weather_code,
      };

      setWeatherCache((prev) => ({ ...prev, [city.name]: weatherData }));

      if (!background) {
        setWeather(weatherData);
      }
    } catch {
      if (!background) {
        setError("날씨 정보를 불러오는 데 실패했습니다");
      }
    } finally {
      if (!background) {
        setLoading(false);
      }
    }
  }, [weatherCache]);

  const fetchDailyForecast = useCallback(async (city: typeof cities[0]) => {
    setForecastLoading(true);
    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=Asia/Kolkata&start_date=2026-02-13&end_date=2026-02-22`
      );
      if (!response.ok) throw new Error("예보를 불러올 수 없습니다");
      const data = await response.json();
      const forecasts: DailyForecast[] = data.daily.time.map((date: string, i: number) => ({
        date,
        maxTemp: data.daily.temperature_2m_max[i],
        minTemp: data.daily.temperature_2m_min[i],
        weatherCode: data.daily.weather_code[i],
      }));
      setDailyForecast(forecasts);
    } catch {
      setDailyForecast([]);
    } finally {
      setForecastLoading(false);
    }
  }, []);

  // Fetch all cities overview on mount (with localStorage cache)
  useEffect(() => {
    // Load cached data first for instant display
    const cached = localStorage.getItem("india-weather-cache");
    if (cached) {
      try {
        const { data, timestamp } = JSON.parse(cached);
        if (Date.now() - timestamp < 60 * 60 * 1000) {
          setAllCityWeather(data);
          setAllCityLoading(false);
        }
      } catch { /* ignore */ }
    }

    const fetchAllCities = async () => {
      try {
        const results = await Promise.allSettled(
          cities.map(async (city) => {
            const response = await fetch(
              `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,weather_code&timezone=Asia/Kolkata`
            );
            if (!response.ok) throw new Error();
            const data = await response.json();
            return {
              name: city.name,
              temp: data.current.temperature_2m,
              code: data.current.weather_code,
            };
          })
        );

        const weatherMap: Record<string, { temp: number; code: number }> = {};
        results.forEach((result) => {
          if (result.status === "fulfilled") {
            weatherMap[result.value.name] = {
              temp: result.value.temp,
              code: result.value.code,
            };
          }
        });
        setAllCityWeather(weatherMap);
        // Save to localStorage
        localStorage.setItem("india-weather-cache", JSON.stringify({
          data: weatherMap,
          timestamp: Date.now(),
        }));
      } finally {
        setAllCityLoading(false);
      }
    };

    fetchAllCities();
  }, []);

  // Auto-fetch Delhi on mount
  useEffect(() => {
    fetchWeather(cities[0]);
    fetchDailyForecast(cities[0]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCitySelect = (city: typeof cities[0]) => {
    setSelectedCity(city);
    fetchWeather(city);
    fetchDailyForecast(city);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">인도 날씨</h1>
        <p className="text-sm text-neutral-500">여행 도시의 실시간 날씨와 여행 기간 예보를 확인하세요</p>
      </div>

      {/* All Cities Overview */}
      <div className="mb-8">
        <h2 className="text-sm font-medium text-neutral-500 mb-3 uppercase tracking-wide">전체 도시 현재 날씨</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {cities.map((city) => {
            const colors = cityColors[city.cityId];
            const cityWeather = allCityWeather[city.name];
            return (
              <button
                key={city.name}
                onClick={() => handleCitySelect(city)}
                className={`relative overflow-hidden rounded-xl border transition-all duration-300 text-left ${
                  selectedCity.name === city.name ? "scale-[1.02] shadow-md" : "hover:scale-[1.01]"
                }`}
                style={
                  selectedCity.name === city.name
                    ? { backgroundColor: colors?.hex, color: "white", borderColor: "transparent" }
                    : undefined
                }
              >
                <div
                  className={`p-4 ${
                    selectedCity.name === city.name
                      ? ""
                      : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold">{city.nameKo}</p>
                      <p
                        className={`text-xs ${
                          selectedCity.name === city.name ? "opacity-70" : "text-neutral-500"
                        }`}
                      >
                        {city.name}
                      </p>
                      <p
                        className={`text-[10px] mt-1 ${
                          selectedCity.name === city.name ? "opacity-50" : "text-neutral-400"
                        }`}
                      >
                        {city.days}
                      </p>
                    </div>
                    <div className="text-right">
                      {allCityLoading ? (
                        <div className="skeleton w-10 h-6 rounded" />
                      ) : cityWeather ? (
                        <>
                          <span className="text-lg">{getWeatherEmoji(cityWeather.code)}</span>
                          <p
                            className={`text-sm font-bold number-display ${
                              selectedCity.name === city.name ? "" : "text-neutral-700 dark:text-neutral-300"
                            }`}
                          >
                            {Math.round(cityWeather.temp)}°
                          </p>
                        </>
                      ) : (
                        <span className={`text-xs ${selectedCity.name === city.name ? "opacity-50" : "text-neutral-400"}`}>--</span>
                      )}
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Weather Display + Tips */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Current Weather Card */}
        <div
          className={`border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 transition-all duration-500 ${
            weather ? getTempGradient(weather.temperature) : "bg-white dark:bg-neutral-900"
          }`}
        >
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">{selectedCity.nameKo}</h2>
              <p className="text-neutral-500">{selectedCity.name}, India</p>
            </div>
            {weather && !loading && (
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: cityColors[selectedCity.cityId]?.hex }}
              />
            )}
          </div>

          {loading ? (
            <div className="py-8">
              <div className="flex items-center justify-center gap-6 mb-10">
                <div className="skeleton w-16 h-16 rounded-2xl" />
                <div className="skeleton w-32 h-16 rounded-2xl" />
              </div>
              <div className="skeleton w-40 h-5 mx-auto rounded mb-10" />
              <div className="grid grid-cols-3 gap-3">
                <div className="skeleton h-20 rounded-xl" />
                <div className="skeleton h-20 rounded-xl" />
                <div className="skeleton h-20 rounded-xl" />
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 mb-4">{error}</p>
              <button
                onClick={() => handleCitySelect(selectedCity)}
                className="px-4 py-2 btn-primary rounded-lg text-sm"
              >
                다시 시도
              </button>
            </div>
          ) : weather ? (
            <>
              <div className="text-center mb-10">
                <div className="flex items-center justify-center gap-4">
                  <span className="text-6xl">{getWeatherEmoji(weather.weatherCode)}</span>
                  <p className="text-7xl font-bold tracking-tighter number-display">
                    {Math.round(weather.temperature)}°
                  </p>
                </div>
                <p className="text-xl text-neutral-500 mt-3">{weather.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-white/60 dark:bg-neutral-800/50 rounded-xl backdrop-blur-sm">
                  <p className="text-xs text-neutral-500 mb-1">체감</p>
                  <p className="font-semibold number-display">{Math.round(weather.feelsLike)}°C</p>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-neutral-800/50 rounded-xl backdrop-blur-sm">
                  <p className="text-xs text-neutral-500 mb-1">습도</p>
                  <p className="font-semibold number-display">{weather.humidity}%</p>
                </div>
                <div className="text-center p-4 bg-white/60 dark:bg-neutral-800/50 rounded-xl backdrop-blur-sm">
                  <p className="text-xs text-neutral-500 mb-1">풍속</p>
                  <p className="font-semibold number-display">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-500 mb-4">날씨 정보를 불러오는 중...</p>
            </div>
          )}
        </div>

        {/* Travel Tips */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8">
          <h2 className="text-lg font-semibold mb-6">2월 인도 여행 팁</h2>

          <div className="space-y-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-2 text-sm">기후</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                2월은 인도 여행의 최적기입니다. 라자스탄(자이살메르·우다이푸르·자이푸르)은
                낮 20-28°C, 밤 8-15°C. 바라나시는 15-25°C로 쾌적합니다.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-2 text-sm">복장</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                낮에는 가벼운 옷, 아침/저녁에는 재킷이나 긴팔이 필요합니다.
                사원 방문시 긴 바지와 어깨를 덮는 옷 필수. 사막 투어시 스카프 권장.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-2 text-sm">자외선</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                자외선이 강하므로 선크림, 선글라스, 모자를 챙기세요.
                특히 자이살메르 사막 지역은 직사광선 주의.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-2 text-sm">건강</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                수분 섭취를 충분히 하고, 생수만 마시세요.
                손 소독제와 기본 상비약 준비 권장. 야간 버스 탑승 시 따뜻한 옷 필수.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Travel Period Daily Forecast */}
      <div className="mt-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-semibold">여행 기간 예보</h2>
            <p className="text-sm text-neutral-500 mt-0.5">
              {selectedCity.nameKo} · 2월 13일 - 22일
            </p>
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-medium text-white"
            style={{ backgroundColor: cityColors[selectedCity.cityId]?.hex }}
          >
            {selectedCity.days}
          </div>
        </div>

        {forecastLoading ? (
          <div className="flex gap-3 overflow-x-auto pb-2">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="skeleton min-w-[100px] h-28 rounded-xl flex-shrink-0" />
            ))}
          </div>
        ) : dailyForecast.length > 0 ? (
          <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1">
            {dailyForecast.map((day, dayIdx) => (
              <div
                key={day.date}
                className={`min-w-[100px] flex-shrink-0 rounded-xl p-3 text-center border border-neutral-200 dark:border-neutral-700 transition-all duration-300 hover:-translate-y-1 hover:shadow-md ${getTempGradient(
                  day.maxTemp
                )}`}
                style={{ animationDelay: `${dayIdx * 50}ms` }}
              >
                <p className="text-xs text-neutral-500 mb-2 font-medium">{formatForecastDate(day.date)}</p>
                <span className="text-2xl block mb-1">{getWeatherEmoji(day.weatherCode)}</span>
                <p className="text-sm font-bold number-display">
                  <span className="text-red-500 dark:text-red-400">{Math.round(day.maxTemp)}°</span>
                  <span className="text-neutral-400 mx-0.5">/</span>
                  <span className="text-blue-500 dark:text-blue-400">{Math.round(day.minTemp)}°</span>
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-500 text-center py-8">예보 데이터를 불러올 수 없습니다</p>
        )}
      </div>

      {/* Time Difference with Live Clocks */}
      <div className="mt-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-6">시차 정보</h2>
        <div className="grid md:grid-cols-2 gap-8">
          {/* Live Clocks */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl text-center">
              <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide font-medium">한국 (KST)</p>
              <p className="text-sm text-neutral-500 mb-2">{formatDate(now, "Asia/Seoul")}</p>
              <p className="text-3xl font-bold tracking-tighter number-display">
                {formatTime(now, "Asia/Seoul")}
              </p>
            </div>
            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl text-center">
              <p className="text-xs text-neutral-500 mb-1 uppercase tracking-wide font-medium">인도 (IST)</p>
              <p className="text-sm text-neutral-500 mb-2">{formatDate(now, "Asia/Kolkata")}</p>
              <p className="text-3xl font-bold tracking-tighter number-display">
                {formatTime(now, "Asia/Kolkata")}
              </p>
            </div>
          </div>

          {/* Time Difference Info */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-4xl font-bold tracking-tighter number-display">-3시간 30분</p>
            </div>
            <div className="space-y-1.5 text-sm text-neutral-500">
              <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">시차 예시</p>
              <p>한국 오전 9시 = 인도 오전 5시 30분</p>
              <p>한국 오후 6시 = 인도 오후 2시 30분</p>
              <p>한국 자정 = 인도 오후 8시 30분</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
