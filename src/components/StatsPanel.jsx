import React, { useEffect, useState } from "react";
import { translateText } from "./translate";
import { useLanguage } from "./LanguageContext";

function StatsPanel({ deaths, injuries, missing }) {
  const { lang } = useLanguage();

  const [labels, setLabels] = useState({
    deaths: "Deaths",
    injuries: "Injuries",
    missing: "Missing",
  });

  useEffect(() => {
    async function translate() {
      if (lang === "my") {
        const [d, i, m] = await Promise.all([
          translateText("Deaths", "my"),
          translateText("Injuries", "my"),
          translateText("Missing", "my"),
        ]);
        setLabels({ deaths: d, injuries: i, missing: m });
      } else {
        setLabels({
          deaths: "Deaths",
          injuries: "Injuries",
          missing: "Missing",
        });
      }
    }

    translate();
  }, [lang]);

  return (
    <div className="stats-container">
      <div className="stats-circles">
        <div className="stat-circle stat-deaths">
          <div className="stat-value">{deaths.toLocaleString()}</div>
          <div className="stat-label">{labels.deaths}</div>
        </div>

        <div className="stat-circle stat-injuries">
          <div className="stat-value">{injuries.toLocaleString()}</div>
          <div className="stat-label">{labels.injuries}</div>
        </div>

        <div className="stat-circle stat-missing">
          <div className="stat-value">{missing.toLocaleString()}</div>
          <div className="stat-label">{labels.missing}</div>
        </div>
      </div>
    </div>
  );
}

export default StatsPanel;
