import React from 'react';
import { NewsItem } from '../types';
import { CATEGORY_THEME } from '../constants';
import { useTranslation } from '../i18n';

interface Props {
  item: NewsItem;
  onBookmark: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
  onClick: () => void;
}

const NewsCard: React.FC<Props> = ({ item, onBookmark, onClick }) => {
  const { t } = useTranslation();
  const theme = CATEGORY_THEME[item.category];

  return (
    <div 
      className={`
        group relative flex flex-col h-full
        ${theme.bgGradient} rounded-[32px] p-7
        transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        shadow-[0_2px_8px_rgba(0,0,0,0.04)]
        hover:scale-[1.02] hover:shadow-[0_12px_32px_rgba(0,0,0,0.08)]
        hover:-translate-y-1
        cursor-pointer
        overflow-hidden
        border border-white/40
      `}
      onClick={onClick}
    >
      {/* Abstract Decoration Shape - Subtle */}
      <div className={`absolute top-0 right-0 w-48 h-48 bg-white/40 blur-3xl rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none`} />
      <div className={`absolute bottom-0 left-0 w-32 h-32 bg-white/30 blur-2xl ${theme.decoration} translate-y-1/3 -translate-x-1/3 pointer-events-none`} />

      {/* Header */}
      <div className="flex justify-between items-start mb-5 relative z-10">
        <div className="flex flex-col items-start">
          <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${theme.badge} mb-1.5`}>
            {t(`cat.${item.category}`)}
          </span>
          <span className="text-[10px] font-semibold text-zinc-500/80 pl-1">
            {new Date(item.created_at).toLocaleDateString()}
          </span>
        </div>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onBookmark(item.id); }}
          className={`
            w-9 h-9 rounded-full flex items-center justify-center 
            transition-all duration-300
            ${item.isBookmarked 
              ? 'bg-white text-yellow-500 shadow-sm' 
              : 'bg-white/40 text-zinc-400 hover:bg-white hover:text-zinc-600'}
          `}
        >
           <svg className="w-5 h-5" fill={item.isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 relative z-10">
        <h3 className="text-[1.25rem] font-bold leading-snug mb-3 text-[#111111] font-sans tracking-tight">
          {item.title}
        </h3>
        <p className="text-[13px] leading-relaxed font-medium text-zinc-700/80 line-clamp-3">
          {item.summary}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 pt-4 border-t border-black/5 relative z-10 flex justify-between items-center">
        <span className="text-xs font-bold text-zinc-800 opacity-60">
          {item.source_name}
        </span>
        <div className={`w-2 h-2 rounded-full ${theme.accent}`} />
      </div>
    </div>
  );
};

export default NewsCard;