import { Category, RawFeedItem } from './types';

// Updated for Cyber/Neon Aesthetic
// Each category now has a definition for the border color, shadow glow, and text accent.
export const CATEGORY_THEME: Record<Category, { badge: string, borderHover: string, shadowHover: string, text: string, icon: string }> = {
  [Category.World]: {
    badge: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    borderHover: 'group-hover:border-blue-500/50',
    shadowHover: 'group-hover:shadow-[0_0_30px_-5px_rgba(59,130,246,0.3)]',
    text: 'text-blue-400',
    icon: 'text-blue-500'
  },
  [Category.Tech]: {
    badge: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    borderHover: 'group-hover:border-cyan-500/50',
    shadowHover: 'group-hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.3)]',
    text: 'text-cyan-400',
    icon: 'text-cyan-500'
  },
  [Category.AI]: {
    badge: 'bg-violet-500/10 text-violet-400 border-violet-500/20',
    borderHover: 'group-hover:border-violet-500/50',
    shadowHover: 'group-hover:shadow-[0_0_30px_-5px_rgba(139,92,246,0.3)]',
    text: 'text-violet-400',
    icon: 'text-violet-500'
  },
  [Category.Business]: {
    badge: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    borderHover: 'group-hover:border-emerald-500/50',
    shadowHover: 'group-hover:shadow-[0_0_30px_-5px_rgba(16,185,129,0.3)]',
    text: 'text-emerald-400',
    icon: 'text-emerald-500'
  },
  [Category.Humanities]: {
    badge: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    borderHover: 'group-hover:border-amber-500/50',
    shadowHover: 'group-hover:shadow-[0_0_30px_-5px_rgba(245,158,11,0.3)]',
    text: 'text-amber-400',
    icon: 'text-amber-500'
  },
  [Category.Ideas]: {
    badge: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    borderHover: 'group-hover:border-rose-500/50',
    shadowHover: 'group-hover:shadow-[0_0_30px_-5px_rgba(244,63,94,0.3)]',
    text: 'text-rose-400',
    icon: 'text-rose-500'
  },
};

// Legacy support (optional, if needed by older code, but we try to replace)
export const CATEGORY_COLORS = {}; 

// Simulated Raw RSS Feed Data
export const MOCK_RAW_FEED: RawFeedItem[] = [
  {
    title: "Global Summit Reaches Climate Agreement",
    content: "Leaders from 190 nations agreed to cut emissions by 40% by 2030 in a historic pact signed in Geneva today. The agreement focuses on heavy industry and transport.",
    source: "Global News",
    url: "https://example.com/world1"
  },
  {
    title: "New Quantum Chip Breaks Speed Records",
    content: "Tech Giants unveiled a 500-qubit processor that solves complex logistics problems in seconds. This marks a significant milestone in quantum supremacy.",
    source: "TechDaily",
    url: "https://example.com/tech1"
  },
  {
    title: "AI Model Simulates Protein Folding with 99% Accuracy",
    content: "DeepMind's latest iteration has solved a 50-year biology challenge, predicting protein structures. This accelerates drug discovery significantly.",
    source: "AI Weekly",
    url: "https://example.com/ai1"
  },
  {
    title: "Markets Rally as Inflation Cools",
    content: "The S&P 500 hit a new high as the latest CPI report shows inflation dropping to 2.1%. Retail sector leads the growth.",
    source: "Finance Insider",
    url: "https://example.com/biz1"
  },
  {
    title: "Rediscovering Stoicism in Modern Management",
    content: "A look at how ancient philosophy is shaping modern CEO strategies. Marcus Aurelius helps leaders maintain calm under pressure.",
    source: "The Philosopher",
    url: "https://example.com/hum1"
  },
  {
    title: "The Rise of Micro-SaaS Solo Founders",
    content: "Why building small, niche software products is becoming the new path to financial freedom for developers. Less VC money, more profit.",
    source: "IndieHacker",
    url: "https://example.com/ideas1"
  },
  {
    title: "Generative Video Models enter Hollywood",
    content: "Studios are experimenting with AI generated backgrounds to cut costs. Unions are concerned about likeness rights.",
    source: "TechDaily",
    url: "https://example.com/ai2"
  }
];