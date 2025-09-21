import { WeatherData } from '../types';

const FROST_TEMP = 2; // Celsius
const HEATWAVE_TEMP = 35; // Celsius
const STORM_KEYWORDS = ['storm', 'thunderstorm', 'hurricane', 'tornado', 'heavy rain'];

/**
 * Analyzes weather data to identify potential risks for crops.
 * @param weatherData The weather data object containing a 5-day forecast.
 * @returns An array of string messages describing any detected weather alerts.
 */
export const checkWeatherAlerts = (weatherData: WeatherData | null): string[] => {
  if (!weatherData) {
    return [];
  }

  const alerts: string[] = [];
  const uniqueAlerts = new Set<string>();

  const frostDays: string[] = [];
  const heatwaveDays: string[] = [];
  const stormDays: { day: string, desc: string }[] = [];

  weatherData.forecast.forEach(day => {
    // Check for frost risk
    if (day.temp_min <= FROST_TEMP) {
      frostDays.push(day.date.split(',')[0]);
    }

    // Check for heatwave risk
    if (day.temp_max >= HEATWAVE_TEMP) {
      heatwaveDays.push(day.date.split(',')[0]);
    }

    // Check for storms
    const descriptionLower = day.description.toLowerCase();
    if (STORM_KEYWORDS.some(keyword => descriptionLower.includes(keyword))) {
      stormDays.push({ day: day.date.split(',')[0], desc: day.description });
    }
  });

  if (frostDays.length > 0) {
    uniqueAlerts.add(`Frost Risk: Low temperatures below ${FROST_TEMP}°C expected on ${frostDays.join(', ')}.`);
  }

  if (heatwaveDays.length > 0) {
    uniqueAlerts.add(`Heatwave Warning: High temperatures above ${HEATWAVE_TEMP}°C expected on ${heatwaveDays.join(', ')}.`);
  }
  
  if (stormDays.length > 0) {
      const stormDescription = stormDays.map(s => `${s.desc} on ${s.day}`).join('; ');
      uniqueAlerts.add(`Severe Weather: Potential storms forecasted. (${stormDescription})`);
  }


  return Array.from(uniqueAlerts);
};
