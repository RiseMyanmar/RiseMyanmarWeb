import React from "react";

function DonationCard({ title, description, link }) {
  return (
    <div style={{
      border: "1px solid #ddd",
      borderRadius: "10px",
      padding: "1rem",
      backgroundColor: "#fff",
      width: "300px",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
    }}>
      <h3>{title}</h3>
      <p style={{ fontSize: "0.95rem", color: "#444" }}>{description}</p>
      <a
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: "none" }}
      >
        <button style={{
          marginTop: "0.5rem",
          padding: "0.5rem 1rem",
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Donate Now
        </button>
      </a>
    </div>
  );
}

export default DonationCard;
