import React, { useEffect, useState } from 'react';
import { getAllTickets, updateStatus, deleteTicket, addComment, deleteComment } from '../../api/ticketApi';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [selectedImg, setSelectedImg] = useState(null);
    const [loading, setLoading] = useState(true);
    const currentUserId = "staff-001"; // Technician/Admin ID

    useEffect(() => { load(); }, []);
    
    const load = async () => { 
        setLoading(true);
        try {
            const res = await getAllTickets(); 
            setTickets(res.data); 
        } catch (err) {
            console.error("Error loading tickets", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatus = async (id, status) => {
        const note = (status === 'RESOLVED' || status === 'REJECTED') ? prompt(`Provide a reason for ${status}:`) : "";
        await updateStatus(id, status, note, currentUserId);
        load();
    };

    const handleComment = async (id) => {
        const text = prompt("Add an internal maintenance note:");
        if (text) { await addComment(id, currentUserId, text); load(); }
    };

    // Priority වලට අනුව පාට වෙනස් කරන Helper Function එක
    const getPriorityColor = (prio) => {
        switch(prio) {
            case 'HIGH': return 'bg-red-500 text-white';
            case 'MEDIUM': return 'bg-yellow-500 text-black';
            case 'EMERGENCY': return 'bg-red-700 text-white animate-pulse';
            default: return 'bg-emerald-500 text-white';
        }
    };

    return (
        <div className="p-4 md:p-10 bg-zinc-950 min-h-screen font-sans text-white">
            <div className="max-w-7xl mx-auto">
                
                {/* Header Section */}
                <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-3 h-8 bg-yellow-400 rounded-full"></span>
                            <h2 className="text-4xl font-black uppercase tracking-tighter">Operations <span className="text-yellow-400">Console.</span></h2>
                        </div>
                        <p className="text-zinc-500 text-sm ml-6 uppercase tracking-widest font-bold">Smart Campus Maintenance Management</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-zinc-900 border border-zinc-800 p-4 rounded-2xl text-center min-w-[120px]">
                            <p className="text-[10px] text-zinc-500 font-bold uppercase mb-1">Total Incidents</p>
                            <p className="text-2xl font-black text-yellow-400">{tickets.length}</p>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-yellow-400"></div>
                    </div>
                ) : (
                    <div className="grid gap-10">
                        {tickets.map(t => (
                            <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-[2.5rem] overflow-hidden shadow-2xl hover:border-yellow-400/30 transition-all">
                                <div className="flex flex-col lg:flex-row">
                                    
                                    {/* Left Side: Ticket Info */}
                                    <div className="flex-1 p-8 md:p-10">
                                        <div className="flex justify-between items-start mb-6">
                                            <div>
                                                <span className={`px-3 py-1 rounded-lg text-[10px] font-black mb-2 inline-block ${getPriorityColor(t.priority)}`}>
                                                    {t.priority} PRIORITY
                                                </span>
                                                <h3 className="text-3xl font-black text-white">{t.resourceId}</h3>
                                                <p className="text-yellow-400 text-xs font-bold uppercase tracking-wider">{t.building} • {t.category}</p>
                                            </div>
                                            <div className="text-right">
                                                <span className="bg-zinc-800 text-zinc-400 border border-zinc-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest">
                                                    {t.status}
                                                </span>
                                            </div>
                                        </div>

                                        <p className="text-zinc-400 text-sm leading-relaxed mb-8 bg-zinc-800/50 p-5 rounded-2xl border border-zinc-800/50 italic">
                                            "{t.description}"
                                        </p>

                                        {/* Reporter Details Grid */}
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 bg-black/30 p-5 rounded-3xl border border-zinc-800">
                                            <div>
                                                <p className="text-[9px] text-zinc-500 font-black uppercase">Reporter</p>
                                                <p className="text-xs font-bold">{t.reporterName || 'Unknown'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-zinc-500 font-black uppercase">Student ID</p>
                                                <p className="text-xs font-bold">{t.studentId || 'N/A'}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-zinc-500 font-black uppercase">Contact</p>
                                                <p className="text-xs font-bold text-yellow-400">{t.contactDetails}</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-zinc-500 font-black uppercase">Posted On</p>
                                                <p className="text-xs font-bold">{new Date(t.createdAt).toLocaleDateString()}</p>
                                            </div>
                                        </div>

                                        {/* Action Buttons */}
                                        <div className="flex flex-wrap gap-3 pt-4 border-t border-zinc-800">
                                            <select 
                                                onChange={(e) => handleStatus(t.id, e.target.value)} 
                                                value={t.status} 
                                                className="bg-yellow-400 text-black text-xs font-black rounded-xl px-4 py-3 outline-none cursor-pointer hover:bg-yellow-500 transition-colors"
                                            >
                                                <option value="OPEN">MARK AS OPEN</option>
                                                <option value="IN_PROGRESS">IN PROGRESS</option>
                                                <option value="RESOLVED">MARK RESOLVED</option>
                                                <option value="REJECTED">REJECT INCIDENT</option>
                                            </select>
                                            
                                            <button onClick={() => handleComment(t.id)} className="bg-zinc-800 text-white px-6 py-3 rounded-xl text-xs font-bold hover:bg-zinc-700 transition-all">
                                                + Add Note
                                            </button>
                                            
                                            <button onClick={() => { if(window.confirm('Delete this ticket permanently?')) deleteTicket(t.id).then(load) }} className="bg-zinc-800 p-3 rounded-xl hover:bg-red-500/20 hover:text-red-500 transition-all">
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    {/* Right Side: Media & Timeline */}
                                    <div className="w-full lg:w-[400px] bg-black/20 p-8 border-t lg:border-t-0 lg:border-l border-zinc-800 flex flex-col gap-8">
                                        
                                        {/* Evidence Images */}
                                        <div>
                                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Evidence Photos</h4>
                                            <div className="flex flex-wrap gap-3">
                                                {t.imageUrls.length > 0 ? t.imageUrls.map((img, i) => (
                                                    <div key={i} className="relative group">
                                                        <img 
                                                            src={`http://localhost:8080/uploads/${img}`} 
                                                            className="w-20 h-20 rounded-2xl object-cover border-2 border-zinc-800 cursor-zoom-in hover:border-yellow-400 transition-all" 
                                                            onClick={() => setSelectedImg(`http://localhost:8080/uploads/${img}`)} 
                                                        />
                                                    </div>
                                                )) : <p className="text-xs text-zinc-700 font-bold uppercase italic">No photos uploaded</p>}
                                            </div>
                                        </div>

                                        {/* Internal Timeline (Comments) */}
                                        <div className="flex-1 flex flex-col min-h-[200px]">
                                            <h4 className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-4">Maintenance Notes</h4>
                                            <div className="space-y-3 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                                                {t.comments.length > 0 ? t.comments.map(c => (
                                                    <div key={c.id} className="group bg-zinc-800/50 p-4 rounded-2xl border border-zinc-800 relative">
                                                        <div className="flex justify-between items-start mb-1">
                                                            <span className="text-[9px] font-black text-yellow-400/70 uppercase">{c.authorId}</span>
                                                            {c.authorId === currentUserId && (
                                                                <button onClick={() => deleteComment(t.id, c.id).then(load)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-all">×</button>
                                                            )}
                                                        </div>
                                                        <p className="text-xs text-zinc-300 leading-relaxed">{c.text}</p>
                                                        <p className="text-[8px] text-zinc-600 mt-2 font-bold">{new Date(c.timestamp).toLocaleTimeString()}</p>
                                                    </div>
                                                )) : <p className="text-xs text-zinc-700 font-bold uppercase italic">No internal notes added</p>}
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        ))}
                    </div>
                )}
                
                {/* Empty State */}
                {!loading && tickets.length === 0 && (
                    <div className="text-center py-40">
                        <div className="text-6xl mb-4">✅</div>
                        <h3 className="text-2xl font-black text-white">All Clear!</h3>
                        <p className="text-zinc-500">No active incidents reported on campus.</p>
                    </div>
                )}
            </div>

            {/* Image Preview Modal */}
            {selectedImg && (
                <div className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[100] flex justify-center items-center p-6" onClick={() => setSelectedImg(null)}>
                    <button className="absolute top-10 right-10 text-white text-4xl font-light hover:text-yellow-400 transition-colors">×</button>
                    <img src={selectedImg} className="max-w-full max-h-[85vh] rounded-3xl shadow-2xl border-4 border-yellow-400/20" alt="Evidence Preview" />
                </div>
            )}

            {/* Custom Styles for Scrollbar */}
            <style>{`
                .custom-scrollbar::-webkit-scrollbar { width: 4px; }
                .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
                .custom-scrollbar::-webkit-scrollbar-thumb { background: #3f3f46; border-radius: 10px; }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #eab308; }
            `}</style>
        </div>
    );
};

export default TicketList;