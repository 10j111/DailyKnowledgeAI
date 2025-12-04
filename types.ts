export enum Category {
  World = 'World',
  Tech = 'Tech',
  AI = 'AI',
  Business = 'Business',
  Humanities = 'Humanities',
  Ideas = 'Ideas'
}

// DB Entity: daily_insights
export interface DailyInsight {
  id: string; // SQLite uses int, but we use string UUIDs in mock
  date: string;
  category: Category;
  title: string;
  summary: string;
  score?: number;
  url: string;
  source_name: string;
  created_at: number;
}

// DB Entity: collections
export interface CollectionItem {
  id: string;
  insight_id?: string;
  title: string;
  summary: string;
  url: string;
  category: Category;
  tags?: string[];
  created_at: number;
  user_note?: string; // Joined from 'notes' table in UI view
}

// DB Entity: weekly_reviews
export interface WeeklyReview {
  id: string;
  weekRange: string;
  themes: string;
  insights: string;
  nextWeekSuggestions: string;
  createdAt: number;
}

export type ViewState = 'dashboard' | 'bookmarks' | 'weekly';

// Mock Data Input Type
export interface RawFeedItem {
  title: string;
  content: string;
  source: string;
  url: string;
}

// Legacy support for UI components (Mapped from DailyInsight)
export interface NewsItem extends DailyInsight {
  isBookmarked: boolean;
  userNotes?: string;
}
