import React from 'react';

const Loader = () => (
  <div className="fixed inset-0 bg-zinc-950 z-[999] flex flex-col items-center justify-center">
    <div className="relative w-20 h-20">
      <div className="absolute inset-0 border-4 border-yellow-400/20 rounded-full"></div>
      <div className="absolute inset-0 border-4 border-yellow-400 rounded-full border-t-transparent animate-spin"></div>
    </div>
    <h2 className="mt-6 text-yellow-400 font-black tracking-[0.3em] uppercase text-[10px]">Smart Campus Hub</h2>
  </div>
);

export default Loader;