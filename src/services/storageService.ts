import { DailyInsight, CollectionItem, WeeklyReview, NewsItem, Language } from "../types";

const KEYS = {
  INSIGHTS: 'dk_daily_insights',     // mimics 'daily_insights' table
  COLLECTIONS: 'dk_collections',     // mimics 'collections' table
  NOTES: 'dk_notes',                 // mimics 'notes' table
  REVIEWS: 'dk_weekly_reviews',      // mimics 'weekly_reviews' table
  SETTINGS: 'dk_settings'            // mimics 'settings' table
};

/**
 * StorageService
 * 
 * In the Electron app, this service would use `ipcRenderer.invoke()` to call 
 * the methods in `backend/db.ts`.
 * 
 * Here, it mimics the SQL relationships using LocalStorage.
 */
export const StorageService = {
  
  // --- Settings ---
  
  getLanguage: (): Language => {
    const settings = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
    return settings.language || 'zh-CN'; // Default to Chinese
  },

  setLanguage: (lang: Language) => {
    const settings = JSON.parse(localStorage.getItem(KEYS.SETTINGS) || '{}');
    settings.language = lang;
    localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
  },

  // --- Daily Insights (The Feed) ---

  saveDailyInsights: (insights: DailyInsight[]) => {
    // In SQL: INSERT INTO daily_insights...
    // We overwrite for demo simplicity, or append in real life
    localStorage.setItem(KEYS.INSIGHTS, JSON.stringify(insights));
  },

  getDailyInsights: (): DailyInsight[] => {
    const data = localStorage.getItem(KEYS.INSIGHTS);
    return data ? JSON.parse(data) : [];
  },

  // --- Collections (Bookmarks) ---

  getCollections: (): CollectionItem[] => {
    const data = localStorage.getItem(KEYS.COLLECTIONS);
    return data ? JSON.parse(data) : [];
  },

  addToCollection: (insight: DailyInsight) => {
    const collections = StorageService.getCollections();
    if (collections.find(c => c.insight_id === insight.id)) return; // Already exists

    const newItem: CollectionItem = {
      id: Math.random().toString(36).substring(2),
      insight_id: insight.id,
      title: insight.title,
      summary: insight.summary,
      url: insight.url,
      category: insight.category,
      created_at: Date.now(),
      tags: []
    };
    
    collections.push(newItem);
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(collections));
  },

  removeFromCollection: (insightId: string) => {
    const collections = StorageService.getCollections();
    const updated = collections.filter(c => c.insight_id !== insightId);
    localStorage.setItem(KEYS.COLLECTIONS, JSON.stringify(updated));
  },

  // --- Notes (Joined with Collections) ---

  updateNote: (collectionId: string, content: string) => {
    // In SQL: UPSERT INTO notes (collection_id, content)...
    const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');
    notes[collectionId] = content;
    localStorage.setItem(KEYS.NOTES, JSON.stringify(notes));
  },

  getNote: (collectionId: string): string | undefined => {
    const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');
    return notes[collectionId];
  },

  // --- Weekly Reviews ---

  getReviews: (): WeeklyReview[] => {
    const data = localStorage.getItem(KEYS.REVIEWS);
    return data ? JSON.parse(data) : [];
  },

  saveReview: (review: WeeklyReview) => {
    const reviews = StorageService.getReviews();
    reviews.unshift(review);
    localStorage.setItem(KEYS.REVIEWS, JSON.stringify(reviews));
  },

  // --- UI Helper: Join Tables ---
  
  /**
   * Returns Feed items combined with their Bookmark status and Notes.
   * This mimics a LEFT JOIN between daily_insights, collections, and notes.
   */
  getDashboardData: (): NewsItem[] => {
    const insights = StorageService.getDailyInsights();
    const collections = StorageService.getCollections();
    const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');

    // Create a map for fast lookup
    const collectionMap = new Map(collections.map(c => [c.insight_id, c]));

    return insights.map(item => {
      const collectionItem = collectionMap.get(item.id);
      return {
        ...item,
        isBookmarked: !!collectionItem,
        userNotes: collectionItem ? notes[collectionItem.id] : undefined
      };
    });
  },

  /**
   * Returns only Bookmarked items with Notes.
   */
  getBookmarksData: (): NewsItem[] => {
    const collections = StorageService.getCollections();
    const notes = JSON.parse(localStorage.getItem(KEYS.NOTES) || '{}');

    return collections.map(c => ({
      id: c.insight_id || c.id, // Fallback if manually added
      date: new Date(c.created_at).toISOString().split('T')[0],
      category: c.category,
      title: c.title,
      summary: c.summary,
      url: c.url,
      source_name: 'Saved',
      created_at: c.created_at,
      isBookmarked: true,
      userNotes: notes[c.id]
    }));
  }
};