import axios from "axios";

const GEO_URL = "https://geocoding-api.open-meteo.com/v1/search";
const WEATHER_URL = "https://api.open-meteo.com/v1/forecast";
const AIR_QUALITY_URL = "https://air-quality-api.open-meteo.com/v1/air-quality";
// Search for a city
export async function searchCity(city) {
  try {
    const response = await axios.get(GEO_URL, {
      params: {
        name: city,
        count: 1,
        language: "en",
        format: "json",
      },
    });
    console.log(response);

    const results = response.data.results;

    if (!results || results.length === 0) {
      throw new Error("City not found");
    }

    return results[0];
  } catch (error) {
    console.error("Error searching for city:", error.message);
    throw error;
  }
}
export async function searchCities(city) {
  try {
    const response = await axios.get(GEO_URL, {
      params: {
        name: city,
        count: 5,
        language: "en",
        format: "json",
      },
    });

    return response.data.results || [];
  } catch (error) {
    console.error("Error searching for cities:", error.message);
    return [];
  }
}

// Get weather by coordinates
export async function getWeather(latitude, longitude) {
  try {
    const response = await axios.get(WEATHER_URL, {
      params: {
        latitude,
        longitude,
        current: [
          "temperature_2m",
          "relative_humidity_2m",
          "apparent_temperature",
          "weather_code",
          "pressure_msl",
          "wind_speed_10m",
          "is_day",
        ].join(","),
        hourly: ["temperature_2m", "weather_code"].join(","),
        daily: [
          "weather_code",
          "temperature_2m_max",
          "temperature_2m_min",
          "sunrise",
          "sunset",
        ].join(","),
        timezone: "auto",
        forecast_days: 7,
        temperature_unit: "celsius",
        wind_speed_unit: "mph",
      },
    });

    return response.data;
  } catch (error) {
    console.log("API Error Details:", error.response?.data);
    throw error;
  }
}

export async function getAirQuality(latitude, longitude) {
  const response = await axios.get(AIR_QUALITY_URL, {
    params: {
      latitude,
      longitude,
      current: ["us_aqi", "pm2_5", "pm10"].join(","),
      timezone: "auto",
    },
  });

  return response.data;
}
