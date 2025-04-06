import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StatsPanel from "./components/StatsPanel";
import ArticleSection from "./components/ArticleSection";
import DonationSection from "./components/DonationSection";
import MapComponent from "./components/MapComponent";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./App.css";
import SubmitResource from "./components/SubmitResources";
import { useLanguage } from "./components/LanguageContext";
import { translateText } from "./components/translate";
import ResourceList from "./components/ResourceList";

function App() {
  const { lang } = useLanguage();
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
    <div className="app-container">
      <LanguageSwitcher />

      <header>
        <h1>
          <span className="gradient-text">{title}</span>
          <span className="flag-emoji"> 🇲🇲</span>
        </h1>
        <p>{description}</p>
        <nav>
          <Link to="/">{lang === "en" ? "Home" : "မူလစာမျက်နှာ"}</Link>
          <Link to="/submit">
            {lang === "en" ? "Submit Report" : "အရင်းအမြစ်တင်သွင်းရန်"}
          </Link>
        </nav>
      </header>

      <Routes>
        <Route
          path="/"
          element={
            <div className="main-content">
              <main className="content-area">
                {/* Stats panel first */}
                <StatsPanel deaths={4316} injuries={6588} missing={448} />

                {/* Map component immediately after stats panel */}
                <MapComponent />

                <ResourceList />

                {/* Article section follows the map */}
                <ArticleSection />

                {/* Donation section last */}
                <DonationSection />
              </main>
            </div>
          }
        />

        <Route path="/submit" element={<SubmitResource />} />
      </Routes>
    </div>
  );
}

export default App;
