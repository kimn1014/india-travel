"use client";

import { useState } from "react";

const cities = [
  { name: "Delhi", nameKo: "델리", lat: 28.6139, lng: 77.209 },
  { name: "Mumbai", nameKo: "뭄바이", lat: 19.076, lng: 72.8777 },
  { name: "Agra", nameKo: "아그라", lat: 27.1767, lng: 78.0081 },
  { name: "Jaipur", nameKo: "자이푸르", lat: 26.9124, lng: 75.7873 },
  { name: "Varanasi", nameKo: "바라나시", lat: 25.3176, lng: 82.9739 },
  { name: "Goa", nameKo: "고아", lat: 15.2993, lng: 74.124 },
  { name: "Kolkata", nameKo: "콜카타", lat: 22.5726, lng: 88.3639 },
  { name: "Chennai", nameKo: "첸나이", lat: 13.0827, lng: 80.2707 },
];

interface WeatherData {
  temperature: number;
  feelsLike: number;
  humidity: number;
  description: string;
  windSpeed: number;
}

export default function WeatherPage() {
  const [selectedCity, setSelectedCity] = useState(cities[0]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchWeather = async (city: typeof cities[0]) => {
    setLoading(true);
    setError("");
    setSelectedCity(city);

    try {
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${city.lat}&longitude=${city.lng}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m&timezone=Asia/Kolkata`
      );

      if (!response.ok) throw new Error("날씨 정보를 불러올 수 없습니다");

      const data = await response.json();
      const current = data.current;

      const weatherCodes: Record<number, string> = {
        0: "맑음", 1: "대체로 맑음", 2: "부분적 흐림", 3: "흐림",
        45: "안개", 48: "짙은 안개",
        51: "가벼운 이슬비", 53: "이슬비", 55: "강한 이슬비",
        61: "가벼운 비", 63: "비", 65: "강한 비",
        71: "가벼운 눈", 73: "눈", 75: "강한 눈",
        80: "소나기", 81: "강한 소나기", 82: "매우 강한 소나기",
        95: "뇌우",
      };

      setWeather({
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        description: weatherCodes[current.weather_code] || "알 수 없음",
        windSpeed: current.wind_speed_10m,
      });
    } catch {
      setError("날씨 정보를 불러오는 데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-16">
      <div className="mb-8 sm:mb-10">
        <h1 className="text-2xl sm:text-3xl font-bold mb-1">인도 날씨</h1>
        <p className="text-sm text-neutral-500">주요 도시의 현재 날씨를 확인하세요</p>
      </div>

      {/* City Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => fetchWeather(city)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedCity.name === city.name
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 border-transparent"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-400 dark:hover:border-neutral-600"
            }`}
          >
            <p className="font-semibold">{city.nameKo}</p>
            <p className={`text-sm ${selectedCity.name === city.name ? "opacity-60" : "text-neutral-500"}`}>
              {city.name}
            </p>
          </button>
        ))}
      </div>

      {/* Weather Display */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6 sm:p-8">
          <div className="mb-8">
            <h2 className="text-2xl font-bold">{selectedCity.nameKo}</h2>
            <p className="text-neutral-500">{selectedCity.name}, India</p>
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-10 h-10 border-2 border-neutral-900 dark:border-white border-t-transparent dark:border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-neutral-500">날씨 정보 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <p className="text-neutral-500 mb-4">{error}</p>
              <button
                onClick={() => fetchWeather(selectedCity)}
                className="px-4 py-2 btn-primary rounded-lg text-sm"
              >
                다시 시도
              </button>
            </div>
          ) : weather ? (
            <>
              <div className="text-center mb-10">
                <p className="text-7xl font-bold tracking-tighter number-display">{Math.round(weather.temperature)}°</p>
                <p className="text-xl text-neutral-500 mt-2">{weather.description}</p>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">체감</p>
                  <p className="font-semibold number-display">{Math.round(weather.feelsLike)}°C</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">습도</p>
                  <p className="font-semibold number-display">{weather.humidity}%</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <p className="text-xs text-neutral-500 mb-1">풍속</p>
                  <p className="font-semibold number-display">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <p className="text-neutral-500 mb-4">도시를 선택하면 날씨 정보가 표시됩니다</p>
              <button
                onClick={() => fetchWeather(selectedCity)}
                className="px-5 py-2.5 btn-primary rounded-full font-medium text-sm"
              >
                날씨 확인하기
              </button>
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
                2월은 인도 여행의 최적기입니다. 북부 지역은 15-25°C로 쾌적하며,
                남부는 25-30°C로 따뜻합니다.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-2 text-sm">복장</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                낮에는 가벼운 옷, 아침/저녁에는 재킷이나 긴팔이 필요합니다.
                사원 방문시 긴 바지와 어깨를 덮는 옷 필수.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-2 text-sm">자외선</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                자외선이 강하므로 선크림, 선글라스, 모자를 챙기세요.
                특히 오후 12-4시 야외 활동 주의.
              </p>
            </div>

            <div className="p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-200 dark:border-neutral-700">
              <h3 className="font-medium mb-2 text-sm">건강</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                수분 섭취를 충분히 하고, 생수만 마시세요.
                손 소독제와 기본 상비약 준비 권장.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Time Difference Info */}
      <div className="mt-8 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-6">
        <h2 className="text-lg font-semibold mb-6">시차 정보</h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-neutral-500 mb-2 uppercase tracking-wide">한국 (KST) → 인도 (IST)</p>
            <p className="text-4xl font-bold tracking-tighter number-display">-3시간 30분</p>
          </div>
          <div className="space-y-1.5 text-sm text-neutral-500">
            <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">예시</p>
            <p>한국 오전 9시 = 인도 오전 5시 30분</p>
            <p>한국 오후 6시 = 인도 오후 2시 30분</p>
            <p>한국 자정 = 인도 오후 8시 30분</p>
          </div>
        </div>
      </div>
    </div>
  );
}
