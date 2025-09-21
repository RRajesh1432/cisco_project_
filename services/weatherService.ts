import { WeatherData, ForecastDay } from '../types';

const API_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

if (!API_KEY) {
  console.warn("OPENWEATHER_API_KEY environment variable not set. Weather feature will be disabled.");
}

const processForecastData = (apiResponse: any): WeatherData => {
  const dailyForecasts: { [key: string]: any[] } = {};

  // Group forecast entries by day
  apiResponse.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toISOString().split('T')[0];
    if (!dailyForecasts[date]) {
      dailyForecasts[date] = [];
    }
    dailyForecasts[date].push(item);
  });
  
  const forecast: ForecastDay[] = Object.entries(dailyForecasts).slice(0, 5).map(([date, items]) => {
      const temps = items.map(i => i.main.temp);
      const weather = items.reduce((acc, i) => {
          acc[i.weather[0].description] = (acc[i.weather[0].description] || 0) + 1;
          return acc;
      }, {} as Record<string, number>);

      const mostCommonWeather = Object.keys(weather).reduce((a, b) => weather[a] > weather[b] ? a : b);
      const icon = items.find(i => i.weather[0].description === mostCommonWeather)?.weather[0].icon || items[0].weather[0].icon;

      return {
          date: new Date(date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }),
          temp_max: Math.round(Math.max(...temps)),
          temp_min: Math.round(Math.min(...temps)),
          description: mostCommonWeather,
          icon,
      };
  });

  const current = {
      temp: Math.round(apiResponse.list[0].main.temp),
      description: apiResponse.list[0].weather[0].description,
      icon: apiResponse.list[0].weather[0].icon,
  };
  
  return { current, forecast };
};

export const getWeather = async (location: { type: 'coords', value: string } | { type: 'text', value: string }): Promise<WeatherData> => {
  if (!API_KEY) {
    throw new Error("Weather API key is not configured.");
  }
  
  let url = '';
  if (location.type === 'coords') {
    const [lat, lon] = location.value.split(',');
    url = `${BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`;
  } else {
    url = `${BASE_URL}/forecast?q=${encodeURIComponent(location.value)}&appid=${API_KEY}&units=metric`;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Weather API request failed with status ${response.status}`);
    }
    const data = await response.json();
    if (data.cod !== "200") {
        throw new Error(`Weather API error: ${data.message}`);
    }
    return processForecastData(data);
  } catch (error) {
    console.error("Error fetching weather data:", error);
    throw new Error("Failed to fetch weather data.");
  }
};