import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

const Home = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setTimeout(() => setLoading(false), 1500); // 
  }, []);

  if (loading) return <Loader />;

  return (
    <div className="bg-zinc-950 min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-yellow-400/5 blur-[150px] rounded-full"></div>
        <div className="max-w-7xl mx-auto text-center relative z-10">
          <div className="inline-block border border-yellow-400/30 px-4 py-1.5 rounded-full text-yellow-400 text-[9px] font-black uppercase tracking-[0.3em] mb-6">
            Institutional Operations Management
          </div>
          <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter mb-8 leading-none">
            SMART CAMPUS<br />
            <span className="text-yellow-400">OPERATIONS HUB.</span>
          </h1>
          <p className="text-zinc-500 max-w-2xl mx-auto text-sm md:text-lg font-medium leading-relaxed mb-12">
            A unified platform for campus facility bookings and 
            real-time maintenance tracking. Designed for role-based access, 
            efficiency, and operational transparency.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <button onClick={() => navigate('/report-fault')} className="bg-yellow-400 text-black px-12 py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-yellow-500 transition-all hover:-translate-y-1 shadow-2xl shadow-yellow-400/20">
              Launch Maintenance
            </button>
            <button className="bg-zinc-900 border border-zinc-800 text-white px-12 py-5 rounded-2xl font-black uppercase italic tracking-widest hover:bg-zinc-800 transition-all">
              Facility Booking
            </button>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          {/* Card 1: Maintenance */}
          <div className="group bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] hover:border-yellow-400/50 transition-all cursor-pointer" onClick={() => navigate('/report-fault')}>
            <div className="flex justify-between items-start mb-10">
              <div className="bg-yellow-400 text-black w-14 h-14 rounded-2xl flex items-center justify-center text-2xl">🛠️</div>
              <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Module 01</span>
            </div>
            <h3 className="text-3xl font-black mb-4 uppercase italic">Maintenance & <span className="text-yellow-400">Incidents</span></h3>
            <p className="text-zinc-500 text-sm leading-relaxed mb-8">Report faults, track technician updates, and manage resolutions with a robust audit trail.</p>
            <div className="h-1 w-20 bg-yellow-400 group-hover:w-full transition-all duration-500"></div>
          </div>

          {/* Card 2: Booking (Visual only as requested) */}
          <div className="group bg-zinc-900 border border-zinc-800 p-10 rounded-[3rem] opacity-60">
            <div className="flex justify-between items-start mb-10">
              <div className="bg-zinc-800 text-white w-14 h-14 rounded-2xl flex items-center justify-center text-2xl">📅</div>
              <span className="text-[10px] font-black text-zinc-700 uppercase tracking-widest">Module 02</span>
            </div>
            <h3 className="text-3xl font-black mb-4 uppercase italic text-zinc-400">Facility & <br />Asset Booking</h3>
            <p className="text-zinc-600 text-sm leading-relaxed mb-8">Manage campus labs, equipment, and room reservations with role-based scheduling.</p>
            <p className="text-[10px] font-bold text-yellow-400 italic">SYSTEM UPGRADE IN PROGRESS</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;