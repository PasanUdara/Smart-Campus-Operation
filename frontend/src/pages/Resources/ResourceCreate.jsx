import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResource } from "../../api/resourceApi";

function ResourceCreate() {
  const navigate = useNavigate();

  // =========================
  // FORM STATE
  // =========================

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    availabilityWindow: "",

    // NEW FEATURE → Availability Calendar
    availableDays: "",
    availableTime: "",

    status: "ACTIVE",
  });

  // =========================
  // HANDLE INPUT CHANGE
  // =========================

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // =========================
  // HANDLE SUBMIT
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createResource(formData);
      navigate("/resources");
    } catch (error) {
      console.error("Error creating resource:", error);
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="bg-gray-900 w-full max-w-lg p-8 rounded-xl shadow-lg">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Add Resource
        </h2>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          {/* NAME */}
          <input
            type="text"
            name="name"
            placeholder="Resource Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* TYPE */}
          <select
            name="type"
            value={formData.type}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          >
            <option value="">Select Resource Type</option>
            <option value="Lecture Hall">Lecture Hall</option>
            <option value="Lab">Lab</option>
            <option value="Meeting Room">Meeting Room</option>
            <option value="Projector">Projector</option>
            <option value="Camera">Camera</option>
            <option value="Equipment">Equipment</option>
          </select>

          {/* CAPACITY */}
          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* LOCATION */}
          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* OLD FEATURE */}
          <input
            type="text"
            name="availabilityWindow"
            placeholder="Availability Window"
            value={formData.availabilityWindow}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* NEW FEATURE → AVAILABLE DAYS */}
          <input
            type="text"
            name="availableDays"
            placeholder="Available Days (Mon - Fri)"
            value={formData.availableDays}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* NEW FEATURE → AVAILABLE TIME */}
          <input
            type="text"
            name="availableTime"
            placeholder="Available Time (8AM - 5PM)"
            value={formData.availableTime}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* STATUS */}
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">
              OUT OF SERVICE
            </option>
          </select>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            className="bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Save Resource
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResourceCreate;