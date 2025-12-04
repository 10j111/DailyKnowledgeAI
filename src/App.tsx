import React, { useEffect, useState, useMemo } from 'react';
import { Category, NewsItem, ViewState, WeeklyReview } from './types';
import { MOCK_RAW_FEED, CATEGORY_THEME } from './constants';
import { processDailyFeeds, generateWeeklyReview } from './services/geminiService';
import { StorageService } from './services/storageService';
import NewsCard from './components/NewsCard';
import WeeklyReviewView from './components/WeeklyReviewView';
import FloatingNotification from './components/FloatingNotification';
import { I18nProvider, useTranslation } from './i18n';

const AppContent: React.FC = () => {
  const { t, language, setLanguage } = useTranslation();
  const [view, setView] = useState<ViewState>('dashboard');
  const [articles, setArticles] = useState<NewsItem[]>([]);
  const [latestReview, setLatestReview] = useState<WeeklyReview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [notificationVisible, setNotificationVisible] = useState(false);
  const [readingItem, setReadingItem] = useState<NewsItem | null>(null);

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
      const processedItems = await processDailyFeeds(MOCK_RAW_FEED, language);
      StorageService.saveDailyInsights(processedItems);
      refreshData();
      setView('dashboard');
    } catch (error) {
      console.error(error);
      alert("Failed to fetch.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGenerateReview = async () => {
    setIsLoading(true);
    try {
      const bookmarks = StorageService.getBookmarksData();
      const review = await generateWeeklyReview(bookmarks, language);
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
    if (readingItem && readingItem.id === id) {
        setReadingItem(prev => prev ? {...prev, isBookmarked: !prev.isBookmarked} : null);
    }
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

  // --- Reader View Component ---
  if (readingItem) {
      return (
          <div className="fixed inset-0 z-50 bg-[#121212] flex flex-col animate-fade-in-up overflow-y-auto">
              <div className="max-w-3xl mx-auto w-full p-8 md:p-16">
                  <button onClick={() => setReadingItem(null)} className="mb-8 flex items-center text-zinc-400 hover:text-white transition-colors font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      {t('card.cancel')}
                  </button>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 bg-white/10 text-zinc-300 border border-white/5`}>
                      {t(`cat.${readingItem.category}`)}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight tracking-tight">{readingItem.title}</h1>
                  <div className="flex items-center justify-between border-b border-zinc-800 pb-8 mb-8">
                      <div className="text-sm text-zinc-500 font-medium">
                          {readingItem.source_name} • {new Date(readingItem.created_at).toLocaleDateString()}
                      </div>
                      <button onClick={() => toggleBookmark(readingItem.id)}>
                         <svg className={`w-6 h-6 ${readingItem.isBookmarked ? 'text-yellow-500 fill-current' : 'text-zinc-500 hover:text-white'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      </button>
                  </div>
                  <article className="prose prose-lg prose-invert max-w-none">
                      <p className="text-xl leading-relaxed text-zinc-300 font-serif">{readingItem.summary}</p>
                      <div className="mt-12 p-8 bg-[#27272A] rounded-[32px] border border-white/5">
                          <h4 className="font-bold text-white mb-2 text-sm uppercase tracking-wide">AI Insight</h4>
                          <p className="text-zinc-400">This content was summarized by Gemini 2.5. The original article explores this topic in greater depth.</p>
                          <a href={readingItem.url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-[#C4B5FD] font-medium hover:underline">Read Full Article &rarr;</a>
                      </div>
                  </article>
              </div>
          </div>
      )
  }

  // --- Main App Layout (Split View) ---
  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#121212] text-white">
      
      {notificationVisible && (
          <FloatingNotification 
            count={MOCK_RAW_FEED.length} 
            onOpen={handleFetchDaily} 
            onDismiss={() => setNotificationVisible(false)} 
          />
      )}

      {/* LEFT COLUMN: Hero & Navigation (Fixed) */}
      <div className="w-[420px] h-full flex flex-col p-10 relative z-10 border-r border-white/5 bg-[#121212]">
          
          {/* Header */}
          <div className="mb-12">
              <div className="flex items-center space-x-2 mb-4">
                 <div className="w-3 h-3 rounded-full bg-[#C4B5FD]" />
                 <span className="text-xs font-bold tracking-[0.2em] text-zinc-500 uppercase">{t('app.system_status')}</span>
              </div>
              <h1 className="text-6xl font-bold tracking-tighter leading-none mb-4">{t('app.title')}<br/><span className="text-zinc-600">{t('app.subtitle')}</span></h1>
              <p className="text-xl text-zinc-400 font-medium">{new Date().toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
          </div>

          {/* Navigation Pills */}
          <nav className="space-y-4 flex-1">
             {[
               { id: 'dashboard', label: t('nav.dashboard') },
               { id: 'bookmarks', label: t('nav.bookmarks') },
               { id: 'weekly', label: t('nav.weekly') }
             ].map((navItem) => (
                <button 
                  key={navItem.id}
                  onClick={() => setView(navItem.id as ViewState)}
                  className={`
                    w-full text-left px-6 py-4 rounded-full text-lg font-bold transition-all duration-300
                    ${view === navItem.id 
                      ? 'bg-white text-black' 
                      : 'bg-[#27272A] text-zinc-400 hover:bg-[#323235] hover:text-white'}
                  `}
                >
                  {navItem.label}
                </button>
             ))}
          </nav>

          {/* Footer Actions */}
          <div className="mt-10 space-y-4">
             <button 
                onClick={handleFetchDaily} 
                disabled={isLoading}
                className="w-full flex items-center justify-between px-6 py-4 rounded-full bg-[#C4B5FD] text-black hover:bg-[#B09EFC] hover:scale-[1.02] transition-all duration-300 font-bold"
             >
                 <span>{isLoading ? t('btn.syncing') : t('btn.fetch')}</span>
                 <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
             
             <button 
                onClick={() => setLanguage(language === 'en' ? 'zh-CN' : 'en')}
                className="w-full text-center py-2 text-xs font-bold text-zinc-600 hover:text-white uppercase tracking-widest"
             >
                 Switch Language: {language === 'en' ? '中文' : 'English'}
             </button>
          </div>
      </div>

      {/* RIGHT COLUMN: Content (Scrollable) */}
      <div className="flex-1 h-full overflow-y-auto p-10 scroll-smooth">
          <div className="max-w-4xl mx-auto">
            {/* View Title Overlay */}
            <h2 className="text-[100px] font-bold text-white/5 absolute top-10 right-10 pointer-events-none select-none tracking-tighter leading-none">
                {view === 'dashboard' && 'DAILY'}
                {view === 'bookmarks' && 'SAVED'}
                {view === 'weekly' && 'WEEKLY'}
            </h2>

            {view === 'dashboard' && (
                <div className="animate-fade-in-up">
                    {articles.length === 0 && !isLoading && (
                        <div className="py-24 text-center">
                            <p className="text-zinc-500 text-lg mb-4">{t('empty.dashboard.title')}</p>
                        </div>
                    )}
                    
                    {/* Masonry-style Grid */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {Object.values(Category).map((category) => {
                             const categoryItems = categorizedArticles[category];
                             if (categoryItems.length === 0) return null;
                             return categoryItems.map(item => (
                                <NewsCard 
                                    key={item.id} 
                                    item={item} 
                                    onBookmark={toggleBookmark}
                                    onUpdateNote={updateNote}
                                    onClick={() => setReadingItem(item)}
                                />
                             ));
                        })}
                    </div>
                </div>
            )}

            {view === 'bookmarks' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in-up">
                    {articles.length === 0 ? (
                         <div className="col-span-full py-32 text-center text-zinc-500 text-xl font-bold">{t('empty.bookmarks')}</div>
                    ) : (
                        articles.map(item => (
                            <NewsCard 
                                key={item.id} 
                                item={item} 
                                onBookmark={toggleBookmark}
                                onUpdateNote={updateNote}
                                onClick={() => setReadingItem(item)}
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
      </div>

    </div>
  );
};

// Root Component
const App: React.FC = () => {
  return (
    <I18nProvider>
      <AppContent />
    </I18nProvider>
  );
};

export default App;