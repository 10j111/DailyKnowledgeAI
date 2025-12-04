import { GoogleGenAI, Type } from "@google/genai";
import { DailyInsight, RawFeedItem, Category, WeeklyReview, NewsItem, Language } from "../types";

// Simple UUID polyfill
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

export const processDailyFeeds = async (rawItems: RawFeedItem[], lang: Language = 'zh-CN'): Promise<DailyInsight[]> => {
  if (!apiKey) throw new Error("API Key is missing");

  // Construct a prompt context
  const feedsText = rawItems.map((item, index) => 
    `Item ${index + 1}:\nTitle: ${item.title}\nContent: ${item.content}\nSource: ${item.source}\nURL: ${item.url}`
  ).join("\n\n");

  const langInstruction = lang === 'zh-CN' ? 'Please OUTPUT ALL TITLES AND SUMMARIES IN SIMPLIFIED CHINESE.' : 'Please OUTPUT ALL TITLES AND SUMMARIES IN ENGLISH.';

  const prompt = `
    You are an expert news editor. 
    Analyze the following raw news items. 
    Your tasks:
    1. Select the most important items.
    2. Classify them strictly into: World, Tech, AI, Business, Humanities, Ideas.
    3. Generate a concise, high-value summary (max 2 sentences).
    4. Assign a relevance score (1-100).
    5. Return a structured JSON.
    
    IMPORTANT: ${langInstruction}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: [
        { role: 'user', parts: [{ text: prompt }] },
        { role: 'user', parts: [{ text: feedsText }] }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              originalIndex: { type: Type.INTEGER },
              title: { type: Type.STRING },
              summary: { type: Type.STRING },
              category: { type: Type.STRING, enum: Object.values(Category) },
              score: { type: Type.INTEGER }
            },
            required: ["originalIndex", "title", "summary", "category", "score"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Map back to DailyInsight objects
    return data.map((item: any) => {
      const original = rawItems[item.originalIndex - 1];
      return {
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        title: item.title,
        summary: item.summary,
        category: item.category as Category,
        url: original?.url || '#',
        source_name: original?.source || 'Unknown',
        score: item.score,
        created_at: Date.now()
      };
    });

  } catch (error) {
    console.error("Gemini Processing Error:", error);
    throw error;
  }
};

export const generateWeeklyReview = async (bookmarks: NewsItem[], lang: Language = 'zh-CN'): Promise<WeeklyReview> => {
  if (!apiKey) throw new Error("API Key is missing");

  if (bookmarks.length === 0) {
    throw new Error("No bookmarks to review.");
  }

  const content = bookmarks.map(b => 
    `- [${b.category}] ${b.title}: ${b.summary}. User Notes: ${b.userNotes || "None"}`
  ).join("\n");

  const langInstruction = lang === 'zh-CN' ? 'Please OUTPUT IN SIMPLIFIED CHINESE.' : 'Please OUTPUT IN ENGLISH.';

  const prompt = `
    Based on the user's bookmarked articles this week, generate a "Weekly Review".
    
    Input Articles:
    ${content}

    Please provide:
    1. **Key Themes**: What topics did the user focus on?
    2. **Insights**: Synthesize the information into 1-2 deep insights.
    3. **Next Week**: Suggest 2-3 specific topics or questions they should explore next.

    IMPORTANT: ${langInstruction}
  `;

  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: {
        responseMimeType: "application/json",
        responseSchema: {
            type: Type.OBJECT,
            properties: {
                themes: { type: Type.STRING },
                insights: { type: Type.STRING },
                nextWeekSuggestions: { type: Type.STRING }
            }
        }
    }
  });

  const result = JSON.parse(response.text || "{}");

  return {
    id: generateId(),
    weekRange: "Current Week",
    themes: result.themes || "No themes identified.",
    insights: result.insights || "No insights generated.",
    nextWeekSuggestions: result.nextWeekSuggestions || "No suggestions.",
    createdAt: Date.now()
  };
};