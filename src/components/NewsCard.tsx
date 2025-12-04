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
        ${theme.bg} rounded-[32px] p-8
        transition-all duration-300 ease-out
        hover:scale-[1.02] hover:shadow-xl
        cursor-pointer
        border border-black/5
      `}
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <span className={`inline-block px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${theme.badge} border`}>
          {t(`cat.${item.category}`)}
        </span>
        
        <button 
          onClick={(e) => { e.stopPropagation(); onBookmark(item.id); }}
          className={`
            w-10 h-10 rounded-full flex items-center justify-center 
            transition-all duration-300
            ${item.isBookmarked 
              ? 'bg-white text-yellow-500 shadow-sm scale-110' 
              : `bg-black/5 ${theme.iconColor} hover:bg-black/10`}
          `}
        >
           <svg className="w-5 h-5" fill={item.isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1">
        <h3 className={`text-2xl font-bold leading-tight mb-4 ${theme.text} tracking-tight`}>
          {item.title}
        </h3>
        <p className={`text-sm leading-relaxed font-medium opacity-80 line-clamp-4 ${theme.text}`}>
          {item.summary}
        </p>
      </div>

      {/* Footer */}
      <div className={`mt-8 pt-4 border-t border-black/5 flex justify-between items-center opacity-70`}>
        <span className={`text-xs font-bold ${theme.text}`}>
          {item.source_name}
        </span>
        <span className={`text-[10px] font-medium ${theme.text}`}>
          {new Date(item.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  );
};

export default NewsCard;