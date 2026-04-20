import React, { useState, useEffect } from 'react';
import { createTicket, getAllTickets, addComment } from '../../api/ticketApi';
import { useNavigate } from 'react-router-dom';

const TicketCreate = () => {
  const [form, setForm] = useState({
    resourceId: '', building: 'Main Building', category: 'Electrical',
    priority: 'LOW', description: '', reporterName: '',
    studentId: '', contactDetails: '', email: ''
  });
  
  const [tickets, setTickets] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUserId = "student-123";

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    try {
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) { 
      console.error("Transmission Error:", err); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    images.forEach(img => data.append('images', img));

    try {
      await createTicket(data);
      alert("⚡ SYSTEM UPDATE: Incident successfully broadcasted!");
      setForm({
        resourceId: '', building: 'Main Building', category: 'Electrical',
        priority: 'LOW', description: '', reporterName: '',
        studentId: '', contactDetails: '', email: ''
      });
      setImages([]);
      loadTickets();
    } catch (err) {
      alert("🚨 CRITICAL ERROR: Uplink failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserComment = async (id) => {
    const text = prompt("UPLINK: Enter your feedback note...");
    if (text) {
      await addComment(id, currentUserId, text);
      loadTickets();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-10 font-sans text-white selection:bg-yellow-400 selection:text-black">
      
      {/* Subtle Grid Background Effect */}
      <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

      <div className="max-w-[1700px] mx-auto grid lg:grid-cols-12 gap-10 relative z-10">
        
        {/* 🟡 LEFT SIDE: LIVE OPERATIONS FEED (Transparency Hub) */}
        <div className="lg:col-span-5 space-y-6 max-h-[90vh] overflow-y-auto pr-4 custom-scrollbar">
          <div className="sticky top-0 bg-[#050505]/90 backdrop-blur-xl pb-6 z-20 border-b border-zinc-900 mb-6">
            <h2 className="text-3xl font-black italic tracking-tighter uppercase leading-none flex items-center gap-3">
              <span className="w-2 h-8 bg-yellow-400 rounded-full"></span>
              Live <span className="text-yellow-400 font-light">Operations.</span>
            </h2>
            <p className="text-zinc-600 text-[9px] font-bold uppercase tracking-[0.4em] mt-3 ml-5">Network Transparency & Public Log</p>
          </div>
          
          {tickets.length === 0 ? (
             <div className="border border-zinc-900/50 p-12 rounded-[2rem] text-center italic text-zinc-800 font-bold uppercase text-[10px] tracking-widest">No active transmissions detected.</div>
          ) : (
            tickets.map(t => (
              <div key={t.id} className="group relative bg-zinc-900/20 border border-zinc-800/60 rounded-[2rem] overflow-hidden hover:border-yellow-400/40 transition-all duration-500 backdrop-blur-sm shadow-xl">
                <div className="p-6 md:p-8 space-y-6">
                  
                  <div className="flex flex-col md:flex-row gap-6">
                    {t.imageUrls?.[0] && (
                      <div className="relative h-24 w-24 flex-shrink-0 overflow-hidden rounded-2xl border border-zinc-800">
                          <img src={`http://localhost:8080/uploads/${t.imageUrls[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="incident" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="text-xl font-black text-white italic tracking-tight">{t.resourceId}</h4>
                        <span className={`px-3 py-0.5 rounded-lg text-[8px] font-black uppercase tracking-widest ${t.status === 'OPEN' ? 'bg-yellow-400 text-black shadow-[0_0_15px_rgba(250,204,21,0.3)]' : 'bg-emerald-500 text-white'}`}>
                          {t.status}
                        </span>
                      </div>
                      <p className="text-zinc-500 text-xs leading-relaxed line-clamp-2 italic font-medium opacity-80">"{t.description}"</p>
                    </div>
                  </div>

                  {/* 💬 ALL COMMENTS BLOCK (Enhanced Scrollable Section) */}
                  <div className="space-y-3 bg-black/40 p-5 rounded-2xl border border-zinc-800/40">
                    <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-800/50 pb-2">Centralized Discussion Thread</p>
                    <div className="max-h-32 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                      {t.comments && t.comments.length > 0 ? (
                        t.comments.map(c => (
                          <div key={c.id} className="text-[10px] bg-zinc-800/20 p-2 rounded-lg border-l-2 border-yellow-400/30">
                            <div className="flex justify-between mb-1">
                              <span className="text-yellow-400 font-bold uppercase tracking-tighter">{c.authorId}</span>
                              <span className="text-zinc-600 text-[8px]">{new Date(c.timestamp).toLocaleTimeString()}</span>
                            </div>
                            <p className="text-zinc-400 leading-normal italic">{c.text}</p>
                          </div>
                        ))
                      ) : (
                        <p className="text-[9px] text-zinc-700 italic">No feedback logged in this thread yet.</p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4">
                      <button onClick={() => handleUserComment(t.id)} className="flex items-center gap-2 bg-zinc-800/50 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-xl transition-all group/btn">
                          <span className="text-sm">💬</span>
                          <span className="text-[9px] font-black uppercase tracking-widest">Append Note</span>
                      </button>
                      <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">{t.building} // {new Date(t.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ⚡ RIGHT SIDE: PREMIUM REPORTING CONSOLE */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-900/30 border border-zinc-800/80 p-8 md:p-14 rounded-[3.5rem] backdrop-blur-2xl shadow-2xl relative overflow-hidden sticky top-10 border-t-yellow-400/20">
            
            <div className="mb-10">
              <div className="inline-block border-l-4 border-yellow-400 pl-4 mb-4">
                <span className="text-yellow-400 font-black text-[9px] tracking-[0.4em] uppercase block mb-1">Incident Management</span>
                {/* DECREASED HEADER SIZE AS REQUESTED */}
                <h2 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none">
                  File <span className="text-yellow-400">Report.</span>
                </h2>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* identity Section */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Full Identity Name</label>
                  <input type="text" placeholder="CHANKA EKANAYAKA" className="w-full p-4 bg-black/40 text-white rounded-2xl border border-zinc-800 outline-none focus:border-yellow-400 transition-all font-bold text-xs" 
                    value={form.reporterName} onChange={e => setForm({...form, reporterName: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Student ID (IT NO)</label>
                  <input type="text" placeholder="IT2XXXXXXX" className="w-full p-4 bg-black/40 text-white rounded-2xl border border-zinc-800 outline-none focus:border-yellow-400 transition-all font-bold text-xs" 
                    value={form.studentId} onChange={e => setForm({...form, studentId: e.target.value})} required />
                </div>
              </div>

              {/* Communication Row */}
              <div className="grid md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Direct Contact</label>
                  <input type="text" placeholder="07XXXXXXXX" className="w-full p-4 bg-black/40 text-white rounded-2xl border border-zinc-800 outline-none focus:border-yellow-400 transition-all font-bold text-xs" 
                    value={form.contactDetails} onChange={e => setForm({...form, contactDetails: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Official Email</label>
                  <input type="email" placeholder="name@sliit.lk" className="w-full p-4 bg-black/40 text-white rounded-2xl border border-zinc-800 outline-none focus:border-yellow-400 transition-all font-bold text-xs" 
                    value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>

              {/* Hardware Location Section */}
              <div className="grid md:grid-cols-3 gap-5">
                <div className="md:col-span-2 space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Location / Zone ID</label>
                  <input type="text" placeholder="e.g. Lab 04 - Server 01" className="w-full p-4 bg-black/40 text-white rounded-2xl border border-zinc-800 outline-none focus:border-yellow-400 transition-all font-bold text-xs" 
                    value={form.resourceId} onChange={e => setForm({...form, resourceId: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Building</label>
                  <select className="w-full p-4 bg-black/40 text-white rounded-2xl border border-zinc-800 outline-none focus:border-yellow-400 font-bold text-xs appearance-none" 
                    value={form.building} onChange={e => setForm({...form, building: e.target.value})}>
                    <option value="Main Building">Main Block</option>
                    <option value="New Faculty">New Faculty</option>
                    <option value="Auditorium">Auditorium</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-4">Incident Log (Description)</label>
                <textarea placeholder="Describe the failure..." className="w-full p-5 bg-black/40 text-white rounded-[2rem] border border-zinc-800 outline-none focus:border-yellow-400 transition-all font-bold text-xs h-32 custom-scrollbar" 
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} required></textarea>
              </div>

              {/* Media & Action Section */}
              <div className="grid md:grid-cols-2 gap-8 items-end">
                 <div className="relative p-6 border-2 border-dashed border-zinc-800 rounded-3xl text-center bg-black/20 hover:border-yellow-400/50 transition-all cursor-pointer">
                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer z-10" onChange={e => setImages(Array.from(e.target.files).slice(0, 3))} />
                    <div className="flex flex-col items-center">
                        <span className="text-xl mb-2">📸</span>
                        <p className="text-[8px] font-black uppercase tracking-widest text-zinc-600">
                          {images.length > 0 ? `${images.length} Evidence Logs Attached` : 'Attach Evidence'}
                        </p>
                    </div>
                 </div>
                 <div className="grid grid-cols-2 gap-3">
                    <div className="space-y-2">
                        <label className="text-[8px] font-black text-zinc-600 uppercase ml-2">Priority</label>
                        <select className="w-full p-3 bg-black/40 text-yellow-400 rounded-xl border border-zinc-800 font-black text-[9px] uppercase tracking-widest outline-none" 
                            value={form.priority} onChange={e => setForm({...form, priority: e.target.value})}>
                            <option value="LOW">Low</option>
                            <option value="MEDIUM">Med</option>
                            <option value="HIGH">High</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[8px] font-black text-zinc-600 uppercase ml-2">Category</label>
                        <select className="w-full p-3 bg-black/40 text-white rounded-xl border border-zinc-800 font-bold text-[9px] uppercase tracking-widest outline-none" 
                            value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                            <option value="Electrical">Electrical</option>
                            <option value="Plumbing">Plumbing</option>
                            <option value="Network">IT</option>
                        </select>
                    </div>
                 </div>
              </div>

              <button 
                type="submit" 
                disabled={loading} 
                className="w-full group relative overflow-hidden bg-yellow-400 text-black p-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] shadow-xl hover:bg-yellow-500 transition-all flex justify-center items-center gap-4 mt-4"
              >
                {loading ? "TRANSMITTING DATA..." : "SUBMIT REPORT"}
                <div className="absolute inset-0 bg-white/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-500"></div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Global CSS for Scrollbar & High-End Look */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #facc15; }
        input::placeholder, textarea::placeholder { color: #222; font-weight: 900; text-transform: uppercase; font-size: 9px; letter-spacing: 0.1em; }
        select { cursor: pointer; }
      `}</style>
    </div>
  );
};

export default TicketCreate;