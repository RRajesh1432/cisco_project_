import React, { useState, useCallback } from 'react';
import { PredictionFormData, PredictionResult, WeatherData } from '../types';
import { getPrediction } from '../services/geminiService';
import { getWeather } from '../services/weatherService';
import { checkWeatherAlerts } from '../services/weatherAlertService'; // New import
import { savePrediction } from '../services/historyService';
import PredictionForm from '../components/PredictionForm';
import ResultsDisplay from '../components/ResultsDisplay';
import LoadingSpinner from '../components/LoadingSpinner';
import WeatherInfo from '../components/WeatherInfo';
import WeatherAlerts from '../components/WeatherAlerts'; // New import

const PredictionPage: React.FC = () => {
  const [formData, setFormData] = useState<PredictionFormData | null>(null);
  const [prediction, setPrediction] = useState<PredictionResult | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [weatherAlerts, setWeatherAlerts] = useState<string[]>([]); // New state for alerts


  const handleLocationSet = useCallback(async (location: { type: 'coords' | 'text', value: string } | null) => {
    if (!location) {
        setWeatherData(null);
        setWeatherError(null);
        setWeatherAlerts([]); // Reset alerts
        return;
    }
    
    setIsWeatherLoading(true);
    setWeatherError(null);
    setWeatherAlerts([]); // Reset alerts on new fetch
    try {
        const data = await getWeather(location);
        setWeatherData(data);
        const alerts = checkWeatherAlerts(data); // Check for alerts
        setWeatherAlerts(alerts); // Set alerts
    } catch (err) {
        setWeatherError("Could not fetch weather data for the location.");
        setWeatherData(null);
        console.error(err);
    } finally {
        setIsWeatherLoading(false);
    }
  }, []);

  const handlePrediction = useCallback(async (data: PredictionFormData) => {
    setIsLoading(true);
    setError(null);
    setPrediction(null);
    setFormData(data);
    try {
      const result = await getPrediction(data, weatherData);
      setPrediction(result);
      savePrediction(data, result); // Save to history
    } catch (err) {
      setError('Failed to get prediction. Please check your inputs and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [weatherData]);

  const handleReset = useCallback(() => {
    setFormData(null);
    setPrediction(null);
    setError(null);
    setWeatherData(null);
    setWeatherError(null);
    setWeatherAlerts([]); // Reset alerts
  }, []);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      <div className="lg:col-span-2 space-y-6">
        <PredictionForm onSubmit={handlePrediction} isLoading={isLoading} onLocationSet={handleLocationSet} />
        {weatherAlerts.length > 0 && <WeatherAlerts alerts={weatherAlerts} />}
        <WeatherInfo data={weatherData} isLoading={isWeatherLoading} error={weatherError} />
      </div>
      <div className="lg:col-span-3">
        {isLoading && (
          <div className="flex flex-col items-center justify-center h-full bg-white rounded-xl shadow-lg p-8">
            <LoadingSpinner />
            <p className="mt-4 text-lg font-medium text-green-700">AI is analyzing your farm data...</p>
            <p className="text-sm text-gray-500">This might take a moment.</p>
          </div>
        )}
        {error && (
          <div className="flex items-center justify-center h-full bg-red-50 text-red-700 rounded-xl shadow-lg p-8">
            <p>{error}</p>
          </div>
        )}
        {prediction && formData && (
          <ResultsDisplay result={prediction} formData={formData} onReset={handleReset} />
        )}
        {!isLoading && !prediction && !error && (
           <div className="flex flex-col items-center justify-center h-full bg-white/70 backdrop-blur-sm border border-green-200/50 rounded-xl shadow-sm p-8 text-center">
             <img src="https://storage.googleapis.com/aistudio-v2-apps-example-images/agri-yield-welcome.png" alt="Lush green field" className="rounded-lg mb-6 shadow-md w-full max-w-sm" />
             <h2 className="text-2xl font-bold text-green-800">Welcome to AgriYield AI</h2>
             <p className="mt-2 text-gray-600 max-w-md">
               Enter your farm's details on the left to receive an AI-powered crop yield prediction and actionable recommendations to boost your harvest.
             </p>
           </div>
        )}
      </div>
    </div>
  );
};

export default PredictionPage;