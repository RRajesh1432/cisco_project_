import { PredictionFormData, PredictionResult, HistoricalPrediction } from '../types';

const HISTORY_KEY = 'agriYieldHistory';

export const getHistory = (): HistoricalPrediction[] => {
  try {
    const historyJson = localStorage.getItem(HISTORY_KEY);
    return historyJson ? JSON.parse(historyJson) : [];
  } catch (error) {
    console.error("Failed to parse history from localStorage", error);
    return [];
  }
};

export const savePrediction = (formData: PredictionFormData, result: PredictionResult): void => {
  const history = getHistory();
  const newPrediction: HistoricalPrediction = {
    id: Date.now().toString(),
    date: new Date().toISOString(),
    formData,
    result,
  };
  
  // Add new prediction to the beginning of the array
  const updatedHistory = [newPrediction, ...history];
  
  try {
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updatedHistory));
  } catch (error) {
    console.error("Failed to save prediction to localStorage", error);
  }
};

export const clearHistory = (): void => {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (error) {
    console.error("Failed to clear history from localStorage", error);
  }
};
