"use client";

import { Wind, Leaf, Activity, ShieldCheck, AlertTriangle } from "lucide-react";

export default function AirQuality({ airQualityData }) {
  const air = airQualityData?.current;

  const aqi = air?.us_aqi;

  const getAirStatus = (value) => {
    if (value == null) {
      return {
        label: "Unavailable",
        color: "text-white/50",
        barColor: "bg-white/30",
        width: "0%",
        description: "Air quality data is unavailable.",
      };
    }

    if (value <= 50) {
      return {
        label: "Good",
        color: "text-emerald-400",
        barColor: "bg-emerald-400",
        width: `${(value / 500) * 100}%`,
        description: "Air quality is satisfactory.",
      };
    }

    if (value <= 100) {
      return {
        label: "Moderate",
        color: "text-yellow-400",
        barColor: "bg-yellow-400",
        width: `${(value / 500) * 100}%`,
        description: "Sensitive people may need extra care.",
      };
    }

    if (value <= 150) {
      return {
        label: "Unhealthy for Sensitive Groups",
        color: "text-orange-400",
        barColor: "bg-orange-400",
        width: `${(value / 500) * 100}%`,
        description:
          "Sensitive groups should limit prolonged outdoor activity.",
      };
    }

    if (value <= 200) {
      return {
        label: "Unhealthy",
        color: "text-red-400",
        barColor: "bg-red-400",
        width: `${(value / 500) * 100}%`,
        description: "Consider reducing prolonged outdoor activity.",
      };
    }

    if (value <= 300) {
      return {
        label: "Very Unhealthy",
        color: "text-purple-400",
        barColor: "bg-purple-400",
        width: `${(value / 500) * 100}%`,
        description: "Health alert: reduce outdoor exposure.",
      };
    }

    return {
      label: "Hazardous",
      color: "text-rose-500",
      barColor: "bg-rose-500",
      width: `${Math.min((value / 500) * 100, 100)}%`,
      description: "Avoid outdoor exposure when possible.",
    };
  };

  const status = getAirStatus(aqi);

  const pollutants = [
    {
      label: "PM2.5",
      value: air?.pm2_5,
      unit: "µg/m³",
      icon: Activity,
    },
    {
      label: "PM10",
      value: air?.pm10,
      unit: "µg/m³",
      icon: Wind,
    },
  ];

  return (
    <section className="w-full rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 text-white sm:p-6">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-emerald-400/10 p-3">
            <Wind className="h-5 w-5 text-emerald-400" />
          </div>

          <div>
            <h2 className="font-semibold">Air Quality</h2>
            <p className="mt-1 text-xs text-white/45">Current air conditions</p>
          </div>
        </div>

        <Leaf className="h-5 w-5 text-emerald-400/70" />
      </div>

      {!airQualityData ? (
        <div className="flex min-h-36 items-center justify-center text-sm text-white/50">
          Loading air quality...
        </div>
      ) : (
        <>
          {/* AQI */}
          <div className="mb-6 rounded-xl border border-white/[0.06] bg-white/[0.02] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm text-white/55">US Air Quality Index</p>

                <div className="mt-2 flex items-baseline gap-2">
                  <span className="text-4xl font-semibold tracking-tight">
                    {aqi ?? "--"}
                  </span>

                  <span className={`text-sm font-medium ${status.color}`}>
                    {status.label}
                  </span>
                </div>
              </div>

              {aqi != null && aqi <= 50 ? (
                <ShieldCheck className="h-8 w-8 text-emerald-400" />
              ) : (
                <AlertTriangle
                  className={`h-8 w-8 ${
                    aqi == null ? "text-white/30" : status.color
                  }`}
                />
              )}
            </div>

            {/* AQI scale */}
            <div className="mt-5">
              <div className="h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${status.barColor}`}
                  style={{ width: status.width }}
                />
              </div>

              <div className="mt-2 flex justify-between text-[10px] text-white/40">
                <span>Good</span>
                <span>Moderate</span>
                <span>Unhealthy</span>
                <span>500</span>
              </div>
            </div>

            <p className="mt-4 text-sm leading-6 text-white/60">
              {status.description}
            </p>
          </div>

          {/* Pollutants */}
          <div className="grid grid-cols-2 gap-3">
            {pollutants.map((pollutant) => {
              const Icon = pollutant.icon;

              return (
                <div
                  key={pollutant.label}
                  className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4 transition-colors hover:bg-white/[0.05]"
                >
                  <div className="flex items-center gap-2 text-white/50">
                    <Icon className="h-4 w-4" />

                    <span className="text-sm">{pollutant.label}</span>
                  </div>

                  <p className="mt-3 text-xl font-semibold">
                    {pollutant.value != null
                      ? pollutant.value.toFixed(1)
                      : "--"}
                  </p>

                  <p className="mt-1 text-xs text-white/40">{pollutant.unit}</p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </section>
  );
}
