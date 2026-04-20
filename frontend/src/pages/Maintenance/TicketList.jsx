import React, { useEffect, useState } from 'react';
import { getAllTickets, updateStatus, deleteTicket, addComment, deleteComment } from '../../api/ticketApi';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const currentUserId = "staff-001"; 

    useEffect(() => { load(); }, []);
    const load = async () => { 
        setLoading(true);
        try { const res = await getAllTickets(); setTickets(res.data); } 
        catch (err) { console.error(err); } 
        finally { setLoading(false); }
    };

    const handleStatus = async (id, status) => {
        const note = (status === 'RESOLVED' || status === 'REJECTED') ? prompt(`Reason for ${status}:`) : "";
        await updateStatus(id, status, note, currentUserId);
        load();
    };

    const handleDeleteComment = async (ticketId, commentId) => {
        if(window.confirm("Admin: Delete this user comment?")) {
            // මෙතනදී Admin requesterId එක currentUserId විදිහට යවනවා
            await deleteComment(ticketId, commentId, currentUserId);
            load();
        }
    };

    return (
        <div className="p-4 md:p-10 bg-zinc-950 min-h-screen text-white font-sans">
            <div className="max-w-7xl mx-auto">
                <div className="mb-12">
                    <h2 className="text-4xl font-black uppercase tracking-tighter">Admin <span className="text-yellow-400">Control.</span></h2>
                    <p className="text-zinc-500 text-xs font-bold uppercase mt-2">Manage Incidents & User Feedback</p>
                </div>

                <div className="grid gap-6">
                    {tickets.map(t => (
                        <div key={t.id} className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 flex flex-col lg:flex-row gap-8">
                            <div className="flex-1">
                                <div className="flex justify-between">
                                    <h3 className="text-2xl font-bold">{t.resourceId}</h3>
                                    <span className="text-yellow-400 font-black text-xs uppercase italic">{t.status}</span>
                                </div>
                                <p className="text-zinc-500 text-sm mt-4 italic">"{t.description}"</p>
                                
                                <div className="mt-8 flex gap-4">
                                    <select onChange={(e) => handleStatus(t.id, e.target.value)} value={t.status} className="bg-yellow-400 text-black text-[10px] font-black p-2 rounded-lg outline-none">
                                        <option value="OPEN">OPEN</option>
                                        <option value="IN_PROGRESS">IN PROGRESS</option>
                                        <option value="RESOLVED">RESOLVED</option>
                                        <option value="REJECTED">REJECTED</option>
                                    </select>
                                    <button onClick={() => {if(window.confirm('Delete Ticket?')) deleteTicket(t.id).then(load)}} className="text-zinc-600 hover:text-red-500">🗑️</button>
                                </div>
                            </div>

                            {/* RIGHT SIDE: User Comments Management */}
                            <div className="w-full lg:w-96 bg-black/30 p-6 rounded-3xl border border-zinc-800">
                                <h4 className="text-[10px] font-black text-zinc-500 uppercase mb-4 tracking-widest">User Comments & Feedback</h4>
                                <div className="space-y-3">
                                    {t.comments?.length > 0 ? t.comments.map(c => (
                                        <div key={c.id} className="bg-zinc-800/50 p-3 rounded-xl border border-zinc-800 flex justify-between items-center group">
                                            <div>
                                                <p className="text-[10px] text-yellow-400/70 font-bold">{c.authorId}</p>
                                                <p className="text-xs text-zinc-300">{c.text}</p>
                                            </div>
                                            <button onClick={() => handleDeleteComment(t.id, c.id)} className="text-red-500 text-xs opacity-0 group-hover:opacity-100 transition-all">Delete</button>
                                        </div>
                                    )) : <p className="text-[10px] text-zinc-700 italic">No user feedback yet.</p>}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TicketList;