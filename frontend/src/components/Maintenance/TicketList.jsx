import React, { useEffect, useState } from 'react';
import { getAllTickets, updateStatus, deleteTicket, deleteComment } from '../../api/ticketApi';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null);
    const currentUserId = "admin-master"; 

    useEffect(() => { load(); }, []);

    const load = async () => { 
        setLoading(true);
        try { 
            const res = await getAllTickets(); 
            setTickets(res.data); 
        } catch (err) { 
            console.error("Uplink Error:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    const handleWorkflowAction = async (id, stage) => {
        let note = "";
        let techId = "";

        if (stage === 'IN_PROGRESS') {
            techId = prompt("ASSIGNMENT: Enter Technician ID/Name:");
            if (!techId) return;
        } else if (stage === 'RESOLVED') {
            note = prompt("RESOLUTION LOG: Describe the fix performed:");
            if (!note) return;
        } else if (stage === 'REJECTED') {
            note = prompt("REJECTION PROTOCOL: Enter reason for rejection:");
            if (!note) return;
        }

        try {
            await updateStatus(id, stage, note, techId);
            alert(`Node updated to ${stage}`);
            load();
        } catch (err) {
            alert("Protocol Error: Update failed.");
        }
    };

    const handleDeleteComment = async (tId, cId) => {
        if(window.confirm("ADMIN OVERRIDE: Delete this record permanently?")) {
            await deleteComment(tId, cId);
            load();
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'OPEN': return 'border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
            case 'IN_PROGRESS': return 'border-blue-500 text-blue-400';
            case 'RESOLVED': return 'border-emerald-500 text-emerald-400';
            case 'CLOSED': return 'border-zinc-700 text-zinc-500 bg-zinc-900/50';
            case 'REJECTED': return 'border-red-600 text-red-500 bg-red-950/10';
            default: return 'border-zinc-800 text-zinc-400';
        }
    };

    return (
        <div className="p-6 md:p-12 bg-[#050505] min-h-screen text-white font-sans selection:bg-yellow-400 overflow-x-hidden">
            
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

            <div className="max-w-[1700px] mx-auto relative z-10">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-8 border-b border-zinc-900 pb-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-2 h-10 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter">Admin <span className="text-yellow-400 font-light tracking-normal">Console.</span></h2>
                        </div>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] ml-6 italic">Strategic Operations Oversight</p>
                    </div>
                    <div className="bg-zinc-900/30 p-4 rounded-3xl border border-zinc-800 backdrop-blur-sm px-10">
                        <p className="text-[8px] text-zinc-500 font-black uppercase mb-1">Active Alerts</p>
                        <p className="text-3xl font-black text-yellow-400 tracking-tighter">{tickets.filter(t=>t.status==='OPEN').length}</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-40 animate-pulse text-zinc-700 font-black uppercase tracking-[0.3em]">Syncing Secure Database...</div>
                ) : (
                    <div className="grid gap-12">
                        {tickets.map(t => (
                            <div key={t.id} className="group relative bg-zinc-900/10 border border-zinc-800 rounded-[2.5rem] overflow-hidden hover:border-yellow-400/40 transition-all duration-700 shadow-2xl backdrop-blur-sm">
                                <div className="flex flex-col lg:flex-row">
                                    
                                    <div className="flex-1 p-8 md:p-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                                            <div>
                                                <div className={`inline-block px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border mb-4 ${getStatusStyles(t.status)}`}>
                                                    STATUS: {t.status}
                                                </div>
                                                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase">{t.resourceId}</h3>
                                                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-widest mt-2">{t.building} // {t.category}</p>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 p-6 rounded-3xl border border-zinc-800/50 mb-10">
                                            <p className="text-zinc-400 text-sm leading-relaxed italic">"{t.description}"</p>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 mb-10">
                                            <div className="bg-zinc-800/20 p-4 rounded-2xl border border-zinc-800/50">
                                                <p className="text-[8px] text-zinc-600 uppercase font-black mb-1">Assigned Agent</p>
                                                <p className="text-xs font-black text-yellow-400 uppercase">{t.assignedTechnicianId || "UNASSIGNED"}</p>
                                            </div>
                                            {t.resolutionNotes && (
                                                <div className="bg-emerald-500/5 p-4 rounded-2xl border border-emerald-500/20">
                                                    <p className="text-[8px] text-emerald-500 uppercase font-black mb-1">Resolution Note</p>
                                                    <p className="text-[10px] text-emerald-200 italic">"{t.resolutionNotes}"</p>
                                                </div>
                                            )}
                                        </div>

                                        <div className="bg-zinc-900/30 p-6 rounded-2xl border border-zinc-800/40 mb-10">
                                            <p className="text-[9px] font-black text-yellow-400 uppercase mb-4 tracking-widest">Communication Log</p>
                                            <div className="space-y-3 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                                                {t.comments.map(c => (
                                                    <div key={c.id} className="group/msg flex justify-between bg-black/20 p-3 rounded-xl border border-zinc-800/50">
                                                        <div className="text-[10px]"><span className="text-yellow-400/60 font-bold uppercase">{c.authorId}:</span> <span className="text-zinc-400 italic">"{c.text}"</span></div>
                                                        <button onClick={() => handleDeleteComment(t.id, c.id)} className="text-zinc-700 hover:text-red-500 text-[8px] font-black uppercase opacity-0 group-hover/msg:opacity-100 transition-all">Erase</button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="flex flex-wrap gap-3 pt-8 border-t border-zinc-900">
                                            <button onClick={() => handleWorkflowAction(t.id, 'IN_PROGRESS')} className="bg-zinc-800/50 hover:bg-blue-600 text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase border border-zinc-800">Assign Agent</button>
                                            <button onClick={() => handleWorkflowAction(t.id, 'RESOLVED')} className="bg-zinc-800/50 hover:bg-emerald-600 text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase border border-zinc-800">Resolve</button>
                                            <button onClick={() => handleWorkflowAction(t.id, 'CLOSED')} className="bg-zinc-800/50 hover:bg-zinc-700 text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase border border-zinc-800 text-zinc-500">Close Log</button>
                                            <button onClick={() => handleWorkflowAction(t.id, 'REJECTED')} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase border border-red-900/50">Reject</button>
                                            <button onClick={() => {if(window.confirm('Delete Forever?')) deleteTicket(t.id).then(load)}} className="ml-auto p-3 text-zinc-700 hover:text-red-500 transition-all">🗑️</button>
                                        </div>
                                    </div>

                                    <div className="w-full lg:w-[450px] bg-black/40 p-10 border-t lg:border-t-0 lg:border-l border-zinc-900 flex flex-col">
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 border-b border-zinc-900 pb-4">Requester Dossier</h4>
                                        <div className="space-y-6 mb-10">
                                            <div className="flex justify-between items-center bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
                                                <div><p className="text-[8px] text-zinc-600 uppercase font-black">Identity</p><p className="text-xs font-black text-zinc-200">{t.reporterName || 'UNKNOWN'}</p></div>
                                                <div className="text-right"><p className="text-[8px] text-zinc-600 uppercase font-black">IT No</p><p className="text-xs font-black text-yellow-400">{t.studentId || 'N/A'}</p></div>
                                            </div>
                                            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
                                                <p className="text-[8px] text-zinc-600 uppercase font-black">Contact</p><p className="text-xs font-black text-zinc-300">{t.contactDetails}</p>
                                            </div>
                                        </div>
                                        
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">Visual Recon</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {t.imageUrls?.map((img, i) => (
                                                <img 
                                                  key={i} 
                                                  src={`/uploads/${img}`} 
                                                  className="w-20 h-20 rounded-2xl object-cover border border-zinc-800 grayscale hover:grayscale-0 cursor-zoom-in transition-all" 
                                                  onClick={() => setSelectedImg(`/uploads/${img}`)}
                                                  onError={(e) => { e.target.src = "https://via.placeholder.com/100?text=Broken"; }}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {selectedImg && (
                <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex justify-center items-center p-8 transition-all" onClick={() => setSelectedImg(null)}>
                    <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-[2.5rem] border-2 border-yellow-400/20 shadow-2xl object-contain" alt="Evidence" />
                </div>
            )}

            <style>{`.custom-scrollbar::-webkit-scrollbar { width: 3px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #facc15; border-radius: 10px; }`}</style>
        </div>
    );
};

export default TicketList;