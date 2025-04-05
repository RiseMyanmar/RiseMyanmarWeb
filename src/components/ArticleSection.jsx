import React from "react";
import ArticleCard from "./ArticleCard";

function ArticleSection() {
  // Later this can come from a backend
  const articles = [
    {
      title: "Aftershock Hits Mandalay",
      summary: "A 5.2 magnitude aftershock struck near Mandalay just days after the initial quake..."
    },
    {
      title: "Volunteers Set Up Aid Stations",
      summary: "Local volunteers are organizing temporary shelters and medical camps in Sagaing region."
    },
    {
      title: "Donations Reach $500K",
      summary: "Thanks to global support, donations have crossed the half-million mark within 48 hours."
    }
  ];

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📰 Latest Articles</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            title={article.title}
            summary={article.summary}
          />
        ))}
      </div>
    </div>
  );
}

export default ArticleSection;
