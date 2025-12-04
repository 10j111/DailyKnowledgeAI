import React, { useEffect, useState, useMemo } from 'react';
import { Category, NewsItem, ViewState, WeeklyReview } from './types';
import { MOCK_RAW_FEED, CATEGORY_THEME } from './constants';
import { processDailyFeeds, generateWeeklyReview } from './services/geminiService';
import { StorageService } from './services/storageService';
import NewsCard from './components/NewsCard';
import WeeklyReviewView from './components/WeeklyReviewView';
import FloatingNotification from './components/FloatingNotification';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('dashboard');
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [latestReview, setLatestReview] = useState<WeeklyReview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);

  const isFloatingMode = window.location.search.includes('mode=floating');

  useEffect(() => {
    refreshData();
    const savedReviews = StorageService.getReviews();
    if (savedReviews.length > 0) setLatestReview(savedReviews[0]);
    setTimeout(() => {
        const currentData = StorageService.getDailyInsights();
        if (!isFloatingMode && currentData.length === 0) setNotificationVisible(true);
    }, 1500);
  }, [isFloatingMode]);

  useEffect(() => {
    refreshData();
  }, [view]);

  const refreshData = () => {
    if (view === 'bookmarks') {
      setArticles(StorageService.getBookmarksData());
    } else {
      setArticles(StorageService.getDashboardData());
    }
  };

  const handleFetchDaily = async () => {
    setIsLoading(true);
    setNotificationVisible(false); 
    try {
      const processedItems = await processDailyFeeds(MOCK_RAW_FEED);
      StorageService.saveDailyInsights(processedItems);
      refreshData();
      setView('dashboard');
    } catch (error) {
      console.error(error);
      alert("Failed to fetch. Check API Key.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReview = async () => {
    setIsLoading(true);
    try {
      const bookmarks = StorageService.getBookmarksData();
      const review = await generateWeeklyReview(bookmarks);
      StorageService.saveReview(review);
      setLatestReview(review);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleBookmark = (id: string) => {
    const item = articles.find(a => a.id === id);
    if (!item) return;
    if (item.isBookmarked) {
      StorageService.removeFromCollection(id);
    } else {
      const insight = StorageService.getDailyInsights().find(i => i.id === id);
      if (insight) StorageService.addToCollection(insight);
    }
    refreshData();
  };

  const updateNote = (id: string, note: string) => {
    const collections = StorageService.getCollections();
    const collection = collections.find(c => c.insight_id === id) || collections.find(c => c.id === id);
    if (collection) {
        StorageService.updateNote(collection.id, note);
        refreshData();
    }
  };

  if (isFloatingMode) {
    return (
        <div className="h-screen w-screen bg-transparent flex items-center justify-center p-4">
            <FloatingNotification 
                count={5} 
                onOpen={() => console.log("Open")}
                onDismiss={() => window.close()}
                />
        </div>
    )
  }

  const categorizedArticles = useMemo(() => {
    const grouped: Record<string, NewsItem[]> = {};
    Object.values(Category).forEach(c => grouped[c as string] = []);
    articles.forEach(a => {
        if(grouped[a.category]) grouped[a.category].push(a);
    });
    return grouped;
  }, [articles]);

  const NavButton = ({ id, label, icon }: { id: ViewState, label: string, icon: React.ReactNode }) => (
    <button 
        onClick={() => setView(id)}
        className={`
            w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200
            ${view === id 
                ? 'bg-white text-black shadow-[0_0_20px_rgba(255,255,255,0.2)] scale-105' 
                : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/5'}
        `}
    >
        {icon}
        <span>{label}</span>
    </button>
  );

  return (
    <div className="flex h-screen font-sans overflow-hidden selection:bg-indigo-500/30 text-zinc-100">
      
      {/* Background Ambience */}
      <div className="aurora-bg" />

      {notificationVisible && (
          <FloatingNotification 
            count={MOCK_RAW_FEED.length} 
            onOpen={handleFetchDaily} 
            onDismiss={() => setNotificationVisible(false)} 
          />
      )}

      {/* Sidebar - Arc Style */}
      <aside className="w-[280px] flex flex-col p-4 z-10">
        <div className="glass-panel h-full rounded-3xl flex flex-col p-6 shadow-2xl">
            {/* Branding */}
            <div className="mb-10 pl-2">
                <div className="flex items-center space-x-3 mb-1">
                    <div className="w-3 h-3 bg-indigo-500 rounded-full animate-pulse-slow shadow-[0_0_10px_currentColor]" />
                    <h1 className="text-xl font-bold tracking-tight text-white">Daily<span className="text-zinc-500">Knowledge</span></h1>
                </div>
                <p className="text-[10px] text-zinc-600 font-mono pl-6">SYSTEM V1.2 • ONLINE</p>
            </div>

            {/* Navigation */}
            <nav className="space-y-2 flex-1">
                <NavButton 
                    id="dashboard" 
                    label="Today's Feed" 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>}
                />
                <NavButton 
                    id="bookmarks" 
                    label="My Library" 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>}
                />
                <NavButton 
                    id="weekly" 
                    label="Weekly Synthesis" 
                    icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" /></svg>}
                />
            </nav>

            {/* Fetch Action */}
            <div className="pt-6 border-t border-white/5">
                <button 
                    onClick={handleFetchDaily}
                    disabled={isLoading}
                    className="w-full group relative h-10 bg-zinc-800 rounded-xl overflow-hidden disabled:opacity-50"
                >
                    <div className={`absolute inset-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 w-[200%] transition-transform duration-[2s] linear ${isLoading ? 'animate-[spin_4s_linear_infinite] translate-x-0' : 'translate-x-full group-hover:translate-x-0'}`} />
                    <div className="absolute inset-[1px] bg-zinc-900 rounded-[10px] flex items-center justify-center">
                        <span className="text-xs font-bold text-white relative z-10 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:to-purple-400 transition-all">
                            {isLoading && view !== 'weekly' ? 'SYNCING...' : 'FETCH INTEL'}
                        </span>
                    </div>
                </button>
            </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 h-screen overflow-y-auto z-0 scroll-smooth">
        <div className="max-w-[1600px] mx-auto p-12 pb-32">
            
            {/* Page Header */}
            <header className="mb-12 animate-fade-in pl-2">
                <h2 className="text-4xl font-bold text-white mb-2 tracking-tighter">
                    {view === 'dashboard' && 'Daily Intelligence'}
                    {view === 'bookmarks' && 'Knowledge Base'}
                    {view === 'weekly' && 'Deep Synthesis'}
                </h2>
                <div className="h-0.5 w-12 bg-white/20 rounded-full" />
            </header>

            {/* Content Switcher */}
            {view === 'dashboard' && (
                <div className="space-y-12">
                     {articles.length === 0 && !isLoading && (
                        <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-3xl border-dashed border-zinc-800">
                            <p className="text-zinc-400 text-lg">System Idle. No data available.</p>
                            <button onClick={handleFetchDaily} className="mt-4 text-indigo-400 hover:text-white transition-colors text-sm underline underline-offset-4">Initiate Fetch Sequence</button>
                        </div>
                     )}

                     {/* Render Categories */}
                     {Object.values(Category).map((category, idx) => {
                         const categoryItems = categorizedArticles[category];
                         if (categoryItems.length === 0) return null;
                         const theme = CATEGORY_THEME[category as Category];
                         
                         return (
                            <section key={category} className="animate-fade-in-up" style={{animationDelay: `${idx * 100}ms`}}>
                                <div className="flex items-center space-x-3 mb-6 pl-2">
                                    <h3 className={`text-sm font-bold uppercase tracking-[0.2em] ${theme.text}`}>
                                        {category}
                                    </h3>
                                    <div className="h-px bg-zinc-800 flex-1" />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
                                    {categoryItems.map(item => (
                                        <NewsCard 
                                            key={item.id} 
                                            item={item} 
                                            onBookmark={toggleBookmark}
                                            onUpdateNote={updateNote}
                                        />
                                    ))}
                                </div>
                            </section>
                         );
                     })}
                </div>
            )}

            {view === 'bookmarks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fade-in-up">
                    {articles.length === 0 ? (
                         <div className="col-span-full py-32 text-center text-zinc-600">Library Empty.</div>
                    ) : (
                        articles.map(item => (
                            <NewsCard 
                                key={item.id} 
                                item={item} 
                                onBookmark={toggleBookmark}
                                onUpdateNote={updateNote}
                            />
                        ))
                    )}
                </div>
            )}

            {view === 'weekly' && (
                <WeeklyReviewView 
                    isLoading={isLoading} 
                    latestReview={latestReview} 
                    onGenerate={handleGenerateReview} 
                />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;