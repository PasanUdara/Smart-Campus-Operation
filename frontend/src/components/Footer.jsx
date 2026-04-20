import React from 'react';

const Footer = () => (
  <footer className="bg-zinc-950 border-t border-zinc-900 py-12 px-6">
    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
      <div className="text-center md:text-left">
        <p className="text-white font-black text-lg italic uppercase">Smart<span className="text-yellow-400">Campus.</span></p>
        <p className="text-zinc-500 text-[10px] mt-1 font-bold uppercase tracking-widest">Operations Hub • University Modernization</p>
      </div>
      <div className="flex gap-10 text-[9px] font-black uppercase tracking-widest text-zinc-600">
        <span className="text-zinc-400 italic">Built by Chanaka Ekanayaka</span>
        <span>MERN Stack</span>
        <span>SLIIT Data Science</span>
      </div>
      <p className="text-zinc-700 text-[9px] font-bold uppercase tracking-widest">© 2026 All Rights Reserved.</p>
    </div>
  </footer>
);

export default Footer;