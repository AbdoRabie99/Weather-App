"use client";

import { useState, useEffect } from "react";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { searchCity, getWeather, getAirQuality } from "./lib/weather";
import TempToggle from "./components/TempToggle";
import AirQuality from "./components/AirQuality";
import Sun_Moon from "./components/Sun_Moon";

export default function Home() {
  const [unit, setUnit] = useState("C");
  const [cityData, setCityData] = useState(null);
  const [weatherData, setWeatherData] = useState(null);
  const [airQualityData, setAirQualityData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    handleSearch("Cairo");
  }, []);

  async function handleSearch(city) {
    if (!city.trim()) {
      setError("Please enter a city name.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const cityResult = await searchCity(city.trim());

      const [weatherResult, airQualityResult] = await Promise.all([
        getWeather(cityResult.latitude, cityResult.longitude),
        getAirQuality(cityResult.latitude, cityResult.longitude),
      ]);

      setCityData(cityResult);
      setWeatherData(weatherResult);
      setAirQualityData(airQualityResult);
    } catch (err) {
      console.error(err);

      setError(
        err.message === "City not found"
          ? "City not found. Please try another city."
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="relative isolate min-h-screen overflow-hidden text-white">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_450px_at_13%_10%,rgba(12,52,80,0.7),rgba(12,52,80,0)_100%)]"
      />

      <div className="mx-auto flex w-full max-w-5xl flex-col gap-6 px-6 py-6">
        <Header
          cityData={cityData}
          onSearch={handleSearch}
          loading={loading}
          error={error}
          unit={unit}
          setUnit={setUnit}
        />

        <Hero weatherData={weatherData} unit={unit} />

        <TempToggle weatherData={weatherData} unit={unit} />

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <AirQuality airQualityData={airQualityData} />
          <Sun_Moon weatherData={weatherData} />
        </div>
      </div>
    </main>
  );
}
