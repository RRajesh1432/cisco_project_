export interface PredictionFormData {
  cropType: string;
  location: string;
  soilType: string;
  rainfall: number;
  temperature: number;
  pesticideUsage: boolean;
  fertilizerType: string;
  area: number;
}

export interface Recommendation {
  title: string;
  description: string;
  impact: 'High' | 'Medium' | 'Low';
  potentialYieldIncrease: number; // Percentage
}

export interface PredictionResult {
  predictedYield: number;
  yieldUnit: string;
  confidenceScore: number;
  summary: string;
  recommendations: Recommendation[];
  riskFactors: string[];
  weatherImpactAnalysis: string; // New field
}

export interface CropInfo {
  cropName: string;
  description: string;
  idealConditions: {
    soilType: string[];
    temperatureRange: string; // e.g., "15-25°C"
    annualRainfall: string; // e.g., "600-1200 mm"
  };
  commonPests: string[];
  growingCycle: string; // e.g., "90-120 days"
}

export interface HistoricalPrediction {
  id: string; // unique id, e.g., timestamp
  date: string;
  formData: PredictionFormData;
  result: PredictionResult;
}

export interface WeatherData {
  current: {
    temp: number;
    description: string;
    icon: string;
  };
  forecast: ForecastDay[];
}

export interface ForecastDay {
  date: string;
  temp_max: number;
  temp_min: number;
  description: string;
  icon: string;
}