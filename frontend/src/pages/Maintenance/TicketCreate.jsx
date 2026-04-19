import React, { useState } from 'react';
import { createTicket } from '../../api/ticketApi';
import { useNavigate } from 'react-router-dom';

const TicketCreate = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ resourceId: '', category: 'Electrical', description: '', priority: 'MEDIUM', contactDetails: '' });
    const [images, setImages] = useState([]);

    const handleFile = (e) => {
        if (e.target.files.length > 3) { alert("Max 3 images allowed!"); e.target.value = ""; return; }
        setImages([...e.target.files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = new FormData();
        Object.keys(form).forEach(key => data.append(key, form[key]));
        images.forEach(img => data.append('images', img));
        try {
            await createTicket(data);
            alert("✅ Reported!");
            navigate('/admin/tickets');
        } catch (err) { alert("Error!"); }
    };

    return (
        <div className="max-w-xl mx-auto p-10 bg-white rounded-3xl shadow-2xl mt-10">
            <h2 className="text-2xl font-black mb-6">Report Fault 🛠️</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input className="w-full p-4 bg-gray-50 rounded-xl" placeholder="Location" onChange={e => setForm({...form, resourceId: e.target.value})} required />
                <input className="w-full p-4 bg-gray-50 rounded-xl" placeholder="Contact (Phone/Email)" onChange={e => setForm({...form, contactDetails: e.target.value})} required />
                <textarea className="w-full p-4 bg-gray-50 rounded-xl" placeholder="Describe issue" onChange={e => setForm({...form, description: e.target.value})} required />
                <input type="file" multiple onChange={handleFile} className="text-sm" />
                <button className="w-full py-4 bg-blue-600 text-white font-bold rounded-xl">Submit Report</button>
            </form>
        </div>
    );
};
export default TicketCreate;