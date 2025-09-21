import { GoogleGenAI, Type } from "@google/genai";
import type { PredictionFormData, PredictionResult, CropInfo, WeatherData } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const predictionSchema = {
  type: Type.OBJECT,
  properties: {
    predictedYield: { type: Type.NUMBER, description: "Predicted yield in tons per hectare." },
    yieldUnit: { type: Type.STRING, description: "Unit of measurement for the yield, e.g., 'tons/hectare'." },
    confidenceScore: { type: Type.NUMBER, description: "A score from 0.0 to 1.0 indicating model confidence." },
    summary: { type: Type.STRING, description: "A brief, human-readable summary of the prediction." },
    weatherImpactAnalysis: { type: Type.STRING, description: "A detailed analysis of how the provided weather forecast might impact the crop yield."},
    recommendations: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          description: { type: Type.STRING },
          impact: { type: Type.STRING, enum: ['High', 'Medium', 'Low'] },
          potentialYieldIncrease: { type: Type.NUMBER, description: "Estimated percentage increase in yield." },
        },
        required: ["title", "description", "impact", "potentialYieldIncrease"],
      },
    },
    riskFactors: {
      type: Type.ARRAY,
      items: { type: Type.STRING, description: "Potential risks that could affect the yield." },
    },
  },
  required: ["predictedYield", "yieldUnit", "confidenceScore", "summary", "recommendations", "riskFactors", "weatherImpactAnalysis"],
};

const cropInfoSchema = {
    type: Type.OBJECT,
    properties: {
        cropName: { type: Type.STRING },
        description: { type: Type.STRING },
        idealConditions: {
            type: Type.OBJECT,
            properties: {
                soilType: { type: Type.ARRAY, items: { type: Type.STRING } },
                temperatureRange: { type: Type.STRING, description: "e.g., 15-25°C" },
                annualRainfall: { type: Type.STRING, description: "e.g., 600-1200 mm" },
            },
            required: ["soilType", "temperatureRange", "annualRainfall"],
        },
        commonPests: { type: Type.ARRAY, items: { type: Type.STRING } },
        growingCycle: { type: Type.STRING, description: "e.g., 90-120 days" },
    },
    required: ["cropName", "description", "idealConditions", "commonPests", "growingCycle"],
};


export const getPrediction = async (formData: PredictionFormData, weatherData?: WeatherData | null): Promise<PredictionResult> => {
  let weatherPromptSection = '';
  if (weatherData) {
    const forecastString = weatherData.forecast
        .map(day => `- ${day.date}: High ${day.temp_max}°C, Low ${day.temp_min}°C, ${day.description}`)
        .join('\n');
    weatherPromptSection = `
    Weather Forecast Data:
    - Current: ${weatherData.current.temp}°C, ${weatherData.current.description}
    - 5-Day Forecast:
${forecastString}
    
    **Analysis Task:**
    Based on the farm data AND the weather forecast, generate a prediction.
    Your response MUST include a 'weatherImpactAnalysis' section. This section should be a detailed commentary on how the provided weather (current and forecast) will specifically influence the crop's growth and predicted yield. Discuss potential risks like frost, heat stress, or disease from humidity, and any positive influences.
    `;
  } else {
    weatherPromptSection = `
    **Analysis Task:**
    Based on the farm data, generate a prediction. Since no weather data was provided, the 'weatherImpactAnalysis' should state that the prediction does not account for short-term weather events.
    `;
  }

  const prompt = `
    You are an expert agricultural scientist. Predict the crop yield and provide recommendations based on the following data.
    
    Farm Data:
    - Crop Type: ${formData.cropType}
    - Location: ${formData.location}
    - Soil Type: ${formData.soilType}
    - Annual Rainfall: ${formData.rainfall} mm
    - Average Temperature: ${formData.temperature}°C
    - Pesticide Usage: ${formData.pesticideUsage ? 'Yes' : 'No'}
    - Fertilizer Type: ${formData.fertilizerType}
    - Cultivation Area: ${formData.area} hectares

    ${weatherPromptSection}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: "You are an expert agricultural scientist and data analyst specializing in crop yield prediction. Your goal is to provide accurate yield estimates, actionable recommendations, and a detailed weather impact analysis based on the user's input. Provide your response in a structured JSON format.",
        responseMimeType: 'application/json',
        responseSchema: predictionSchema,
      },
    });

    const jsonText = response.text.trim();
    const parsedResult = JSON.parse(jsonText) as PredictionResult;
    return parsedResult;
  } catch (error) {
    console.error("Error calling Gemini API for prediction:", error);
    throw new Error("Failed to fetch prediction from AI model.");
  }
};

export const getCropInfo = async (cropName: string): Promise<CropInfo> => {
    const prompt = `Provide a detailed profile for the crop: ${cropName}. Include a general description, ideal growing conditions (soil types, temperature range, annual rainfall), common pests and diseases, and the typical growing cycle duration.`;

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an expert agricultural botanist. Provide concise, factual information about the requested crop in a structured JSON format.",
                responseMimeType: 'application/json',
                responseSchema: cropInfoSchema,
            },
        });

        const jsonText = response.text.trim();
        const parsedResult = JSON.parse(jsonText) as CropInfo;
        return parsedResult;
    } catch (error) {
        console.error(`Error calling Gemini API for crop info on ${cropName}:`, error);
        throw new Error("Failed to fetch crop information from AI model.");
    }
};