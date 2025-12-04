import React from 'react';
import { useTranslation } from '../i18n';

interface Props {
  onOpen: () => void;
  onDismiss: () => void;
  count: number;
}

const FloatingNotification: React.FC<Props> = ({ onOpen, onDismiss, count }) => {
  const { t } = useTranslation();

  return (
    <div className="fixed top-8 left-8 z-[9999] animate-bounce-in font-sans">
      <div 
        onClick={onOpen}
        className="
          cursor-pointer group 
          bg-white/80 backdrop-blur-xl 
          border border-white/50 
          shadow-[0_8px_30px_rgba(0,0,0,0.12)]
          pl-2 pr-5 py-2
          rounded-full 
          flex items-center space-x-4
          hover:scale-105 hover:shadow-[0_12px_40px_rgba(0,0,0,0.15)]
          transition-all duration-500 ease-[cubic-bezier(0.25,0.1,0.25,1)]
        "
      >
        {/* Icon Circle */}
        <div className="w-10 h-10 rounded-full bg-black text-white flex items-center justify-center shadow-lg">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>

        {/* Text Content */}
        <div className="flex flex-col justify-center">
          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mb-1">{t('notify.title')}</p>
          <p className="text-sm font-bold text-zinc-900 leading-tight">{count} {t('notify.sub')}</p>
        </div>
      </div>
    </div>
  );
};

export default FloatingNotification;