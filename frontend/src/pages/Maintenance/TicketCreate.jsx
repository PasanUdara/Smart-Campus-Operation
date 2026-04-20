import React, { useState, useEffect } from 'react';
import { createTicket, getAllTickets, addComment } from '../../api/ticketApi';
import { useNavigate } from 'react-router-dom';

const TicketCreate = () => {
  const [form, setForm] = useState({
    resourceId: '',
    building: 'Main Building',
    category: 'Electrical',
    priority: 'LOW',
    description: '',
    reporterName: '',
    studentId: '',
    contactDetails: '',
    email: ''
  });
  
  const [tickets, setTickets] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const currentUserId = "student-123";

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    const res = await getAllTickets();
    setTickets(res.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    images.forEach(img => data.append('images', img));

    try {
      await createTicket(data);
      alert("🚀 Incident Reported Successfully!");
      loadTickets();
      // Reset form logic if needed
    } catch (err) {
      alert("❌ Error placing ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserComment = async (id) => {
    const text = prompt("Add your feedback on this incident:");
    if (text) {
      await addComment(id, currentUserId, text);
      loadTickets();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-10 font-sans text-white selection:bg-yellow-400 selection:text-black">
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-12">
        
        {/* 🟡 LEFT SIDE: LIVE CAMPUS FEED (Community Transparency) */}
        <div className="lg:col-span-6 space-y-8 overflow-y-auto max-h-[90vh] pr-4 custom-scrollbar">
          <div className="flex items-center gap-4 mb-10">
            <div className="w-2 h-10 bg-yellow-400 rounded-full"></div>
            <div>
              <h2 className="text-4xl font-black uppercase italic tracking-tighter">Live <span className="text-yellow-400">Feed.</span></h2>
              <p className="text-zinc-500 text-[10px] font-bold uppercase tracking-[0.2em]">Community Transparency Portal</p>
            </div>
          </div>
          
          {tickets.length === 0 ? (
             <div className="bg-zinc-900/30 border border-zinc-800 p-10 rounded-[2rem] text-center italic text-zinc-700">No active incidents reported.</div>
          ) : (
            tickets.map(t => (
              <div key={t.id} className="group bg-zinc-900/40 border border-zinc-800 rounded-[2.5rem] p-8 hover:border-yellow-400/20 transition-all duration-500 hover:shadow-2xl hover:shadow-yellow-400/5">
                <div className="flex flex-col md:flex-row gap-6">
                  {t.imageUrls?.[0] && (
                    <div className="relative overflow-hidden rounded-2xl w-full md:w-32 h-32 border border-zinc-800">
                        <img src={`http://localhost:8080/uploads/${t.imageUrls[0]}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt="incident" />
                    </div>
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="text-xl font-black text-white uppercase italic tracking-tight">{t.resourceId}</h4>
                      <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${t.status === 'OPEN' ? 'bg-yellow-400 text-black' : 'bg-zinc-800 text-zinc-400'}`}>
                        {t.status}
                      </span>
                    </div>
                    <p className="text-zinc-500 text-xs leading-relaxed mb-4">{t.description.substring(0, 100)}...</p>
                    
                    <div className="flex items-center justify-between mt-6">
                      <div className="flex items-center gap-4">
                        <button onClick={() => handleUserComment(t.id)} className="bg-zinc-800 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-xl text-[10px] font-black uppercase transition-all">
                          💬 Feedback
                        </button>
                        <div className="flex text-yellow-500 text-[10px] tracking-widest">⭐⭐⭐⭐⭐</div>
                      </div>
                      <span className="text-[9px] font-bold text-zinc-700 uppercase tracking-widest">{new Date(t.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* 🖤 RIGHT SIDE: ENHANCED REPORT FORM (The Master Form) */}
        <div className="lg:col-span-6">
          <div className="bg-zinc-900 border border-zinc-800 p-10 md:p-14 rounded-[3.5rem] shadow-2xl relative overflow-hidden sticky top-10">
            <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-400/5 blur-[80px] rounded-full"></div>
            
            <div className="mb-12">
              <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest mb-4 italic">System Entry Required</div>
              <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter">Report <span className="text-yellow-400">Incident.</span></h2>
              <p className="text-zinc-500 mt-2 text-sm">Fill the parameters below to initiate the maintenance sequence.</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Identity Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Reporter Name</label>
                  <input type="text" placeholder="Full Name" className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all font-bold text-sm" 
                    onChange={e => setForm({...form, reporterName: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Student ID (IT NO)</label>
                  <input type="text" placeholder="IT21XXXXXX" className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all font-bold text-sm" 
                    onChange={e => setForm({...form, studentId: e.target.value})} required />
                </div>
              </div>

              {/* Contact Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Contact Number</label>
                  <input type="text" placeholder="07XXXXXXXX" className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all font-bold text-sm" 
                    onChange={e => setForm({...form, contactDetails: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Official Email</label>
                  <input type="email" placeholder="name@sliit.lk" className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all font-bold text-sm" 
                    onChange={e => setForm({...form, email: e.target.value})} required />
                </div>
              </div>

              {/* Location & Category Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Location/Asset ID</label>
                  <input type="text" placeholder="e.g. Lab 01 - PC 05" className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all font-bold text-sm" 
                    onChange={e => setForm({...form, resourceId: e.target.value})} required />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Building Block</label>
                  <select className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all font-bold text-sm appearance-none" 
                    onChange={e => setForm({...form, building: e.target.value})}>
                    <option value="Main Building">Main Building</option>
                    <option value="New Faculty">New Faculty</option>
                    <option value="Auditorium">Auditorium Hub</option>
                    <option value="Hostels">University Hostels</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Description</label>
                <textarea placeholder="Provide details of the failure..." className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all font-bold text-sm h-32" 
                  onChange={e => setForm({...form, description: e.target.value})} required></textarea>
              </div>

              {/* Media Upload */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                 <div className="p-6 border-2 border-dashed border-zinc-700 rounded-3xl text-center bg-zinc-950/20 hover:border-yellow-400 transition-all cursor-pointer relative group">
                    <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" onChange={e => setImages(Array.from(e.target.files).slice(0, 3))} />
                    <div className="text-zinc-600 group-hover:text-yellow-400">
                        <span className="text-2xl">📸</span>
                        <p className="text-[9px] mt-2 font-black uppercase tracking-widest">{images.length > 0 ? `${images.length} Files Ready` : 'Attach Photos'}</p>
                    </div>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2">Category</label>
                    <select className="w-full p-4 bg-zinc-800/50 text-white rounded-2xl border border-zinc-700 font-bold text-sm outline-none" 
                        onChange={e => setForm({...form, category: e.target.value})}>
                        <option value="Electrical">Electrical</option>
                        <option value="Plumbing">Plumbing</option>
                        <option value="Network">Network/IT</option>
                        <option value="Other">Other Issues</option>
                    </select>
                 </div>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black p-5 rounded-[1.8rem] font-black text-sm uppercase tracking-[0.2em] shadow-xl shadow-yellow-400/10 hover:bg-yellow-500 transition-all active:scale-95 flex justify-center items-center gap-3 mt-4">
                {loading ? <div className="w-5 h-5 border-2 border-black border-t-transparent animate-spin rounded-full"></div> : 'Initiate Maintenance Request'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #eab308; }
      `}</style>
    </div>
  );
};

export default TicketCreate;