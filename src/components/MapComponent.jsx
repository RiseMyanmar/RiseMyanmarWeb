// MapComponent.jsx
import 'mapbox-gl/dist/mapbox-gl.css'; // Add this line at the very top

import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import './MapComponent.css';

//mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
mapboxgl.accessToken ='pk.eyJ1IjoibXBhaW5nIiwiYSI6ImNtOTRtYnlydzExY24yd29qMTQzZndxZHIifQ.ULUXEnBvCVlJKHv5J2kH7w'

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

      // Define marker data for the locations
      const markersData = [
        { coordinates: [96.091, 21.979], title: 'Mandalay' },
        { coordinates: [95.224, 22.034], title: 'Sagaing' },
        { coordinates: [96.129, 19.75], title: 'Nay Pyi Taw' },
      ];

      // Add markers to the map
      markersData.forEach((marker) => {
        new mapboxgl.Marker({ color: 'red' })
          .setLngLat(marker.coordinates)
          .setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<h3>${marker.title}</h3>`))
          .addTo(mapInstance);
      });
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
