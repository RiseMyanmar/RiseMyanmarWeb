import React from "react";

function ArticleCard({ title, summary, image, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
        color: "inherit"
      }}
    >
      <div style={{
        border: "1px solid #ddd",
        borderRadius: "10px",
        padding: "1rem",
        backgroundColor: "#fff",
        maxWidth: "300px",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "0.5rem",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)"
      }}>
        {image && (
          <img
            src={image}
            alt={title}
            style={{
              width: "100%",
              height: "160px",
              objectFit: "cover",
              borderRadius: "8px"
            }}
          />
        )}
        <h3 style={{ fontSize: "1.1rem", fontWeight: "600" }}>{title}</h3>
        <p style={{ fontSize: "0.9rem", color: "#444" }}>{summary}</p>
      </div>
    </a>
  );
}

export default ArticleCard;
