import React, { useEffect, useState } from "react";
import { translateText } from "./translate";
import { useLanguage } from "./LanguageContext";

function StatsPanel({ deaths, injuries, missing }) {
  const { lang } = useLanguage();

  const [labels, setLabels] = useState({
    deaths: "⚠️ Deaths",
    injuries: "➕ Injuries",
    missing: "😢 Missing",
  });

  useEffect(() => {
    async function translate() {
      if (lang === "my") {
        const [d, i, m] = await Promise.all([
          translateText("⚠️ Deaths", "my"),
          translateText("➕ Injuries", "my"),
          translateText("😢 Missing", "my"),
        ]);
        setLabels({ deaths: d, injuries: i, missing: m });
      } else {
        setLabels({
          deaths: "⚠️ Deaths",
          injuries: "➕ Injuries",
          missing: "😢 Missing",
        });
      }
    }

    translate();
  }, [lang]);

  return (
    <div className="stats-panel" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ backgroundColor: 'red', color: 'white', padding: '1rem', borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>{labels.deaths}</h3>
        <p style={{ fontSize: '1.5rem' }}>{deaths}</p>
      </div>
      <div style={{ backgroundColor: 'yellow', padding: '1rem', borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>{labels.injuries}</h3>
        <p style={{ fontSize: '1.5rem' }}>{injuries}</p>
      </div>
      <div style={{ backgroundColor: 'blue', color: 'white', padding: '1rem', borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>{labels.missing}</h3>
        <p style={{ fontSize: '1.5rem' }}>{missing}</p>
      </div>
    </div>
  );
}

export default StatsPanel;

