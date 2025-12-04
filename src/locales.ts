import { Language } from "./types";

type Dictionary = Record<string, string>;

export const en: Dictionary = {
  // Sidebar
  "app.title": "Daily",
  "app.subtitle": "Knowledge",
  "app.system_status": "SYSTEM V1.2 • ONLINE",
  "nav.dashboard": "Today's Feed",
  "nav.bookmarks": "My Library",
  "nav.weekly": "Weekly Synthesis",
  "btn.syncing": "SYNCING...",
  "btn.fetch": "FETCH INTEL",
  "btn.processing": "Processing Feeds...",
  "btn.fetch_latest": "Fetch Latest",
  
  // Header
  "header.dashboard.title": "Today's Insights",
  "header.dashboard.desc": "AI-curated summary of the world's most important developments across 6 key dimensions.",
  "header.bookmarks.title": "Knowledge Library",
  "header.bookmarks.desc": "Your personal collection of saved insights and notes. These form the basis of your weekly review.",
  "header.weekly.title": "Weekly Synthesis",
  "header.weekly.desc": "Deep learning happens through reflection. Gemini analyzes your library to surface patterns and future directions.",

  // Empty States
  "empty.dashboard.title": "System Idle. No data available.",
  "empty.dashboard.action": "Initiate Fetch Sequence",
  "empty.dashboard_box.title": "Your daily feed is empty",
  "empty.dashboard_box.desc": "Start your morning by fetching the latest insights.",
  "empty.dashboard_box.btn": "Fetch Now",
  "empty.bookmarks": "Library Empty.",
  "empty.bookmarks_detailed": "No bookmarks yet.",
  "empty.bookmarks_action": "Go to Dashboard",
  "empty.weekly": "No synthesis available",
  "empty.weekly_desc": "Collect insights throughout the week by bookmarking interesting articles, then generate your personalized review.",

  // Cards
  "card.read_more": "Read Source",
  "card.save_note": "Save Note",
  "card.cancel": "Cancel",
  "card.add_note": "Add personal insight...",
  "card.placeholder_note": "Add a note...",

  // Weekly Review
  "review.analyzing": "Analyzing...",
  "review.generate": "Generate Review",
  "review.scope": "Analysis Scope",
  "review.themes": "Core Themes",
  "review.insights": "Strategic Insights",
  "review.suggestions": "Next Week's Focus",
  "review.footer": "POWERED BY GEMINI 2.5",

  // Notification
  "notify.title": "Daily Knowledge",
  "notify.message": "Today's insights are ready",
  "notify.sub": "new insights summarized",

  // Categories
  "cat.World": "World",
  "cat.Tech": "Tech",
  "cat.AI": "AI",
  "cat.Business": "Business",
  "cat.Humanities": "Humanities",
  "cat.Ideas": "Ideas"
};

export const zhCN: Dictionary = {
  // Sidebar
  "app.title": "每日",
  "app.subtitle": "新知",
  "app.system_status": "系统 V1.2 • 在线",
  "nav.dashboard": "今日精选",
  "nav.bookmarks": "我的收藏",
  "nav.weekly": "周度回顾",
  "btn.syncing": "同步中...",
  "btn.fetch": "获取资讯",
  "btn.processing": "处理订阅源...",
  "btn.fetch_latest": "获取最新",

  // Header
  "header.dashboard.title": "今日洞察",
  "header.dashboard.desc": "AI 精选全球 6 大维度最重要的发展动态。",
  "header.bookmarks.title": "知识库",
  "header.bookmarks.desc": "您的个人收藏与笔记。这些是生成周度回顾的基础。",
  "header.weekly.title": "深度合成",
  "header.weekly.desc": "反思带来深度。Gemini 分析您的知识库，提炼模式并指引未来方向。",

  // Empty States
  "empty.dashboard.title": "系统待机。无数据。",
  "empty.dashboard.action": "启动获取程序",
  "empty.dashboard_box.title": "今日订阅为空",
  "empty.dashboard_box.desc": "从获取最新资讯开始您的早晨。",
  "empty.dashboard_box.btn": "立即获取",
  "empty.bookmarks": "知识库为空",
  "empty.bookmarks_detailed": "暂无收藏",
  "empty.bookmarks_action": "前往首页",
  "empty.weekly": "暂无周报",
  "empty.weekly_desc": "本周通过收藏感兴趣的文章来积累素材，然后生成您的专属回顾。",

  // Cards
  "card.read_more": "阅读原文",
  "card.save_note": "保存笔记",
  "card.cancel": "取消",
  "card.add_note": "添加个人见解...",
  "card.placeholder_note": "添加笔记...",

  // Weekly Review
  "review.analyzing": "分析中...",
  "review.generate": "生成周报",
  "review.scope": "分析范围",
  "review.themes": "核心主题",
  "review.insights": "战略洞察",
  "review.suggestions": "下周关注",
  "review.footer": "由 GEMINI 2.5 驱动",

  // Notification
  "notify.title": "每日新知",
  "notify.message": "今日精选已更新",
  "notify.sub": "条新资讯已摘要",

  // Categories
  "cat.World": "世界大事",
  "cat.Tech": "科技前沿",
  "cat.AI": "AI 动态",
  "cat.Business": "商业经济",
  "cat.Humanities": "人文经典",
  "cat.Ideas": "创新思考"
};

export const dictionaries: Record<Language, Dictionary> = {
  'en': en,
  'zh-CN': zhCN
};