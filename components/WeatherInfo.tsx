import React from 'react';
import { WeatherData } from '../types';
import LoadingSpinner from './LoadingSpinner';

interface WeatherInfoProps {
  data: WeatherData | null;
  isLoading: boolean;
  error: string | null;
}

const WeatherInfo: React.FC<WeatherInfoProps> = ({ data, isLoading, error }) => {
  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-2 text-sm text-gray-600">Fetching Weather...</p>
        </div>
      );
    }

    if (error) {
      return <div className="p-4 text-center text-red-600 bg-red-50 rounded-lg">{error}</div>;
    }

    if (!data) {
      return (
        <div className="p-4 text-center text-gray-500">
            <p>Enter a location to see the weather forecast.</p>
        </div>
      );
    }

    return (
      <div className="p-4 animate-fade-in">
        <div className="flex items-center justify-between mb-4">
            <div>
                <p className="text-gray-600">Current Weather</p>
                <p className="text-4xl font-bold text-gray-800">{data.current.temp}°C</p>
                <p className="text-gray-600 capitalize">{data.current.description}</p>
            </div>
            <img 
                src={`https://openweathermap.org/img/wn/${data.current.icon}@2x.png`} 
                alt={data.current.description}
                className="w-20 h-20"
            />
        </div>
        <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2 border-t pt-2">5-Day Forecast</h4>
            <div className="grid grid-cols-5 gap-2 text-center">
                {data.forecast.map(day => (
                    <div key={day.date} className="bg-gray-100 p-2 rounded-lg">
                        <p className="text-xs font-bold text-gray-800">{day.date.split(',')[0]}</p>
                         <img 
                            src={`https://openweathermap.org/img/wn/${day.icon}.png`} 
                            alt={day.description}
                            className="w-10 h-10 mx-auto"
                        />
                        <p className="text-sm font-semibold">{day.temp_max}°</p>
                        <p className="text-xs text-gray-500">{day.temp_min}°</p>
                    </div>
                ))}
            </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white p-2 rounded-xl shadow-lg">
      <h3 className="text-lg font-bold text-gray-800 p-4 border-b">Weather Outlook</h3>
      {renderContent()}
    </div>
  );
};

export default WeatherInfo;