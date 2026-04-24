import React, { useState, useEffect } from 'react';
import { getAllBookings, approveBooking, rejectBooking, deleteBooking } from '../../api/BookingApi';
import { useAuth } from '../../contexts/AuthContext';

const STATUS_CONFIG = {
    PENDING: {
        color: 'text-yellow-400',
        bg: 'bg-yellow-400/10',
        border: 'border-yellow-400/30',
        icon: '⏳',
        label: 'Pending'
    },
    APPROVED: {
        color: 'text-green-400',
        bg: 'bg-green-400/10',
        border: 'border-green-400/30',
        icon: '✅',
        label: 'Approved'
    },
    REJECTED: {
        color: 'text-red-400',
        bg: 'bg-red-400/10',
        border: 'border-red-400/30',
        icon: '❌',
        label: 'Rejected'
    },
    CANCELLED: {
        color: 'text-zinc-500',
        bg: 'bg-zinc-500/10',
        border: 'border-zinc-500/30',
        icon: '🚫',
        label: 'Cancelled'
    }
};

const AdminBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('ALL');
    const [actionLoading, setActionLoading] = useState(null);

    // Modal state for approve/reject with remarks
    const [modal, setModal] = useState({ show: false, type: '', bookingId: '', remarks: '' });

    useEffect(() => {
        loadBookings();
    }, [token, filter]);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await getAllBookings(token, filter);
            setBookings(response.data);
        } catch (err) {
            console.error('Failed to load bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (type, bookingId) => {
        setModal({ show: true, type, bookingId, remarks: '' });
    };

    const closeModal = () => {
        setModal({ show: false, type: '', bookingId: '', remarks: '' });
    };

    const handleModalSubmit = async () => {
        setActionLoading(modal.bookingId);
        try {
            if (modal.type === 'approve') {
                await approveBooking(modal.bookingId, modal.remarks, token);
            } else if (modal.type === 'reject') {
                await rejectBooking(modal.bookingId, modal.remarks, token);
            }
            closeModal();
            loadBookings();
        } catch (err) {
            alert(err.response?.data?.message || `Failed to ${modal.type} booking.`);
        } finally {
            setActionLoading(null);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to permanently delete this booking?')) return;
        setActionLoading(id);
        try {
            await deleteBooking(id, token);
            loadBookings();
        } catch (err) {
            alert('Failed to delete booking.');
        } finally {
            setActionLoading(null);
        }
    };

    const formatDateTime = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleString('en-US', {
            month: 'short', day: 'numeric', year: 'numeric',
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const pendingCount = bookings.filter(b => b.status === 'PENDING').length;

    return (
        <div className="min-h-screen bg-[#050505] p-4 md:p-10 font-sans text-white selection:bg-yellow-400 selection:text-black">
            <div className="max-w-7xl mx-auto">

                {/* Page Header */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-10 gap-4">
                    <div>
                        <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                            Booking <span className="text-yellow-400">Console.</span>
                        </h1>
                        <p className="text-zinc-500 mt-2 text-sm font-medium">
                            Review, approve, or reject booking requests.
                        </p>
                    </div>
                    {pendingCount > 0 && (
                        <div className="bg-yellow-400/10 border border-yellow-400/30 text-yellow-400 px-5 py-2.5 rounded-2xl text-xs font-black uppercase tracking-widest animate-pulse">
                            {pendingCount} Pending Request{pendingCount !== 1 ? 's' : ''}
                        </div>
                    )}
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap gap-2 mb-8">
                    {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((status) => (
                        <button
                            key={status}
                            onClick={() => setFilter(status)}
                            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                filter === status
                                    ? 'bg-yellow-400 text-black'
                                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-yellow-400/50 hover:text-yellow-400'
                            }`}
                        >
                            {status}
                        </button>
                    ))}
                </div>

                {/* Loading State */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                        <span className="ml-3 text-zinc-500 text-sm font-bold uppercase tracking-widest">Loading...</span>
                    </div>
                ) : bookings.length === 0 ? (
                    <div className="text-center py-20 bg-zinc-900/30 border border-zinc-800 rounded-[2rem]">
                        <div className="text-5xl mb-4">📭</div>
                        <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">No bookings found</p>
                        <p className="text-zinc-700 text-xs mt-2">
                            {filter !== 'ALL' ? `No ${filter.toLowerCase()} bookings at this time.` : 'No booking requests have been made yet.'}
                        </p>
                    </div>
                ) : (
                    /* Bookings Table / Cards */
                    <div className="space-y-4">
                        {bookings.map((booking) => {
                            const statusConf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                            return (
                                <div
                                    key={booking.id}
                                    className={`bg-zinc-900/30 border ${
                                        booking.status === 'PENDING' ? 'border-yellow-400/20' : 'border-zinc-800'
                                    } p-6 rounded-[2rem] hover:border-yellow-400/30 transition-all`}
                                >
                                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                                        {/* Left: Info */}
                                        <div className="flex-1 space-y-3">
                                            <div className="flex flex-wrap items-center gap-3">
                                                <h3 className="text-lg font-black text-white uppercase italic tracking-tight">
                                                    {booking.resourceName || booking.resourceId}
                                                </h3>
                                                <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[9px] font-black uppercase ${statusConf.bg} ${statusConf.color}`}>
                                                    {statusConf.icon} {statusConf.label}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 text-xs">
                                                <div>
                                                    <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Requested By</span>
                                                    <p className="text-zinc-300 font-medium">{booking.userName || booking.userId || '—'}</p>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Start</span>
                                                    <p className="text-zinc-300 font-medium">{formatDateTime(booking.startTime)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">End</span>
                                                    <p className="text-zinc-300 font-medium">{formatDateTime(booking.endTime)}</p>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Purpose</span>
                                                    <p className="text-zinc-300 font-medium">{booking.purpose}</p>
                                                </div>
                                                <div>
                                                    <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Attendees</span>
                                                    <p className="text-zinc-300 font-medium">{booking.expectedAttendees || '—'}</p>
                                                </div>
                                            </div>

                                            {/* Admin Remarks */}
                                            {booking.adminRemarks && (
                                                <div className="bg-black/30 p-3 rounded-xl border border-zinc-800/50">
                                                    <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Admin Remarks</span>
                                                    <p className="text-zinc-400 text-xs italic mt-1">"{booking.adminRemarks}"</p>
                                                </div>
                                            )}
                                        </div>

                                        {/* Right: Actions */}
                                        <div className="flex items-center gap-2 shrink-0 flex-wrap">
                                            {booking.status === 'PENDING' && (
                                                <>
                                                    <button
                                                        onClick={() => openModal('approve', booking.id)}
                                                        disabled={actionLoading === booking.id}
                                                        className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-green-500/10 text-green-400 border border-green-500/30 hover:bg-green-500 hover:text-white transition-all disabled:opacity-50"
                                                    >
                                                        ✓ Approve
                                                    </button>
                                                    <button
                                                        onClick={() => openModal('reject', booking.id)}
                                                        disabled={actionLoading === booking.id}
                                                        className="px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white transition-all disabled:opacity-50"
                                                    >
                                                        ✕ Reject
                                                    </button>
                                                </>
                                            )}
                                            <button
                                                onClick={() => handleDelete(booking.id)}
                                                disabled={actionLoading === booking.id}
                                                className="px-4 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest text-zinc-600 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-50"
                                                title="Delete booking"
                                            >
                                                🗑
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* ── APPROVE / REJECT MODAL ── */}
            {modal.show && (
                <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
                    <div className="bg-zinc-900 border border-zinc-800 rounded-[2rem] p-8 max-w-lg w-full shadow-2xl">
                        <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-2">
                            {modal.type === 'approve' ? '✅ Approve' : '❌ Reject'} Booking
                        </h3>
                        <p className="text-zinc-500 text-sm mb-6">
                            {modal.type === 'approve'
                                ? 'Optionally add remarks for the user.'
                                : 'Please provide a reason for rejection.'}
                        </p>

                        <textarea
                            value={modal.remarks}
                            onChange={(e) => setModal({ ...modal, remarks: e.target.value })}
                            placeholder={modal.type === 'approve'
                                ? 'e.g., Approved. Please ensure cleanup after use.'
                                : 'e.g., Room is under maintenance during that period.'}
                            className="w-full p-4 bg-black/40 rounded-xl border border-zinc-800 text-sm text-white outline-none focus:border-yellow-400 transition-all h-28 resize-none"
                        />

                        <div className="flex gap-3 mt-6">
                            <button
                                onClick={handleModalSubmit}
                                disabled={actionLoading}
                                className={`flex-1 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs transition-all ${
                                    modal.type === 'approve'
                                        ? 'bg-green-500 text-white hover:bg-green-600'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                } disabled:opacity-50`}
                            >
                                {actionLoading ? 'Processing...' : `Confirm ${modal.type === 'approve' ? 'Approval' : 'Rejection'}`}
                            </button>
                            <button
                                onClick={closeModal}
                                className="px-6 py-3.5 rounded-xl font-black uppercase tracking-widest text-xs bg-zinc-800 text-zinc-400 hover:text-white transition-all"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                textarea::placeholder { color: #555; font-style: italic; font-size: 12px; }
            `}</style>
        </div>
    );
};

export default AdminBookings;
