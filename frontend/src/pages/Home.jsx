import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F5F5F7] font-sans text-slate-900">
      <div className="max-w-6xl mx-auto pt-24 px-6 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tight mb-4">
          Smart <span className="text-blue-600">Maintenance.</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-12">
          Official Smart Campus Incident Reporting System. Report electrical, plumbing, 
          or structural issues instantly to the maintenance team.
        </p>

        {/* ඔයාගේ ප්‍රධාන බටන් එක */}
        <button 
          onClick={() => navigate('/report-fault')}
          className="bg-black text-white px-10 py-4 rounded-full font-bold hover:scale-105 transition-transform shadow-2xl mb-20"
        >
          + Report New Incident
        </button>

        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-20">
          {/* 1. ටිකට් එකක් දාන තැන */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 text-left">
            <div className="w-14 h-14 bg-blue-500 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">🛠️</div>
            <h3 className="text-xl font-black mb-3">Report Fault</h3>
            <p className="text-slate-500 text-sm mb-8">Quickly report any broken facilities or maintenance needs with photos.</p>
            <button onClick={() => navigate('/report-fault')} className="w-full py-3 bg-slate-50 rounded-xl font-bold text-blue-600">Open Form</button>
          </div>

          {/* 2. තියෙන ටිකට් බලන තැන (Admin/Staff view) */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm hover:shadow-xl transition-all border border-slate-100 text-left">
            <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center text-2xl mb-6 shadow-lg">📋</div>
            <h3 className="text-xl font-black mb-3">Admin Dashboard</h3>
            <p className="text-slate-500 text-sm mb-8">Monitor reported incidents, assign technicians, and track resolution status.</p>
            <button onClick={() => navigate('/admin/tickets')} className="w-full py-3 bg-slate-50 rounded-xl font-bold text-slate-700">View All Tickets</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;