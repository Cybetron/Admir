
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
        error: "Connection lost. Retrying..." 
      }));
      // Rapid retry for failures
      setTimeout(loadData, 15000);
    }
  }, []);

  useEffect(() => {
    loadData();
    // Refresh every 15 minutes
    const interval = setInterval(loadData, 15 * 60 * 1000);
    return () => clearInterval(interval);
  }, [loadData]);

  return (
    <div className="fixed inset-0 w-full h-full flex flex-col text-zinc-100 select-none overflow-hidden p-6 sm:p-8 lg:p-10">
      {/* Dynamic Background Noise */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] -z-10"></div>

      {/* Header */}
      <div className="flex justify-between items-center mb-6 lg:mb-8 flex-shrink-0">
        <div className="flex items-center gap-4 sm:gap-6">
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-500 blur-2xl opacity-20 animate-pulse"></div>
            <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center shadow-2xl relative z-10">
              <Zap className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-500 fill-indigo-500/20" />
            </div>
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-tighter text-white">VISION STATION</h1>
            <div className="flex items-center gap-2 mt-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></span>
              <p className="text-[8px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Node: Paris-Main</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 sm:gap-8 bg-zinc-900/40 p-2 px-5 sm:px-8 rounded-full border border-zinc-800/50 backdrop-blur-md">
          <div className="flex flex-col items-center">
            <span className="text-[8px] text-zinc-600 uppercase font-black tracking-widest mb-0.5">Sync</span>
            <span className="text-xs font-mono font-bold text-zinc-400">{state.lastUpdated}</span>
          </div>
          <div className="w-[1px] h-6 bg-zinc-800"></div>
          <button 
            onClick={() => loadData()}
            className="group flex items-center gap-2"
            disabled={state.loading}
          >
            <RefreshCw className={`w-4 h-4 text-zinc-600 group-active:text-indigo-400 ${state.loading ? 'animate-spin text-indigo-500' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Grid */}
      <div className="flex-1 grid grid-cols-12 gap-6 lg:gap-10 min-h-0">
        {/* Left Column */}
        <div className="col-span-12 lg:col-span-7 flex flex-col gap-6 lg:gap-10 h-full min-h-0">
          <div className="flex-none">
            <Clock />
          </div>
          <div className="flex-1 min-h-0">
            <WeatherWidget data={state.weather} />
          </div>
        </div>

        {/* Right Column */}
        <div className="hidden lg:block lg:col-span-5 h-full min-h-0">
          <NewsFeed news={state.news} />
        </div>
      </div>

      {/* Footer (Simplified for TV) */}
      <div className="mt-6 flex justify-between items-center opacity-30 flex-shrink-0">
        <div className="flex gap-8">
          <span className="text-[8px] font-bold uppercase tracking-widest">Dashboard System v2.1</span>
          <span className="text-[8px] font-bold uppercase tracking-widest">Fully Kiosk Optimized</span>
        </div>
        <div className="flex items-center gap-2">
          <LayoutGrid className="w-3 h-3" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-zinc-500">SECURE TERMINAL</span>
        </div>
      </div>

      {/* Background Notification */}
      {state.error && (
        <div className="fixed bottom-10 left-10 right-10 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-red-500/10 border border-red-500/20 text-red-200 px-6 py-2 rounded-full backdrop-blur-xl flex items-center gap-3">
             <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
             <span className="text-xs font-black uppercase tracking-widest">{state.error}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
