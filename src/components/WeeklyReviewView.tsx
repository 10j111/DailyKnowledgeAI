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
    <div className="max-w-5xl mx-auto py-8 animate-fade-in-up">
      {/* Header Section */}
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-4xl font-bold text-white tracking-tight mb-2">{t('header.weekly.title')}</h2>
          <p className="text-zinc-400 text-base max-w-lg">{t('header.weekly.desc')}</p>
        </div>
        
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className={`
            px-8 py-3 rounded-full font-bold text-sm shadow-xl transition-all duration-300
            ${isLoading 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed' 
              : 'bg-[#C4B5FD] text-black hover:scale-105 hover:bg-[#B09EFC]'}
          `}
        >
          {isLoading ? t('review.analyzing') : t('review.generate')}
        </button>
      </div>

      {latestReview ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Main Summary Card - Big Dark Block */}
          <div className="md:col-span-2 bg-[#27272A] rounded-[32px] p-10 relative overflow-hidden text-white">
             <div className="relative z-10">
               <p className="text-xs font-bold text-[#C4B5FD] uppercase tracking-widest mb-3">{t('review.scope')}</p>
               <h3 className="text-3xl font-bold mb-8">{latestReview.weekRange}</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                 <div>
                   <h4 className="text-lg font-bold mb-4 flex items-center text-[#C4B5FD]">
                     {t('review.themes')}
                   </h4>
                   <p className="text-zinc-300 leading-relaxed">{latestReview.themes}</p>
                 </div>
                 <div>
                   <h4 className="text-lg font-bold mb-4 flex items-center text-[#FDE047]">
                     {t('review.insights')}
                   </h4>
                   <p className="text-zinc-300 leading-relaxed">{latestReview.insights}</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Suggestions - Yellow Block */}
          <div className="bg-[#FDE047] rounded-[32px] p-10 text-[#111111]">
             <h4 className="text-xl font-bold mb-4 flex items-center">
                {t('review.suggestions')}
             </h4>
             <p className="leading-relaxed whitespace-pre-wrap font-medium text-lg opacity-90">{latestReview.nextWeekSuggestions}</p>
          </div>

           {/* Footer Block - Lavender */}
           <div className="bg-[#C4B5FD] rounded-[32px] p-10 flex items-center justify-center text-[#111111]">
             <p className="text-xs font-bold font-mono tracking-widest uppercase">{t('review.footer')} • {new Date(latestReview.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-32 bg-[#27272A] rounded-[32px]">
          <div className="w-20 h-20 bg-zinc-800 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-bold text-lg">{t('empty.weekly')}</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyReviewView;