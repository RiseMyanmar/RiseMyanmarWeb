// MapComponent.jsx
import 'mapbox-gl/dist/mapbox-gl.css'; // Add this line at the very top

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapComponent.css';
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
//mapboxgl.accessToken ='pk.eyJ1IjoibXBhaW5nIiwiYSI6ImNtOTRtYnlydzExY24yd29qMTQzZndxZHIifQ.ULUXEnBvCVlJKHv5J2kH7w'

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [markersData, setMarkersData] = useState([]); // Store markers data from the backend

    // Fetch data from the backend
    const fetchMarkersData = async () => {
      try {
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/surveys`);
        if (!response.ok) {
          throw new Error('Failed to fetch markers data');
        }
        const data = await response.json();
        setMarkersData(data); // Store the fetched data
      } catch (error) {
        console.error('Error fetching markers data:', error);
      }
    };

  const { lang } = useLanguage();
  const [labels, setLabels] = useState({
    title: "🗺️ Interactive Map",
    tooltip: "Explore the affected areas and key locations.",
  });

  useEffect(() => {
    async function translateLabels() {
      if (lang === "my") {
        const [translatedTitle, translatedTooltip] = await Promise.all([
          translateText("🗺️ Interactive Map", "my"),
          translateText("Explore the affected areas and key locations.", "my"),
        ]);

        setLabels({
          title: translatedTitle,
          tooltip: translatedTooltip,
        });
      } else {
        setLabels({
          title: "🗺️ Interactive Map",
          tooltip: "Explore the affected areas and key locations.",
        });
      }
    }

    translateLabels();
  }, [lang]);

  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [96.1345, 16.8661],
      zoom: 10,
    });

    // Add navigation controls (zoom in/out buttons)
    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapInstance.addControl(new mapboxgl.GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true,
      },
      trackUserLocation: true,
      showUserHeading: true,
    }), 'top-right');

    // Assign the map instance to the ref
    mapInstanceRef.current = mapInstance;

    mapInstance.on('load', () => {
      setLoading(false);
      fetchMarkersData(); // Fetch markers data when the map loads
    });

    return () => mapInstance.remove();
  }, []);

  useEffect(() => {
    if (mapInstanceRef.current && markersData.length > 0) {
      markersData.forEach((marker) => {
        const popupContent = `
          <h3>${marker.organization || 'Unknown Organization'}</h3>
          <p><strong>Region:</strong> ${marker.location.regionName}</p>
          <p><strong>People in Need:</strong> ${marker.peopleInNeed}</p>
          <p><strong>Resources Needed:</strong> ${marker.survivalItems.join(', ')}</p>
        `;

        new mapboxgl.Marker({ color: 'red' })
          .setLngLat(marker.location.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(popupContent))
          .addTo(mapInstanceRef.current);
      });
    }
  }, [markersData]);

  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({ center: [96.1345, 16.8661], zoom: 10 });
    } else {
      console.error("Map instance is not initialized.");
    }
  };

  return (
    <div className="map-wrapper">
      <h2>{labels.title}</h2>
      <p>{labels.tooltip}</p>
      {loading && <div className="loading-spinner">Loading map...</div>}
      <div ref={mapContainerRef} className="map-container" ></div>
      <button className="reset-button" onClick={resetView}>Reset View</button>
    </div>
  );
};

export default MapComponent;
