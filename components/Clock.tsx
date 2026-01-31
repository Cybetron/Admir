
import React, { useState, useEffect } from 'react';

const Clock: React.FC = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formattedTime = time.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });

  const seconds = time.getSeconds().toString().padStart(2, '0');

  const formattedDate = time.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className="flex flex-col items-center justify-center p-6 sm:p-8 lg:p-10 bg-zinc-900/30 rounded-3xl border border-zinc-800/50 backdrop-blur-xl shadow-2xl relative group overflow-hidden">
      {/* Glow Effect */}
      <div className="absolute inset-0 bg-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="flex items-baseline gap-1 sm:gap-2 relative z-10">
        <div className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] font-black leading-none tracking-tighter text-white font-mono">
          {formattedTime}
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-mono font-bold text-indigo-500/40 mb-2 sm:mb-4 lg:mb-6 w-8 sm:w-12">
          {seconds}
        </div>
      </div>
      
      <div className="text-xs sm:text-lg lg:text-2xl font-bold text-zinc-500 mt-2 uppercase tracking-[0.2em] sm:tracking-[0.4em] text-center relative z-10">
        {formattedDate}
      </div>
    </div>
  );
};

export default Clock;
