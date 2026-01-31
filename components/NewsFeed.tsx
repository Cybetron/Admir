
import React from 'react';
import { NewsItem } from '../types';
import { ExternalLink, Newspaper, Flame } from 'lucide-react';

interface NewsFeedProps {
  news: NewsItem[];
}

const NewsFeed: React.FC<NewsFeedProps> = ({ news }) => {
  return (
    <div className="flex flex-col h-full bg-zinc-900/30 rounded-[2.5rem] border border-zinc-800/50 backdrop-blur-xl overflow-hidden shadow-2xl">
      <div className="p-8 border-b border-zinc-800/50 bg-zinc-900/60 flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center border border-orange-500/20">
            <Flame className="text-orange-500 w-6 h-6" />
          </div>
          <div>
            <h2 className="text-2xl font-black text-zinc-100 uppercase tracking-tight">À La Une</h2>
            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">Paris & France</p>
          </div>
        </div>
        <div className="px-4 py-1 rounded-full bg-zinc-800 text-[10px] font-mono text-zinc-400 font-bold tracking-widest border border-zinc-700/50">
          LIVE STREAM
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
        {news.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6 opacity-40 py-20">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-zinc-800 border-t-indigo-500 rounded-full animate-spin"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Newspaper className="w-6 h-6 text-indigo-400" />
              </div>
            </div>
            <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">Synchronizing Headlines...</p>
          </div>
        ) : (
          news.map((item, index) => (
            <div 
              key={index} 
              className="group p-6 bg-zinc-900/40 hover:bg-zinc-800/40 rounded-3xl border border-zinc-800/50 transition-all duration-300 transform hover:-translate-y-1 active:scale-[0.98]"
            >
              <div className="flex justify-between items-start mb-4">
                <span className="px-3 py-1 bg-zinc-800 text-indigo-400 text-[10px] font-black uppercase rounded-lg tracking-[0.15em] border border-zinc-700/30">
                  {item.source}
                </span>
                <a href={item.url} target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-zinc-700 rounded-lg transition-colors">
                  <ExternalLink className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400" />
                </a>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight group-hover:text-indigo-200 transition-colors">
                {item.title}
              </h3>
              <p className="text-zinc-400 text-base line-clamp-3 leading-relaxed font-medium">
                {item.snippet}
              </p>
            </div>
          ))
        )}
      </div>
      
      <div className="p-6 bg-zinc-900/40 border-t border-zinc-800/50 flex justify-center items-center gap-3">
        <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
        <p className="text-[10px] text-zinc-600 uppercase tracking-[0.3em] font-black">
          End of Briefing • Refreshing Automatically
        </p>
        <span className="w-2 h-2 rounded-full bg-zinc-700"></span>
      </div>
    </div>
  );
};

export default NewsFeed;
