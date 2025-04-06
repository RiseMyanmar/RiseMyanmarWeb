import React, { useEffect, useState } from "react";
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";
import "./ResourceList.css";

function ResourceList() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { lang } = useLanguage();

  const [labels, setLabels] = useState({
    title: "Resource Reports",
    location: "Location",
    peopleInNeed: "People in Need",
    resourcesNeeded: "Resources Needed",
    reportedBy: "Reported by",
    reportedOn: "Reported on",
    noReports: "No reports available at this time.",
    anonymous: "Anonymous",
    loading: "Loading resource reports...",
    error: "Error loading reports:",
  });

  // Translate resource terms
  const [resourceTranslations, setResourceTranslations] = useState({
    food: "Food",
    water: "Water",
    clothes: "Clothes",
    medicalSupplies: "Medical Supplies",
    sleepingBags: "Sleeping Bags",
    hygieneProducts: "Hygiene Products",
    blankets: "Blankets",
    tents: "Tents",
    powerBanks: "Power Banks",
  });

  useEffect(() => {
    async function translateLabels() {
      if (lang === "my") {
        const translations = await Promise.all([
          translateText("Resource Reports", "my"),
          translateText("Location", "my"),
          translateText("People in Need", "my"),
          translateText("Resources Needed", "my"),
          translateText("Reported by", "my"),
          translateText("Reported on", "my"),
          translateText("No reports available at this time.", "my"),
          translateText("Anonymous", "my"),
          translateText("Loading resource reports...", "my"),
          translateText("Error loading reports:", "my"),
        ]);

        setLabels({
          title: translations[0],
          location: translations[1],
          peopleInNeed: translations[2],
          resourcesNeeded: translations[3],
          reportedBy: translations[4],
          reportedOn: translations[5],
          noReports: translations[6],
          anonymous: translations[7],
          loading: translations[8],
          error: translations[9],
        });

        // Translate resource terms
        const resourceKeys = [
          "food",
          "water",
          "clothes",
          "medicalSupplies",
          "sleepingBags",
          "hygieneProducts",
          "blankets",
          "tents",
          "powerBanks",
        ];

        const resourceLabels = [
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
          resourceLabels.map((resource) => translateText(resource, "my"))
        );

        const resourceDict = {};
        resourceKeys.forEach((key, index) => {
          resourceDict[key] = translatedResources[index];
        });

        setResourceTranslations(resourceDict);
      } else {
        setLabels({
          title: "Resource Reports",
          location: "Location",
          peopleInNeed: "People in Need",
          resourcesNeeded: "Resources Needed",
          reportedBy: "Reported by",
          reportedOn: "Reported on",
          noReports: "No reports available at this time.",
          anonymous: "Anonymous",
          loading: "Loading resource reports...",
          error: "Error loading reports:",
        });

        setResourceTranslations({
          food: "Food",
          water: "Water",
          clothes: "Clothes",
          medicalSupplies: "Medical Supplies",
          sleepingBags: "Sleeping Bags",
          hygieneProducts: "Hygiene Products",
          blankets: "Blankets",
          tents: "Tents",
          powerBanks: "Power Banks",
        });
      }
    }

    translateLabels();
  }, [lang]);

  useEffect(() => {
    async function fetchResources() {
      try {
        setLoading(true);
        const backendUrl = process.env.REACT_APP_BACKEND_URL;
        const response = await fetch(`${backendUrl}/api/surveys`);

        if (!response.ok) {
          throw new Error(`Failed to fetch resources: ${response.status}`);
        }

        const data = await response.json();

        // Sort by createdAt date, most recent first
        const sortedData = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setResources(sortedData);
        setError(null);
      } catch (err) {
        console.error("Error fetching resources:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchResources();
  }, []);

  // Format the date to be more readable
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(lang === "en" ? "en-US" : "my-MM", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Format resources for display
  const formatResources = (survivalItems) => {
    if (
      !survivalItems ||
      !Array.isArray(survivalItems) ||
      survivalItems.length === 0
    ) {
      return "-";
    }

    return survivalItems
      .map((item) => {
        // Handle items like "medicalSupplies" -> "Medical Supplies"
        if (item === "food" || item === "Food")
          return resourceTranslations.food;
        if (item === "water" || item === "Water")
          return resourceTranslations.water;
        if (item === "clothes" || item === "Clothes")
          return resourceTranslations.clothes;
        if (item.includes("medical"))
          return resourceTranslations.medicalSupplies;
        if (item.includes("sleeping")) return resourceTranslations.sleepingBags;
        if (item.includes("hygiene"))
          return resourceTranslations.hygieneProducts;
        if (item === "blankets" || item === "Blankets")
          return resourceTranslations.blankets;
        if (item === "tents" || item === "Tents")
          return resourceTranslations.tents;
        if (item.includes("power")) return resourceTranslations.powerBanks;

        // For custom items, just return as is
        return item;
      })
      .join(", ");
  };

  return (
    <div className="resource-list-container">
      <h2 className="resource-list-heading">{labels.title}</h2>

      {loading && <p className="resource-list-message">{labels.loading}</p>}

      {error && (
        <p className="resource-list-error">
          {labels.error} {error}
        </p>
      )}

      {!loading && !error && resources.length === 0 && (
        <p className="resource-list-message">{labels.noReports}</p>
      )}

      {!loading && !error && resources.length > 0 && (
        <div className="resource-list-scrollable-container">
          {resources.map((resource, index) => (
            <div key={index} className="resource-list-item">
              <div className="resource-item-header">
                <span className="resource-item-location">
                  {resource.location.regionName}
                </span>
                <span className="resource-item-date">
                  {formatDate(resource.createdAt)}
                </span>
              </div>

              <div className="resource-item-details">
                <div className="resource-item-detail">
                  <span className="resource-item-label">
                    {labels.peopleInNeed}:
                  </span>
                  <span className="resource-item-value">
                    {resource.peopleInNeed.toLocaleString()}
                  </span>
                </div>

                <div className="resource-item-detail">
                  <span className="resource-item-label">
                    {labels.resourcesNeeded}:
                  </span>
                  <span className="resource-item-value">
                    {formatResources(resource.survivalItems)}
                  </span>
                </div>

                <div className="resource-item-detail resource-item-org">
                  <span className="resource-item-label">
                    {labels.reportedBy}:
                  </span>
                  <span className="resource-item-value">
                    {resource.organization || labels.anonymous}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ResourceList;
