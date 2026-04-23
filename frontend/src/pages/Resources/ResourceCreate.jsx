import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResource } from "../../api/resourceApi";

function ResourceCreate() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    availabilityWindow: "",
    status: "ACTIVE",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createResource(formData);
      navigate("/resources");
    } catch (error) {
      console.error("Error creating resource", error);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">
      <div className="bg-gray-900 w-full max-w-lg p-8 rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Add Resource
        </h2>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <input
            type="text"
            name="name"
            placeholder="Resource Name"
            value={formData.name}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

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

          <input
            type="number"
            name="capacity"
            placeholder="Capacity"
            value={formData.capacity}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          <input
            type="text"
            name="location"
            placeholder="Location"
            value={formData.location}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          <input
            type="text"
            name="availabilityWindow"
            placeholder="Availability Window"
            value={formData.availabilityWindow}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
          >
            <option value="ACTIVE">ACTIVE</option>
            <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
          </select>

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