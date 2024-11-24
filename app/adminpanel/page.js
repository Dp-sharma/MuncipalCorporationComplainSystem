"use client";

import { useEffect, useState } from "react";

export default function AdminPanel() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newComplaint, setNewComplaint] = useState({
    issueType: "",
    description: "",
    status: "Pending",
  });
  const [editingStatus, setEditingStatus] = useState({}); // Track which status is being edited
  const [filterStatus, setFilterStatus] = useState(""); // Track filter status

  // Fetch complaints from the database
  useEffect(() => {
    async function fetchComplaints() {
      try {
        setLoading(true);
        const res = await fetch("/api/complaint");
        if (!res.ok) throw new Error("Failed to fetch complaints.");
        const data = await res.json();
        setComplaints(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchComplaints();
  }, []);

  // Update complaint status
  async function saveComplaintStatus(id) {
    try {
      const res = await fetch(`/api/complaint/update-status`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id, status: editingStatus[id] }),
      });

      if (!res.ok) throw new Error("Failed to update complaint status.");
      const updatedComplaint = await res.json();

      setComplaints((prev) =>
        prev.map((complaint) =>
          complaint._id === id ? updatedComplaint : complaint
        )
      );

      // Clear editing status
      setEditingStatus((prev) => {
        const newStatus = { ...prev };
        delete newStatus[id];
        return newStatus;
      });
    } catch (err) {
      setError(err.message);
    }
  }

  // Add a new complaint
  async function addComplaint(e) {
    e.preventDefault();
    try {
      const res = await fetch("/api/complaint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newComplaint),
      });

      if (!res.ok) throw new Error("Failed to add complaint.");
      const createdComplaint = await res.json();
      setComplaints((prev) => [createdComplaint, ...prev]);
      setIsAdding(false);
      setNewComplaint({ issueType: "", description: "", status: "Pending" });
    } catch (err) {
      setError(err.message);
    }
  }

  // Map statuses to colors
  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-200 text-yellow-800";
      case "In Progress":
        return "bg-blue-200 text-blue-800";
      case "Resolved":
        return "bg-green-200 text-green-800";
      default:
        return "bg-gray-200 text-gray-800";
    }
  };

  // Filter complaints by status
  const filteredComplaints = filterStatus
    ? complaints.filter((complaint) => complaint.status === filterStatus)
    : complaints;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Add Complaint Button */}
      <button
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
        onClick={() => setIsAdding(true)}
      >
        Add Complaint
      </button>

      {/* Filter Dropdown */}
      <div className="mb-4">
        <label className="mr-2">Filter:</label>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className="border border-gray-400 px-4 py-2 rounded text-black"
        >
          <option value="">Filter</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>
      </div>

      {/* Add Complaint Form */}
      {isAdding && (
        <form className="mb-4 border p-4" onSubmit={addComplaint}>
          <h2 className="text-xl font-semibold mb-2">Add New Complaint</h2>
          <div className="mb-2">
            <label className="block mb-1">Issue Type</label>
            <select
              value={newComplaint.issueType}
              onChange={(e) =>
                setNewComplaint({ ...newComplaint, issueType: e.target.value })
              }
              className="border border-gray-400 px-2 py-1 w-full text-black"
              required
            >
              <option value="">Select Issue Type</option>
              <option value="pothole">Pothole</option>
              <option value="waste management">Waste Management</option>
              <option value="streetlight issue">Streetlight Issue</option>
              <option value="water supply">Water Supply</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="mb-2">
            <label className="block mb-1">Description</label>
            <textarea
  value={newComplaint.description}
  onChange={(e) =>
    setNewComplaint({ ...newComplaint, description: e.target.value })
  }
  className="border border-gray-400 px-2 py-1 w-3/4 text-black" // Reduced width to w-3/4
  rows="3"
  required
></textarea>
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Submit
          </button>
          <button
            type="button"
            className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
        </form>
      )}

      {/* Complaints Table */}
      <table className="table-auto w-full border-collapse border border-gray-200">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Issue Type</th>
            <th className="border border-gray-300 px-4 py-2">Description</th>
            <th className="border border-gray-300 px-4 py-2">Reported At</th>
            <th className="border border-gray-300 px-4 py-2">Status</th>
            <th className="border border-gray-300 px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredComplaints.map((complaint) => (
            <tr key={complaint._id}>
              <td className="border border-gray-300 px-4 py-2">{complaint.issueType}</td>
              <td className="border border-gray-300 px-4 py-2">{complaint.description}</td>
              <td className="border border-gray-300 px-4 py-2">
                {new Date(complaint.reportedAt).toLocaleString()}
              </td>
              <td className="border border-gray-300 px-4 py-2">
              <select
  value={editingStatus[complaint._id] || complaint.status || "Pending"}
  onChange={(e) =>
    setEditingStatus((prev) => ({
      ...prev,
      [complaint._id]: e.target.value,
    }))
  }
  className={`border border-gray-400 px-2 py-1 text-black w-64 rounded ${getStatusColor(
    editingStatus[complaint._id] || complaint.status
  )}`} // Increased width to w-64
>
  <option value="Pending">Pending</option>
  <option value="In Progress">In Progress</option>
  <option value="Resolved">Resolved</option>
</select>
              </td>
              <td className="border border-gray-300 px-4 py-2">
                {editingStatus[complaint._id] && (
                  <button
                    onClick={() => saveComplaintStatus(complaint._id)}
                    className="px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Save
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {loading && <p className="text-center">Loading...</p>}
    </div>
  );
}
