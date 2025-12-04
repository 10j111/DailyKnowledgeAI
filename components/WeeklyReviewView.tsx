import React, { useState } from 'react';
import { WeeklyReview } from '../types';

interface Props {
  onGenerate: () => Promise<void>;
  latestReview: WeeklyReview | null;
  isLoading: boolean;
}

const WeeklyReviewView: React.FC<Props> = ({ onGenerate, latestReview, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto py-4 animate-fade-in-up">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Weekly Synthesis</h2>
          <p className="text-zinc-400 text-sm mt-1">AI-powered analysis of your reading habits and interests.</p>
        </div>
        
        <button 
          onClick={onGenerate}
          disabled={isLoading}
          className={`
            group relative px-6 py-2.5 rounded-full font-medium text-sm flex items-center space-x-2 transition-all duration-300 overflow-hidden
            ${isLoading 
              ? 'bg-zinc-800 text-zinc-500 cursor-not-allowed border border-white/5' 
              : 'bg-white text-black hover:scale-105 shadow-[0_0_20px_rgba(255,255,255,0.3)]'}
          `}
        >
          {isLoading ? (
            <>
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Analyzing...</span>
            </>
          ) : (
            <>
              <span className="relative z-10">Generate Review</span>
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-200 to-purple-200 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </>
          )}
        </button>
      </div>

      {latestReview ? (
        <div className="space-y-6">
          {/* Header Card */}
          <div className="glass-panel rounded-2xl p-8 relative overflow-hidden group">
             <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:bg-indigo-500/20 transition-all duration-700"></div>
             <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-2">Analysis Scope</p>
             <h3 className="text-3xl font-bold text-white tracking-tight">{latestReview.weekRange}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Themes Card */}
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-purple-500 hover:border-white/20 hover:shadow-[0_0_30px_-10px_rgba(168,85,247,0.3)] transition-all duration-300">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                <span className="w-1.5 h-1.5 bg-purple-500 rounded-full mr-3 shadow-[0_0_10px_currentColor]"></span>
                Core Themes
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{latestReview.themes}</p>
            </div>
            
            {/* Insights Card */}
            <div className="glass-panel rounded-2xl p-6 border-l-4 border-l-emerald-500 hover:border-white/20 hover:shadow-[0_0_30px_-10px_rgba(16,185,129,0.3)] transition-all duration-300">
              <h4 className="text-lg font-bold text-white mb-4 flex items-center">
                 <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full mr-3 shadow-[0_0_10px_currentColor]"></span>
                 Strategic Insights
              </h4>
              <p className="text-zinc-400 text-sm leading-relaxed whitespace-pre-wrap">{latestReview.insights}</p>
            </div>
          </div>

          {/* Suggestions Card */}
          <div className="glass-panel rounded-2xl p-8 border border-amber-500/20 bg-gradient-to-br from-amber-500/5 to-transparent">
             <h4 className="text-lg font-bold text-amber-100 mb-4 flex items-center">
                <svg className="w-5 h-5 mr-3 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                Next Week's Focus
             </h4>
             <p className="text-zinc-300 leading-relaxed whitespace-pre-wrap">{latestReview.nextWeekSuggestions}</p>
          </div>
          
          <div className="text-center pt-8">
             <p className="text-[10px] text-zinc-600 font-mono">POWERED BY GEMINI 2.5 • {new Date(latestReview.createdAt).toLocaleDateString()}</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 glass-panel rounded-2xl border-dashed border-zinc-800">
          <div className="w-16 h-16 bg-zinc-800/50 rounded-full flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-zinc-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
            </svg>
          </div>
          <p className="text-zinc-400 font-medium text-lg">No synthesis available</p>
          <p className="text-zinc-600 text-sm mt-2 max-w-sm text-center">Collect insights throughout the week by bookmarking interesting articles, then generate your personalized review.</p>
        </div>
      )}
    </div>
  );
};

export default WeeklyReviewView;