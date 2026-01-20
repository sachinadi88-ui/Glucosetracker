import { GoogleGenAI } from "@google/genai";
import { GlucoseEntry } from "../types";

export const getGlucoseInsights = async (entries: GlucoseEntry[]): Promise<string> => {
  // Initialize GoogleGenAI directly using process.env.API_KEY as per the world-class guidelines.
  // The API key is injected by Vite's define plugin during the build process.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
  
  const recentData = entries.slice(-10).map(e => ({
    val: e.value,
    status: e.mealStatus,
    level: e.level,
    time: e.timestamp.toISOString()
  }));

  const prompt = `
    Analyze these blood glucose readings (mg/dL) for an individual:
    ${JSON.stringify(recentData)}
    
    Instructions:
    - Provide a short, professional trend analysis.
    - Give exactly 3 actionable, evidence-based health tips.
    - Use bullet points.
    - You MUST include this specific text at the end: "DISCLAIMER: This is an AI-generated summary for educational purposes. This is not medical advice. Consult a doctor for personalized care."
    - Be encouraging but cautious.
    - Maximum length: 180 words.
  `;

  try {
    // Call generateContent using the correct model and prompt structure.
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    
    // Access the text property directly (not a method call) as specified in the guidelines.
    return response.text || '';
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    throw error;
  }
};