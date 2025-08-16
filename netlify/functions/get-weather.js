// netlify/functions/get-weather.js
import fetch from 'node-fetch';

// ESM exports use `export` keyword instead of `exports.handler = ...`
export async function handler(event, context) {
    const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;

    if (!OPENWEATHER_API_KEY) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: 'OpenWeather API key not configured.' }),
        };
    }

    const city = event.queryStringParameters.city || 'London';

    try {
        const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
            city
        )}&appid=${OPENWEATHER_API_KEY}&units=metric`;

        const response = await fetch(weatherApiUrl);

        if (!response.ok) {
            const errorData = await response.json();
            return {
                statusCode: response.status,
                body: JSON.stringify({
                    error: errorData.message || 'Failed to fetch weather data',
                }),
            };
        }

        const data = await response.json();

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
}
