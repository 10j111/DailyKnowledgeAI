
import { Category } from "../../src/types";

export interface FeedSource {
  source: string;
  rss_url: string;
}

export interface FeedCategoryConfig {
  category: Category;
  feeds: FeedSource[];
}

export const RSS_FEEDS: FeedCategoryConfig[] = [
  {
    category: Category.World,
    feeds: [
      { source: "Reuters World News", rss_url: "https://feeds.reuters.com/Reuters/worldNews" },
      { source: "BBC News World", rss_url: "http://feeds.bbci.co.uk/news/world/rss.xml" },
      { source: "CNN World News", rss_url: "http://rss.cnn.com/rss/edition_world.rss" }
    ]
  },
  {
    category: Category.Tech,
    feeds: [
      { source: "WIRED Tech", rss_url: "https://www.wired.com/feed/category/technology/latest/rss" },
      { source: "Ars Technica All News", rss_url: "https://arstechnica.com/rss-feeds/all-news" },
      { source: "Ars Technica Technology Lab", rss_url: "https://arstechnica.com/rss-feeds/technology-lab" }
    ]
  },
  {
    category: Category.AI,
    feeds: [
      { source: "WIRED AI", rss_url: "https://www.wired.com/category/artificial-intelligence/rss" },
      { source: "IEEE Spectrum AI", rss_url: "https://spectrum.ieee.org/feeds/topic/artificial-intelligence.rss" },
      { source: "Ars Technica AI", rss_url: "https://arstechnica.com/ai/feed/" }
    ]
  },
  {
    category: Category.Business,
    feeds: [
      { source: "Financial Times Business", rss_url: "http://www.ft.com/rss/world" },
      { source: "BBC News Business", rss_url: "http://feeds.bbci.co.uk/news/business/rss.xml" },
      { source: "CNN Business", rss_url: "http://rss.cnn.com/rss/edition_business.rss" }
    ]
  },
  {
    category: Category.Humanities,
    feeds: [
      { source: "WIRED Culture", rss_url: "https://www.wired.com/feed/category/culture/latest/rss" },
      { source: "BBC Entertainment & Arts", rss_url: "http://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml" },
      { source: "The Guardian Culture", rss_url: "https://www.theguardian.com/world/culture/rss" }
    ]
  },
  {
    category: Category.Ideas,
    feeds: [
      { source: "WIRED Ideas", rss_url: "https://www.wired.com/feed/category/ideas/latest/rss" },
      { source: "Medium Ideas", rss_url: "https://medium.com/feed/tag/ideas" },
      { source: "Aeon Magazine", rss_url: "https://aeon.co/feed" }
    ]
  }
];

