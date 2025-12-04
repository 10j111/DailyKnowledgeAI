
import { GoogleGenAI, Type } from "@google/genai";
// import { db } from '../db';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateDailyInsights = async () => {
  console.log("Starting AI Insights Generation...");

  // 1. Get unprocessed raw articles from last 24h
  // const rawArticles = db.getUnprocessedArticles(); 
  // For demo, we assume rawArticles is a list of { title, description, url, source }
  
  const rawArticles = []; // Placeholder

  if (rawArticles.length === 0) {
    console.log("No new articles to process.");
    return [];
  }

  // 2. Construct Prompt
  const articlesText = rawArticles.map((a: any, i) => 
    `[${i}] Source: ${a.source_name}\nTitle: ${a.title}\nDesc: ${a.description}\nURL: ${a.url}`
  ).join("\n\n");

  const prompt = `
    You are an expert Chief Editor. 
    Review these raw articles and curate the "Daily Top 20" insights.
    
    Categories: World, Tech, AI, Business, Humanities, Ideas.
    
    Rules:
    - Select the most impactful news.
    - Provide a dense, 50-word summary for each.
    - Assign a relevance score (0-100).
    - Return strictly JSON.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: articlesText }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              raw_index: { type: Type.INTEGER, description: "Index of the article in provided list" },
              category: { type: Type.STRING, enum: ["World", "Tech", "AI", "Business", "Humanities", "Ideas"] },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              score: { type: Type.INTEGER }
            }
          }
        }
      }
    });

    const insights = JSON.parse(response.text || "[]");

    // 3. Write to DB
    console.log(`Generated ${insights.length} insights.`);
    for (const item of insights) {
      const original = rawArticles[item.raw_index];
      // db.insertDailyInsight({
      //   ...item,
      //   url: original.url,
      //   source_name: original.source_name
      // });
    }
    
    return insights;

  } catch (error) {
    console.error("AI Generation failed:", error);
    throw error;
  }
};
