
import React, { useState, useEffect, useCallback, useRef } from 'react';
import Clock from './components/Clock';
import WeatherWidget from './components/WeatherWidget';
import NewsFeed from './components/NewsFeed';
import { DashboardState } from './types';
import { fetchParisDashboardData } from './services/geminiService';
import { RefreshCw, LayoutGrid, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [state, setState] = useState<DashboardState>({
    news: [],
    weather: null,
    loading: true,
    error: null,
    lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  });

  const refreshCount = useRef(0);

  const loadData = useCallback(async () => {
    if (refreshCount.current === 0) {
      setState(prev => ({ ...prev, loading: true, error: null }));
    }
    
    try {
      const { news, weather } = await fetchParisDashboardData();
      setState({
        news,
        weather,
        loading: false,
        error: null,
        lastUpdated: new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
      });
      refreshCount.current += 1;
    } catch (err) {
      console.error(err);
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: "Reconnecting to Paris..." 
      }));
      setTimeout(loadData, 30000);
    }
  }, []);

  useEffect(() => {
    loadData();
    const interval = setInterval(loadData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="h-screen w-full flex flex-col text-zinc-100 select-none overflow-hidden p-4 sm:p-6 md:p-8 lg:p-10 xl:p-12">
      {/* Dynamic Background Noise */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] -z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-4 sm:mb-6 md:mb-8 lg:mb-10 flex-shrink-0">
        <div className="flex items-center gap-4 sm:gap-6 md:gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="h-12 w-12 sm:h-16 sm:w-16 lg:h-20 lg:w-20 rounded-2xl sm:rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl relative z-10">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 text-indigo-500 fill-indigo-500/20" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-black tracking-tighter text-white">VISION STATION</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] sm:tracking-[0.4em] text-zinc-500">Live Infrastructure • Paris Node</p>
            </div>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-4 md:gap-8 lg:gap-12 bg-zinc-900/30 p-2 sm:p-3 lg:p-4 px-4 sm:px-6 lg:px-8 rounded-full border border-zinc-800/50 backdrop-blur-md">
           <div className="flex flex-col items-center">
            <span className="text-[8px] lg:text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Status</span>
            <span className="text-[10px] lg:text-xs font-bold text-emerald-500 uppercase tracking-widest">Active</span>
          </div>
          <div className="w-[1px] h-6 lg:h-8 bg-zinc-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-[8px] lg:text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Last Sync</span>
            <span className="text-sm lg:text-xl font-mono font-bold text-zinc-400">{state.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 min-h-0">
        {/* Main Section (Clock & Weather) */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-4 sm:gap-6 md:gap-8 lg:gap-10 xl:gap-12 min-h-0 h-full">
          <div className="flex-none">
            <Clock />
          </div>
          <div className="flex-1 min-h-0 overflow-hidden">
            <WeatherWidget data={state.weather} />
          </div>
        </div>

        {/* Feed Section */}
        <div className="hidden lg:block lg:col-span-5 h-full overflow-hidden">
          <NewsFeed news={state.news} />
        </div>
      </div>

      {/* Footer Navigation Labels */}
      <div className="mt-4 sm:mt-6 md:mt-8 flex justify-between items-center opacity-40 flex-shrink-0">
        <div className="flex gap-6 lg:gap-10">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[8px] font-bold">OK</div>
            <span className="text-[8px] font-bold uppercase tracking-widest">Select Item</span>
          </div>
          <div className="flex items-center gap-2">
             <div className="w-5 h-5 rounded bg-zinc-800 flex items-center justify-center text-[8px] font-bold">▲▼</div>
            <span className="text-[8px] font-bold uppercase tracking-widest">Scroll Feed</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-3 h-3 lg:w-4 lg:h-4" />
          <span className="text-[8px] font-bold uppercase tracking-widest">Dashboard Cluster 01-A</span>
        </div>
      </div>

      {/* Mobile/Small Screen Overlay Toggle for Feed */}
      <div className="lg:hidden absolute bottom-20 right-4">
          <button 
            onClick={() => loadData()}
            className="p-3 bg-indigo-600 rounded-full shadow-lg"
          >
             <RefreshCw className={`w-5 h-5 ${state.loading ? 'animate-spin' : ''}`} />
          </button>
      </div>

      {/* Persistent Sync Notification */}
      {state.loading && refreshCount.current > 0 && (
        <div className="fixed top-8 sm:top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-indigo-600 px-4 sm:px-6 py-1.5 sm:py-2 rounded-full shadow-2xl animate-bounce z-50">
          <RefreshCw className="w-3 h-3 sm:w-4 sm:h-4 animate-spin" />
          <span className="text-[10px] sm:text-xs font-black uppercase tracking-widest">Syncing</span>
        </div>
      )}
    </div>
  );
};

export default App;
