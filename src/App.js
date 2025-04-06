import React, { useEffect, useState, useRef } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StatsPanel from "./components/StatsPanel";
import ArticleSection from "./components/ArticleSection";
import DonationSection from "./components/DonationSection";
import MapComponent from "./components/MapComponent";
import ResourceList from "./components/ResourceList";
import LanguageSwitcher from "./components/LanguageSwitcher";
import "./App.css";
import SubmitResource from "./components/SubmitResources";
import { useLanguage } from "./components/LanguageContext";
import { translateText } from "./components/translate";

function App() {
  const { lang } = useLanguage();
  const [title, setTitle] = useState("Help Myanmar Rise");
  const [description, setDescription] = useState(
    "Earthquake Relief and Recovery Tracker"
  );

  // Create refs for sections to scroll to
  const newsRef = useRef(null);
  const donationRef = useRef(null);

  useEffect(() => {
    async function translateIfNeeded() {
      if (lang === "my") {
        const [t, d, news, donation] = await Promise.all([
          translateText("Help Myanmar Rise", "my"),
          translateText("Earthquake Relief and Recovery Tracker", "my"),
          translateText("News", "my"),
          translateText("Donation", "my"),
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

  // Scroll handler for section navigation
  const scrollToSection = (ref) => {
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

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
          <a
            href="#news"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(newsRef);
            }}
          >
            {lang === "en" ? "News" : "သတင်းများ"}
          </a>
          <a
            href="#donation"
            className="nav-link"
            onClick={(e) => {
              e.preventDefault();
              scrollToSection(donationRef);
            }}
          >
            {lang === "en" ? "Donation" : "လှူဒါန်းမှု"}
          </a>
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

                {/* Resource List after the map */}
                <ResourceList />

                {/* Article section follows the resource list */}
                <div ref={newsRef} id="news">
                  <ArticleSection />
                </div>

                {/* Donation section last */}
                <div ref={donationRef} id="donation">
                  <DonationSection />
                </div>
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
