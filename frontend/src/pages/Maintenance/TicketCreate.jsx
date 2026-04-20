import React, { useState, useEffect } from 'react';
import { createTicket, getAllTickets, addComment, editComment, deleteComment } from '../../api/ticketApi';

const TicketCreate = () => {
  const [form, setForm] = useState({
    resourceId: '', building: 'Main Building', category: 'Electrical',
    priority: 'LOW', description: '', reporterName: '',
    studentId: '', contactDetails: '', email: ''
  });
  
  const [tickets, setTickets] = useState([]);
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  
  // 🔴 වැදගත්: මෙය පසුව ඔයාගේ Login එකේ Student ID එකට සමාන කරන්න (උදා: IT21000000)
  const currentUserId = "student-123"; 

  useEffect(() => { loadTickets(); }, []);

  const loadTickets = async () => {
    try {
      const res = await getAllTickets();
      setTickets(res.data);
    } catch (err) { console.error("Sync Error:", err); }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    Object.keys(form).forEach(key => data.append(key, form[key]));
    images.forEach(img => data.append('images', img));

    try {
      await createTicket(data);
      alert("⚡ MISSION SUCCESS: Incident Logged!");
      setForm({ resourceId: '', building: 'Main Building', category: 'Electrical', priority: 'LOW', description: '', reporterName: '', studentId: '', contactDetails: '', email: '' });
      setImages([]);
      loadTickets();
    } catch (err) { alert("🚨 UPLINK FAILED."); }
    finally { setLoading(false); }
  };

  const handlePostComment = async (id) => {
    const text = prompt("Transmission: Enter feedback note...");
    if (text && text.trim() !== "") {
      await addComment(id, currentUserId, text);
      loadTickets();
    }
  };

  // ✅ FIXED: Edit Comment Function
  const handleEditComment = async (tId, cId, oldText) => {
    const newText = prompt("Update Transmission Log:", oldText);
    if (newText && newText.trim() !== "" && newText !== oldText) {
      try {
        await editComment(tId, cId, currentUserId, newText);
        loadTickets();
      } catch (err) {
        alert("🚨 Unauthorized or Uplink failed.");
      }
    }
  };

  const handleDeleteComment = async (tId, cId) => {
    if (window.confirm("Erase this record from system?")) {
      await deleteComment(tId, cId);
      loadTickets();
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] p-4 md:p-10 font-sans text-white selection:bg-yellow-400 overflow-x-hidden">
      <div className="max-w-[1700px] mx-auto grid lg:grid-cols-12 gap-10">
        
        {/* LEFT SIDE: FEED */}
        <div className="lg:col-span-5 space-y-6 max-h-[90vh] overflow-y-auto pr-4 custom-scrollbar">
          <h2 className="text-3xl font-black italic uppercase flex items-center gap-3">
            <span className="w-2 h-8 bg-yellow-400 rounded-full shadow-[0_0_15px_rgba(250,204,21,0.4)]"></span> Live Stream.
          </h2>
          {tickets.map(t => (
            <div key={t.id} className="bg-zinc-900/20 border border-zinc-800 p-6 rounded-[2rem] space-y-6 hover:border-yellow-400/30 transition-all shadow-xl backdrop-blur-sm">
              <div className="flex justify-between items-start">
                <h4 className="text-xl font-black italic uppercase tracking-tight">{t.resourceId}</h4>
                <span className="bg-yellow-400 text-black px-3 py-1 rounded-lg text-[8px] font-black uppercase">{t.status}</span>
              </div>
              <p className="text-zinc-500 text-xs leading-relaxed italic">"{t.description}"</p>
              
              {/* Comment Ownership & Feed Section */}
              <div className="bg-black/40 p-5 rounded-2xl border border-zinc-800/40 space-y-4">
                <p className="text-[8px] font-black text-zinc-600 uppercase tracking-widest border-b border-zinc-800/50 pb-2">Comms Discussion Thread</p>
                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                    {t.comments && t.comments.length > 0 ? t.comments.map(c => (
                    <div key={c.id} className="group/item bg-zinc-800/10 p-3 rounded-xl border-l-2 border-yellow-400/30">
                        <div className="flex justify-between items-start mb-1">
                            <span className="text-yellow-400 font-bold text-[10px] uppercase">{c.authorId}</span>
                            
                            {/* ✅ Ownership logic: පෙන්වන්නේ තමන්ගේ කමෙන්ට් වලට විතරයි */}
                            {c.authorId === currentUserId && (
                                <div className="flex gap-2 opacity-0 group-hover/item:opacity-100 transition-all">
                                    <button onClick={() => handleEditComment(t.id, c.id, c.text)} className="text-[8px] font-black uppercase text-zinc-500 hover:text-yellow-400">Edit</button>
                                    <button onClick={() => handleDeleteComment(t.id, c.id)} className="text-[8px] font-black uppercase text-zinc-500 hover:text-red-500">Del</button>
                                </div>
                            )}
                        </div>
                        <p className="text-zinc-400 text-[10px] italic leading-normal">"{c.text}"</p>
                    </div>
                    )) : <p className="text-[9px] text-zinc-800 italic">No transmissions recorded.</p>}
                </div>
              </div>
              <button onClick={() => handlePostComment(t.id)} className="flex items-center gap-2 bg-zinc-800/50 hover:bg-yellow-400 hover:text-black px-4 py-2 rounded-xl transition-all font-black text-[9px] uppercase tracking-widest">
                💬 Append Feedback
              </button>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE: REPORT FORM (REDUCED SIZE AS REQUESTED) */}
        <div className="lg:col-span-7">
          <div className="bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-[3.5rem] backdrop-blur-2xl border-t-yellow-400/20 shadow-2xl sticky top-10">
            <h2 className="text-4xl font-black text-white uppercase italic tracking-tighter mb-8">File <span className="text-yellow-400">Report.</span></h2>
            <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-5">
                <input type="text" placeholder="Full Identity Name" className="p-4 bg-black/40 rounded-xl border border-zinc-800 text-xs focus:border-yellow-400 outline-none transition-all" onChange={e => setForm({...form, reporterName: e.target.value})} required />
                <input type="text" placeholder="IT Number" className="p-4 bg-black/40 rounded-xl border border-zinc-800 text-xs focus:border-yellow-400 outline-none transition-all" onChange={e => setForm({...form, studentId: e.target.value})} required />
                <input type="text" placeholder="Contact Details" className="p-4 bg-black/40 rounded-xl border border-zinc-800 text-xs focus:border-yellow-400 outline-none transition-all" onChange={e => setForm({...form, contactDetails: e.target.value})} required />
                <input type="email" placeholder="Official Email" className="p-4 bg-black/40 rounded-xl border border-zinc-800 text-xs focus:border-yellow-400 outline-none transition-all" onChange={e => setForm({...form, email: e.target.value})} required />
                <input type="text" placeholder="Location / Resource ID" className="p-4 bg-black/40 rounded-xl border border-zinc-800 text-xs focus:border-yellow-400 outline-none transition-all" onChange={e => setForm({...form, resourceId: e.target.value})} required />
                <select className="p-4 bg-black/40 rounded-xl border border-zinc-800 text-xs text-zinc-500 outline-none appearance-none" onChange={e => setForm({...form, building: e.target.value})}>
                    <option value="Main Building">Main Block</option>
                    <option value="New Faculty">New Faculty</option>
                    <option value="Auditorium">Auditorium</option>
                </select>
                <textarea placeholder="Specify the operational failure in detail..." className="col-span-2 p-5 bg-black/40 rounded-[2rem] border border-zinc-800 text-xs h-32 focus:border-yellow-400 outline-none custom-scrollbar" onChange={e => setForm({...form, description: e.target.value})} required />
                <div className="col-span-2 flex items-center justify-between bg-black/20 p-4 rounded-2xl border border-dashed border-zinc-800">
                    <input type="file" multiple className="text-[10px] text-zinc-600" onChange={e => setImages(Array.from(e.target.files))} />
                    <span className="text-[8px] font-black text-zinc-700 uppercase tracking-widest">Max 3 images</span>
                </div>
                <button type="submit" disabled={loading} className="col-span-2 bg-yellow-400 text-black p-5 rounded-2xl font-black uppercase text-xs hover:bg-yellow-500 transition-all shadow-[0_15px_30px_rgba(250,204,21,0.1)] active:scale-95">
                    {loading ? "TRANSMITTING DATA..." : "EXECUTE REPORT SUBMISSION"}
                </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #facc15; border-radius: 10px; }
        input::placeholder, textarea::placeholder { color: #333; text-transform: uppercase; font-weight: 900; font-size: 9px; letter-spacing: 0.1em; }
      `}</style>
    </div>
  );
};
export default TicketCreate;