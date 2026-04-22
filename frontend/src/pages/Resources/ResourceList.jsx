import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getAllResources, deleteResource } from "../../api/resourceApi";
import "../../styles/Resource.css";

function ResourceList() {
  const [resources, setResources] = useState([]);

  const fetchResources = async () => {
    try {
      const response = await getAllResources();
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource", error);
    }
  };

  return (
    <div className="resource-container">
      <div className="resource-header">
        <h2>All Resources</h2>
        <Link to="/resources/create" className="add-btn">
          Add Resource
        </Link>
      </div>

      <table className="resource-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Capacity</th>
            <th>Location</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {resources.map((resource) => (
            <tr key={resource.id}>
              <td>{resource.name}</td>
              <td>{resource.type}</td>
              <td>{resource.capacity}</td>
              <td>{resource.location}</td>
              <td>{resource.status}</td>
              <td>
                <Link
                  to={`/resources/edit/${resource.id}`}
                  className="edit-btn"
                >
                  Edit
                </Link>

                <button
                  className="delete-btn"
                  onClick={() => handleDelete(resource.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResourceList;