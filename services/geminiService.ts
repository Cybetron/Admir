
import { GoogleGenAI, Type } from "@google/genai";
import { NewsItem, WeatherData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const fetchParisDashboardData = async (): Promise<{ news: NewsItem[], weather: WeatherData }> => {
  const model = 'gemini-3-flash-preview';

  // Step 1: Get the raw information using Google Search grounding
  const searchPrompt = `
    Find the following information for Paris, France:
    1. Current weather: temperature (Celsius), conditions, high/low, and humidity.
    2. Top 5 latest news stories from "Sortir à Paris" and general French news (e.g., Le Monde).
    Provide a detailed summary.
  `;

  try {
    const searchResponse = await ai.models.generateContent({
      model: model,
      contents: searchPrompt,
      config: {
        tools: [{ googleSearch: {} }],
      },
    });

    const rawBriefing = searchResponse.text || "";
    const groundingChunks = searchResponse.candidates?.[0]?.groundingMetadata?.groundingChunks || [];

    // Step 2: Use the model to convert that briefing into structured JSON
    // We don't use tools here so we can safely use responseSchema/JSON mode
    const extractionPrompt = `
      Extract the following information into JSON from this briefing:
      BRIEFING: "${rawBriefing.replace(/"/g, "'")}"
      
      JSON Structure:
      {
        "weather": { "temp": number, "condition": string, "high": number, "low": number, "humidity": number },
        "news": [ { "title": string, "source": string, "snippet": string } ]
      }
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
              required: ["temp", "condition", "high", "low", "humidity"],
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
                required: ["title", "source", "snippet"],
              },
            },
          },
          required: ["weather", "news"],
        },
      },
    });

    const data = JSON.parse(extractionResponse.text || "{}");

    // Map news with links from grounding chunks if possible, otherwise use fallback
    const news: NewsItem[] = (data.news || []).map((item: any, index: number) => ({
      ...item,
      url: groundingChunks[index]?.web?.uri || "https://www.google.com/search?q=" + encodeURIComponent(item.title),
    }));

    return { 
      news, 
      weather: data.weather || { temp: 0, condition: "Unknown", high: 0, low: 0, humidity: 0, description: "" } 
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};
