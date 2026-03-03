import React, { useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchWeather = async () => {
    if (!city) return alert("Enter a city name");

    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/weather?city=${city}`
      );
      setWeather(res.data);
    } catch {
      alert("City not found");
    } finally {
      setLoading(false);
    }
  };

  const getLocationWeather = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          setLoading(true);

          const { latitude, longitude } = position.coords;

          const res = await axios.get(
            `http://localhost:5000/weather?lat=${latitude}&lon=${longitude}`
          );

          setWeather(res.data);
        } catch (error) {
          console.error(error);
          alert("Error fetching weather data");
        } finally {
          setLoading(false);
        }
      },
      (error) => {
        console.error(error);
        alert("Location permission denied or unavailable");
      }
    );
  };

  const getBackground = () => {
    if (!weather || !weather.weather)
      return "linear-gradient(135deg, #1d2b64, #f8cdda)";

    const condition = weather.weather[0].main.toLowerCase();

    if (condition.includes("clear"))
      return "linear-gradient(135deg, #f7971e, #ffd200)";

    if (condition.includes("cloud"))
      return "linear-gradient(135deg, #757f9a, #d7dde8)";

    if (condition.includes("rain"))
      return "linear-gradient(135deg, #314755, #26a0da)";

    if (condition.includes("snow"))
      return "linear-gradient(135deg, #e6dada, #274046)";

    if (condition.includes("thunder"))
      return "linear-gradient(135deg, #141e30, #243b55)";

    return "linear-gradient(135deg, #1d2b64, #f8cdda)";
  };

  return (
    <div
      className="app"
      style={{
        background: getBackground()
      }}
    >
      <h1>Weather Forecast App 🌦</h1>

      <div className="search-container">
        <input
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
        />

        <button onClick={fetchWeather}>Search</button>
        <button onClick={getLocationWeather}>
          Use My Location
        </button>
      </div>

      {loading && (
        <p className="loading">Fetching Weather...</p>
      )}

      {weather && (
        <div className="weather-card">
          <h2>
            {weather.name}, {weather.sys.country}
          </h2>

          <img
            src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
            alt="weather icon"
          />

          <p>🌡 Temperature: {weather.main.temp}°C</p>
          <p>💧 Humidity: {weather.main.humidity}%</p>
          <p>🌬 Wind Speed: {weather.wind.speed} m/s</p>
          <p>🌥 Condition: {weather.weather[0].description}</p>
        </div>
      )}
    </div>
  );
}

export default App;