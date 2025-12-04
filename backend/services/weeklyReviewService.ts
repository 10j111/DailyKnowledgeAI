
import { GoogleGenAI, Type } from "@google/genai";
// import { db } from '../db';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateWeeklyReviewBackend = async () => {
  console.log("Generating Weekly Review...");

  // 1. Fetch this week's collections and notes
  // const collections = db.getWeeklyCollections();
  
  const collections: any[] = []; // Placeholder

  if (collections.length === 0) return null;

  const context = collections.map(c => 
    `Title: ${c.title}\nCategory: ${c.category}\nUser Note: ${c.user_note || "None"}`
  ).join("\n---\n");

  const prompt = `
    Analyze the user's reading history for this week.
    Identify patterns, themes, and provide a thoughtful review.
    Suggest 3 topics for next week.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: context }] }
    ],
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                week_theme: { type: Type.STRING },
                insights: { type: Type.STRING },
                suggestions: { type: Type.STRING }
            }
        }
    }
  });

  const result = JSON.parse(response.text || "{}");
  
  // db.insertWeeklyReview(result);
  return result;
};
