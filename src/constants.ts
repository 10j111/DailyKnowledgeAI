import { Category, RawFeedItem } from './types';

// Updated for "Bento Dark" Aesthetic (Reference Image)
// Solid matte colors. Some dark with white text, some pastel with black text.
export const CATEGORY_THEME: Record<Category, { bg: string, text: string, accent: string, badge: string, iconColor: string }> = {
  // Style: The "Lavender" card in the image
  [Category.Tech]: {
    bg: 'bg-[#C4B5FD]', // Lavender
    text: 'text-[#111111]',
    accent: 'bg-white/40',
    badge: 'bg-black/10 text-black border-black/5',
    iconColor: 'text-black'
  },
  // Style: The "Yellow" card in the image (or similar vibrant accent)
  [Category.AI]: {
    bg: 'bg-[#FDE047]', // Yellow
    text: 'text-[#111111]',
    accent: 'bg-black/10',
    badge: 'bg-black/10 text-black border-black/5',
    iconColor: 'text-black'
  },
  // Style: Dark Grey Card (Standard Bento Block)
  [Category.World]: {
    bg: 'bg-[#27272A]', // Zinc 800
    text: 'text-white',
    accent: 'bg-white/10',
    badge: 'bg-white/10 text-zinc-300 border-white/5',
    iconColor: 'text-zinc-400'
  },
  // Style: The "Earthy/Brown" card in the image
  [Category.Business]: {
    bg: 'bg-[#A67C52]', // Earthy Brown
    text: 'text-white',
    accent: 'bg-black/20',
    badge: 'bg-black/20 text-white/90 border-white/10',
    iconColor: 'text-white'
  },
  // Style: Soft White/Grey card
  [Category.Humanities]: {
    bg: 'bg-[#F4F4F5]', // Zinc 100
    text: 'text-[#111111]',
    accent: 'bg-black/5',
    badge: 'bg-black/5 text-zinc-600 border-black/5',
    iconColor: 'text-zinc-500'
  },
  // Style: Dark Blue/Black card
  [Category.Ideas]: {
    bg: 'bg-[#18181B]', // Zinc 900
    text: 'text-white',
    accent: 'bg-white/10',
    badge: 'bg-white/10 text-zinc-400 border-white/5',
    iconColor: 'text-zinc-400'
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