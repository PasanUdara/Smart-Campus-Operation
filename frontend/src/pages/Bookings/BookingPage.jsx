import React, { useState } from 'react';
import BookingManager from '../../components/Bookings/BookingManager';
import MyBookings from '../../components/Bookings/MyBookings';

const TABS = [
    { id: 'create', label: 'Reserve a Resource', icon: '📅' },
    { id: 'my', label: 'My Bookings', icon: '📋' },
];

const BookingPage = () => {
    const [activeTab, setActiveTab] = useState('create');

    return (
        <div className="min-h-screen bg-[#050505] p-4 md:p-10 font-sans text-white selection:bg-yellow-400 selection:text-black">
            <div className="max-w-6xl mx-auto">
                {/* Page Header */}
                <div className="mb-10">
                    <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter">
                        Facility <span className="text-yellow-400">Booking.</span>
                    </h1>
                    <p className="text-zinc-500 mt-2 text-sm md:text-base font-medium">
                        Request and manage your campus resource reservations.
                    </p>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 mb-8">
                    {TABS.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                                    ? 'bg-yellow-400 text-black shadow-[0_10px_25px_rgba(250,204,21,0.15)]'
                                    : 'bg-zinc-900 text-zinc-500 border border-zinc-800 hover:border-yellow-400/40 hover:text-yellow-400'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div>
                    {activeTab === 'create' && <BookingManager />}
                    {activeTab === 'my' && <MyBookings />}
                </div>
            </div>
        </div>
    );
};

export default BookingPage;
