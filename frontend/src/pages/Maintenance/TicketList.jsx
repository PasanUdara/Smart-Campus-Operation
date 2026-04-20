import React, { useEffect, useState } from 'react';
import { getAllTickets, updateStatus, deleteTicket, deleteComment } from '../../api/ticketApi';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);
    const currentUserId = "admin-master"; 

    useEffect(() => { load(); }, []);
    const load = async () => { 
        setLoading(true); try { const res = await getAllTickets(); setTickets(res.data); } catch (err) { console.error(err); } finally { setLoading(false); }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        let reason = ""; let techId = "";
        if (newStatus === 'IN_PROGRESS') { techId = prompt("Assign Agent ID:"); }
        if (newStatus === 'REJECTED') { reason = prompt("Enter Rejection Reason:"); if (!reason) return; } 
        else if (newStatus === 'RESOLVED') { reason = prompt("Enter Resolution Notes:"); }
        await updateStatus(id, newStatus, reason, techId); load();
    };

    const handleDeleteComment = async (tId, cId) => {
        if(window.confirm("ADMIN OVERRIDE: Delete this feedback permanently?")) { await deleteComment(tId, cId); load(); }
    };

    return (
        <div className="p-6 md:p-12 bg-[#050505] min-h-screen text-white font-sans selection:bg-yellow-400">
            <h2 className="text-4xl font-black italic uppercase mb-10 border-b border-zinc-900 pb-6">Admin <span className="text-yellow-400">Console.</span></h2>
            <div className="grid gap-10">
                {tickets.map(t => (
                    <div key={t.id} className="bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] p-8 lg:p-12 flex flex-col lg:flex-row gap-10 shadow-2xl backdrop-blur-sm">
                        <div className="flex-1 space-y-6">
                            <div className="flex justify-between"><h3 className="text-3xl font-black uppercase italic tracking-tighter text-yellow-400">{t.resourceId}</h3><span className="text-[10px] font-black uppercase text-zinc-500">Status: {t.status}</span></div>
                            <div className="bg-black/40 p-6 rounded-2xl border border-zinc-800/50 italic text-zinc-400">"{t.description}"</div>
                            
                            <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/40">
                                <p className="text-[9px] font-black text-yellow-400 uppercase mb-4 tracking-widest">Communication Log</p>
                                <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                    {t.comments.map(c => (
                                        <div key={c.id} className="group flex justify-between bg-black/20 p-3 rounded-xl border border-zinc-800/50">
                                            <div className="text-[10px]"><span className="text-yellow-400/60 font-bold uppercase">{c.authorId}:</span> <span className="text-zinc-400 italic">"{c.text}"</span></div>
                                            <button onClick={() => handleDeleteComment(t.id, c.id)} className="text-zinc-700 hover:text-red-500 text-[8px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">Erase</button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-3 pt-6 border-t border-zinc-800/50">
                                <button onClick={() => handleStatusUpdate(t.id, 'IN_PROGRESS')} className="bg-zinc-800 text-[9px] font-black px-4 py-2 rounded-xl hover:bg-blue-600 transition-all uppercase">Assign/Progress</button>
                                <button onClick={() => handleStatusUpdate(t.id, 'RESOLVED')} className="bg-zinc-800 text-[9px] font-black px-4 py-2 rounded-xl hover:bg-emerald-600 transition-all uppercase">Resolve</button>
                                <button onClick={() => handleStatusUpdate(t.id, 'CLOSED')} className="bg-zinc-800 text-[9px] font-black px-4 py-2 rounded-xl hover:bg-zinc-700 transition-all uppercase">Close</button>
                                <button onClick={() => handleStatusUpdate(t.id, 'REJECTED')} className="bg-red-600/10 text-red-500 text-[9px] font-black px-4 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase">Reject</button>
                                <button onClick={() => {if(window.confirm('Erase Log?')) deleteTicket(t.id).then(load)}} className="ml-auto p-2 hover:text-red-500 transition-all">🗑️</button>
                            </div>
                        </div>

                        <div className="w-full lg:w-[350px] space-y-6">
                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest border-b border-zinc-800 pb-2">Requester Dossier</h4>
                            <div className="bg-zinc-900/40 p-4 rounded-xl space-y-2 border border-zinc-800/50">
                                <p className="text-[9px] text-zinc-600 uppercase font-black">Full Identity</p><p className="text-xs font-black text-zinc-200">{t.reporterName || 'N/A'}</p>
                                <p className="text-[9px] text-zinc-600 uppercase font-black">IT Tag</p><p className="text-xs font-black text-yellow-400">{t.studentId || 'N/A'}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #facc15; }`}</style>
        </div>
    );
};
export default TicketList;