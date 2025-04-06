import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";

function ArticleSection() {
  const [articles, setArticles] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    async function fetchNews() {
      const res = await fetch(
        `https://gnews.io/api/v4/search?q=myanmar%20earthquake&lang=en&country=us&max=10&apikey=${process.env.REACT_APP_GNEWS_API_KEY}`
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

      // ✅ Translate articles if language is "my"
      if (lang === "my") {
        const translated = await Promise.all(
          uniqueArticles.map(async (item) => ({
            ...item,
            title: await translateText(item.title, "my"),
            summary: await translateText(item.summary, "my")
          }))
        );
        setArticles(translated);
      } else {
        setArticles(uniqueArticles);
      }
    }

    fetchNews();
  }, [lang]);

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>📰 {lang === "en" ? "Latest Articles" : "နောက်ဆုံးရ သတင်းများ"}</h2>
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
