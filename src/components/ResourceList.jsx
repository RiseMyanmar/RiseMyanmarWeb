import React, { useEffect, useState } from "react";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        setError(null);

        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/resources`);
        if (!response.ok) {
          throw new Error("Failed to fetch resources");
        }

        const data = await response.json();

        // Sort locations by the highest number of resources
        const sortedResources = data.sort(
          (a, b) => b.survivalItems.length - a.survivalItems.length
        );

        setResources(sortedResources);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  if (loading) return <p>Loading resources...</p>;
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📋 Submitted Resources</h2>
      <ul style={{ listStyleType: "none", padding: 0 }}>
        {resources.map((resource, index) => (
          <li
            key={index}
            style={{
              marginBottom: "1rem",
              padding: "1rem",
              border: "1px solid #ddd",
              borderRadius: "8px",
              backgroundColor: "#f9f9f9",
              boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
            }}
          >
            <h3 style={{ margin: "0 0 0.5rem 0" }}>
              📍 {resource.location.regionName}
            </h3>
            <p style={{ margin: "0.5rem 0" }}>
              <strong>People in Need:</strong> {resource.peopleInNeed}
            </p>
            <p style={{ margin: "0.5rem 0" }}>
              <strong>Resources:</strong> {resource.survivalItems.join(", ")}
            </p>
            <p style={{ margin: "0.5rem 0", fontStyle: "italic", color: "#555" }}>
              Reported by: {resource.organization || "Anonymous"}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ResourceList;
