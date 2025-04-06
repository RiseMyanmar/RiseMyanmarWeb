import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StatsPanel from "./components/StatsPanel";
import ArticleSection from "./components/ArticleSection";
import DonationSection from "./components/DonationSection";
import MapComponent from "./components/MapComponent";
import "./App.css";
import SubmitResource from "./components/SubmitResources";
import { useLanguage } from "./components/LanguageContext";
import { translateText } from "./components/translate";

function App() {
  const { lang, setLang } = useLanguage();
  const toggleLang = () => {
    setLang(lang === "en" ? "my" : "en");
  };
  const [title, setTitle] = useState("Help Myanmar Rise");
  const [description, setDescription] = useState(
    "Earthquake Relief and Recovery Tracker"
  );

  useEffect(() => {
    async function translateIfNeeded() {
      if (lang === "my") {
        const [t, d] = await Promise.all([
          translateText("Help Myanmar Rise", "my"),
          translateText("Earthquake Relief and Recovery Tracker", "my"),
        ]);
        setTitle(t);
        setDescription(d);
      } else {
        setTitle("Help Myanmar Rise");
        setDescription("Earthquake Relief and Recovery Tracker");
      }
    }

    translateIfNeeded();
  }, [lang]);

  return (
    <div
      style={{
        padding: "2rem",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f7fa",
        minHeight: "100vh",
      }}
    >
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1>🌏 {title} 🇲🇲</h1>
        <p style={{ color: "#555" }}>{description}</p>
        <nav>
          <Link to="/" style={{ marginRight: "1rem" }}>
          {lang === "en" ? "Home" : "မူလစာမျက်နှာ"}
          </Link>
          <Link to="/submit">
          {lang === "en" ? "Submit Resource" : "အရင်းအမြစ်တင်သွင်းရန်"}
          </Link>
        </nav>

        <button
          onClick={toggleLang}
          style={{
            marginTop: "1rem",
            padding: "0.5rem 1rem",
            fontSize: "1rem",
            borderRadius: "8px",
            border: "none",
            backgroundColor: "#007bff",
            color: "white",
            cursor: "pointer",
          }}
        >
          {lang === "en" ? "မြန်မာစာ" : "English"}
        </button>
      </header>
      <Routes>
        <Route
          path="/"
          element={
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "2rem",
                flexWrap: "wrap",
              }}
            >
              <main
                style={{
                  flex: "3 1 600px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                <ArticleSection />
                <MapComponent />
                <DonationSection />
              </main>
              <aside style={{ flex: "1 1 250px" }}>
                <StatsPanel deaths={3848} injuries={4725} missing={708} />
              </aside>
            </div>
          }
        />

        <Route path="/submit" element={<SubmitResource />} />
      </Routes>
    </div>
  );
}

export default App;
