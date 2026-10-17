"use client";

import { useState } from "react";
import {
  Sun,
  Cloud,
  CloudSun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
} from "lucide-react";

const tempToggle = ["Hourly", "7-Day"];

// تحديد أيقونة الطقس من Open-Meteo weather code
function WeatherIcon({ code, isDay = true }) {
  if (code === 0) {
    return isDay ? (
      <Sun className="h-7 w-7 text-amber-300" />
    ) : (
      <Sun className="h-7 w-7 text-indigo-300" />
    );
  }

  if (code === 1 || code === 2) {
    return <CloudSun className="h-7 w-7 text-sky-300" />;
  }

  if (code === 3) {
    return <Cloud className="h-7 w-7 text-slate-300" />;
  }

  if ([45, 48].includes(code)) {
    return <CloudFog className="h-7 w-7 text-slate-300" />;
  }

  if ([51, 53, 55, 56, 57, 61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
    return <CloudRain className="h-7 w-7 text-sky-300" />;
  }

  if ([71, 73, 75, 77, 85, 86].includes(code)) {
    return <CloudSnow className="h-7 w-7 text-cyan-200" />;
  }

  if ([95, 96, 99].includes(code)) {
    return <CloudLightning className="h-7 w-7 text-purple-300" />;
  }

  return <Cloud className="h-7 w-7 text-slate-300" />;
}

export default function TempToggle({ weatherData, unit = "C" }) {
  const current = weatherData?.current;
  const daily = weatherData?.daily;
  const hourly = weatherData?.hourly;
  const timezone = weatherData?.timezone;

  const [openHourly, setOpenHourly] = useState(true);
  const [openDay, setOpenDay] = useState(false);

  const convertTemp = (temp) => {
    if (temp == null) return "--";

    return Math.round(unit === "F" ? (temp * 9) / 5 + 32 : temp);
  };

  const today = current?.time?.split("T")[0];
  const currentTime = current?.time;

  const daysInfo =
    daily?.time?.map((date, index) => ({
      id: date,
      date,
      dayName:
        index === 0
          ? "Today"
          : new Date(`${date}T12:00:00`).toLocaleDateString("en-US", {
              weekday: "short",
              timeZone: "UTC",
            }),
      minTemp: daily.temperature_2m_min[index],
      maxTemp: daily.temperature_2m_max[index],
      weatherCode: daily.weather_code[index],
    })) ?? [];

  const hoursInfo =
    hourly?.time
      ?.map((date, index) => ({
        id: date,
        date: date.split("T")[0],
        time: new Date(date).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
          timeZone: timezone,
        }),
        temp: hourly.temperature_2m[index],
        weatherCode: hourly.weather_code[index],
      }))
      .filter((hour) => hour.date === today && hour.id >= currentTime) ?? [];

  return (
    <section className="flex flex-col gap-5">
      {/* Tabs */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/3 p-1">
          {tempToggle.map((item) => {
            const isActive = item === "Hourly" ? openHourly : openDay;

            return (
              <button
                key={item}
                type="button"
                onClick={() => {
                  setOpenHourly(item === "Hourly");
                  setOpenDay(item === "7-Day");
                }}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-300 ${
                  isActive
                    ? "bg-sky-500/20 text-sky-300 shadow-sm"
                    : "text-white/50 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item}
              </button>
            );
          })}
        </div>

        <span className="text-xs text-white/40">
          {openHourly ? "Today's forecast" : "7-day forecast"}
        </span>
      </div>

      {/* Hourly Cards */}
      {openHourly && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8">
          {hoursInfo.length > 0 ? (
            hoursInfo.map((hour, index) => (
              <div
                key={hour.id}
                className={`group flex min-h-40 flex-col items-center justify-between gap-4 rounded-2xl border p-4 text-center transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-sky-400/8 ${
                  index === 0
                    ? "border-sky-400/30 bg-sky-400/8"
                    : "border-white/8 bg-white/3"
                }`}
              >
                <p className="text-xs font-medium text-white/55">
                  {index === 0 ? "Now" : hour.time}
                </p>

                <WeatherIcon code={hour.weatherCode} />

                <p className="text-2xl font-semibold tracking-tight text-white">
                  {convertTemp(hour.temp)}°
                </p>
              </div>
            ))
          ) : (
            <p className="col-span-full rounded-2xl border border-white/10 bg-white/3 p-6 text-center text-sm text-white/50">
              No hourly forecast available.
            </p>
          )}
        </div>
      )}

      {/* 7-Day Cards */}
      {openDay && (
        <div className="flex w-full flex-col gap-3">
          {daysInfo.map((day, index) => (
            <div
              key={day.id}
              className={`group flex w-full items-center justify-between gap-4 rounded-2xl border p-4 transition-all duration-300 hover:-translate-y-1 hover:border-sky-400/40 hover:bg-sky-400/8 ${
                index === 0
                  ? "border-sky-400/30 bg-sky-400/8"
                  : "border-white/8 bg-white/3"
              }`}
            >
              <div className="flex min-w-0 flex-col gap-2">
                <p className="font-medium text-white">{day.dayName}</p>

                <p className="text-xs text-white/40">{day.date}</p>

                <div className="flex items-center gap-2 text-sm">
                  <span className="font-semibold text-white">
                    {convertTemp(day.maxTemp)}°
                  </span>

                  <span className="text-white/40">
                    {convertTemp(day.minTemp)}°
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center justify-center rounded-xl bg-white/4 p-3 transition-transform duration-300 group-hover:scale-110">
                <WeatherIcon code={day.weatherCode} />
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
