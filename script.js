// script.js (example)
document.addEventListener("DOMContentLoaded", () => {
  const weatherDiv = document.getElementById("weather-info");
  const cityInput = document.getElementById("city-input");
  const fetchWeatherBtn = document.getElementById("fetch-weather-btn");

  fetchWeatherBtn.addEventListener("click", () => {
    const city = cityInput.value || "London"; // Get city from input, default to London
    getWeather(city);
  });

  // Fetch weather for a default city on page load
  getWeather("London");

  async function getWeather(city) {
    weatherDiv.innerHTML = "Loading weather...";
    try {
      // Call your Netlify Function
      // The URL structure is / .netlify / functions / [your-function-file-name]
      const response = await fetch(
        `/.netlify/functions/get-weather?city=${encodeURIComponent(city)}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        weatherDiv.innerHTML = `<p>Error: ${
          errorData.error || "Could not fetch weather."
        }</p>`;
        return;
      }

      const data = await response.json();
      weatherDiv.innerHTML = `
                <h2>Weather in ${data.city}</h2>
                <p>Temperature: ${data.temperature}°C</p>
                <p>Conditions: ${data.description} <img src="http://openweathermap.org/img/wn/${data.icon}.png" alt="Weather icon"></p>
            `;
    } catch (error) {
      console.error("Error in frontend:", error);
      weatherDiv.innerHTML = "<p>An unexpected error occurred.</p>";
    }
  }
});
