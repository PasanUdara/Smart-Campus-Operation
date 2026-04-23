import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAllResources,
  deleteResource,
  searchByType,
  searchByLocation,
  searchByCapacity,
} from "../../api/resourceApi";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // Fetch all
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

  // Delete
  const handleDelete = async (id) => {
    try {
      await deleteResource(id);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource", error);
    }
  };

  // Search
  const handleSearch = async () => {
    try {
      let response;

      if (filterType === "type") {
        response = await searchByType(searchValue);
      } else if (filterType === "location") {
        response = await searchByLocation(searchValue);
      } else if (filterType === "capacity") {
        response = await searchByCapacity(searchValue);
      } else {
        response = await getAllResources();
      }

      setResources(response.data);
    } catch (error) {
      console.error("Search error", error);
    }
  };

  return (
    <div className="p-6 bg-black min-h-screen text-white">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-yellow-400">
          All Resources
        </h2>

        <Link
          to="/resources/create"
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition"
        >
          Add Resource
        </Link>
      </div>

      {/* Search Bar */}
      <div className="flex gap-3 mb-6">
        <select
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white p-2 rounded-lg"
        >
          <option value="">Filter</option>
          <option value="type">Type</option>
          <option value="location">Location</option>
          <option value="capacity">Capacity</option>
        </select>

        <input
          type="text"
          placeholder="Enter value..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="bg-gray-900 border border-gray-700 text-white p-2 rounded-lg flex-1"
        />

        <button
          onClick={handleSearch}
          className="bg-yellow-400 text-black px-4 py-2 rounded-lg hover:bg-yellow-500 transition"
        >
          Search
        </button>

        <button
          onClick={fetchResources}
          className="bg-gray-700 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="overflow-x-auto bg-gray-900 rounded-lg shadow-lg">
        <table className="w-full text-center">
          
          {/* Table Head */}
          <thead className="bg-yellow-400 text-black">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Type</th>
              <th className="p-3">Capacity</th>
              <th className="p-3">Location</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody>
            {resources.map((resource) => (
              <tr
                key={resource.id}
                className="border-b border-gray-700 hover:bg-gray-800 transition"
              >
                <td className="p-3">{resource.name}</td>
                <td className="p-3">{resource.type}</td>
                <td className="p-3">{resource.capacity}</td>
                <td className="p-3">{resource.location}</td>

                {/* Status */}
                <td className="p-3">
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      resource.status === "ACTIVE"
                        ? "bg-yellow-400 text-black"
                        : "bg-red-500 text-white"
                    }`}
                  >
                    {resource.status}
                  </span>
                </td>

                {/* Actions */}
                <td className="p-3 flex justify-center gap-2">
                  <Link
                    to={`/resources/edit/${resource.id}`}
                    className="bg-yellow-400 text-black px-3 py-1 rounded hover:bg-yellow-500 transition"
                  >
                    Edit
                  </Link>

                  <button
                    onClick={() => handleDelete(resource.id)}
                    className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </div>
  );
}

export default ResourceList;