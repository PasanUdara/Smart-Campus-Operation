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
            console.error("Transmission Error:", err); 
        } finally { 
            setLoading(false); 
        }
    };

    // 🚀 THE WORKFLOW LOGIC
    const handleStatusUpdate = async (id, newStatus) => {
        let reason = "";
        
        // Admin Reject කළහොත් හේතුව අනිවාර්යයෙන් ඇසීම
        if (newStatus === 'REJECTED') {
            reason = prompt("⚠️ SYSTEM OVERRIDE: Please provide the reason for REJECTION:");
            if (!reason) return alert("Action Cancelled: Reason is required for rejection.");
        } 
        // Resolve කළහොත් ඒ පිළිබඳ සටහනක් ඇසීම
        else if (newStatus === 'RESOLVED') {
            reason = prompt("✅ RESOLUTION LOG: Brief note on how it was fixed:");
        }

        try {
            await updateStatus(id, newStatus, reason, currentUserId);
            alert(`Status updated to ${newStatus}`);
            load();
        } catch (err) {
            alert("Workflow Error: Failed to update status.");
        }
    };

    const getStatusStyle = (status) => {
        switch(status) {
            case 'OPEN': return 'bg-yellow-400 text-black shadow-[0_0_10px_rgba(250,204,21,0.3)]';
            case 'IN_PROGRESS': return 'bg-blue-500 text-white';
            case 'RESOLVED': return 'bg-emerald-500 text-white';
            case 'CLOSED': return 'bg-zinc-700 text-zinc-400';
            case 'REJECTED': return 'bg-red-600 text-white';
            default: return 'bg-zinc-800 text-white';
        }
    };

    return (
        <div className="p-6 md:p-12 bg-[#050505] min-h-screen text-white font-sans selection:bg-yellow-400">
            <div className="max-w-[1600px] mx-auto">
                
                {/* SYSTEM HEADER */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
                    <div>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-3 h-12 bg-yellow-400 rounded-full"></div>
                            <h2 className="text-5xl font-black uppercase italic tracking-tighter">Admin <span className="text-yellow-400">Workflow.</span></h2>
                        </div>
                        <p className="text-zinc-500 text-[10px] font-black uppercase tracking-[0.5em] ml-7">Operational Status Management</p>
                    </div>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-40 italic text-zinc-600">Initialising Console...</div>
                ) : (
                    <div className="grid gap-12">
                        {tickets.map(t => (
                            <div key={t.id} className="bg-zinc-900/30 border border-zinc-800 rounded-[3rem] overflow-hidden hover:border-yellow-400/30 transition-all duration-500 shadow-2xl">
                                <div className="flex flex-col lg:flex-row">
                                    
                                    <div className="flex-1 p-10 md:p-14">
                                        <div className="flex flex-col md:flex-row justify-between items-start gap-6 mb-8">
                                            <div>
                                                <h3 className="text-4xl font-black text-white italic tracking-tighter mb-1 uppercase">{t.resourceId}</h3>
                                                <div className="flex gap-4 items-center">
                                                    <span className={`px-3 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${getStatusStyle(t.status)}`}>
                                                        {t.status}
                                                    </span>
                                                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest">{t.building} // {t.category}</p>
                                                </div>
                                            </div>
                                        </div>

                                        <p className="text-zinc-400 text-sm leading-relaxed mb-8 font-medium italic border-l-4 border-zinc-800 pl-6">"{t.description}"</p>

                                        {/* REJECTED REASON DISPLAY (වැදගත්!) */}
                                        {t.status === 'REJECTED' && t.rejectedReason && (
                                            <div className="bg-red-950/20 border border-red-500/20 p-4 rounded-2xl mb-8">
                                                <p className="text-[9px] font-black text-red-500 uppercase tracking-widest mb-1">Rejection Reason</p>
                                                <p className="text-xs text-red-200">{t.rejectedReason}</p>
                                            </div>
                                        )}

                                        {/* WORKFLOW CONTROL UNIT */}
                                        <div className="flex flex-wrap gap-3 pt-8 border-t border-zinc-800/50">
                                            <p className="w-full text-[9px] font-black text-zinc-600 uppercase tracking-widest mb-2">Update Stage:</p>
                                            
                                            <button onClick={() => handleStatusUpdate(t.id, 'IN_PROGRESS')} className="bg-zinc-800 text-[10px] font-black px-5 py-3 rounded-xl hover:bg-blue-600 transition-all uppercase tracking-widest">In Progress</button>
                                            <button onClick={() => handleStatusUpdate(t.id, 'RESOLVED')} className="bg-zinc-800 text-[10px] font-black px-5 py-3 rounded-xl hover:bg-emerald-600 transition-all uppercase tracking-widest">Resolve</button>
                                            <button onClick={() => handleStatusUpdate(t.id, 'CLOSED')} className="bg-zinc-800 text-[10px] font-black px-5 py-3 rounded-xl hover:bg-zinc-700 transition-all uppercase tracking-widest text-zinc-400">Close</button>
                                            <button onClick={() => handleStatusUpdate(t.id, 'REJECTED')} className="bg-red-600/20 text-red-500 text-[10px] font-black px-5 py-3 rounded-xl hover:bg-red-600 hover:text-white transition-all uppercase tracking-widest">Reject</button>
                                            
                                            <button onClick={() => {if(window.confirm('Erase Log?')) deleteTicket(t.id).then(load)}} className="ml-auto bg-zinc-900 p-3 rounded-xl hover:text-red-500">🗑️</button>
                                        </div>
                                    </div>

                                    {/* REPORTER DETAILS PANEL */}
                                    <div className="w-full lg:w-[400px] bg-black/40 p-10 border-l border-zinc-800">
                                        <h4 className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.3em] mb-6 underline decoration-yellow-400 decoration-2 underline-offset-8">Requester Dossier</h4>
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div><p className="text-[8px] text-zinc-600 uppercase font-black mb-1">Name</p><p className="text-xs font-black text-zinc-200 uppercase">{t.reporterName || 'N/A'}</p></div>
                                                <div><p className="text-[8px] text-zinc-600 uppercase font-black mb-1">ID</p><p className="text-xs font-black text-yellow-400">{t.studentId || 'N/A'}</p></div>
                                            </div>
                                            <div><p className="text-[8px] text-zinc-600 uppercase font-black mb-1">Contact Link</p><p className="text-xs font-black text-zinc-200">{t.contactDetails}</p></div>
                                            
                                            {/* EVIDENCE LOGS */}
                                            <div className="pt-6">
                                                <p className="text-[8px] text-zinc-600 uppercase font-black mb-4 tracking-widest">Evidence Logs</p>
                                                <div className="flex flex-wrap gap-3">
                                                    {t.imageUrls?.map((img, i) => (
                                                        <img key={i} src={`http://localhost:8080/uploads/${img}`} className="w-16 h-16 rounded-xl object-cover grayscale hover:grayscale-0 cursor-pointer transition-all border border-zinc-800" onClick={() => setSelectedImg(`http://localhost:8080/uploads/${img}`)} />
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* IMAGE PREVIEW */}
            {selectedImg && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[100] flex justify-center items-center p-8" onClick={() => setSelectedImg(null)}>
                    <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-[3rem] border-4 border-yellow-400/20 shadow-2xl shadow-yellow-400/10" alt="Preview" />
                </div>
            )}
        </div>
    );
};

export default TicketList;