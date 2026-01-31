
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
    // Only show loading indicator on first load or manual refresh
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
      // Rapid retry for failures
      setTimeout(loadData, 30000);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Live update every 10 minutes in background
    const interval = setInterval(loadData, 10 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="h-screen w-screen p-12 flex flex-col text-zinc-100 select-none">
      {/* Dynamic Background Noise (Subtle) */}
      <div className="fixed inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] -z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-12">
        <div className="flex items-center gap-8">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="h-20 w-20 rounded-3xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl relative z-10">
              <Zap className="w-10 h-10 text-indigo-500 fill-indigo-500/20" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tighter text-white">VISION STATION</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <p className="text-xs font-black uppercase tracking-[0.4em] text-zinc-500">Live Infrastructure • Paris Node</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-12 bg-zinc-900/30 p-4 px-8 rounded-full border border-zinc-800/50 backdrop-blur-md">
           <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Status</span>
            <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">Active</span>
          </div>
          <div className="w-[1px] h-8 bg-zinc-800"></div>
          <div className="flex flex-col items-center">
            <span className="text-[10px] text-zinc-600 uppercase font-black tracking-widest mb-1">Last Sync</span>
            <span className="text-xl font-mono font-bold text-zinc-400">{state.lastUpdated}</span>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-12 min-h-0">
        {/* Main Section */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-12 h-full">
          <div className="flex-none">
            <Clock />
          </div>
          <div className="flex-1 min-h-0">
            <WeatherWidget data={state.weather} />
          </div>
        </div>

        {/* Feed Section */}
        <div className="col-span-12 lg:col-span-5 h-full overflow-hidden">
          <NewsFeed news={state.news} />
        </div>
      </div>

      {/* TV-Friendly Footer Navigation Labels */}
      <div className="mt-12 flex justify-between items-center opacity-40">
        <div className="flex gap-10">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold">OK</div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Select Item</span>
          </div>
          <div className="flex items-center gap-3">
             <div className="w-6 h-6 rounded bg-zinc-800 flex items-center justify-center text-[10px] font-bold">▲▼</div>
            <span className="text-[10px] font-bold uppercase tracking-widest">Scroll Feed</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-4 h-4" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Dashboard Cluster 01-A</span>
        </div>
      </div>

      {/* Persistent Sync Notification */}
      {state.loading && refreshCount.current > 0 && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-indigo-600 px-6 py-2 rounded-full shadow-2xl animate-bounce">
          <RefreshCw className="w-4 h-4 animate-spin" />
          <span className="text-xs font-black uppercase tracking-widest">Background Syncing</span>
        </div>
      )}
    </div>
  );
};

export default App;
