import "mapbox-gl/dist/mapbox-gl.css";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "./MapComponent.css";
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";

mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;

const MapComponent = () => {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const markersRef = useRef([]);
  const [loading, setLoading] = useState(true);
  const [markersData, setMarkersData] = useState([]);
  const { lang } = useLanguage();

  // Myanmar's center coordinates and zoom level for country-wide view
  const myanmarCenter = [96.5, 19.75]; // Center of Myanmar
  const countryZoomLevel = 5.5; // Zoom level to see most of Myanmar

  // Add these translation state variables
  const [popupLabels, setPopupLabels] = useState({
    region: "Region",
    peopleInNeed: "People in Need",
    resourcesNeeded: "Resources Needed",
    reportedBy: "Reported by",
    anonymous: "Anonymous",
  });

  // Add translations for resources
  const [resourceTranslations, setResourceTranslations] = useState({
    Food: "Food",
    Water: "Water",
    Clothes: "Clothes",
    "Medical Supplies": "Medical Supplies",
    "Sleeping Bags": "Sleeping Bags",
    "Hygiene Products": "Hygiene Products",
    Blankets: "Blankets",
    Tents: "Tents",
    "Power Banks": "Power Banks",
  });

  // Translate popup labels
  useEffect(() => {
    async function translatePopupLabels() {
      if (lang === "my") {
        const [region, peopleInNeed, resourcesNeeded, reportedBy, anonymous] =
          await Promise.all([
            translateText("Region", "my"),
            translateText("People in Need", "my"),
            translateText("Resources Needed", "my"),
            translateText("Reported by", "my"),
            translateText("Anonymous", "my"),
          ]);

        setPopupLabels({
          region,
          peopleInNeed,
          resourcesNeeded,
          reportedBy,
          anonymous,
        });

        // Translate resource terms
        const resourceKeys = [
          "Food",
          "Water",
          "Clothes",
          "Medical Supplies",
          "Sleeping Bags",
          "Hygiene Products",
          "Blankets",
          "Tents",
          "Power Banks",
        ];

        const translatedResources = await Promise.all(
          resourceKeys.map((resource) => translateText(resource, "my"))
        );

        const resourceDict = {};
        resourceKeys.forEach((key, index) => {
          resourceDict[key] = translatedResources[index];
        });

        setResourceTranslations(resourceDict);
      } else {
        setPopupLabels({
          region: "Region",
          peopleInNeed: "People in Need",
          resourcesNeeded: "Resources Needed",
          reportedBy: "Reported by",
          anonymous: "Anonymous",
        });

        setResourceTranslations({
          Food: "Food",
          Water: "Water",
          Clothes: "Clothes",
          "Medical Supplies": "Medical Supplies",
          "Sleeping Bags": "Sleeping Bags",
          "Hygiene Products": "Hygiene Products",
          Blankets: "Blankets",
          Tents: "Tents",
          "Power Banks": "Power Banks",
        });
      }
    }

    translatePopupLabels();
  }, [lang]);

  // Fetch data from the backend
  const fetchMarkersData = async () => {
    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/surveys`);
      if (!response.ok) {
        throw new Error("Failed to fetch markers data");
      }
      const data = await response.json();
      setMarkersData(data);
    } catch (error) {
      console.error("Error fetching markers data:", error);
    }
  };

  // Initialize map with Myanmar-centered view
  useEffect(() => {
    const mapInstance = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/streets-v11",
      center: myanmarCenter, // Updated to center on Myanmar
      zoom: countryZoomLevel, // Updated to show all of Myanmar
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapInstance.addControl(
      new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
        },
        trackUserLocation: true,
        showUserHeading: true,
      }),
      "top-right"
    );

    mapInstanceRef.current = mapInstance;

    mapInstance.on("load", () => {
      setLoading(false);
      fetchMarkersData();
    });

    return () => mapInstance.remove();
  }, []);

  // Update markers when language or marker data changes
  useEffect(() => {
    if (mapInstanceRef.current && markersData.length > 0) {
      // Remove any existing markers
      if (markersRef.current.length > 0) {
        markersRef.current.forEach((marker) => marker.remove());
        markersRef.current = [];
      }

      // Create new markers with current language
      markersData.forEach((marker) => {
        // Format organization name
        let orgName;

        if (lang === "my") {
          // For Burmese, put the name first
          orgName = marker.organization
            ? `${marker.organization} ${popupLabels.reportedBy}`
            : `${popupLabels.anonymous} ${popupLabels.reportedBy}`;
        } else {
          // For English, keep "Reported by" first
          orgName = marker.organization
            ? `${popupLabels.reportedBy} ${marker.organization}`
            : `${popupLabels.reportedBy} ${popupLabels.anonymous}`;
        }

        // Format resources needed with proper capitalization and spacing
        const formattedResources = marker.survivalItems
          .map((item) => {
            // Handle items like "medicalSupplies" -> "Medical Supplies"
            if (item.includes("medical"))
              return resourceTranslations["Medical Supplies"];
            if (item.includes("hygiene"))
              return resourceTranslations["Hygiene Products"];
            if (item.includes("sleeping"))
              return resourceTranslations["Sleeping Bags"];
            if (item.includes("power"))
              return resourceTranslations["Power Banks"];
            if (item === "food") return resourceTranslations["Food"];
            if (item === "water") return resourceTranslations["Water"];
            if (item === "clothes") return resourceTranslations["Clothes"];
            if (item === "blankets") return resourceTranslations["Blankets"];
            if (item === "tents") return resourceTranslations["Tents"];
            // For unknown items, just capitalize the first letter
            return item.charAt(0).toUpperCase() + item.slice(1);
          })
          .join(", ");

        const popupContent = `
          <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
            <h3 style="font-size: 1.1rem; font-weight: 600; color: #1a73e8; margin-bottom: 10px; font-family: 'Georgia', serif;">
              ${popupLabels.region}: ${marker.location.regionName}
            </h3>
            <p style="margin: 6px 0; font-size: 0.95rem;">
              <strong>${popupLabels.peopleInNeed}:</strong> ${marker.peopleInNeed}
            </p>
            <p style="margin: 6px 0; font-size: 0.95rem;">
              <strong>${popupLabels.resourcesNeeded}:</strong> ${formattedResources}
            </p>
            <p style="margin-top: 12px; font-size: 0.85rem; text-align: right; color: #666; font-style: italic;">
              ${orgName}
            </p>
          </div>
        `;

        const markerInstance = new mapboxgl.Marker({ color: "#1a73e8" })
          .setLngLat(marker.location.coordinates)
          .setPopup(
            new mapboxgl.Popup({
              offset: 25,
              className: "custom-popup",
            }).setHTML(popupContent)
          )
          .addTo(mapInstanceRef.current);

        // Store marker reference for later cleanup
        markersRef.current.push(markerInstance);
      });
    }
  }, [markersData, lang, popupLabels, resourceTranslations]);

  const [resetButtonLabel, setResetButtonLabel] = useState("Reset View");

  useEffect(() => {
    async function translateResetButton() {
      if (lang === "my") {
        const translatedReset = await translateText("Reset View", "my");
        setResetButtonLabel(translatedReset);
      } else {
        setResetButtonLabel("Reset View");
      }
    }

    translateResetButton();
  }, [lang]);

  // Updated to reset to Myanmar country-wide view
  const resetView = () => {
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo({
        center: myanmarCenter,
        zoom: countryZoomLevel,
      });
    } else {
      console.error("Map instance is not initialized.");
    }
  };

  return (
    <div className="map-wrapper">
      {loading && <div className="loading-spinner">Loading map...</div>}
      <div ref={mapContainerRef} className="map-container"></div>
      <button className="reset-button" onClick={resetView}>
        {resetButtonLabel}
      </button>
    </div>
  );
};

export default MapComponent;
