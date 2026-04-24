import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../../api/BookingApi';
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

const MyBookings = () => {
    const { token } = useAuth();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [cancellingId, setCancellingId] = useState(null);
    const [filter, setFilter] = useState('ALL');

    useEffect(() => {
        loadBookings();
    }, [token]);

    const loadBookings = async () => {
        setLoading(true);
        try {
            const response = await getMyBookings(token);
            setBookings(response.data);
        } catch (err) {
            console.error('Failed to load bookings:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = async (id) => {
        if (!window.confirm('Are you sure you want to cancel this approved booking?')) return;
        setCancellingId(id);
        try {
            await cancelBooking(id, token);
            loadBookings(); // Refresh the list
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel booking.');
        } finally {
            setCancellingId(null);
        }
    };

    const formatDate = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleDateString('en-US', {
            weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
        });
    };

    const formatTime = (dateStr) => {
        if (!dateStr) return '—';
        const d = new Date(dateStr);
        return d.toLocaleTimeString('en-US', {
            hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const filteredBookings = filter === 'ALL'
        ? bookings
        : bookings.filter(b => b.status === filter);

    if (loading) {
        return (
            <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin"></div>
                <span className="ml-3 text-zinc-500 text-sm font-bold uppercase tracking-widest">Loading Bookings...</span>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Filter Tabs */}
            <div className="flex flex-wrap gap-2">
                {['ALL', 'PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilter(status)}
                        className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            filter === status
                                ? 'bg-yellow-400 text-black'
                                : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-yellow-400/50 hover:text-yellow-400'
                        }`}
                    >
                        {status} {status !== 'ALL' && `(${bookings.filter(b => status === 'ALL' || b.status === status).length})`}
                    </button>
                ))}
            </div>

            {/* Bookings List */}
            {filteredBookings.length === 0 ? (
                <div className="text-center py-16 bg-zinc-900/30 border border-zinc-800 rounded-[2rem]">
                    <div className="text-5xl mb-4">📭</div>
                    <p className="text-zinc-500 font-bold uppercase tracking-widest text-sm">
                        {filter === 'ALL' ? 'No bookings yet' : `No ${filter.toLowerCase()} bookings`}
                    </p>
                    <p className="text-zinc-700 text-xs mt-2">Your booking requests will appear here.</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {filteredBookings.map((booking) => {
                        const statusConf = STATUS_CONFIG[booking.status] || STATUS_CONFIG.PENDING;
                        return (
                            <div
                                key={booking.id}
                                className={`bg-zinc-900/30 border ${statusConf.border} p-6 rounded-[2rem] hover:border-yellow-400/30 transition-all group`}
                            >
                                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                                    {/* Left: Details */}
                                    <div className="flex-1 space-y-3">
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-black text-white uppercase italic tracking-tight">
                                                {booking.resourceName || booking.resourceId}
                                            </h3>
                                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-lg text-[9px] font-black uppercase ${statusConf.bg} ${statusConf.color}`}>
                                                {statusConf.icon} {statusConf.label}
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                                            <div>
                                                <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Date</span>
                                                <p className="text-zinc-300 font-medium">{formatDate(booking.startTime)}</p>
                                            </div>
                                            <div>
                                                <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Time</span>
                                                <p className="text-zinc-300 font-medium">
                                                    {formatTime(booking.startTime)} – {formatTime(booking.endTime)}
                                                </p>
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
                                            <div className="bg-black/30 p-3 rounded-xl border border-zinc-800/50 mt-2">
                                                <span className="text-zinc-600 font-black uppercase tracking-widest text-[8px]">Admin Remarks</span>
                                                <p className="text-zinc-400 text-xs italic mt-1">"{booking.adminRemarks}"</p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right: Actions */}
                                    <div className="flex items-center gap-2 shrink-0">
                                        {booking.status === 'APPROVED' && (
                                            <button
                                                onClick={() => handleCancel(booking.id)}
                                                disabled={cancellingId === booking.id}
                                                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                                                    cancellingId === booking.id
                                                        ? 'bg-zinc-800 text-zinc-600 cursor-not-allowed'
                                                        : 'bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500 hover:text-white'
                                                }`}
                                            >
                                                {cancellingId === booking.id ? 'Cancelling...' : 'Cancel Booking'}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyBookings;
