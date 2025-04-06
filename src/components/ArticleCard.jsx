import React from "react";

function ArticleCard({ title, summary, image, link }) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      style={{
        textDecoration: "none",
        color: "inherit",
      }}
      className="article-card-link"
    >
      <div className="article-card">
        {image && (
          <img src={image} alt={title} className="article-card-image" />
        )}
        <h3 className="article-card-title">{title}</h3>
        <p className="article-card-summary">{summary}</p>
      </div>
    </a>
  );
}

export default ArticleCard;
