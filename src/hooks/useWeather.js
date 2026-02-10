import {
    getCurrentWeather,
    getWeatherForecast,
    getCurrentWeatherByCoords
} from "../services/weatherAPI.js";
import {useEffect, useState} from "react";

export const useWeather = () => {
    const [currentWeather, setCurrentWeather] = useState(null);
    const [forecast, setForecast] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [unit, setUnit] = useState("C");

    const fetchWeatherByCity = async (city) => {
        setLoading(true);
        setError(null);
        try {
            const [weatherData, foreCast] = await Promise.all([
                getCurrentWeather(city),
                getWeatherForecast(city)
            ]);

            setCurrentWeather(weatherData);
            setForecast(foreCast);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to fetch weather data");
        } finally {
            setLoading(false);
        }
    };

    const fetchWeatherByLocation = async () => {
        if (!navigator.geolocation) {
            setError("GeoLocation is not supported by this browser");
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(async (position) => {
            try {

                const {latitude, longitude} = position.coords;
                const weatherData = await getCurrentWeatherByCoords(latitude, longitude);
                setCurrentWeather(weatherData);


                //als fetch forecast for the current location
                const forecastData = await getWeatherForecast(weatherData.name);
                setForecast(forecastData);

            } catch (err) {
                setError(err instanceof Error ? err.message : "Failed to fetch weather data");
            } finally {
                setLoading(false);
            }

        }, (error) => {
            switch (error.code) {
                case error.PERMISSION_DENIED:
                    setError("Permission denied");
                    break;
                case error.POSITION_UNAVAILABLE:
                    setError("Location unavailable");
                    break;
                case error.TIMEOUT:
                    setError("Location request timed out");
                    break;
                default:
                    setError("Unable to retrieve location");
            }
            setLoading(false);
            setLoading(false);
        });
    };

    const toggleUnit = () => {
        setUnit(unit === "C" ? "F" : "C");
    }

    //load default weather on mount
    useEffect(() => {
        fetchWeatherByCity("Ha Noi");
    }, []);

    return {currentWeather, forecast, loading, error, unit, fetchWeatherByCity, fetchWeatherByLocation, toggleUnit};
};

