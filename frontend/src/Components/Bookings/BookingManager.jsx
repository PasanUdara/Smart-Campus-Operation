import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { createBooking } from '../../api/BookingApi';
import { getAllResources } from '../../api/resourceApi';
import { useAuth } from '../../contexts/AuthContext';

const BookingManager = () => {
    const { token } = useAuth();
    const location = useLocation();

    // Form State
    const [formData, setFormData] = useState({
        resourceId: '',
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: ''
    });

    // Resources list from API
    const [resources, setResources] = useState([]);

    // Validation & UI State
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Pre-fill resourceId from query params (e.g., from Resource page "Book" button)
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const resourceIdFromQuery = params.get('resourceId');
        if (resourceIdFromQuery) {
            setFormData((prev) => ({ ...prev, resourceId: resourceIdFromQuery }));
        }
    }, [location.search]);

    // Fetch real resources from the API
    useEffect(() => {
        const fetchResources = async () => {
            try {
                const response = await getAllResources();
                setResources(response.data);
            } catch (err) {
                console.error('Failed to load resource list:', err);
            }
        };
        fetchResources();
    }, []);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // Validation Logic
    const validateForm = () => {
        let newErrors = {};
        const now = new Date();
        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);

        // 1. Resource must be selected
        if (!formData.resourceId) {
            newErrors.resourceId = "Please select a resource.";
        }

        // 2. Purpose validations
        if (!formData.purpose || !formData.purpose.trim()) {
            newErrors.purpose = "Purpose is required.";
        } else if (formData.purpose.trim().length < 3) {
            newErrors.purpose = "Purpose must be at least 3 characters long.";
        } else if (formData.purpose.trim().length > 500) {
            newErrors.purpose = "Purpose must be 500 characters or less.";
        }

        // 3. Attendees validations
        const attendees = parseInt(formData.expectedAttendees, 10);
        if (!formData.expectedAttendees || isNaN(attendees) || attendees < 1) {
            newErrors.expectedAttendees = "Must have at least 1 attendee.";
        } else if (attendees > 1000) {
            newErrors.expectedAttendees = "Attendees cannot exceed 1000.";
        } else if (formData.resourceId) {
            // Check against selected resource capacity
            const selectedResource = resources.find(r => r.id === formData.resourceId);
            if (selectedResource && attendees > selectedResource.capacity) {
                newErrors.expectedAttendees = `Attendees (${attendees}) exceeds resource capacity (${selectedResource.capacity}). Choose a larger facility.`;
            }
        }

        // 4. Start time validations
        if (!formData.startTime) {
            newErrors.startTime = "Start time is required.";
        } else if (formData.endTime && start.getTime() === end.getTime()) {
            newErrors.startTime = "Start time and end time cannot be the same.";
        } else if (formData.endTime && start >= end) {
            newErrors.startTime = "Start time must be before the end time.";
        }

        // 5. End time validations
        if (!formData.endTime) {
            newErrors.endTime = "End time is required.";
        } else if (formData.startTime && start.getTime() === end.getTime()) {
            newErrors.endTime = "End time cannot be the same as start time.";
        } else if (formData.startTime && end <= start) {
            newErrors.endTime = "End time must be after the start time.";
        } else if (formData.startTime && !newErrors.startTime) {
            // Duration checks (only if both times are valid)
            const durationMinutes = (end - start) / (1000 * 60);
            if (durationMinutes < 15) {
                newErrors.endTime = "Booking duration must be at least 15 minutes.";
            } else if (durationMinutes > 24 * 60) {
                newErrors.endTime = "Booking duration cannot exceed 24 hours.";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: '', message: '' });

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            const payload = {
                ...formData,
                expectedAttendees: parseInt(formData.expectedAttendees, 10),
                startTime: formData.startTime ? `${formData.startTime}:00` : null,
                endTime: formData.endTime ? `${formData.endTime}:00` : null,
            };

            await createBooking(payload, token);

            setSubmitStatus({
                type: 'success',
                message: 'Booking request submitted successfully! Waiting for admin approval.'
            });

            // Clear the form after success
            setFormData({ resourceId: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
        } catch (error) {
            const message = error.response?.data?.message || error.message;
            setSubmitStatus({ type: 'error', message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-zinc-900/30 border border-zinc-800 p-8 md:p-12 rounded-[3rem] backdrop-blur-2xl shadow-2xl">
            <div className="mb-8">
                <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
                    Reserve a <span className="text-yellow-400">Resource.</span>
                </h2>
                <p className="text-zinc-500 mt-2 text-sm">Fill out the details below to request a booking.</p>
            </div>

            {/* Status Messages */}
            {submitStatus.message && (
                <div className={`p-4 mb-6 rounded-2xl text-sm font-bold border ${submitStatus.type === 'success'
                        ? 'bg-green-500/10 text-green-400 border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border-red-500/30'
                    }`}>
                    {submitStatus.type === 'success' ? '✅ ' : '⚠️ '}
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">

                {/* Resource Selection */}
                <div>
                    <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                        Select Resource
                    </label>
                    <select
                        name="resourceId"
                        value={formData.resourceId}
                        onChange={handleChange}
                        className={`w-full p-4 bg-black/40 rounded-xl border text-sm text-white outline-none transition-all appearance-none cursor-pointer ${errors.resourceId ? 'border-red-500' : 'border-zinc-800 focus:border-yellow-400'
                            }`}
                    >
                        <option value="">-- Choose a Facility --</option>
                        {resources.map((res) => (
                            <option key={res.id} value={res.id}>
                                {res.name} — {res.type} (Capacity: {res.capacity})
                            </option>
                        ))}
                    </select>
                    {errors.resourceId && <p className="text-red-400 text-xs mt-1 font-medium">{errors.resourceId}</p>}
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                            Start Time
                        </label>
                        <input
                            type="datetime-local"
                            name="startTime"
                            value={formData.startTime}
                            onChange={handleChange}
                            className={`w-full p-4 bg-black/40 rounded-xl border text-sm text-white outline-none transition-all ${errors.startTime ? 'border-red-500' : 'border-zinc-800 focus:border-yellow-400'
                                }`}
                        />
                        {errors.startTime && <p className="text-red-400 text-xs mt-1 font-medium">{errors.startTime}</p>}
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                            End Time
                        </label>
                        <input
                            type="datetime-local"
                            name="endTime"
                            value={formData.endTime}
                            onChange={handleChange}
                            className={`w-full p-4 bg-black/40 rounded-xl border text-sm text-white outline-none transition-all ${errors.endTime ? 'border-red-500' : 'border-zinc-800 focus:border-yellow-400'
                                }`}
                        />
                        {errors.endTime && <p className="text-red-400 text-xs mt-1 font-medium">{errors.endTime}</p>}
                    </div>
                </div>

                {/* Purpose & Attendees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                            Purpose of Booking
                        </label>
                        <input
                            type="text"
                            name="purpose"
                            placeholder="e.g., Guest Lecture on AI"
                            value={formData.purpose}
                            onChange={handleChange}
                            maxLength={500}
                            className={`w-full p-4 bg-black/40 rounded-xl border text-sm text-white outline-none transition-all ${errors.purpose ? 'border-red-500' : 'border-zinc-800 focus:border-yellow-400'
                                }`}
                        />
                        <div className="flex justify-between items-center mt-1">
                            {errors.purpose ? <p className="text-red-400 text-xs font-medium">{errors.purpose}</p> : <span />}
                            <span className={`text-[10px] ${formData.purpose.length > 450 ? 'text-yellow-400' : 'text-zinc-700'}`}>{formData.purpose.length}/500</span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">
                            Expected Attendees
                        </label>
                        <input
                            type="number"
                            name="expectedAttendees"
                            placeholder="0"
                            min="1"
                            max="1000"
                            value={formData.expectedAttendees}
                            onChange={handleChange}
                            className={`w-full p-4 bg-black/40 rounded-xl border text-sm text-white outline-none transition-all ${errors.expectedAttendees ? 'border-red-500' : 'border-zinc-800 focus:border-yellow-400'
                                }`}
                        />
                        {errors.expectedAttendees && <p className="text-red-400 text-xs mt-1 font-medium">{errors.expectedAttendees}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={`w-full text-black font-black uppercase italic tracking-widest py-4 px-4 rounded-2xl transition-all text-sm
                            ${isSubmitting
                                ? 'bg-yellow-400/50 cursor-not-allowed'
                                : 'bg-yellow-400 hover:bg-yellow-500 hover:shadow-[0_15px_30px_rgba(250,204,21,0.15)] active:scale-[0.98]'
                            }`}
                    >
                        {isSubmitting ? 'Processing...' : 'Submit Booking Request'}
                    </button>
                </div>

            </form>

            <style>{`
                input::placeholder { color: #555; text-transform: uppercase; font-weight: 900; font-size: 9px; letter-spacing: 0.1em; }
                input[type="datetime-local"]::-webkit-calendar-picker-indicator { filter: invert(1); }
                select option { background: #111; color: #fff; }
            `}</style>
        </div>
    );
};

export default BookingManager;