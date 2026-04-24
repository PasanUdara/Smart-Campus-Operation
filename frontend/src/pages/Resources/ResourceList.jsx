import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAllResources,
  deleteResource,
  searchByType,
  searchByLocation,
  searchByCapacity,
} from "../../api/resourceApi";
import { useAuth } from "../../contexts/AuthContext";

function ResourceList() {
  // =========================
  // STATES
  // =========================

  const [resources, setResources] = useState([]);
  const [filterType, setFilterType] = useState("");
  const [searchValue, setSearchValue] = useState("");

  // =========================
  // AUTH
  // =========================

  const { isAdmin } = useAuth();

  // =========================
  // FETCH ALL RESOURCES
  // =========================

  const fetchResources = async () => {
    try {
      const response = await getAllResources();
      setResources(response.data);
    } catch (error) {
      console.error("Error fetching resources:", error);
    }
  };

  useEffect(() => {
    fetchResources();
  }, []);

  // =========================
  // DELETE RESOURCE (ADMIN)
  // =========================

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this resource?"
    );

    if (!confirmDelete) return;

    try {
      await deleteResource(id);
      fetchResources();
    } catch (error) {
      console.error("Error deleting resource:", error);
    }
  };

  // =========================
  // SEARCH / FILTER
  // =========================

  const handleSearch = async () => {
    try {
      let response;

      if (filterType === "type" && searchValue.trim()) {
        response = await searchByType(searchValue);
      } else if (
        filterType === "location" &&
        searchValue.trim()
      ) {
        response = await searchByLocation(searchValue);
      } else if (
        filterType === "capacity" &&
        searchValue.trim()
      ) {
        response = await searchByCapacity(searchValue);
      } else {
        response = await getAllResources();
      }

      setResources(response.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  // =========================
  // RESET FILTER
  // =========================

  const handleReset = () => {
    setFilterType("");
    setSearchValue("");
    fetchResources();
  };

  // =========================
  // CHECK AVAILABILITY
  // =========================

  const handleCheckAvailability = (resource) => {
    alert(
      `Resource: ${resource.name}

Available Days: ${resource.availableDays}

Available Time: ${resource.availableTime}`
    );
  };

  // =========================
  // BOOK RESOURCE
  // =========================

  const handleBookNow = (resource) => {
    alert(
      `Booking Request Started

Resource: ${resource.name}

Please continue to booking form.`
    );
  };

  // =========================
  // UI
  // =========================

  return (
    <div className="min-h-screen bg-black text-white p-6">
      {/* PAGE HEADER */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-yellow-400">
          Resources
        </h1>

        {/* ADMIN ONLY → ADD BUTTON */}
        {isAdmin() && (
          <Link
            to="/resources/create"
            className="bg-yellow-400 text-black font-semibold px-5 py-2 rounded-lg hover:bg-yellow-500 transition"
          >
            Add Resource
          </Link>
        )}
      </div>

      {/* SEARCH SECTION */}
      <div className="flex gap-3 mb-8 flex-wrap">
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="bg-gray-800 border border-gray-700 p-3 rounded-lg min-w-[180px]"
        >
          <option value="">Select Filter</option>
          <option value="type">Type</option>
          <option value="location">Location</option>
          <option value="capacity">Capacity</option>
        </select>

        <input
          type="text"
          placeholder="Enter search value..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          className="bg-gray-800 border border-gray-700 p-3 rounded-lg flex-1 min-w-[250px]"
        />

        <button
          onClick={handleSearch}
          className="bg-yellow-400 text-black px-6 rounded-lg font-medium hover:bg-yellow-500 transition"
        >
          Search
        </button>

        <button
          onClick={handleReset}
          className="bg-gray-700 text-white px-6 rounded-lg font-medium hover:bg-gray-600 transition"
        >
          Reset
        </button>
      </div>

      {/* RESOURCE TABLE */}
      <div className="overflow-x-auto rounded-xl">
        <table className="w-full bg-gray-900 text-center rounded-xl overflow-hidden">
          <thead className="bg-yellow-400 text-black">
            <tr>
              <th className="py-4">Name</th>
              <th>Type</th>
              <th>Capacity</th>
              <th>Location</th>
              <th>Availability</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {resources.length > 0 ? (
              resources.map((resource) => (
                <tr
                  key={resource.id}
                  className="border-b border-gray-700"
                >
                  <td className="py-4">{resource.name}</td>

                  <td>{resource.type}</td>

                  <td>{resource.capacity}</td>

                  <td>{resource.location}</td>

                  {/* Availability */}
                  <td>
                    <div className="text-sm">
                      <p>{resource.availableDays}</p>
                      <p className="text-yellow-400">
                        {resource.availableTime}
                      </p>
                    </div>
                  </td>

                  {/* Status */}
                  <td>
                    <span className="bg-yellow-400 text-black px-3 py-1 rounded-full font-medium">
                      {resource.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td>
                    {isAdmin() ? (
                      /* ADMIN → EDIT + DELETE */
                      <div className="flex justify-center gap-2">
                        <Link
                          to={`/resources/edit/${resource.id}`}
                          className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 transition"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() =>
                            handleDelete(resource.id)
                          }
                          className="bg-red-600 text-white px-4 py-1 rounded hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    ) : (
                      /* USER → CHECK + BOOK */
                      resource.status === "ACTIVE" && (
                        <div className="flex justify-center gap-2">
                          <button
                            onClick={() =>
                              handleCheckAvailability(resource)
                            }
                            className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 transition"
                          >
                            Check Availability
                          </button>

                          <button
                            onClick={() =>
                              handleBookNow(resource)
                            }
                            className="bg-yellow-400 text-black px-4 py-1 rounded hover:bg-yellow-500 transition"
                          >
                            Book Now
                          </button>
                        </div>
                      )
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="py-8 text-gray-400"
                >
                  No resources found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ResourceList;