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
          <div className="fixed inset-0 z-50 bg-[#F7F7F9] flex flex-col animate-fade-in-up overflow-y-auto">
              <div className="max-w-3xl mx-auto w-full p-8 md:p-16">
                  <button onClick={() => setReadingItem(null)} className="mb-8 flex items-center text-zinc-500 hover:text-black transition-colors font-medium">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                      {t('card.cancel')}
                  </button>
                  <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-6 ${CATEGORY_THEME[readingItem.category].bgGradient} ${CATEGORY_THEME[readingItem.category].text} border border-black/5`}>
                      {t(`cat.${readingItem.category}`)}
                  </span>
                  <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#111111] mb-8 leading-tight tracking-tight">{readingItem.title}</h1>
                  <div className="flex items-center justify-between border-b border-zinc-200 pb-8 mb-8">
                      <div className="text-sm text-zinc-600 font-medium">
                          {readingItem.source_name} • {new Date(readingItem.created_at).toLocaleDateString()}
                      </div>
                      <button onClick={() => toggleBookmark(readingItem.id)}>
                         <svg className={`w-6 h-6 ${readingItem.isBookmarked ? 'text-yellow-500 fill-current' : 'text-zinc-300 hover:text-zinc-500'}`} viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} fill="none"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
                      </button>
                  </div>
                  <article className="prose prose-lg prose-zinc max-w-none">
                      <p className="text-xl leading-relaxed text-zinc-800 font-serif">{readingItem.summary}</p>
                      <div className="mt-12 p-6 bg-white rounded-2xl border border-zinc-200 shadow-sm">
                          <h4 className="font-bold text-zinc-900 mb-2 text-sm uppercase tracking-wide">AI Insight</h4>
                          <p className="text-zinc-600">This content was summarized by Gemini 2.5. The original article explores this topic in greater depth.</p>
                          <a href={readingItem.url} target="_blank" rel="noreferrer" className="inline-block mt-4 text-indigo-600 font-medium hover:underline">Read Full Article &rarr;</a>
                      </div>
                  </article>
              </div>
          </div>
      )
  }

  // --- Main App Layout ---
  return (
    <div className="flex flex-col h-screen font-sans bg-[#F7F7F9] text-[#111111] selection:bg-indigo-100">
      
      {notificationVisible && (
          <FloatingNotification 
            count={MOCK_RAW_FEED.length} 
            onOpen={handleFetchDaily} 
            onDismiss={() => setNotificationVisible(false)} 
          />
      )}

      {/* Top Header */}
      <header className="px-8 pt-12 pb-6 flex justify-between items-end max-w-7xl mx-auto w-full z-10 relative">
         <div>
             <h1 className="text-4xl font-bold tracking-tight text-[#111111] mb-1">{t('app.title')}{t('app.subtitle')}</h1>
             <p className="text-zinc-500 text-sm font-medium">{new Date().toLocaleDateString(language, { weekday: 'long', month: 'long', day: 'numeric' })}</p>
         </div>
         <div className="flex items-center space-x-4">
             <button 
                onClick={handleFetchDaily} 
                className="w-10 h-10 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500 hover:text-black hover:border-zinc-400 transition-all shadow-sm"
                title={t('btn.fetch')}
             >
                 <svg className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
             </button>
             <button 
                onClick={() => setLanguage(language === 'en' ? 'zh-CN' : 'en')}
                className="text-sm font-bold text-zinc-500 hover:text-black transition-colors border border-transparent hover:border-zinc-200 px-3 py-1 rounded-full"
             >
                 {language === 'en' ? 'EN' : '中'}
             </button>
         </div>
      </header>

      {/* Scrollable Content */}
      <main className="flex-1 overflow-y-auto pb-32">
        <div className="max-w-7xl mx-auto px-8">
            
            {/* View Title */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-[#111111]">
                    {view === 'dashboard' && t('header.dashboard.title')}
                    {view === 'bookmarks' && t('header.bookmarks.title')}
                    {view === 'weekly' && t('header.weekly.title')}
                </h2>
            </div>

            {view === 'dashboard' && (
                <div className="space-y-12 animate-fade-in">
                     {articles.length === 0 && !isLoading && (
                        <div className="py-24 text-center">
                            <p className="text-zinc-500 text-lg mb-4">{t('empty.dashboard.title')}</p>
                            <button onClick={handleFetchDaily} className="bg-black text-white px-6 py-2 rounded-full font-bold text-sm shadow-lg hover:scale-105 transition-transform">{t('empty.dashboard_box.btn')}</button>
                        </div>
                     )}

                     {Object.values(Category).map((category) => {
                         const categoryItems = categorizedArticles[category];
                         if (categoryItems.length === 0) return null;
                         
                         return (
                            <section key={category} className="mb-12">
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className={`w-2 h-2 rounded-full ${CATEGORY_THEME[category as Category].accent}`} />
                                    <h3 className="text-sm font-bold uppercase tracking-widest text-zinc-500">
                                        {t(`cat.${category}`)}
                                    </h3>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {categoryItems.map(item => (
                                        <NewsCard 
                                            key={item.id} 
                                            item={item} 
                                            onBookmark={toggleBookmark}
                                            onUpdateNote={updateNote}
                                            onClick={() => setReadingItem(item)}
                                        />
                                    ))}
                                </div>
                            </section>
                         );
                     })}
                </div>
            )}

            {view === 'bookmarks' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
                    {articles.length === 0 ? (
                         <div className="col-span-full py-32 text-center text-zinc-400">{t('empty.bookmarks')}</div>
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
      </main>

      {/* Bottom Navigation (Mobile/Modern Desktop style) */}
      <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-40 bg-white/90 backdrop-blur-xl border border-white/50 shadow-[0_8px_30px_rgba(0,0,0,0.12)] rounded-full px-8 py-4 flex space-x-10 items-center">
          <button 
             onClick={() => setView('dashboard')}
             className={`flex flex-col items-center space-y-1.5 transition-colors ${view === 'dashboard' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
              <svg className="w-6 h-6" fill={view === 'dashboard' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.dashboard')}</span>
          </button>
          <div className="w-px h-8 bg-zinc-200" />
          <button 
             onClick={() => setView('bookmarks')}
             className={`flex flex-col items-center space-y-1.5 transition-colors ${view === 'bookmarks' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
              <svg className="w-6 h-6" fill={view === 'bookmarks' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.bookmarks')}</span>
          </button>
          <div className="w-px h-8 bg-zinc-200" />
          <button 
             onClick={() => setView('weekly')}
             className={`flex flex-col items-center space-y-1.5 transition-colors ${view === 'weekly' ? 'text-black' : 'text-zinc-400 hover:text-zinc-600'}`}
          >
              <svg className="w-6 h-6" fill={view === 'weekly' ? "currentColor" : "none"} stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" /></svg>
              <span className="text-[10px] font-bold uppercase tracking-wider">{t('nav.weekly')}</span>
          </button>
      </nav>
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