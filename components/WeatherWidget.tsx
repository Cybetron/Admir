
import React from 'react';
import { WeatherData } from '../types';
import { Thermometer, Droplets, Wind, Sun, Cloud, CloudRain, CloudLightning, Snowflake, CloudFog } from 'lucide-react';

interface WeatherWidgetProps {
  data: WeatherData | null;
}

const WeatherIcon = ({ condition }: { condition: string }) => {
  const c = condition.toLowerCase();
  const iconClass = "w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24 xl:w-32 xl:h-32 drop-shadow-[0_0_20px_rgba(255,255,255,0.1)]";
  
  if (c.includes('sun') || c.includes('clear')) return <Sun className={`${iconClass} text-yellow-400`} />;
  if (c.includes('storm') || c.includes('thunder')) return <CloudLightning className={`${iconClass} text-purple-400`} />;
  if (c.includes('snow')) return <Snowflake className={`${iconClass} text-blue-100`} />;
  if (c.includes('rain') || c.includes('shower') || c.includes('drizzle')) return <CloudRain className={`${iconClass} text-blue-400`} />;
  if (c.includes('fog') || c.includes('mist')) return <CloudFog className={`${iconClass} text-zinc-400`} />;
  if (c.includes('cloud') || c.includes('overcast')) return <Cloud className={`${iconClass} text-zinc-300`} />;
  
  return <Cloud className={`${iconClass} text-zinc-500`} />;
};

const WeatherWidget: React.FC<WeatherWidgetProps> = ({ data }) => {
  if (!data || data.condition === "Unknown") return (
    <div className="h-full flex flex-col items-center justify-center bg-zinc-900/40 rounded-3xl border border-zinc-800/50 p-6 sm:p-12">
      <div className="w-10 h-10 sm:w-16 sm:h-16 rounded-full border-4 border-zinc-800 border-t-indigo-500 animate-spin"></div>
      <p className="mt-4 sm:mt-6 text-zinc-500 font-bold uppercase tracking-[0.2em] sm:tracking-[0.3em] text-[10px] sm:text-xs">Syncing Paris weather...</p>
    </div>
  );

  return (
    <div className="p-6 sm:p-8 lg:p-10 xl:p-12 bg-zinc-900/60 rounded-2xl sm:rounded-3xl lg:rounded-[3rem] border border-zinc-800/40 backdrop-blur-3xl h-full flex flex-col justify-between shadow-2xl relative overflow-hidden group">
      {/* Visual Accent */}
      <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-indigo-500/5 to-transparent pointer-events-none"></div>

      <div className="flex justify-between items-start relative z-10">
        <div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tighter mb-1 lg:mb-2">Paris, FR</h2>
          <p className="text-sm sm:text-lg lg:text-2xl xl:text-3xl text-indigo-400 font-bold capitalize tracking-tight">{data.condition}</p>
        </div>
        <WeatherIcon condition={data.condition} />
      </div>

      <div className="flex items-center gap-4 sm:gap-8 lg:gap-12 my-2 sm:my-4 lg:my-6 relative z-10">
        <div className="flex items-baseline">
          <span className="text-6xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[14rem] font-black text-white leading-none font-mono tracking-tighter drop-shadow-[0_10px_30px_rgba(0,0,0,0.5)]">
            {Math.round(data.temp)}
          </span>
          <span className="text-3xl sm:text-5xl lg:text-7xl xl:text-8xl font-black text-indigo-500 ml-2 sm:ml-4">°C</span>
        </div>
        
        <div className="flex flex-col gap-2 sm:gap-4 lg:gap-6">
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-red-500/10 rounded-xl sm:rounded-2xl border border-red-500/20">
            <Thermometer className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-red-500" />
            <span className="text-red-100 text-sm sm:text-xl lg:text-3xl font-black">{Math.round(data.high)}°</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 lg:gap-4 px-3 sm:px-4 lg:px-6 py-1.5 sm:py-2 lg:py-3 bg-blue-500/10 rounded-xl sm:rounded-2xl border border-blue-500/20">
            <Thermometer className="w-4 h-4 sm:w-6 sm:h-6 lg:w-8 lg:h-8 text-blue-500" />
            <span className="text-blue-100 text-sm sm:text-xl lg:text-3xl font-black">{Math.round(data.low)}°</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:gap-10 border-t border-zinc-800/50 pt-4 sm:pt-6 lg:pt-10 relative z-10">
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20">
            <Droplets className="text-indigo-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </div>
          <div>
            <p className="text-[8px] sm:text-[10px] lg:text-sm text-zinc-500 uppercase font-black tracking-widest mb-0.5 sm:mb-1">Humidity</p>
            <p className="text-lg sm:text-2xl lg:text-4xl font-black text-zinc-100">{data.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center gap-3 sm:gap-4 lg:gap-6">
          <div className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-xl sm:rounded-2xl bg-zinc-800 flex items-center justify-center border border-zinc-700">
            <Wind className="text-zinc-400 w-5 h-5 sm:w-6 sm:h-6 lg:w-8 lg:h-8" />
          </div>
          <div>
            <p className="text-[8px] sm:text-[10px] lg:text-sm text-zinc-500 uppercase font-black tracking-widest mb-0.5 sm:mb-1">Wind</p>
            <p className="text-lg sm:text-2xl lg:text-4xl font-black text-zinc-100">12<span className="text-[10px] sm:text-xs lg:text-lg ml-1 text-zinc-500">km/h</span></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WeatherWidget;
