import Image from "next/image";
import { Thermometer, Droplets, Wind, Gauge, Sun, Eye } from "lucide-react";

function getWeatherDescription(code) {
  if (code === 0) return "Clear sky";
  if (code === 1) return "Mainly clear";
  if (code === 2) return "Partly cloudy";
  if (code === 3) return "Overcast";
  if ([45, 48].includes(code)) return "Fog";
  if ([51, 53, 55, 56, 57].includes(code)) return "Drizzle";
  if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "Rain";
  }
  if ([71, 73, 75, 77, 85, 86].includes(code)) return "Snow";
  if ([95, 96, 99].includes(code)) return "Thunderstorm";

  return "Weather unavailable";
}

function tempConvert(value, unit) {
  if (value == null) return "--";
  const temperature = unit === "F" ? (value * 9) / 5 + 32 : value;
  return `${Math.round(temperature)}°${unit}`;
}
function getWeatherImage(code) {
  if (code === 0) {
    return "/icons/sun_3d.png";
  }

  if ([1, 2].includes(code)) {
    return "/icons/sun_behind_cloud_3d.png";
  }

  if (code === 3) {
    return "/icons/cloud_3d.png";
  }

  if ([45, 48].includes(code)) {
    return "/icons/cloud_3d.png";
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return "/icons/cloud_with_rain_3d.png";
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return "/icons/cloud_with_snow_3d.png";
  }

  if ([95, 96, 99].includes(code)) {
    return "/icons/cloud_with_lightning_3d.png";
  }

  return "/icons/sun_3d.png";
}
function formatTime(value) {
  if (!value) return "--:--";

  return new Date(value).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
  });
}

export default function Hero({ weatherData, unit }) {
  const current = weatherData?.current;
  const daily = weatherData?.daily;
  const weatherImage = current
    ? getWeatherImage(current.weather_code, current.is_day === 1)
    : "/icons/sun_3d.png";

  const tempInfo = [
    {
      id: 1,
      title: "FEELS LIKE",
      icon: <Thermometer size={16} />,
      info: current ? tempConvert(current.apparent_temperature, unit) : "--",
    },
    {
      id: 2,
      title: "HUMIDITY",
      icon: <Droplets size={16} />,
      info: current ? `${current.relative_humidity_2m}%` : "--",
    },
    {
      id: 3,
      title: "WIND",
      icon: <Wind size={16} />,
      info: current ? `${current.wind_speed_10m} mph` : "--",
    },
    {
      id: 4,
      title: "PRESSURE",
      icon: <Gauge size={16} />,
      info: current ? `${current.pressure_msl} hPa` : "--",
    },
    {
      id: 5,
      title: "SUNRISE",
      icon: <Sun size={16} />,
      info: daily ? formatTime(daily.sunrise[0]) : "--",
    },
    {
      id: 6,
      title: "SUNSET",
      icon: <Eye size={16} />,
      info: daily ? formatTime(daily.sunset[0]) : "--",
    },
  ];

  return (
    <div className="relative mb-6 overflow-hidden rounded-2xl border border-[#22d3ee2a] bg-[radial-gradient(circle_450px_at_0%_10%,rgba(12,52,80,0.7),rgba(12,52,80,0)_100%)] p-8 shadow-2xl">
      <div className="flex flex-col items-start justify-between gap-4 text-left sm:gap-16 md:flex-row">
        <div className="my-2 flex md:min-w-[240] lg:min-w-[280]">
          <Image
            src={weatherImage}
            alt="Weather"
            width={112}
            height={112}
            className="mr-2 h-28 w-28 object-contain"
          />

          <div className="flex flex-col">
            <h2 className="bg-linear-to-b from-white to-indigo-300 bg-clip-text text-6xl font-bold text-transparent">
              {current ? tempConvert(current.temperature_2m, unit) : "--"}
            </h2>

            <p className="text-xl font-medium tracking-wide text-[#00D4FF]">
              {current
                ? getWeatherDescription(current.weather_code)
                : "Search for a city"}
            </p>

            <div className="flex justify-between gap-4 text-[#8899CC]">
              <p>
                H:{" "}
                {daily ? `${Math.round(daily.temperature_2m_max[0])}°` : "--"}
              </p>
              <p>
                L:{" "}
                {daily ? `${Math.round(daily.temperature_2m_min[0])}°` : "--"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
          {tempInfo.map((item) => (
            <div
              key={item.id}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 p-4 bg-[rgba(255,255,255,0.03)]"
            >
              <p className="flex items-center gap-2 font-mono text-[10px] text-[rgba(136,153,204,0.7)]">
                {item.icon}
                {item.title}
              </p>

              <p className="text-base font-medium text-white">{item.info}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
