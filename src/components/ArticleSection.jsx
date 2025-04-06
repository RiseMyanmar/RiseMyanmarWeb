import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";

function ArticleSection() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

  useEffect(() => {
    async function fetchNews() {
      try {
        setLoading(true);
        setError(null);

        // Fetch from our backend instead of directly from GNEWS
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const res = await fetch(`${backendUrl}/api/news`);

        if (!res.ok) {
          throw new Error(`Failed to fetch news: ${res.status}`);
        }

        const data = await res.json();
        console.log("📰 News from backend:", data);

        if (!Array.isArray(data) || data.length === 0) {
          setArticles([]);
          return;
        }

        // Apply translations if needed
        const finalArticles =
          lang === "my"
            ? await Promise.all(
                data.map(async (item) => ({
                  ...item,
                  title: await translateText(item.title, "my"),
                  summary: await translateText(item.summary, "my"),
                }))
              )
            : data;

        setArticles(finalArticles);
      } catch (err) {
        console.error("❌ Failed to fetch news:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [lang]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📰 {lang === "en" ? "Latest Articles" : "နောက်ဆုံးရ သတင်းများ"}</h2>

      {loading && <p>Loading latest news...</p>}
      {error && <p style={{ color: "red" }}>Error loading news: {error}</p>}

      {!loading && !error && articles.length === 0 && (
        <p>No articles available at the moment.</p>
      )}

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
