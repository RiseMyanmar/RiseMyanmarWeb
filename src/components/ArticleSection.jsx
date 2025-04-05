import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";

function ArticleSection() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=myanmar%20earthquake&lang=en&country=us&max=10&apikey=48bfa8a4c588aa2886ca7e33d0ba70a9`
      );
      const data = await res.json();

      const seenLinks = new Set();
      const uniqueArticles = [];

      for (const item of data.articles) {
        if (item.image && !seenLinks.has(item.url)) {
          seenLinks.add(item.url);
          uniqueArticles.push({
            title: item.title,
            summary: item.description,
            image: item.image,
            link: item.url
          });
        }

        if (uniqueArticles.length === 4) break;
      }

      setArticles(uniqueArticles);
    }

    fetchNews();
  }, []);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📰 Latest Articles</h2>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        {articles.map((article, index) => (
          <ArticleCard
            key={index}
            title={article.title}
            summary={article.summary}
            image={article.image}
            link={article.link}
          />
        ))}
      </div>
    </div>
  );
}

export default ArticleSection;
