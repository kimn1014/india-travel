"use client";

import { useState } from "react";
import {
  Sun, CloudSun, Cloud, CloudFog, CloudRain, CloudSnow, CloudLightning,
  HelpCircle, Thermometer, Droplets, Wind, Globe, ClipboardList,
  Shirt, Clock, RefreshCw
} from "lucide-react";

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
  iconType: string;
  windSpeed: number;
}

function WeatherIcon({ type, size = 48 }: { type: string; size?: number }) {
  const iconProps = { size, strokeWidth: 1.5 };
  switch (type) {
    case "sun":
      return <Sun {...iconProps} className="text-amber-500" />;
    case "cloud-sun":
      return <CloudSun {...iconProps} className="text-amber-400" />;
    case "cloud":
      return <Cloud {...iconProps} className="text-neutral-400" />;
    case "fog":
      return <CloudFog {...iconProps} className="text-neutral-400" />;
    case "rain":
      return <CloudRain {...iconProps} className="text-blue-500" />;
    case "snow":
      return <CloudSnow {...iconProps} className="text-blue-300" />;
    case "storm":
      return <CloudLightning {...iconProps} className="text-purple-500" />;
    default:
      return <HelpCircle {...iconProps} className="text-neutral-400" />;
  }
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

      const weatherCodes: Record<number, { desc: string; iconType: string }> = {
        0: { desc: "맑음", iconType: "sun" },
        1: { desc: "대체로 맑음", iconType: "cloud-sun" },
        2: { desc: "부분적 흐림", iconType: "cloud-sun" },
        3: { desc: "흐림", iconType: "cloud" },
        45: { desc: "안개", iconType: "fog" },
        48: { desc: "짙은 안개", iconType: "fog" },
        51: { desc: "가벼운 이슬비", iconType: "rain" },
        53: { desc: "이슬비", iconType: "rain" },
        55: { desc: "강한 이슬비", iconType: "rain" },
        61: { desc: "가벼운 비", iconType: "rain" },
        63: { desc: "비", iconType: "rain" },
        65: { desc: "강한 비", iconType: "rain" },
        71: { desc: "가벼운 눈", iconType: "snow" },
        73: { desc: "눈", iconType: "snow" },
        75: { desc: "강한 눈", iconType: "snow" },
        80: { desc: "소나기", iconType: "rain" },
        81: { desc: "강한 소나기", iconType: "rain" },
        82: { desc: "매우 강한 소나기", iconType: "storm" },
        95: { desc: "뇌우", iconType: "storm" },
      };

      const weatherInfo = weatherCodes[current.weather_code] || { desc: "알 수 없음", iconType: "unknown" };

      setWeather({
        temperature: current.temperature_2m,
        feelsLike: current.apparent_temperature,
        humidity: current.relative_humidity_2m,
        description: weatherInfo.desc,
        iconType: weatherInfo.iconType,
        windSpeed: current.wind_speed_10m,
      });
    } catch (err) {
      setError("날씨 정보를 불러오는 데 실패했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="mb-10">
        <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Sun size={22} className="text-amber-600" />
          </div>
          인도 날씨
        </h1>
        <p className="text-neutral-500">주요 도시의 현재 날씨를 확인하세요</p>
      </div>

      {/* City Selection */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {cities.map((city) => (
          <button
            key={city.name}
            onClick={() => fetchWeather(city)}
            className={`p-4 rounded-xl border transition-all text-left ${
              selectedCity.name === city.name
                ? "bg-gradient-to-br from-orange-500 to-amber-500 text-white border-transparent shadow-lg shadow-orange-500/20"
                : "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-orange-500"
            }`}
          >
            <p className="font-semibold">{city.nameKo}</p>
            <p className={`text-sm ${selectedCity.name === city.name ? "opacity-80" : "text-neutral-500"}`}>
              {city.name}
            </p>
          </button>
        ))}
      </div>

      {/* Weather Display */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold">{selectedCity.nameKo}</h2>
              <p className="text-neutral-500">{selectedCity.name}, India</p>
            </div>
            {!loading && weather && (
              <WeatherIcon type={weather.iconType} size={56} />
            )}
          </div>

          {loading ? (
            <div className="text-center py-16">
              <div className="inline-block w-10 h-10 border-2 border-orange-500 border-t-transparent rounded-full animate-spin" />
              <p className="mt-4 text-neutral-500">날씨 정보 불러오는 중...</p>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
                <HelpCircle size={24} className="text-red-500" />
              </div>
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => fetchWeather(selectedCity)}
                className="inline-flex items-center gap-2 px-4 py-2 btn-primary text-white rounded-lg text-sm"
              >
                <RefreshCw size={14} /> 다시 시도
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
                  <div className="flex justify-center mb-2">
                    <Thermometer size={20} className="text-red-500" />
                  </div>
                  <p className="text-xs text-neutral-500 mb-1">체감</p>
                  <p className="font-semibold number-display">{Math.round(weather.feelsLike)}°C</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <Droplets size={20} className="text-blue-500" />
                  </div>
                  <p className="text-xs text-neutral-500 mb-1">습도</p>
                  <p className="font-semibold number-display">{weather.humidity}%</p>
                </div>
                <div className="text-center p-4 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl">
                  <div className="flex justify-center mb-2">
                    <Wind size={20} className="text-neutral-500" />
                  </div>
                  <p className="text-xs text-neutral-500 mb-1">풍속</p>
                  <p className="font-semibold number-display">{weather.windSpeed} km/h</p>
                </div>
              </div>
            </>
          ) : (
            <div className="text-center py-16">
              <div className="flex justify-center mb-4">
                <Globe size={56} className="text-neutral-200 dark:text-neutral-700" />
              </div>
              <p className="text-neutral-500 mb-4">도시를 선택하면 날씨 정보가 표시됩니다</p>
              <button
                onClick={() => fetchWeather(selectedCity)}
                className="inline-flex items-center gap-2 px-5 py-2.5 btn-primary text-white rounded-full font-medium text-sm"
              >
                날씨 확인하기
              </button>
            </div>
          )}
        </div>

        {/* Travel Tips */}
        <div className="bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl p-8">
          <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
            <ClipboardList size={18} className="text-neutral-400" /> 2월 인도 여행 팁
          </h2>

          <div className="space-y-4">
            <div className="p-4 bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/20 rounded-xl">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                <Thermometer size={14} className="text-orange-500" /> 기후
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                2월은 인도 여행의 최적기입니다. 북부 지역은 15-25°C로 쾌적하며,
                남부는 25-30°C로 따뜻합니다.
              </p>
            </div>

            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 rounded-xl">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                <Shirt size={14} className="text-blue-500" /> 복장
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                낮에는 가벼운 옷, 아침/저녁에는 재킷이나 긴팔이 필요합니다.
                사원 방문시 긴 바지와 어깨를 덮는 옷 필수.
              </p>
            </div>

            <div className="p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 rounded-xl">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                <Sun size={14} className="text-amber-500" /> 자외선
              </h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400">
                자외선이 강하므로 선크림, 선글라스, 모자를 챙기세요.
                특히 오후 12-4시 야외 활동 주의.
              </p>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-900/20 rounded-xl">
              <h3 className="font-medium mb-2 flex items-center gap-2 text-sm">
                <Droplets size={14} className="text-purple-500" /> 건강
              </h3>
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
        <h2 className="text-lg font-semibold mb-6 flex items-center gap-2">
          <Clock size={18} className="text-neutral-400" /> 시차 정보
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          <div>
            <p className="text-sm text-neutral-500 mb-2 uppercase tracking-wide">한국 (KST) → 인도 (IST)</p>
            <p className="text-4xl font-bold tracking-tighter number-display">-3시간 30분</p>
          </div>
          <div className="space-y-1.5 text-sm text-neutral-500">
            <p className="font-medium text-neutral-700 dark:text-neutral-300 mb-2">예시</p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-300" />
              한국 오전 9시 = 인도 오전 5시 30분
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-300" />
              한국 오후 6시 = 인도 오후 2시 30분
            </p>
            <p className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-neutral-300" />
              한국 자정 = 인도 오후 8시 30분
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
