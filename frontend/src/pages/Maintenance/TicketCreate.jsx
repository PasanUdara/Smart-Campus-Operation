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
  const currentUserId = "student-123"; // දැනට hardcoded

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
      loadTickets(); // පෝස්ට් කළ පසු ලිස්ට් එක අප්ඩේට් කිරීම
    } catch (err) {
      alert("❌ Error placing ticket.");
    } finally {
      setLoading(false);
    }
  };

  const handleUserComment = async (id) => {
    const text = prompt("Add your comment/feedback:");
    if (text) {
      await addComment(id, currentUserId, text);
      loadTickets();
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-8 font-sans text-white">
      <div className="max-w-[1600px] mx-auto grid lg:grid-cols-12 gap-8">
        
        {/* LEFT SIDE: Community Feed (6 Columns) */}
        <div className="lg:col-span-7 space-y-6 overflow-y-auto max-h-screen pr-2 custom-scrollbar">
          <h2 className="text-2xl font-black text-yellow-400 uppercase italic tracking-tighter">Campus Feed.</h2>
          <p className="text-zinc-500 text-xs mb-6">See what's happening and provide feedback on ongoing issues.</p>
          
          {tickets.length === 0 ? <p className="text-zinc-700 italic">No tickets reported yet.</p> : 
            tickets.map(t => (
              <div key={t.id} className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-6 hover:border-zinc-700 transition-all">
                <div className="flex gap-4">
                  {t.imageUrls?.[0] && (
                    <img src={`http://localhost:8080/uploads/${t.imageUrls[0]}`} className="w-24 h-24 rounded-2xl object-cover border border-zinc-800" alt="incident" />
                  )}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className="text-lg font-bold text-white">{t.resourceId}</h4>
                      <span className="text-[10px] bg-zinc-800 px-2 py-1 rounded text-zinc-400">{t.status}</span>
                    </div>
                    <p className="text-zinc-500 text-xs mt-1">{t.description.substring(0, 80)}...</p>
                    
                    <div className="flex items-center gap-4 mt-4">
                      <button onClick={() => handleUserComment(t.id)} className="text-yellow-400 text-[10px] font-black uppercase hover:underline">💬 Comment</button>
                      <div className="flex text-yellow-500 text-xs">⭐⭐⭐⭐⭐</div>
                    </div>

                    {/* සරලව කමෙන්ට් පෙන්වීම */}
                    {t.comments?.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-zinc-800 space-y-2">
                        {t.comments.slice(-2).map(c => (
                          <p key={c.id} className="text-[10px] text-zinc-400"><span className="font-bold text-yellow-400/50">{c.authorId}:</span> {c.text}</p>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))
          }
        </div>

        {/* RIGHT SIDE: Report Form (5 Columns) */}
        <div className="lg:col-span-5">
          <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-[2.5rem] shadow-2xl sticky top-8">
            <div className="text-center mb-8">
              <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4 italic">Action Required</div>
              <h2 className="text-3xl font-black text-white uppercase">Post <span className="text-yellow-400">Incident.</span></h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Your Name" className="w-full p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 text-xs outline-none focus:border-yellow-400" 
                  onChange={e => setForm({...form, reporterName: e.target.value})} required />
                <input type="text" placeholder="Student ID" className="w-full p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 text-xs outline-none focus:border-yellow-400" 
                  onChange={e => setForm({...form, studentId: e.target.value})} required />
              </div>
              
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder="Location (Lab 01)" className="w-full p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 text-xs outline-none focus:border-yellow-400" 
                  onChange={e => setForm({...form, resourceId: e.target.value})} required />
                <select className="w-full p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 text-xs outline-none" 
                  onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Electrical">Electrical</option><option value="Plumbing">Plumbing</option><option value="IT">IT</option>
                </select>
              </div>

              <textarea placeholder="Tell us what's broken..." className="w-full p-3 bg-zinc-800 text-white rounded-xl border border-zinc-700 text-xs h-24 outline-none focus:border-yellow-400" 
                onChange={e => setForm({...form, description: e.target.value})} required></textarea>

              <div className="p-4 border-2 border-dashed border-zinc-700 rounded-2xl text-center bg-zinc-950/50">
                <input type="file" multiple className="text-[10px]" onChange={e => setImages(Array.from(e.target.files).slice(0, 3))} />
                <p className="text-[9px] text-zinc-600 mt-2">Max 3 images (JPG/PNG)</p>
              </div>

              <button type="submit" disabled={loading} className="w-full bg-yellow-400 text-black p-4 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-yellow-500 transition-all">
                {loading ? 'Processing...' : 'Submit to Maintenance'}
              </button>
            </form>
          </div>
        </div>
      </div>
      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default TicketCreate;