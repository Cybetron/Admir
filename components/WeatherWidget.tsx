
import React from 'react';
import { WeatherData } from '../types';
import { Thermometer, Droplets, Wind, Navigation } from 'lucide-react';

interface WeatherWidgetProps {
  data: WeatherData | null;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  
  if (c.includes('sun') || c.includes('clear')) {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <div className="absolute w-16 h-16 bg-yellow-400 rounded-full blur-sm"></div>
        <svg className="animate-sun w-full h-full text-yellow-400/80" viewBox="0 0 100 100">
          {[...Array(8)].map((_, i) => (
            <rect key={i} x="48" y="10" width="4" height="15" rx="2" transform={`rotate(${i * 45} 50 50)`} fill="currentColor" />
          ))}
        </svg>
      </div>
    );
  }
  
  if (c.includes('rain') || c.includes('drizzle') || c.includes('shower')) {
    return (
      <div className="relative w-32 h-32 flex items-center justify-center">
        <svg className="w-24 h-24 text-blue-400 animate-cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.4-1.9-4.4-4.3-4.5C17.2 6.5 13.9 4 10 4 6.5 4 3.7 6.3 3.1 9.5 1.2 10.3 0 12.3 0 14.5 0 17 2 19 4.5 19H17.5z" fill="currentColor" fillOpacity="0.2" />
        </svg>
        <div className="absolute inset-0 flex justify-around px-8 pt-16">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="w-0.5 h-4 bg-blue-400 rounded-full rain-line" style={{ animationDelay: `${i * 0.4}s` }}></div>
          ))}
        </div>
      </div>
    );
  }

  // Default: Cloud / Overcast
  return (
    <div className="relative w-32 h-32 flex items-center justify-center">
      <svg className="w-24 h-24 text-zinc-400 animate-cloud" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
         <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.4-1.9-4.4-4.3-4.5C17.2 6.5 13.9 4 10 4 6.5 4 3.7 6.3 3.1 9.5 1.2 10.3 0 12.3 0 14.5 0 17 2 19 4.5 19H17.5z" fill="currentColor" fillOpacity="0.1" />
      </svg>
      <svg className="absolute w-16 h-16 text-zinc-500 translate-x-4 -translate-y-2 opacity-50" viewBox="0 0 24 24" fill="currentColor">
         <path d="M17.5 19c2.5 0 4.5-2 4.5-4.5 0-2.4-1.9-4.4-4.3-4.5C17.2 6.5 13.9 4 10 4 6.5 4 3.7 6.3 3.1 9.5 1.2 10.3 0 12.3 0 14.5 0 17 2 19 4.5 19H17.5z" />
      </svg>
    </div>
  );
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  if (!data || data.condition === "Unknown") return (
    <div className="h-full flex flex-col items-center justify-center bg-zinc-900/20 rounded-[3rem] border border-zinc-800/50 p-12">
      <div className="w-16 h-16 rounded-full border-4 border-zinc-800 border-t-indigo-500 animate-spin"></div>
      <p className="mt-6 text-zinc-500 font-bold uppercase tracking-[0.3em] text-xs">Paris Weather Active</p>
    </div>
  );

  return (
    <div className="p-12 bg-gradient-to-br from-zinc-900/60 to-transparent rounded-[3rem] border border-zinc-800/40 backdrop-blur-2xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
      {/* Background Glow */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-500/5 blur-[100px] rounded-full group-hover:bg-indigo-500/10 transition-colors duration-1000"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Navigation className="w-5 h-5 text-indigo-500 fill-indigo-500/20" />
            <h2 className="text-4xl font-black text-white tracking-tight">PARIS</h2>
          </div>
          <p className="text-2xl text-zinc-500 font-medium capitalize tracking-wide">{data.condition}</p>
        </div>
        <WeatherIcon condition={data.condition} />
      </div>

      <div className="flex items-center gap-10 my-8 relative z-10">
        <div className="relative">
          <span className="text-[10rem] font-black text-white leading-none font-mono tracking-tighter drop-shadow-2xl">
            {Math.round(data.temp)}<span className="text-indigo-500 text-6xl align-top mt-8 inline-block">°C</span>
          </span>
        </div>
        
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 px-5 py-2 bg-red-500/10 rounded-2xl border border-red-500/20 shadow-lg shadow-red-900/10">
            <Thermometer className="w-5 h-5 text-red-500" />
            <span className="text-red-100 text-xl font-black">{Math.round(data.high)}°</span>
          </div>
          <div className="flex items-center gap-3 px-5 py-2 bg-blue-500/10 rounded-2xl border border-blue-500/20 shadow-lg shadow-blue-900/10">
            <Thermometer className="w-5 h-5 text-blue-500" />
            <span className="text-blue-100 text-xl font-black">{Math.round(data.low)}°</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-8 border-t border-zinc-800/50 pt-10 relative z-10">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-inner">
            <Droplets className="text-indigo-400 w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">Humidity</p>
            <p className="text-3xl font-black text-zinc-100">{data.humidity}<span className="text-sm ml-1 text-zinc-600">%</span></p>
          </div>
        </div>
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 rounded-2xl bg-zinc-800/50 flex items-center justify-center border border-zinc-700/30">
            <Wind className="text-zinc-400 w-7 h-7" />
          </div>
          <div>
            <p className="text-xs text-zinc-500 uppercase font-black tracking-widest mb-1">Wind</p>
            <p className="text-3xl font-black text-zinc-100">14<span className="text-sm ml-1 text-zinc-600">km/h</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
