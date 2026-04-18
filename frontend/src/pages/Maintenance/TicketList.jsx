import React, { useEffect, useState } from 'react';
import { getAllTickets, updateTicketStatus, deleteTicket } from '../../api/ticketApi';

const TicketList = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedImg, setSelectedImg] = useState(null); // පින්තූරය ලොකුවට පෙන්වීමට

    useEffect(() => {
        fetchTickets();
    }, []);

    const fetchTickets = async () => {
        try {
            const res = await getAllTickets();
            setTickets(res.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (id, newStatus) => {
        const note = prompt(`Please enter a brief note for ${newStatus} status:`);
        if (note === null) return;
        try {
            await updateTicketStatus(id, newStatus, note);
            fetchTickets();
        } catch (err) { alert("Failed to update status."); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this incident report? 🗑️")) {
            try {
                await deleteTicket(id);
                fetchTickets();
            } catch (err) { alert("Delete failed."); }
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50/50 p-4 md:p-10">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
                <div>
                    <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                        Maintenance <span className="text-blue-600">Dashboard</span>
                    </h2>
                    <p className="text-slate-500 mt-1 font-medium">Manage and monitor campus infrastructure incidents.</p>
                </div>
                <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
                    <span className="text-sm text-slate-400">Total Incidents:</span>
                    <span className="ml-2 text-xl font-bold text-slate-800">{tickets.length}</span>
                </div>
            </div>

            {/* Table Container */}
            <div className="bg-white rounded-[2rem] shadow-xl shadow-slate-200/50 border border-gray-100 overflow-hidden">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-slate-900 text-slate-200">
                            <th className="p-6 font-semibold uppercase text-xs tracking-wider">Resource Information</th>
                            <th className="p-6 font-semibold uppercase text-xs tracking-wider">Category</th>
                            <th className="p-6 font-semibold uppercase text-xs tracking-wider text-center">Visual Evidence</th>
                            <th className="p-6 font-semibold uppercase text-xs tracking-wider text-center">Current Status</th>
                            <th className="p-6 font-semibold uppercase text-xs tracking-wider text-right">Administrative Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {tickets.map((t) => (
                            <tr key={t.id} className="hover:bg-blue-50/30 transition-all group">
                                <td className="p-6">
                                    <div className="flex flex-col">
                                        <span className="font-bold text-slate-800 text-lg">{t.resourceId}</span>
                                        <span className="text-xs text-slate-400 font-mono">{t.id.substring(0, 8)}...</span>
                                    </div>
                                </td>
                                <td className="p-6">
                                    <span className="px-3 py-1 bg-slate-100 text-slate-600 rounded-lg text-sm font-semibold">
                                        {t.category}
                                    </span>
                                </td>
                                <td className="p-6">
                                    <div className="flex justify-center -space-x-4">
                                        {t.imageUrls && t.imageUrls.length > 0 ? (
                                            t.imageUrls.map((img, i) => (
                                                <div key={i} className="relative cursor-pointer" onClick={() => setSelectedImg(`http://localhost:8080/uploads/${img}`)}>
                                                    <img 
                                                        src={`http://localhost:8080/uploads/${img}`}
                                                        className="w-12 h-12 rounded-2xl border-4 border-white object-cover shadow-lg transform group-hover:rotate-6 transition-transform hover:scale-125 z-10 hover:z-20"
                                                        alt="Incident"
                                                        onError={(e) => { e.target.src = 'https://via.placeholder.com/150?text=No+Image'; }}
                                                    />
                                                </div>
                                            ))
                                        ) : (
                                            <span className="text-xs text-gray-300 italic">No evidence attached</span>
                                        )}
                                    </div>
                                </td>
                                <td className="p-6 text-center">
                                    <span className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-black tracking-widest ${
                                        t.status === 'OPEN' ? 'bg-emerald-100 text-emerald-700' :
                                        t.status === 'REJECTED' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                                    }`}>
                                        <span className={`w-2 h-2 mr-2 rounded-full animate-pulse ${
                                            t.status === 'OPEN' ? 'bg-emerald-500' :
                                            t.status === 'REJECTED' ? 'bg-rose-500' : 'bg-amber-500'
                                        }`}></span>
                                        {t.status}
                                    </span>
                                </td>
                                <td className="p-6 text-right">
                                    <div className="flex justify-end items-center gap-3">
                                        {t.status === 'OPEN' && (
                                            <button onClick={() => handleStatusUpdate(t.id, 'REJECTED')} className="px-4 py-2 text-rose-600 hover:bg-rose-50 rounded-xl font-bold text-sm transition-colors">
                                                Reject
                                            </button>
                                        )}
                                        <button onClick={() => handleDelete(t.id)} className="p-3 bg-slate-50 text-slate-400 hover:bg-rose-600 hover:text-white rounded-xl transition-all shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Image Preview Modal */}
            {selectedImg && (
                <div className="fixed inset-0 bg-slate-900/90 backdrop-blur-sm z-[100] flex justify-center items-center p-4 cursor-zoom-out" onClick={() => setSelectedImg(null)}>
                    <img src={selectedImg} className="max-w-full max-h-[90vh] rounded-3xl shadow-2xl border-8 border-white/10" alt="Full Preview" />
                </div>
            )}
        </div>
    );
};

export default TicketList;