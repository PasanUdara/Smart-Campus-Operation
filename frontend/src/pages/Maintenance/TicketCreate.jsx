import React, { useState } from 'react';
import { createTicket } from '../../api/ticketApi';
import { useNavigate } from 'react-router-dom';

const CreateTicket = () => {
  const [form, setForm] = useState({
    resourceId: '',
    building: 'Main Building',
    category: 'Electrical',
    priority: 'LOW',
    description: '',
    reporterName: '',
    studentId: '',
    contactDetails: '',
    email: ''
  });
  
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    
    // සියලුම form fields එකතු කිරීම
    Object.keys(form).forEach(key => data.append(key, form[key]));
    
    // පින්තූර එකතු කිරීම (උපරිම 3)
    images.forEach(img => data.append('images', img));

    try {
      await createTicket(data);
      alert("🚀 Incident Reported Successfully!");
      navigate('/admin/tickets'); 
    } catch (err) {
      alert("❌ Error placing ticket. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 p-4 md:p-10 flex items-center justify-center font-sans">
      <div className="bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] shadow-2xl w-full max-w-2xl">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-block bg-yellow-400 text-black px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-4">
            Maintenance Portal
          </div>
          <h2 className="text-4xl font-black text-white">Report <span className="text-yellow-400">Incident.</span></h2>
          <p className="text-zinc-500 mt-2 text-sm">Please provide accurate details to speed up the repair process.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Section 1: Reporter Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Reporter Name</label>
              <input type="text" placeholder="Full Name" className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, reporterName: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Student / Staff ID</label>
              <input type="text" placeholder="IT2XXXXXXX" className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, studentId: e.target.value})} required />
            </div>
          </div>

          {/* Section 2: Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Contact Number</label>
              <input type="text" placeholder="071 XXXXXXX" className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, contactDetails: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Email Address</label>
              <input type="email" placeholder="name@example.com" className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, email: e.target.value})} required />
            </div>
          </div>

          {/* Section 3: Incident Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Location / Resource ID</label>
              <input type="text" placeholder="e.g. Lab 04 - A2" className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, resourceId: e.target.value})} required />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Building / Block</label>
              <select className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, building: e.target.value})}>
                <option value="Main Building">Main Building</option>
                <option value="New Faculty">New Faculty</option>
                <option value="Hostel Block A">Hostel Block A</option>
                <option value="Canteen Area">Canteen Area</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Category</label>
              <select className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, category: e.target.value})}>
                <option value="Electrical">Electrical</option>
                <option value="Plumbing">Plumbing</option>
                <option value="Furniture">Furniture</option>
                <option value="IT/Network">IT/Network</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-zinc-400 ml-2">Priority Level</label>
              <select className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all" 
                onChange={e => setForm({...form, priority: e.target.value})}>
                <option value="LOW">Low (Not Urgent)</option>
                <option value="MEDIUM">Medium (Normal)</option>
                <option value="HIGH">High (Urgent)</option>
                <option value="EMERGENCY">Emergency (Immediate Action)</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 ml-2">Description</label>
            <textarea placeholder="Tell us more about the issue..." className="w-full p-4 bg-zinc-800 text-white rounded-2xl border border-zinc-700 outline-none focus:border-yellow-400 transition-all h-28" 
              onChange={e => setForm({...form, description: e.target.value})} required></textarea>
          </div>

          {/* Image Upload */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-400 ml-2">Evidence Photos (Max 3)</label>
            <div className="p-6 border-2 border-dashed border-zinc-700 rounded-3xl text-center bg-zinc-900 hover:border-yellow-400 transition-colors cursor-pointer relative">
              <input type="file" multiple className="absolute inset-0 opacity-0 cursor-pointer" 
                onChange={e => setImages(Array.from(e.target.files).slice(0, 3))} />
              <div className="text-zinc-500">
                <span className="text-2xl">📸</span>
                <p className="text-xs mt-2">{images.length > 0 ? `${images.length} files selected` : 'Click to upload or drag images'}</p>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className={`w-full ${loading ? 'bg-zinc-700' : 'bg-yellow-400 hover:bg-yellow-500'} text-black p-5 rounded-2xl font-black text-lg shadow-xl shadow-yellow-900/20 transition-all active:scale-95`}
          >
            {loading ? 'Submitting...' : 'SUBMIT INCIDENT REPORT'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateTicket;