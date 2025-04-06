const express = require("express");
const router = express.Router();
const News = require("./News");
const axios = require("axios");

// Fetch news from GNEWS and store in MongoDB
async function fetchAndStoreNews() {
  try {
    console.log("🔄 Fetching fresh news from GNEWS API...");

    const response = await axios.get(
      `https://gnews.io/api/v4/search?q=myanmar%20earthquake&lang=en&country=us&max=10&apikey=${process.env.REACT_APP_GNEWS_API_KEY}`
    );

    const data = response.data;

    if (!data.articles || !Array.isArray(data.articles)) {
      console.error("❌ Invalid or missing articles from GNEWS API");
      return;
    }

    // Delete old news articles
    await News.deleteMany({});

    // Process and store new articles
    const seenLinks = new Set();
    const articlesToSave = [];

    for (const item of data.articles) {
      if (item.image && !seenLinks.has(item.url)) {
        seenLinks.add(item.url);
        articlesToSave.push({
          title: item.title,
          summary: item.description,
          image: item.image,
          link: item.url,
          fetchedAt: new Date(),
        });
      }

      if (articlesToSave.length === 4) break;
    }

    if (articlesToSave.length > 0) {
      await News.insertMany(articlesToSave);
      console.log(
        `✅ Successfully stored ${articlesToSave.length} news articles`
      );
    }

    return articlesToSave;
  } catch (err) {
    console.error("❌ Failed to fetch and store news:", err);
  }
}

// Get all news articles from the database
router.get("/", async (req, res) => {
  try {
    const now = new Date();
    const news = await News.find({}).sort({ fetchedAt: -1 });

    // If there are no articles or the articles are older than 24 hours, fetch new ones
    if (
      news.length === 0 ||
      (news.length > 0 &&
        now - new Date(news[0].fetchedAt) > 24 * 60 * 60 * 1000)
    ) {
      await fetchAndStoreNews();
      const freshNews = await News.find({}).sort({ fetchedAt: -1 });
      return res.status(200).json(freshNews);
    }

    res.status(200).json(news);
  } catch (error) {
    console.error("Error serving news:", error);
    res.status(500).json({ message: error.message });
  }
});

// Force refresh news (can be called manually or by a scheduler)
router.post("/refresh", async (req, res) => {
  try {
    const articles = await fetchAndStoreNews();
    res.status(200).json({
      message: "News articles refreshed successfully",
      count: articles.length,
    });
  } catch (error) {
    console.error("Error refreshing news:", error);
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
module.exports.fetchAndStoreNews = fetchAndStoreNews; // Export for scheduler
