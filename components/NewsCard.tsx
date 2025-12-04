import React, { useState } from 'react';
import { NewsItem } from '../types';
import { CATEGORY_THEME } from '../constants';

interface Props {
  item: NewsItem;
  onBookmark: (id: string) => void;
  onUpdateNote: (id: string, note: string) => void;
}

const NewsCard: React.FC<Props> = ({ item, onBookmark, onUpdateNote }) => {
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [noteText, setNoteText] = useState(item.userNotes || '');
  const theme = CATEGORY_THEME[item.category];

  const handleSaveNote = () => {
    onUpdateNote(item.id, noteText);
    setIsEditingNote(false);
  };

  return (
    <div className={`
      group relative flex flex-col h-full
      bg-zinc-900/40 backdrop-blur-md 
      border border-white/5 rounded-2xl p-6
      transition-all duration-300 ease-out
      hover:-translate-y-1 hover:bg-zinc-900/60
      ${theme.borderHover} ${theme.shadowHover}
    `}>
      {/* Top Meta */}
      <div className="flex justify-between items-center mb-4">
        <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-md border ${theme.badge}`}>
          {item.category}
        </span>
        
        <div className="flex items-center space-x-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
           <a href={item.url} target="_blank" rel="noreferrer" className="text-zinc-500 hover:text-white transition-colors">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>
          <button 
            onClick={() => onBookmark(item.id)} 
            className={`transition-all duration-300 ${item.isBookmarked ? 'text-yellow-400 scale-110' : 'text-zinc-500 hover:text-yellow-400'}`}
          >
            <svg className="w-4 h-4" fill={item.isBookmarked ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
            </svg>
          </button>
        </div>
      </div>

      {/* Content */}
      <h3 className="text-lg font-bold text-zinc-100 mb-3 leading-snug tracking-tight group-hover:text-white transition-colors">
        {item.title}
      </h3>
      <p className="text-sm text-zinc-400 leading-relaxed mb-6 flex-grow font-light">
        {item.summary}
      </p>
      
      {/* Footer / Notes */}
      <div className="pt-4 border-t border-white/5">
        {!item.isBookmarked && (
           <div className="flex justify-between items-center text-[10px] font-medium text-zinc-600 uppercase tracking-wider">
              <span>{item.source_name}</span>
              <span>{new Date(item.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
           </div>
        )}

        {item.isBookmarked && (
          <div className="animate-fade-in">
             {isEditingNote ? (
               <div className="space-y-2">
                 <textarea 
                    className="w-full bg-black/50 border border-zinc-700 rounded-lg p-3 text-sm text-zinc-200 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-zinc-600"
                    rows={2}
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    placeholder="Add personal insight..."
                    autoFocus
                 />
                 <div className="flex justify-end space-x-2">
                   <button onClick={() => setIsEditingNote(false)} className="text-xs text-zinc-500 hover:text-white transition-colors">Cancel</button>
                   <button onClick={handleSaveNote} className="text-xs bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-1.5 rounded-md font-medium transition-colors">Save Note</button>
                 </div>
               </div>
             ) : (
               <div 
                onClick={() => setIsEditingNote(true)} 
                className="group/note cursor-pointer flex items-start space-x-2"
               >
                 <svg className="w-3 h-3 text-zinc-600 mt-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                 <p className="text-xs text-zinc-500 italic group-hover/note:text-zinc-300 transition-colors line-clamp-2">
                   {item.userNotes || "Add a note..."}
                 </p>
               </div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsCard;