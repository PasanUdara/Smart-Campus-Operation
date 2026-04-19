import React, { useEffect, useState } from 'react';
import { getAllTickets, updateStatus, deleteTicket, addComment, deleteComment } from '../../api/ticketApi';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const currentUserId = "staff-001"; // Auth එකට පසු වෙනස් කළ හැක

    useEffect(() => { load(); }, []);
    const load = async () => { const res = await getAllTickets(); setTickets(res.data); };

    const handleStatus = async (id, status) => {
        const note = (status === 'RESOLVED' || status === 'REJECTED') ? prompt(`Reason for ${status}:`) : "";
        await updateStatus(id, status, note, currentUserId);
        load();
    };

    const handleComment = async (id) => {
        const text = prompt("Add a note:");
        if (text) { await addComment(id, currentUserId, text); load(); }
    };

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-4xl font-black text-slate-900 mb-10 border-l-8 border-blue-600 pl-4">Campus Operations Console</h2>
                
                <div className="grid gap-8">
                    {tickets.map(t => (
                        <div key={t.id} className="bg-white p-8 rounded-[2.5rem] shadow-2xl shadow-slate-200/50 flex flex-col lg:flex-row gap-8 border border-slate-100 hover:scale-[1.01] transition-transform">
                            <div className="flex-1">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-2xl font-bold text-slate-800">{t.resourceId}</h3>
                                    <span className={`px-4 py-1.5 rounded-full text-[10px] font-black tracking-widest uppercase ${t.status === 'OPEN' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>{t.status}</span>
                                </div>
                                <p className="text-slate-500 text-sm leading-relaxed mb-6">{t.description}</p>
                                
                                <div className="flex flex-wrap gap-3 mt-auto">
                                    <select onChange={(e) => handleStatus(t.id, e.target.value)} value={t.status} className="text-xs font-bold bg-slate-100 border-none rounded-xl p-3 focus:ring-0">
                                        <option value="OPEN">OPEN</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="RESOLVED">RESOLVED</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                    <button onClick={() => handleComment(t.id)} className="bg-blue-600 text-white px-5 py-3 rounded-xl text-xs font-bold hover:bg-blue-700 transition-all">+ Add Internal Note</button>
                                    <button onClick={() => deleteTicket(t.id).then(load)} className="p-3 text-rose-500 hover:bg-rose-50 rounded-xl transition-all">🗑️</button>
                                </div>
                            </div>

                            <div className="w-full lg:w-80 space-y-6">
                                <div className="flex gap-3">
                                    {t.imageUrls.map((img, i) => (
                                        <img key={i} src={`http://localhost:8080/uploads/${img}`} className="w-16 h-16 rounded-2xl object-cover border-4 border-slate-50 shadow-sm cursor-zoom-in hover:scale-110 transition-all" onClick={() => setSelectedImg(`http://localhost:8080/uploads/${img}`)} />
                                    ))}
                                </div>
                                <div className="bg-slate-50 p-5 rounded-[1.5rem] border border-slate-100">
                                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Internal Timeline</h4>
                                    <div className="space-y-3">
                                        {t.comments.map(c => (
                                            <div key={c.id} className="group relative bg-white p-3 rounded-xl shadow-sm border border-slate-100 flex justify-between">
                                                <p className="text-xs text-slate-600">{c.text}</p>
                                                {c.authorId === currentUserId && (
                                                    <button onClick={() => deleteComment(t.id, c.id).then(load)} className="text-rose-500 font-bold opacity-0 group-hover:opacity-100">×</button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {selectedImg && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-md z-[100] flex justify-center items-center p-4" onClick={() => setSelectedImg(null)}>
                    <img src={selectedImg} className="max-w-full max-h-[90vh] rounded-3xl border-8 border-white/10" alt="Preview" />
                </div>
            )}
        </div>
    );
};
export default TicketList;