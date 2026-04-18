import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createTicket } from '../../api/ticketApi';

const TicketCreate = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ resourceId: '', category: 'Electrical', description: '', priority: 'MEDIUM' });
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
    const handleFileChange = (e) => setImages([...e.target.files]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const data = new FormData();
        Object.keys(formData).forEach(key => data.append(key, formData[key]));
        images.forEach(img => data.append('images', img));

        try {
            await createTicket(data);
            alert("✅ Incident Reported Successfully!");
            navigate('/admin/tickets'); // සාර්ථක වුණොත් කෙලින්ම Dashboard එකට යනවා
        } catch (err) {
            alert("Error submitting report!");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-xl mx-auto my-10 bg-white p-10 rounded-3xl shadow-2xl border border-gray-100">
            <h2 className="text-3xl font-black text-gray-800 mb-2">Report a Fault 🛠️</h2>
            <p className="text-gray-400 text-sm mb-8">Fill the form to notify the maintenance team.</p>
            
            <form onSubmit={handleSubmit} className="space-y-5">
                <input name="resourceId" placeholder="Resource ID (e.g. A-101)" onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-xl border-none focus:ring-2 focus:ring-blue-500" />
                
                <div className="grid grid-cols-2 gap-4">
                    <select name="category" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border-none">
                        <option value="Electrical">Electrical</option>
                        <option value="IT/Network">IT/Network</option>
                        <option value="Plumbing">Plumbing</option>
                    </select>
                    <select name="priority" onChange={handleChange} className="p-4 bg-gray-50 rounded-xl border-none font-bold text-red-500">
                        <option value="LOW">Low</option>
                        <option value="MEDIUM">Medium</option>
                        <option value="HIGH">High</option>
                    </select>
                </div>

                <textarea name="description" placeholder="What is the issue?" rows="4" onChange={handleChange} required className="w-full p-4 bg-gray-50 rounded-xl border-none" />

                <div className="p-4 border-2 border-dashed border-gray-200 rounded-2xl">
                    <input type="file" multiple accept="image/*" onChange={handleFileChange} className="text-sm text-gray-500" />
                </div>

                <button type="submit" disabled={loading} className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-2xl shadow-lg transition-transform active:scale-95">
                    {loading ? "Sending..." : "Submit Fault Report"}
                </button>
            </form>
        </div>
    );
};

export default TicketCreate;