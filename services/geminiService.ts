import { GoogleGenAI } from "@google/genai";
import { GlucoseEntry } from "../types";

export const getGlucoseInsights = async (entries: GlucoseEntry[]) => {
  // Use the defined process.env.API_KEY from vite.config.ts
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    throw new Error("API Key is missing. Please ensure it's provided in your environment.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
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
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    throw error;
  }
};