
import { GoogleGenAI, Type } from "@google/genai";
import { DailyInsight, RawFeedItem, Category, WeeklyReview, NewsItem, Language } from "../types";

// Simple UUID polyfill
const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const apiKey = process.env.API_KEY;
const ai = new GoogleGenAI({ apiKey: apiKey || '' });

/**
 * Curates a batch of raw RSS items for a specific category.
 * Requirements:
 * - Select top 5 most impactful stories.
 * - Deduplicate.
 * - Summarize (2-3 lines).
 * - Categorize.
 * - STRICTLY preserve original URLs (no hallucination).
 */
export const curateCategoryByAI = async (rawItems: any[], category: Category): Promise<DailyInsight[]> => {
  if (!apiKey) {
    console.error("API Key missing");
    return [];
  }

  // Map input to a simplified format with ID to ensure URL mapping
  const inputMap = rawItems.map((item, index) => ({
    id: index,
    title: item.title,
    source: item.source,
    snippet: item.content.substring(0, 300) // Truncate to save tokens
  }));

  const feedsText = JSON.stringify(inputMap, null, 2);

  const prompt = `
    Role: Senior News Editor.
    Task: Curate the "Daily Top 5" digest for category: "${category}".
    
    Input: A JSON list of raw RSS items with IDs.
    
    Instructions:
    1. Analyze the items and select the top 5 most significant, unique stories.
    2. Deduplicate: If multiple sources report the same event, pick the best one.
    3. Summarize: Write a concise, 2-3 sentence summary (max 60 words) capturing the key insight.
    4. Language: Simplified Chinese (简体中文).
    5. CRITICAL: Return the "original_id" exactly as provided in the input. Do NOT invent URLs. I will map the URL back using this ID.
    
    Output Format: JSON Array.
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
              original_id: { type: Type.INTEGER, description: "The exact ID from the input JSON" },
              title: { type: Type.STRING, description: "Translated title if needed" },
              summary: { type: Type.STRING },
              score: { type: Type.INTEGER, description: "Importance score 0-100" }
            },
            required: ["original_id", "title", "summary", "score"]
          }
        }
      }
    });

    const data = JSON.parse(response.text || "[]");
    
    // Map back to original objects to ensure valid URLs
    const curated: DailyInsight[] = [];
    
    for (const item of data) {
      const original = rawItems[item.original_id];
      
      // If AI hallucinates an ID that doesn't exist, skip it
      if (!original) continue;

      curated.push({
        id: generateId(),
        date: new Date().toISOString().split('T')[0],
        title: item.title,
        summary: item.summary,
        category: category,
        url: original.url, // STRICT USE of original URL
        source_name: original.source,
        score: item.score,
        created_at: Date.now()
      });
    }

    return curated;

  } catch (error) {
    console.error(`Gemini Error for ${category}:`, error);
    return [];
  }
};

// --- Legacy / Client-Side Polyfills below ---

export const processDailyFeeds = async (rawItems: RawFeedItem[], lang: Language = 'zh-CN'): Promise<DailyInsight[]> => {
    // This method simulates the "Daily Fetch" button action in the browser preview.
    // It takes the Mock Data, processes it via Gemini (real API call), and returns insights.
    
    if (!apiKey) throw new Error("API Key is missing");

    const prompt = `
      You are an expert news aggregator.
      Process these raw simulated news items.
      
      Tasks:
      1. Analyze the items.
      2. Categorize them into: World, Tech, AI, Business, Humanities, Ideas.
      3. Summarize them (2 sentences, in ${lang === 'zh-CN' ? 'Simplified Chinese' : 'English'}).
      4. Assign a score (0-100).
      
      Input Data:
      ${JSON.stringify(rawItems)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
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
      
      // Map back to inputs
      return data.map((item: any, idx: number) => {
        // Fallback mapping if index is fuzzy, otherwise try to match original
        const original = rawItems[item.originalIndex] || rawItems[idx]; 
        return {
          id: generateId(),
          date: new Date().toISOString().split('T')[0],
          title: item.title,
          summary: item.summary,
          category: item.category as Category,
          url: original?.url || '#',
          source_name: original?.source || 'Simulation',
          score: item.score,
          created_at: Date.now()
        };
      });

    } catch (error) {
      console.error("Client Simulation Error:", error);
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
