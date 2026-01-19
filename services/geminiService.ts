
import { GoogleGenAI } from "@google/genai";
import { GlucoseEntry } from "../types";

export const getGlucoseInsights = async (entries: GlucoseEntry[]) => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const recentData = entries.slice(-5).map(e => ({
    val: e.value,
    status: e.mealStatus,
    level: e.level,
    time: e.timestamp.toISOString()
  }));

  const prompt = `
    Analyze the following recent blood glucose readings (mg/dL) for an individual:
    ${JSON.stringify(recentData)}
    
    Provide a concise analysis (under 150 words) including:
    1. Overall trend observation.
    2. Two actionable health tips based on these values.
    3. A clear medical disclaimer stating this is not professional medical advice.
    
    Format the response with Markdown for readability.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Insights Error:", error);
    return "Unable to generate insights at this time. Please consult your physician.";
  }
};
