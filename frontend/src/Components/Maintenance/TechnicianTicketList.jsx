import React, { useEffect, useState } from 'react';
import { getAllTickets, updateStatus } from '../../api/ticketApi';
import { useAuth } from '../../contexts/AuthContext';

const TechnicianTicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => { load(); }, []);

    const load = async () => {
        setLoading(true);
        try {
            console.log("Technician user object:", user);
            console.log("Technician user ID:", user?.id);

            const res = await getAllTickets();
            console.log("All tickets assigned IDs:", res.data.map(t => ({ id: t.id, assignedTechId: t.assignedTechnicianId })));

            // Only show tickets assigned to this technician
            const myTickets = res.data.filter(t => t.assignedTechnicianId === user?.userId);
            console.log("Filtered my tickets:", myTickets);

            setTickets(myTickets);
        } catch (err) {
            console.error("Error loading tickets:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleResolve = async (id) => {
        const note = prompt("RESOLUTION NOTES: Describe the fix performed:");
        if (!note) return;

        try {
            await updateStatus(id, 'RESOLVED', note, null);
            alert("Ticket marked as RESOLVED");
            load();
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };

    const handleClose = async (id) => {
        try {
            await updateStatus(id, 'CLOSED', null, null);
            alert("Ticket CLOSED");
            load();
        } catch (err) {
            alert("Update failed: " + err.message);
        }
    };

    const getStatusStyles = (status) => {
        switch (status) {
            case 'OPEN': return 'border-yellow-400 text-yellow-400';
            case 'IN_PROGRESS': return 'border-blue-500 text-blue-400';
            case 'RESOLVED': return 'border-emerald-500 text-emerald-400';
            case 'CLOSED': return 'border-zinc-700 text-zinc-500';
            default: return 'border-zinc-800 text-zinc-400';
        }
    };

    if (loading) {
        return <div className="flex justify-center py-40 text-zinc-700">Loading your tickets...</div>;
    }

    return (
        <div className="p-6 md:p-12 bg-[#050505] min-h-screen text-white">
            <div className="max-w-[1700px] mx-auto">
                <div className="mb-10 border-b border-zinc-900 pb-6">
                    <h2 className="text-3xl font-black uppercase italic tracking-tighter">
                        My <span className="text-yellow-400">Assigned Tickets</span>
                    </h2>
                    <p className="text-zinc-500 text-sm mt-2">Tickets assigned to you for resolution</p>
                </div>

                {tickets.length === 0 ? (
                    <div className="text-center py-20 text-zinc-500">
                        <p className="text-xl mb-2">No tickets assigned to you yet</p>
                        <p className="text-sm">When admin assigns tickets to you, they will appear here</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {tickets.map(t => (
                            <div key={t.id} className="bg-zinc-900/20 border border-zinc-800 rounded-2xl p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <span className={`inline-block px-3 py-1 rounded-lg text-[10px] font-black uppercase border ${getStatusStyles(t.status)}`}>
                                            {t.status}
                                        </span>
                                        <h3 className="text-2xl font-bold mt-2">{t.resourceId}</h3>
                                        <p className="text-zinc-500 text-sm">{t.building} • {t.category}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xs text-zinc-500">Priority</p>
                                        <p className={`font-bold ${t.priority === 'HIGH' ? 'text-red-400' : t.priority === 'MEDIUM' ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {t.priority}
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-black/30 p-4 rounded-xl mb-4">
                                    <p className="text-zinc-400">"{t.description}"</p>
                                </div>

                                <div className="flex justify-between items-center">
                                    <div>
                                        <p className="text-xs text-zinc-500">Requested by</p>
                                        <p className="text-sm">{t.reporterName || t.createdByEmail}</p>
                                    </div>
                                    <div className="flex gap-3">
                                        {t.status === 'IN_PROGRESS' && (
                                            <button
                                                onClick={() => handleResolve(t.id)}
                                                className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 rounded-lg text-sm font-semibold transition"
                                            >
                                                Mark Resolved
                                            </button>
                                        )}
                                        {t.status === 'RESOLVED' && (
                                            <button
                                                onClick={() => handleClose(t.id)}
                                                className="bg-zinc-700 hover:bg-zinc-600 px-4 py-2 rounded-lg text-sm font-semibold transition"
                                            >
                                                Close Ticket
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TechnicianTicketList;