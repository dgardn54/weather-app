// netlify/functions/get-weather.js
import fetch from 'node-fetch'; // You might need to install 'node-fetch' if not already available in your Netlify build environment (see note below)

// Handler function for the Netlify Function
exports.handler = async function(event, context) {
    // Retrieve the API key from Netlify Environment Variables
    // The key is named OPENWEATHER_API_KEY (we'll set this in the next step)
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    // Ensure the API key is set
    if (!OPENWEATHER_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'OpenWeather API key not configured.' }),
        };
    }

    // Get the city from the client-side request
    // For simplicity, we'll expect a query parameter like ?city=London
    const city = event.queryStringParameters.city || 'London'; // Default to London if no city is provided

    try {
        // Make the actual request to the OpenWeatherMap API
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${OPENWEATHER_API_KEY}&units=metric`;
        const response = await fetch(weatherApiUrl);

        if (!response.ok) {
            // Handle API errors (e.g., city not found, invalid key)
            const errorData = await response.json();
            return {
                statusCode: response.status,
                body: JSON.stringify({ error: errorData.message || 'Failed to fetch weather data' }),
            };
        }

        const data = await response.json();

        // Return only the necessary data to the frontend
        return {
            statusCode: 200,
            body: JSON.stringify({
                city: data.name,
                temperature: data.main.temp,
                description: data.weather[0].description,
                icon: data.weather[0].icon,
            }),
        };
    } catch (error) {
        console.error('Error fetching weather:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'Internal server error' }),
        };
    }
};