import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getResourceById, updateResource } from "../../api/resourceApi";
import "../../styles/Resource.css";

function ResourceEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    type: "",
    capacity: "",
    location: "",
    availabilityWindow: "",
    status: "ACTIVE",
  });

  useEffect(() => {
    const fetchResource = async () => {
      try {
        const response = await getResourceById(id);
        setFormData(response.data);
      } catch (error) {
        console.error("Error loading resource", error);
      }
    };

    fetchResource();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateResource(id, formData);
      navigate("/resources");
    } catch (error) {
      console.error("Error updating resource", error);
    }
  };

  return (
    <div className="form-container">
      <h2>Edit Resource</h2>

      <form onSubmit={handleSubmit} className="resource-form">
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="capacity"
          value={formData.capacity}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="availabilityWindow"
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

        <button type="submit">Update Resource</button>
      </form>
    </div>
  );
}

export default ResourceEdit;