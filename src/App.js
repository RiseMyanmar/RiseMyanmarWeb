import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import StatsPanel from "./components/StatsPanel";
import ArticleSection from "./components/ArticleSection";
import DonationSection from "./components/DonationSection";
import MapComponent from "./components/MapComponent";
import './App.css';
import SubmitResource from "./components/SubmitResources";


function App() {
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
        <h1>🌏 Help Myanmar Rise</h1>
        <p style={{ color: "#555" }}>Earthquake Relief and Recovery Tracker</p>
        <nav>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/submit">Submit Resource</Link>
        </nav>
      </header>
      
    <Routes>
      <Route path="/" element={
      <div style={{ display: "flex", justifyContent: "center", gap: "2rem", flexWrap: "wrap" }}>
        <main style={{ flex: "3 1 600px", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <StatsPanel deaths={3848} injuries={4725} missing={708} />
          <ArticleSection />
          <MapComponent />
          <DonationSection />
        </main>
      </div>
      } />

        {/* ✅ Add this new route */}
        <Route path="/submit" element={<SubmitResource />} />
      </Routes>
    </div>
  );
}

export default App;
