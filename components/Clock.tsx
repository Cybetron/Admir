
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
    <div className="flex flex-col items-center justify-center p-12 bg-gradient-to-br from-zinc-900/60 to-zinc-900/10 rounded-[2.5rem] border border-zinc-800/50 backdrop-blur-xl shadow-2xl overflow-hidden relative group">
      {/* Decorative accent */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
      
      <div className="flex items-baseline gap-2">
        <div className="text-[12rem] font-black leading-none tracking-tighter text-white font-mono drop-shadow-[0_0_30px_rgba(255,255,255,0.05)]">
          {formattedTime}
        </div>
        <div className="text-4xl font-mono font-bold text-indigo-500/40 mb-8 w-16">
          {seconds}
        </div>
      </div>
      
      <div className="text-4xl font-medium text-zinc-500 mt-2 uppercase tracking-[0.3em] flex items-center gap-4">
        <span className="w-8 h-[2px] bg-zinc-800"></span>
        {formattedDate}
        <span className="w-8 h-[2px] bg-zinc-800"></span>
      </div>
    </div>
  );
};

export default Clock;
