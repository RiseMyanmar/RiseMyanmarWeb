import React from "react";

function StatsPanel({ deaths, injuries, missing }) {
  return (
    <div className="stats-panel" style={{ display: 'flex', flexDirection: 'row', gap: '1rem'}}>
      <div style={{ backgroundColor: 'red', color: 'white', padding: '1rem',borderRadius:"12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>⚠️ Deaths</h3>
        <p style={{ fontSize: '1.5rem' }}>{deaths}</p>
      </div>
      <div style={{ backgroundColor: 'yellow', padding: '1rem',borderRadius:"12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}>
        <h3>➕ Injuries</h3>
        <p style={{ fontSize: '1.5rem' }}>{injuries}</p>
      </div>
      <div style={{ backgroundColor: 'blue', color: 'white', padding: '1rem', borderRadius:"12px", boxShadow: "0 2px 8px rgba(0,0,0,0.1)"}}>
        <h3>😢 Missing</h3>
        <p style={{ fontSize: '1.5rem' }}>{missing}</p>
      </div>
    </div>
  );
}

export default StatsPanel;
