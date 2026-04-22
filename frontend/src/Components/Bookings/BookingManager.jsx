import React, { useState } from 'react';
import { createBooking } from '../../api/BookingApi';

const BookingManager = () => {
    // 1. Form State
    const [formData, setFormData] = useState({
        resourceId: '', 
        startTime: '',
        endTime: '',
        purpose: '',
        expectedAttendees: ''
    });

    // 2. Validation & UI State
    const [errors, setErrors] = useState({});
    const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        // Clear the specific error when the user starts typing again
        if (errors[name]) {
            setErrors({ ...errors, [name]: null });
        }
    };

    // 3. The Validation Logic
    const validateForm = () => {
        let newErrors = {};
        const now = new Date();
        const start = new Date(formData.startTime);
        const end = new Date(formData.endTime);

        if (!formData.resourceId) newErrors.resourceId = "Please select a resource.";
        if (!formData.purpose.trim()) newErrors.purpose = "Purpose is required.";
        if (!formData.expectedAttendees || formData.expectedAttendees < 1) {
            newErrors.expectedAttendees = "Must have at least 1 attendee.";
        }

        if (!formData.startTime) {
            newErrors.startTime = "Start time is required.";
        } else if (start < now) {
            newErrors.startTime = "Start time cannot be in the past.";
        }

        if (!formData.endTime) {
            newErrors.endTime = "End time is required.";
        } else if (end <= start) {
            newErrors.endTime = "End time must be after the start time.";
        }

        setErrors(newErrors);
        // Returns true if there are 0 errors
        return Object.keys(newErrors).length === 0;
    };

    // 4. Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitStatus({ type: '', message: '' });

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // HTML datetime-local outputs "YYYY-MM-DDThh:mm", which Spring Boot parses perfectly!
            await createBooking(formData);
            
            setSubmitStatus({ 
                type: 'success', 
                message: 'Booking request submitted successfully! Waiting for admin approval.' 
            });
            
            // Clear the form after success
            setFormData({ resourceId: '', startTime: '', endTime: '', purpose: '', expectedAttendees: '' });
        } catch (error) {
            setSubmitStatus({ type: 'error', message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto p-6 mt-10 bg-white rounded-2xl shadow-sm border border-gray-100">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">Reserve a Resource</h2>
                <p className="text-gray-500 mt-1">Fill out the details below to request a booking.</p>
            </div>

            {/* Status Messages (Success or Conflict Error) */}
            {submitStatus.message && (
                <div className={`p-4 mb-6 rounded-lg text-sm font-medium ${
                    submitStatus.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                }`}>
                    {submitStatus.message}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Resource Selection */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Select Resource</label>
                    <select 
                        name="resourceId" 
                        value={formData.resourceId} 
                        onChange={handleChange}
                        className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.resourceId ? 'border-red-500' : 'border-gray-300'}`}
                    >
                        <option value="">-- Choose a Facility --</option>
                        {/* In a real app, you would fetch these from Member 1's API */}
                        <option value="1">Main Auditorium (Capacity: 300)</option>
                        <option value="2">Computer Lab 04 (Capacity: 50)</option>
                        <option value="3">Meeting Room B (Capacity: 10)</option>
                    </select>
                    {errors.resourceId && <p className="text-red-500 text-xs mt-1">{errors.resourceId}</p>}
                </div>

                {/* Date & Time Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                        <input 
                            type="datetime-local" 
                            name="startTime" 
                            value={formData.startTime} 
                            onChange={handleChange}
                            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.startTime && <p className="text-red-500 text-xs mt-1">{errors.startTime}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                        <input 
                            type="datetime-local" 
                            name="endTime" 
                            value={formData.endTime} 
                            onChange={handleChange}
                            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.endTime ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.endTime && <p className="text-red-500 text-xs mt-1">{errors.endTime}</p>}
                    </div>
                </div>

                {/* Purpose & Attendees Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Purpose of Booking</label>
                        <input 
                            type="text" 
                            name="purpose" 
                            placeholder="e.g., Guest Lecture on AI"
                            value={formData.purpose} 
                            onChange={handleChange}
                            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.purpose ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.purpose && <p className="text-red-500 text-xs mt-1">{errors.purpose}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Attendees</label>
                        <input 
                            type="number" 
                            name="expectedAttendees" 
                            placeholder="0"
                            value={formData.expectedAttendees} 
                            onChange={handleChange}
                            className={`w-full border p-3 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition ${errors.expectedAttendees ? 'border-red-500' : 'border-gray-300'}`}
                        />
                        {errors.expectedAttendees && <p className="text-red-500 text-xs mt-1">{errors.expectedAttendees}</p>}
                    </div>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                    <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className={`w-full text-white font-bold py-3 px-4 rounded-lg transition shadow-md 
                            ${isSubmitting ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700 hover:shadow-lg'}`}
                    >
                        {isSubmitting ? 'Processing...' : 'Submit Booking Request'}
                    </button>
                </div>

            </form>
        </div>
    );
};

export default BookingManager;