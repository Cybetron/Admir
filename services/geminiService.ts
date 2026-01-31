
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchParisDashboardData = async (): Promise<{ news: NewsItem[], weather: WeatherData }> => {
  const model = 'gemini-3-flash-preview';

  // We perform a grounded search first
  const searchPrompt = `
    Search for the CURRENT real-time weather in Paris, France right now. 
    I need: exact temperature in Celsius, current sky conditions (e.g. Sunny, Overcast, Light Rain), today's High and Low temperatures, and Humidity percentage.
    Also find the top 5 trending news headlines from "Sortir à Paris" and "Le Monde" specifically for today.
  `;

  try {
    const searchResponse = await ai.models.generateContent({
      model: model,
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const searchContext = searchResponse.text || "No data found";
    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Second pass: Precise JSON extraction
    const extractionPrompt = `
      Based on this research data: "${searchContext.replace(/"/g, "'")}"
      Convert it into a valid JSON object.
      
      Schema:
      {
        "weather": {
          "temp": number,
          "condition": "string (e.g. Sunny, Partly Cloudy, Rain)",
          "high": number,
          "low": number,
          "humidity": number
        },
        "news": [
          { "title": "string", "source": "string", "snippet": "string" }
        ]
      }
      
      Ensure "temp" is a number representing current Celsius.
    `;

    const extractionResponse = await ai.models.generateContent({
      model: model,
      contents: extractionPrompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            weather: {
              type: Type.OBJECT,
              properties: {
                temp: { type: Type.NUMBER },
                condition: { type: Type.STRING },
                high: { type: Type.NUMBER },
                low: { type: Type.NUMBER },
                humidity: { type: Type.NUMBER },
              },
              required: ["temp", "condition", "high", "low", "humidity"]
            },
            news: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  title: { type: Type.STRING },
                  source: { type: Type.STRING },
                  snippet: { type: Type.STRING },
                },
                required: ["title", "source", "snippet"]
              }
            }
          },
          required: ["weather", "news"]
        }
      },
    });

    const data = JSON.parse(extractionResponse.text || "{}");

    const news: NewsItem[] = (data.news || []).map((item: any, index: number) => ({
      ...item,
      url: groundingChunks[index]?.web?.uri || "https://www.google.com/search?q=" + encodeURIComponent(item.title)
    }));

    return { 
      news, 
      weather: data.weather || { temp: 0, condition: "Unknown", high: 0, low: 0, humidity: 0, description: "" } 
    };
  } catch (error) {
    console.error("Dashboard Sync Error:", error);
    throw error;
  }
};
