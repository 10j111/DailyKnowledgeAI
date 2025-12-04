
import Parser from 'rss-parser';
import { DatabaseManager } from '../db'; // Assuming db.ts exports this

// 1. Define Sources (In a real app, these come from the 'sources' table)
const DEFAULT_SOURCES = [
  { name: 'BBC World', url: 'http://feeds.bbci.co.uk/news/world/rss.xml', category: 'World' },
  { name: 'TechCrunch', url: 'https://techcrunch.com/feed/', category: 'Tech' },
  { name: 'The Verge', url: 'https://www.theverge.com/rss/index.xml', category: 'Tech' },
  { name: 'Hacker News', url: 'https://hnrss.org/frontpage', category: 'Tech' }
];

const parser = new Parser();
// const db = new DatabaseManager(); // In real app, import singleton instance

export const runRssFetcher = async () => {
  console.log('Starting RSS Fetcher...');
  
  let newArticlesCount = 0;

  for (const source of DEFAULT_SOURCES) {
    try {
      console.log(`Fetching ${source.name}...`);
      const feed = await parser.parseURL(source.url);
      
      for (const item of feed.items) {
        // In real app: db.insertRawArticle(...)
        // We simulate the DB logic here:
        
        // const exists = db.checkArticleExists(item.link);
        // if (!exists) {
        //   db.insertRawArticle({
        //     source_id: 1, // Look up actual ID
        //     title: item.title,
        //     description: item.contentSnippet || item.content,
        //     url: item.link,
        //     published_at: new Date(item.pubDate || Date.now()).getTime()
        //   });
        //   newArticlesCount++;
        // }
      }
    } catch (error) {
      console.error(`Error fetching ${source.name}:`, error);
    }
  }

  console.log(`RSS Fetch complete. ${newArticlesCount} new articles found.`);
  return newArticlesCount;
};
