import React from "react";

function ArticleCard({ title, summary }) {
  return (
    <div style={{
      border: "1px solid #ccc",
      borderRadius: "10px",
      padding: "1rem",
      backgroundColor: "#f9f9f9",
      maxWidth: "300px"
    }}>
      <h3 style={{ fontSize: "1.2rem", marginBottom: "0.5rem" }}>{title}</h3>
      <p style={{ fontSize: "0.95rem", color: "#555" }}>{summary}</p>
    </div>
  );
}

export default ArticleCard;