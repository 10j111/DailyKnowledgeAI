import { Category, RawFeedItem } from './types';

// Updated for "Airy / Apple Music" Aesthetic (Light Mode)
// Refined Palette: Soft Pastels with Gradients
export const CATEGORY_THEME: Record<Category, { bgGradient: string, accent: string, text: string, decoration: string, badge: string }> = {
  [Category.World]: {
    bgGradient: 'bg-gradient-to-br from-[#E0F2FE] to-[#F0F9FF]', // Sky Blue -> Pale Blue
    accent: 'bg-blue-500',
    text: 'text-blue-900',
    badge: 'text-blue-700 bg-blue-100/50',
    decoration: 'rounded-full'
  },
  [Category.Tech]: {
    bgGradient: 'bg-gradient-to-br from-[#D1FAE5] to-[#ECFDF5]', // Mint -> Emerald
    accent: 'bg-emerald-500',
    text: 'text-emerald-900',
    badge: 'text-emerald-700 bg-emerald-100/50',
    decoration: 'rounded-tl-3xl'
  },
  [Category.AI]: {
    bgGradient: 'bg-gradient-to-br from-[#F3E8FF] to-[#FAF5FF]', // Lavender -> Purple
    accent: 'bg-purple-500',
    text: 'text-purple-900',
    badge: 'text-purple-700 bg-purple-100/50',
    decoration: 'rounded-br-3xl'
  },
  [Category.Business]: {
    bgGradient: 'bg-gradient-to-br from-[#FEF3C7] to-[#FFFBEB]', // Soft Amber -> Cream
    accent: 'bg-amber-500',
    text: 'text-amber-900',
    badge: 'text-amber-700 bg-amber-100/50',
    decoration: 'rounded-tr-3xl'
  },
  [Category.Humanities]: {
    bgGradient: 'bg-gradient-to-br from-[#FFE4E6] to-[#FFF1F2]', // Rose -> Pink
    accent: 'bg-rose-500',
    text: 'text-rose-900',
    badge: 'text-rose-700 bg-rose-100/50',
    decoration: 'rounded-bl-3xl'
  },
  [Category.Ideas]: {
    bgGradient: 'bg-gradient-to-br from-[#E0E7FF] to-[#EEF2FF]', // Soft Indigo -> Periwinkle (Replaces Grey)
    accent: 'bg-indigo-500',
    text: 'text-indigo-900',
    badge: 'text-indigo-700 bg-indigo-100/50',
    decoration: 'rounded-full'
  },
};

// Legacy support
export const CATEGORY_COLORS = {}; 

// Simulated Raw RSS Feed Data (Chinese Version)
export const MOCK_RAW_FEED: RawFeedItem[] = [
  {
    title: "全球气候峰会达成历史性协议",
    content: "来自190个国家的领导人今天在日内瓦签署了一项历史性协议，同意到2030年将排放量减少40%。该协议重点关注重工业和交通运输领域。",
    source: "环球新闻",
    url: "https://example.com/world1"
  },
  {
    title: "新型量子芯片打破运算速度纪录",
    content: "科技巨头发布了一款500量子比特的处理器，能在几秒钟内解决复杂的物流问题。这标志着量子霸权的一个重要里程碑。",
    source: "科技日报",
    url: "https://example.com/tech1"
  },
  {
    title: "AI 模型模拟蛋白质折叠准确率达 99%",
    content: "DeepMind 的最新迭代版本解决了困扰生物学界50年的蛋白质结构预测难题。这将极大地加速新药研发进程。",
    source: "AI 前沿",
    url: "https://example.com/ai1"
  },
  {
    title: "通胀降温，全球市场迎来反弹",
    content: "最新的CPI报告显示通胀率降至2.1%，标普500指数创下新高。零售板块领涨。",
    source: "财经内参",
    url: "https://example.com/biz1"
  },
  {
    title: "在现代管理中重读斯多葛学派",
    content: "探讨古代哲学如何重塑现代CEO的决策策略。马可·奥勒留的思想帮助领导者在压力下保持冷静。",
    source: "哲思录",
    url: "https://example.com/hum1"
  },
  {
    title: "独立开发者的微型 SaaS 崛起之路",
    content: "为什么构建小众、细分的软件产品正成为开发者实现财务自由的新途径？更少的风投依赖，更多的利润。",
    source: "独立黑客",
    url: "https://example.com/ideas1"
  },
  {
    title: "生成式视频模型进军好莱坞",
    content: "电影制片厂正在尝试使用AI生成的背景来降低成本。工会对肖像权表示担忧。",
    source: "文娱早报",
    url: "https://example.com/ai2"
  }
];