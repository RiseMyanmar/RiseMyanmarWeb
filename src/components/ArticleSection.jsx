import React, { useEffect, useState } from "react";
import ArticleCard from "./ArticleCard";
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";

function ArticleSection() {
  const [articles, setArticles] = useState([]);
  const { lang } = useLanguage();

  useEffect(() => {
    async function fetchNews() {
      const cached = localStorage.getItem("cachedArticles");
      const cacheTime = localStorage.getItem("cachedTime");

      const now = Date.now();
      const oneDay = 24 * 60 * 60 * 1000;

      if (cached && cacheTime && now - cacheTime < oneDay) {
        const cachedData = JSON.parse(cached);
        setArticles(cachedData);
        return;
      }

      try {
        const res = await fetch(
          `https://gnews.io/api/v4/search?q=myanmar%20earthquake&lang=en&country=us&max=10&apikey=${process.env.REACT_APP_GNEWS_API_KEY}`
        );

        const data = await res.json();
        console.log("📰 Raw GNews response:", data);

        if (!data.articles || !Array.isArray(data.articles)) {
          console.error("❌ Invalid or missing articles from API:", data);
          return;
        }

        const seenLinks = new Set();
        const uniqueArticles = [];

        for (const item of data.articles) {
          if (item.image && !seenLinks.has(item.url)) {
            seenLinks.add(item.url);
            uniqueArticles.push({
              title: item.title,
              summary: item.description,
              image: item.image,
              link: item.url,
            });
          }

          if (uniqueArticles.length === 4) break;
        }

        const finalArticles =
          lang === "my"
            ? await Promise.all(
                uniqueArticles.map(async (item) => ({
                  ...item,
                  title: await translateText(item.title, "my"),
                  summary: await translateText(item.summary, "my"),
                }))
              )
            : uniqueArticles;

        setArticles(finalArticles);
        localStorage.setItem("cachedArticles", JSON.stringify(finalArticles));
        localStorage.setItem("cachedTime", Date.now().toString());
      } catch (err) {
        console.error("❌ Failed to fetch news:", err);
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