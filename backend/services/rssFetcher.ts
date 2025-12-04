
import Parser from 'rss-parser';
import fs from 'fs';
import path from 'path';
import { RSS_FEEDS } from '../config/feeds';
import { curateCategoryByAI } from '../../src/services/geminiService';
import { DailyInsight } from '../../src/types';

const parser = new Parser({
  timeout: 5000, // 5s timeout per feed
  headers: { 'User-Agent': 'DailyKnowledgeBot/1.0' }
});

export const runDailyFetch = async (): Promise<DailyInsight[]> => {
  console.log(`[${new Date().toISOString()}] Starting Daily RSS Fetch Task...`);
  
  // Directory for daily JSON files - MOVED INSIDE FUNCTION
  const DATA_DIR = path.join(process.cwd(), 'data');
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  
  const allInsights: DailyInsight[] = [];
  const errors: string[] = [];

  // 1. Iterate through each category defined in JSON config
  for (const group of RSS_FEEDS) {
    const rawCandidates: any[] = [];
    console.log(`Processing Category: ${group.category}...`);

    // 2. Fetch Feeds for this category
    for (const feed of group.feeds) {
      try {
        console.log(`  Fetching: ${feed.source} (${feed.rss_url})`);
        const feedResult = await parser.parseURL(feed.rss_url);
        
        // Requirement: Take max 3 items per source
        const latestItems = feedResult.items.slice(0, 3).map(item => ({
          title: item.title?.trim() || 'No Title',
          content: (item.contentSnippet || item.content || '').trim(),
          url: item.link || '',
          source: feed.source,
          pubDate: item.pubDate
        }));

        // Basic validation
        const validItems = latestItems.filter(i => i.url && i.url.startsWith('http'));
        rawCandidates.push(...validItems);

      } catch (err: any) {
        // Requirement: Log error, do not generate fake content
        const errorMsg = `[${group.category}] Failed to fetch ${feed.source}: ${err.message}`;
        console.error(errorMsg);
        errors.push(errorMsg);
      }
    }

    if (rawCandidates.length === 0) {
      console.warn(`  No valid articles found for ${group.category}. Skipping.`);
      continue;
    }

    // Deduplicate by title locally before sending to AI to save tokens
    const uniqueCandidates = Array.from(new Map(rawCandidates.map(item => [item.title, item])).values());

    // 3. Send to AI for Curation 
    // Requirement: Generate up to 5 digest articles per category
    try {
      console.log(`  Sending ${uniqueCandidates.length} items to AI for curation...`);
      const curatedInsights = await curateCategoryByAI(uniqueCandidates, group.category);
      allInsights.push(...curatedInsights);
      console.log(`  > AI selected ${curatedInsights.length} highlights.`);
    } catch (err) {
      console.error(`  AI Curation failed for ${group.category}:`, err);
      errors.push(`AI Error ${group.category}: ${err}`);
    }
  }

  // 4. Save to JSON File (daily_summaries_YYYY-MM-DD.json)
  const dateStr = new Date().toISOString().split('T')[0];
  const filename = `daily_summaries_${dateStr}.json`;
  const filePath = path.join(DATA_DIR, filename);

  const fileOutput = {
    date: dateStr,
    generated_at: new Date().toISOString(),
    total_count: allInsights.length,
    errors: errors,
    data: allInsights
  };

  try {
    fs.writeFileSync(filePath, JSON.stringify(fileOutput, null, 2));
    console.log(`[SUCCESS] Saved ${allInsights.length} insights to ${filePath}`);
  } catch (e) {
    console.error("Failed to write JSON file:", e);
  }

  return allInsights;
};
