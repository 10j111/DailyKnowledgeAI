import React from 'react';

interface Props {
  onOpen: () => void;
  onDismiss: () => void;
  count: number;
}

const FloatingNotification: React.FC<Props> = ({ onOpen, onDismiss, count }) => {
  return (
    <div className="fixed top-6 left-6 z-[9999] animate-bounce-in font-sans">
      <div 
        onClick={onOpen}
        className="
          cursor-pointer group 
          bg-zinc-900/60 backdrop-blur-2xl 
          border border-white/10 
          text-white pl-1 pr-4 py-1.5 
          rounded-full shadow-2xl 
          flex items-center space-x-3 
          hover:bg-zinc-800/80 hover:scale-105 hover:border-white/20
          transition-all duration-300 ease-out
        "
      >
        {/* Icon Circle */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center min-w-[100px]">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-0.5">Daily Knowledge</p>
          <p className="text-xs font-medium text-white leading-tight">{count} new insights</p>
        </div>

        {/* Close Action */}
        <div 
          onClick={(e) => { e.stopPropagation(); onDismiss(); }} 
          className="w-5 h-5 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors ml-2"
        >
          <svg className="w-3 h-3 text-zinc-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default FloatingNotification;