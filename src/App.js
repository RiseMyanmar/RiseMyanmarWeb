import React from "react";
import StatsPanel from "./components/StatsPanel";
import ArticleSection from "./components/ArticleSection";
import DonationSection from "./components/DonationSection";
import MapComponent from "./components/MapComponent";
import './App.css';


function App() {
  return (
    <div style={{
      padding: "2rem",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f7fa",
      minHeight: "100vh"
    }}>
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1>🌏 Help Myanmar Rise</h1>
        <p style={{ color: "#555" }}>Earthquake Relief and Recovery Tracker</p>
      </header>

      {/* Layout: Side stats + content */}
      <div style={{ display: "flex", justifyContent: "space-around" }}>

        {/* Main content: Articles and Donations */}
        <main style={{ flex: "3 1 600px", display: "flex", flexDirection: "column", gap: "2rem" }}>
          <ArticleSection />
          <MapComponent />
          <DonationSection />
        </main>
        {/* Sidebar: Stats */}
        <aside style={{ flex: "0.5 0.5 250px"}}>
          <StatsPanel deaths={3848} injuries={4725} missing={708} />
        </aside>
      </div>
    </div>
  );
}

export default App;

