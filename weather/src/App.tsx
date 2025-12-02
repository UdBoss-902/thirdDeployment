import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./App.css";

const API_KEY = import.meta.env.VITE_WEATHER_KEY;

interface WeatherData {
  name: string;
  main: { temp: number; feels_like: number; humidity: number };
  weather: { description: string; main: string }[];
  wind: { speed: number };
  cod?: number;
  message?: string;
}

interface ForecastData {
  list: {
    dt_txt: string;
    main: { temp: number };
    weather: { description: string; main: string }[];
  }[];
}

function getBackground(condition: string): string {
  const key = condition.toLowerCase();
  if (key.includes("clear")) return "linear-gradient(135deg, #fbd786, #f7797d)";
  if (key.includes("cloud")) return "linear-gradient(135deg, #6a85b6, #bac8e0)";
  if (key.includes("rain")) return "linear-gradient(135deg, #00c6ff, #0072ff)";
  if (key.includes("storm") || key.includes("thunder"))
    return "linear-gradient(135deg, #434343, #000000)";
  if (key.includes("snow")) return "linear-gradient(135deg, #e6dada, #274046)";
  if (key.includes("mist") || key.includes("fog"))
    return "linear-gradient(135deg, #606c88, #3f4c6b)";
  return "linear-gradient(to right, #4facfe, #00f2fe)";
}

export default function App() {
  const [city, setCity] = useState("Ibadan");
  const [input, setInput] = useState("Ibadan");
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error" | "success">("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favorites");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setStatus("loading");
        setErrorMsg("");

        const resWeather = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
        );
        const dataWeather = await resWeather.json();

        if (dataWeather.cod !== 200) {
          setStatus("error");
          setErrorMsg(dataWeather.message || "City not found.");
          return;
        }

        setWeather(dataWeather);

        const resForecast = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}&units=metric`
        );
        const dataForecast = await resForecast.json();
        setForecast(dataForecast);

        setStatus("success");
      } catch {
        setStatus("error");
        setErrorMsg("Network error. Please try again.");
      }
    };

    fetchData();
  }, [city]);

  useEffect(() => {
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }, [favorites]);

  const dailyForecast =
    forecast?.list
      .filter((item) => item.dt_txt.includes("12:00:00"))
      .slice(0, 5) || [];

  const bg =
    weather && weather.weather
      ? getBackground(weather.weather[0].main)
      : "linear-gradient(to right, #4facfe, #00f2fe)";

  const addFavorite = () => {
    if (weather && !favorites.includes(weather.name)) {
      setFavorites([...favorites, weather.name]);
    }
  };

  const removeFavorite = (fav: string) => {
    setFavorites(favorites.filter((c) => c !== fav));
  };

  return (
    <motion.div
      className="app"
      style={{ background: bg }}
      key={bg}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h1 className="title">🌍 UDBOSS Weather</h1>

      {/* Search Bar */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (input.trim()) setCity(input.trim());
        }}
        className="search-bar"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a city (e.g., Lagos, London)…"
          className="search-input"
        />
        <button type="submit" className="search-btn">
          Search
        </button>
      </form>

      {/* Favorites Bar */}
      {favorites.length > 0 && (
        <div className="favorites-bar">
          {favorites.map((fav) => (
            <div key={fav} className="favorite-item">
              <button onClick={() => setCity(fav)} className="favorite-btn">
                {fav}
              </button>
              <button
                onClick={() => removeFavorite(fav)}
                className="remove-btn"
              >
                ✖
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Loading */}
      {status === "loading" && (
        <motion.div
          className="loading-pulse"
          initial={{ opacity: 0.5 }}
          animate={{ opacity: 1 }}
          transition={{ repeat: Infinity, duration: 1, repeatType: "reverse" }}
        >
          Fetching empire skies…
        </motion.div>
      )}

      {/* Error */}
      {status === "error" && (
        <p className="error-msg">
          ⚠️ {errorMsg}. Stay strong, boss — try again.
        </p>
      )}

      {/* Current Weather */}
      {status === "success" && weather && (
        <motion.div
          className="weather-card"
          key={weather.name}
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          whileHover={{ scale: 1.03 }}
        >
          <h2>{weather.name}</h2>
          <p className="temp">{Math.round(weather.main.temp)}°C</p>
          <p className="desc">{weather.weather[0].description}</p>
          <p>
            Feels like {Math.round(weather.main.feels_like)}°C • Humidity{" "}
            {weather.main.humidity}% • Wind {Math.round(weather.wind.speed)} m/s
          </p>
          <p className="motto">
            {`Empire forecast: ${weather.weather[0].main} — build strong today.`}
          </p>
          <button onClick={addFavorite} className="fav-btn">
            ⭐ Save to Favorites
          </button>
        </motion.div>
      )}

      {/* Forecast */}
      {status === "success" && (
        <div className="forecast-container">
          {dailyForecast.map((day, idx) => (
            <motion.div
              className="forecast-card"
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <h3>
                {new Date(day.dt_txt).toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </h3>
              <p className="forecast-temp">
                {Math.round(day.main.temp)}°C
              </p>
              <p className="forecast-desc">
                {day.weather[0].description}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
