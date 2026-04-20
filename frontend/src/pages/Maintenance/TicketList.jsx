import React, { useEffect, useState } from 'react';
import { getAllTickets, updateStatus, deleteTicket, addComment, deleteComment } from '../../api/ticketApi';

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

    const handleStatusUpdate = async (id, newStatus) => {
        let reason = "";
        if (newStatus === 'REJECTED') {
            reason = prompt("⚠️ CRITICAL: Enter Rejection Protocol Reason:");
            if (!reason) return alert("Operation Aborted: Reason required.");
        } else if (newStatus === 'RESOLVED') {
            reason = prompt("✅ RESOLUTION LOG: Brief fix summary:");
        }

        try {
            await updateStatus(id, newStatus, reason, currentUserId);
            load();
        } catch (err) {
            alert("Protocol Error: Status update failed.");
        }
    };

    const handleDeleteComment = async (ticketId, commentId) => {
        if(window.confirm("SECURITY OVERRIDE: Delete this feedback record permanently?")) {
            try {
                await deleteComment(ticketId, commentId, currentUserId);
                load();
            } catch (err) {
                alert("Protocol Error: Could not erase record.");
            }
        }
    };

    const getStatusStyles = (status) => {
        switch(status) {
            case 'OPEN': return 'border-yellow-400 text-yellow-400 shadow-[0_0_10px_rgba(250,204,21,0.2)]';
            case 'IN_PROGRESS': return 'border-blue-500 text-blue-400 shadow-[0_0_10px_rgba(59,130,246,0.2)]';
            case 'RESOLVED': return 'border-emerald-500 text-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.2)]';
            case 'CLOSED': return 'border-zinc-700 text-zinc-500 bg-zinc-900/50';
            case 'REJECTED': return 'border-red-600 text-red-500 bg-red-950/10 shadow-[0_0_10px_rgba(220,38,38,0.2)]';
            default: return 'border-zinc-800 text-zinc-400';
        }
    };

    return (
        <div className="p-6 md:p-12 bg-[#050505] min-h-screen text-white font-sans selection:bg-yellow-400 selection:text-black overflow-x-hidden">
            
            <div className="fixed inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-10 pointer-events-none"></div>

            <div className="max-w-[1700px] mx-auto relative z-10">
                
                {/* 🛰️ SYSTEM HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-8 border-b border-zinc-900 pb-10">
                    <div>
                        <div className="flex items-center gap-4 mb-2">
                            <div className="w-2 h-10 bg-yellow-400 rounded-full shadow-[0_0_20px_rgba(250,204,21,0.4)]"></div>
                            <h2 className="text-4xl font-black uppercase italic tracking-tighter leading-none">
                                Admin <span className="text-yellow-400 font-light tracking-normal">Console.</span>
                            </h2>
                        </div>
                        <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.5em] ml-6 italic">Strategic Operations Oversight</p>
                    </div>

                    <div className="flex gap-4 bg-zinc-900/30 p-4 rounded-3xl border border-zinc-800 backdrop-blur-sm">
                        <div className="px-6 text-center border-r border-zinc-800">
                            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">Total Logs</p>
                            <p className="text-2xl font-black text-yellow-400">{tickets.length}</p>
                        </div>
                        <div className="px-6 text-center">
                            <p className="text-[8px] text-zinc-500 font-black uppercase tracking-widest mb-1">Active Alerts</p>
                            <p className="text-2xl font-black text-red-500">{tickets.filter(t => t.status === 'OPEN').length}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40">
                        <div className="w-10 h-10 border-2 border-yellow-400/20 border-t-yellow-400 rounded-full animate-spin"></div>
                        <p className="mt-4 text-[9px] font-black uppercase tracking-[0.3em] text-zinc-700 animate-pulse">Syncing Secure Database...</p>
                    </div>
                ) : (
                    <div className="grid gap-12">
                        {tickets.map(t => (
                            <div key={t.id} className="group relative bg-zinc-900/10 border border-zinc-800/80 rounded-[2.5rem] overflow-hidden hover:border-yellow-400/40 transition-all duration-700 shadow-2xl backdrop-blur-sm">
                                <div className="flex flex-col lg:flex-row">
                                    
                                    {/* 🔴 MAIN DATA ZONE */}
                                    <div className="flex-1 p-8 md:p-12">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-10">
                                            <div>
                                                <div className={`inline-block px-3 py-1 rounded-lg text-[8px] font-black uppercase tracking-[0.2em] border mb-4 ${getStatusStyles(t.status)}`}>
                                                    LOG STATUS: {t.status}
                                                </div>
                                                <h3 className="text-3xl md:text-4xl font-black text-white italic tracking-tighter leading-none mb-2 uppercase group-hover:text-yellow-400 transition-colors">
                                                    {t.resourceId}
                                                </h3>
                                                <div className="flex items-center gap-3 text-zinc-600 text-[10px] font-black uppercase tracking-widest">
                                                    <span>{t.building}</span>
                                                    <span className="w-1 h-1 bg-zinc-800 rounded-full"></span>
                                                    <span className="text-yellow-400/50">{t.category}</span>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-[8px] text-zinc-700 font-black uppercase tracking-widest mb-1">Transmission Date</p>
                                                <p className="text-xs font-bold text-zinc-400">{new Date(t.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        <div className="bg-black/40 p-6 rounded-3xl border border-zinc-800/50 mb-10 relative">
                                            <div className="absolute top-[-10px] left-6 bg-zinc-900 px-3 text-[8px] font-black text-zinc-500 uppercase tracking-widest">Description Log</div>
                                            <p className="text-zinc-400 text-sm leading-relaxed italic font-medium">"{t.description}"</p>
                                        </div>

                                        {/* 💬 PUBLIC FEEDBACK LOG (DISPLAY ALL COMMENTS) */}
                                        <div className="bg-zinc-900/30 p-8 rounded-[2rem] border border-zinc-800/40 mb-10">
                                            <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-3">
                                                <h4 className="text-[10px] font-black text-yellow-400 uppercase tracking-[0.3em]">Communication Log</h4>
                                                <span className="text-[8px] text-zinc-600 font-black uppercase">{t.comments?.length || 0} Records</span>
                                            </div>
                                            <div className="max-h-48 overflow-y-auto pr-3 custom-scrollbar space-y-4">
                                                {t.comments && t.comments.length > 0 ? t.comments.map(c => (
                                                    <div key={c.id} className="group/msg bg-black/20 p-4 rounded-2xl border border-zinc-800/50 flex justify-between items-start transition-all hover:bg-zinc-800/30">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-1">
                                                                <span className="text-yellow-400 font-black text-[9px] uppercase tracking-tighter">{c.authorId}</span>
                                                                <span className="text-zinc-700 text-[8px] font-bold">{new Date(c.timestamp).toLocaleTimeString()}</span>
                                                            </div>
                                                            <p className="text-xs text-zinc-400 leading-normal italic font-medium">"{c.text}"</p>
                                                        </div>
                                                        <button 
                                                            onClick={() => handleDeleteComment(t.id, c.id)}
                                                            className="text-zinc-700 hover:text-red-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover/msg:opacity-100 transition-all pl-4"
                                                        >
                                                            Erase
                                                        </button>
                                                    </div>
                                                )) : (
                                                    <p className="text-[9px] text-zinc-800 italic uppercase font-bold tracking-widest py-4">No community feedback detected for this node.</p>
                                                )}
                                            </div>
                                        </div>

                                        {/* 🛠️ WORKFLOW CONTROL COMMANDS */}
                                        <div className="flex flex-wrap items-center gap-3 pt-8 border-t border-zinc-900">
                                            <button onClick={() => handleStatusUpdate(t.id, 'IN_PROGRESS')} className="bg-zinc-800/50 hover:bg-blue-600 text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase tracking-widest border border-zinc-800">In Progress</button>
                                            <button onClick={() => handleStatusUpdate(t.id, 'RESOLVED')} className="bg-zinc-800/50 hover:bg-emerald-600 text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase tracking-widest border border-zinc-800">Resolve</button>
                                            <button onClick={() => handleStatusUpdate(t.id, 'CLOSED')} className="bg-zinc-800/50 hover:bg-zinc-700 text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase tracking-widest border border-zinc-800 text-zinc-500">Close</button>
                                            <button onClick={() => handleStatusUpdate(t.id, 'REJECTED')} className="bg-red-600/10 text-red-500 hover:bg-red-600 hover:text-white text-[9px] font-black px-6 py-3 rounded-xl transition-all uppercase tracking-widest border border-red-900/50">Reject</button>
                                            <button onClick={() => {if(window.confirm('Delete incident forever?')) deleteTicket(t.id).then(load)}} className="ml-auto p-3 bg-zinc-900/50 rounded-xl text-zinc-700 hover:text-red-500 transition-all">🗑️</button>
                                        </div>
                                    </div>

                                    {/* 🕵️‍♂️ REQUESTER DOSSIER PANEL */}
                                    <div className="w-full lg:w-[450px] bg-black/40 p-10 lg:p-12 border-t lg:border-t-0 lg:border-l border-zinc-900">
                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-8 border-b border-zinc-900 pb-4">Requester Dossier</h4>
                                        <div className="space-y-6 mb-10">
                                            <div className="flex justify-between items-center bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
                                                <div>
                                                    <p className="text-[8px] text-zinc-600 uppercase font-black mb-1">Identity</p>
                                                    <p className="text-xs font-black text-zinc-200 uppercase">{t.reporterName || 'UNKNOWN'}</p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="text-[8px] text-zinc-600 uppercase font-black mb-1">IT No</p>
                                                    <p className="text-xs font-black text-yellow-400">{t.studentId || 'N/A'}</p>
                                                </div>
                                            </div>
                                            <div className="bg-zinc-900/40 p-4 rounded-2xl border border-zinc-800/50">
                                                <p className="text-[8px] text-zinc-600 uppercase font-black mb-1">Comm Channel</p>
                                                <p className="text-xs font-black text-zinc-300">{t.contactDetails}</p>
                                            </div>
                                        </div>

                                        <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-6">Visual Recon</h4>
                                        <div className="flex flex-wrap gap-4">
                                            {t.imageUrls?.length > 0 ? t.imageUrls.map((img, i) => (
                                                <img 
                                                    key={i} 
                                                    src={`http://localhost:8080/uploads/${img}`} 
                                                    className="w-20 h-20 rounded-2xl object-cover border border-zinc-800 grayscale hover:grayscale-0 cursor-zoom-in transition-all duration-500 hover:border-yellow-400" 
                                                    onClick={() => setSelectedImg(`http://localhost:8080/uploads/${img}`)} 
                                                />
                                            )) : (
                                                <div className="w-full py-10 border border-dashed border-zinc-900 rounded-3xl text-center">
                                                    <p className="text-[9px] font-black text-zinc-800 uppercase tracking-widest">No Media Logs</p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* 📷 MODAL VIEWPORT */}
            {selectedImg && (
                <div className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[100] flex justify-center items-center p-8 transition-all" onClick={() => setSelectedImg(null)}>
                    <button className="absolute top-10 right-10 text-white text-5xl font-thin hover:text-yellow-400 transition-all">&times;</button>
                    <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-[2.5rem] border-2 border-yellow-400/20 shadow-2xl object-contain" alt="Evidence" />
                </div>
            )}

            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 3px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #1a1a1a; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #facc15; }
            `}</style>
        </div>
    );
};

export default TicketList;