import React from 'react';
import { WeeklyReview } from '../types';
import { useTranslation } from '../i18n';

interface Props {
  onGenerate: () => Promise<void>;
  latestReview: WeeklyReview | null;
  isLoading: boolean;
}

const WeeklyReviewView: React.FC<Props> = ({ onGenerate, latestReview, isLoading }) => {
  const { t } = useTranslation();

  return (
    <div className="max-w-4xl mx-auto py-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-12">
        <div>
          <h2 className="text-4xl font-bold text-zinc-900 tracking-tight mb-2">{t('header.weekly.title')}</h2>
          <p className="text-zinc-500 text-base max-w-lg">{t('header.weekly.desc')}</p>
        </div>
        
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className={`
            px-8 py-4 rounded-2xl font-bold text-sm shadow-xl transition-all duration-300
            ${isLoading 
              ? 'bg-zinc-100 text-zinc-400 cursor-not-allowed' 
              : 'bg-black text-white hover:scale-105 hover:bg-zinc-800'}
          `}
        >
          {isLoading ? t('review.analyzing') : t('review.generate')}
        </button>
      </div>

      {latestReview ? (
        <div className="space-y-8">
          {/* Main Summary Card */}
          <div className="bg-white rounded-[32px] p-10 shadow-sm border border-zinc-100 relative overflow-hidden">
             <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-indigo-50 to-pink-50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 opacity-60"></div>
             
             <div className="relative z-10">
               <p className="text-xs font-bold text-indigo-500 uppercase tracking-widest mb-3">{t('review.scope')}</p>
               <h3 className="text-3xl font-bold text-zinc-900 mb-8">{latestReview.weekRange}</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div>
                   <h4 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                     <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                     {t('review.themes')}
                   </h4>
                   <p className="text-zinc-600 leading-loose">{latestReview.themes}</p>
                 </div>
                 <div>
                   <h4 className="text-lg font-bold text-zinc-900 mb-4 flex items-center">
                     <span className="w-2 h-2 bg-pink-500 rounded-full mr-3"></span>
                     {t('review.insights')}
                   </h4>
                   <p className="text-zinc-600 leading-loose">{latestReview.insights}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Suggestions */}
          <div className="bg-[#FFF6B2] rounded-[32px] p-10 relative overflow-hidden">
             <h4 className="text-xl font-bold text-yellow-900 mb-4 flex items-center relative z-10">
                <svg className="w-6 h-6 mr-3 text-yellow-700" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                {t('review.suggestions')}
             </h4>
             <p className="text-yellow-900/80 leading-relaxed whitespace-pre-wrap relative z-10 font-medium text-lg">{latestReview.nextWeekSuggestions}</p>
             
             {/* Decorative */}
             <div className="absolute -bottom-10 -right-10 w-48 h-48 bg-white/30 rounded-full blur-2xl"></div>
          </div>
          
          <div className="text-center pt-8">
             <p className="text-[10px] text-zinc-400 font-mono tracking-widest">{t('review.footer')} • {new Date(latestReview.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-white rounded-[32px] border border-zinc-100">
          <div className="w-20 h-20 bg-zinc-50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-zinc-500 font-medium text-lg">{t('empty.weekly')}</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyReviewView;