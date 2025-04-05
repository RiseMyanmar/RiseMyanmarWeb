// MapComponent.jsx
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapComponent.css';

mapboxgl.accessToken = 'pk.eyJ1IjoibXBhaW5nIiwiYSI6ImNtOTRtYnlydzExY24yd29qMTQzZndxZHIifQ.ULUXEnBvCVlJKHv5J2kH7w';

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [96.1345, 16.8661],
      zoom: 10,
    });

    // Assign the map instance to the ref
    mapInstanceRef.current = mapInstance;

    mapInstance.on('load', () => {
      setLoading(false);
    });

    return () => mapInstance.remove();
  }, []);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [96.1345, 16.8661], zoom: 10 });
    } else {
      console.error("Map instance is not initialized.");
    }
  };

  return (
    <div className="map-wrapper">
      <h2>🗺️ Interactive Map</h2>
      <p>Explore the affected areas and key locations.</p>
      {loading && <div className="loading-spinner">Loading map...</div>}
      <div ref={mapContainerRef} className="map-container" ></div>
      <button className="reset-button" onClick={resetView}>Reset View</button>
    </div>
  );
};

export default MapComponent;
