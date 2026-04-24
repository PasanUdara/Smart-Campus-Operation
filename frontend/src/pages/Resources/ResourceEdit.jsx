import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getResourceById,
  updateResource,
} from "../../api/resourceApi";

function ResourceEdit() {
  const { id } = useParams();
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
  // LOAD RESOURCE DATA
  // =========================

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await getResourceById(id);
        setFormData(response.data);
      } catch (error) {
        console.error(
          "Error loading resource:",
          error
        );
      }
    };

    fetchResource();
  }, [id]);

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
  // HANDLE UPDATE
  // =========================

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateResource(id, formData);
      navigate("/resources");
    } catch (error) {
      console.error(
        "Error updating resource:",
        error
      );
    }
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-6 text-white">

      {/* CARD */}
      <div className="bg-gray-900 w-full max-w-lg p-8 rounded-xl shadow-lg">

        {/* TITLE */}
        <h2 className="text-2xl font-bold text-yellow-400 text-center mb-6">
          Edit Resource
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
            value={formData.name}
            onChange={handleChange}
            placeholder="Resource Name"
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* TYPE */}
          <input
            type="text"
            name="type"
            value={formData.type}
            onChange={handleChange}
            placeholder="Type"
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* CAPACITY */}
          <input
            type="number"
            name="capacity"
            value={formData.capacity}
            onChange={handleChange}
            placeholder="Capacity"
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* LOCATION */}
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Location"
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* OLD FEATURE */}
          <input
            type="text"
            name="availabilityWindow"
            value={formData.availabilityWindow}
            onChange={handleChange}
            placeholder="Availability Window"
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* NEW FEATURE → AVAILABLE DAYS */}
          <input
            type="text"
            name="availableDays"
            value={formData.availableDays}
            onChange={handleChange}
            placeholder="Available Days (Mon - Fri)"
            className="bg-gray-800 border border-gray-700 p-3 rounded-lg focus:outline-none focus:border-yellow-400"
            required
          />

          {/* NEW FEATURE → AVAILABLE TIME */}
          <input
            type="text"
            name="availableTime"
            value={formData.availableTime}
            onChange={handleChange}
            placeholder="Available Time (8AM - 5PM)"
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

          {/* UPDATE BUTTON */}
          <button
            type="submit"
            className="bg-yellow-400 text-black py-3 rounded-lg font-semibold hover:bg-yellow-500 transition"
          >
            Update Resource
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResourceEdit;