import React from "react";
import SearchBar from "./components/SearchBar.jsx";
import TemperatureToggle from "./components/TemperatureToggle.jsx";
import LoadingSpinner from "./components/LoadingSpinner.jsx";
import ErrorMessage from "./components/ErrorMessage.jsx";
import WeatherCard from "./components/WeatherCard.jsx";
import WeatherForecast from "./components/WeatherForecast.jsx";
import {getCurrentWeather} from "./services/weatherAPI.js";
import {useWeather} from "./hooks/useWeather.js";

export default function App() {
    const {
        currentWeather,
        forecast,
        loading,
        error,
        unit,
        fetchWeatherByCity,
        fetchWeatherByLocation,
        toggleUnit
    } = useWeather();

    const handleRetry = () => {
        if (currentWeather) {
            fetchWeatherByCity(currentWeather.name);
        } else {
            fetchWeatherByCity("New York");
        }
    };

    return (
        <>
            <div className="relative overflow-hidden min-h-screen">
                {/*Background Image with Overlay*/}
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{
                    backgroundImage: `url('https://images.pexels.com/photos/32047220/pexels-photo-32047220.jpeg')`
                }}>
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-900/40 via-purple-900/30
                    to-indigo-900/40"></div>
                    <div className="absolute inset-0 bg-black-20"></div>
                </div>
                <div className="relative z-10 container mx-auto px-4 py-8 min-h-screen">
                    <div className="max-w-7xl mx-auto">
                        {/*Header Section*/}
                        <div className="text-center mb-12">
                            <div className="mb-8">
                                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 drop-shadow-2xl
                            tracking-tight">
                                    Weather
                                    <span className="bg-gradient-to-r from-blue-400 to-purple-400
                                bg-clip-text text-transparent">Pro</span>
                                </h1>
                                <p className="text-white/80 text-lg md:text-xl mb-8 max-w-2xl mx-auto
                            leading-relaxed">
                                    Experience weather like never before with real-time data,
                                    beautiful visuals, and precise forecasts for any location
                                    worldwide
                                </p>
                            </div>

                            <div className="flex flex-col lg:flex-row items-center justify-center
                            space-y-6 lg:space-y-0 lg:space-x-6 mb-12">
                                <SearchBar
                                    onSearch={fetchWeatherByCity}
                                    onLocationSearch={fetchWeatherByLocation}
                                    loading={loading}
                                />
                                <TemperatureToggle unit={unit} onToggle={toggleUnit}/>
                            </div>
                        </div>

                        {/*Main Content*/}
                        <div className="space-y-8">
                            {/*Conditional Rendering*/}
                            {loading && (<div className="flex justify-center">
                                    <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 border
                                border-white/20">
                                        <LoadingSpinner/>
                                        <p className="text-white/80 text-center mt-4 font-medium">
                                            Fetching lastest weather data........
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/*Conditional Rendering */}
                            {error && !loading && (
                                <div className="max-w-2xl mx-auto">
                                    <ErrorMessage message={error} onRetry={handleRetry}/>
                                </div>
                            )}

                            {/*Conditional Rendering */}
                            {currentWeather && !loading && (
                                <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                                    <div className="xl:col-span-2">
                                        <WeatherCard weather={currentWeather} unit={unit}/>
                                    </div>
                                    <div className="xl:col-span-1">
                                        {/*Conditional Rendering*/}
                                        {forecast && <WeatherForecast forecast={forecast} unit={unit}/>}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}