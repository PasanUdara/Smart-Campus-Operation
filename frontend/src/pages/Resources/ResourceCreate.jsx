import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createResource } from "../../api/resourceApi";
import "../../styles/Resource.css";

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
    <div className="form-container">
      <h2>Add Resource</h2>

      <form onSubmit={handleSubmit} className="resource-form">
        <input
          type="text"
          name="name"
          placeholder="Resource Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
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
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="availabilityWindow"
          placeholder="Availability Window"
          value={formData.availabilityWindow}
          onChange={handleChange}
          required
        />

        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
        >
          <option value="ACTIVE">ACTIVE</option>
          <option value="OUT_OF_SERVICE">OUT OF SERVICE</option>
        </select>

        <button type="submit">Save Resource</button>
      </form>
    </div>
  );
}

export default ResourceCreate;