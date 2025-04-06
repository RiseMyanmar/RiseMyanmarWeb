import React, { useEffect, useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";
import {
  defaultLabels,
  englishLabelsArray,
  englishSurvivalItemsArray,
  createLabelsFromTranslatedArrays,
} from "./SubmitResourcesLabels";
import "./SubmitResources.css";

function SubmitResource() {
  const { isAuthenticated, loginWithRedirect, user, logout } = useAuth0();
  const { lang } = useLanguage();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    location: {
      address: "",
      coordinates: [0, 0], // Will be filled by Google API
    },
    survivalItems: {
      food: false,
      water: false,
      clothes: false,
      medicalSupplies: false,
      sleepingBags: false,
      hygieneProducts: false,
      blankets: false,
      tents: false,
      powerBanks: false,
      other: "",
    },
    peopleInNeed: 0,
    organization: "",
  });

  const [labels, setLabels] = useState(defaultLabels);

  useEffect(() => {
    async function translateLabels() {
      if (lang === "my") {
        const translatedLabels = await Promise.all(
          englishLabelsArray.map((label) => translateText(label, "my"))
        );

        const translatedSurvivalItems = await Promise.all(
          englishSurvivalItemsArray.map((item) => translateText(item, "my"))
        );

        setLabels(
          createLabelsFromTranslatedArrays(
            translatedLabels,
            translatedSurvivalItems
          )
        );
      } else {
        setLabels(defaultLabels);
      }
    }

    translateLabels();
  }, [lang]);

  if (!isAuthenticated) {
    return (
      <div className="submit-resources-container">
        <h2>{labels.restrictedAccess}</h2>
        <p>{labels.restrictedMessage}</p>
        <button onClick={() => loginWithRedirect()} className="login-button">
          {labels.login}
        </button>
      </div>
    );
  }

  const fetchCoordinates = async (address) => {
    try {
      // First, try with "Myanmar" appended to improve geocoding results
      let fullAddress = address;
      if (!address.toLowerCase().includes("myanmar")) {
        fullAddress = `${address}, Myanmar`;
      }

      const apiKey = process.env.REACT_APP_GOOGLE_API_KEY;
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          fullAddress
        )}&key=${apiKey}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch coordinates");
      }

      const data = await response.json();

      if (data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry.location;
        return [lng, lat]; // Return coordinates as [longitude, latitude]
      } else {
        // If no results with Myanmar appended, try with just "Burma" as an alternative
        const burmaTry = await fetch(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
            `${address}, Burma`
          )}&key=${apiKey}`
        );

        const burmaData = await burmaTry.json();

        if (burmaData.results.length > 0) {
          const { lat, lng } = burmaData.results[0].geometry.location;
          return [lng, lat];
        }

        // Fall back to central Myanmar coordinates if geocoding fails
        console.warn(
          "Using fallback coordinates for Myanmar (central location)"
        );
        return [96.1345, 16.8661]; // Central Myanmar coordinates
      }
    } catch (error) {
      console.error("Error fetching coordinates:", error);
      return [96.1345, 16.8661]; // Central Myanmar coordinates
    }
  };

  const handleChange = async (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "address") {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: value,
        },
      });

      // Fetch coordinates when the address is updated
      if (value.trim() !== "") {
        const coordinates = await fetchCoordinates(value);
        setFormData((prevFormData) => ({
          ...prevFormData,
          location: {
            ...prevFormData.location,
            coordinates,
          },
        }));
      }
    } else if (name === "peopleInNeed") {
      const digitsOnly = value.replace(/\D/g, "");
      const numValue = digitsOnly === "" ? 0 : parseInt(digitsOnly, 10);
      setFormData({
        ...formData,
        peopleInNeed: numValue,
      });
    } else if (name === "organization") {
      setFormData({
        ...formData,
        organization: value,
      });
    } else if (name === "otherResources") {
      setFormData({
        ...formData,
        survivalItems: {
          ...formData.survivalItems,
          other: value,
        },
      });
    } else if (type === "checkbox") {
      setFormData({
        ...formData,
        survivalItems: {
          ...formData.survivalItems,
          [name]: checked,
        },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    const survivalItemsArray = Object.entries(formData.survivalItems)
      .filter(
        ([key, value]) =>
          value === true || (key === "other" && value.trim() !== "")
      )
      .map(([key, value]) => (key === "other" ? value : key));

    try {
      const backendUrl = process.env.REACT_APP_BACKEND_URL;
      const response = await fetch(`${backendUrl}/api/surveys`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            coordinates: formData.location.coordinates,
            regionName: formData.location.address,
          },
          survivalItems: survivalItemsArray,
          peopleInNeed: formData.peopleInNeed,
          organization: formData.organization,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSuccess(data.message.includes("updated") ? "updated" : "created");
    } catch (error) {
      console.error("Error submitting form:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2 className="form-title">{labels.title}</h2>
        <button
          className="logout-button"
          onClick={() => logout({ returnTo: window.location.origin })}
        >
          {labels.logout}
        </button>
      </div>

      <p className="welcome-message">
        {labels.welcome} {user?.name || user?.email}
      </p>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">{labels.organization}</label>
          <input
            type="text"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label className="form-label">{labels.address}</label>
          <input
            type="text"
            name="address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder={labels.addressPlaceholder}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">{labels.peopleInNeed}</label>
          <input
            type="number"
            name="peopleInNeed"
            value={formData.peopleInNeed}
            onChange={handleChange}
            className="form-input"
            min="0"
            required
          />
        </div>

        <div className="form-group">
          <label className="form-label">{labels.resourcesNeeded}</label>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="food"
              name="food"
              checked={formData.survivalItems.food}
              onChange={handleChange}
            />
            <label htmlFor="food" className="checkbox-label">
              {labels.survivalItems.food}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="water"
              name="water"
              checked={formData.survivalItems.water}
              onChange={handleChange}
            />
            <label htmlFor="water" className="checkbox-label">
              {labels.survivalItems.water}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="clothes"
              name="clothes"
              checked={formData.survivalItems.clothes}
              onChange={handleChange}
            />
            <label htmlFor="clothes" className="checkbox-label">
              {labels.survivalItems.clothes}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="medicalSupplies"
              name="medicalSupplies"
              checked={formData.survivalItems.medicalSupplies}
              onChange={handleChange}
            />
            <label htmlFor="medicalSupplies" className="checkbox-label">
              {labels.survivalItems.medicalSupplies}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="sleepingBags"
              name="sleepingBags"
              checked={formData.survivalItems.sleepingBags}
              onChange={handleChange}
            />
            <label htmlFor="sleepingBags" className="checkbox-label">
              {labels.survivalItems.sleepingBags}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="hygieneProducts"
              name="hygieneProducts"
              checked={formData.survivalItems.hygieneProducts}
              onChange={handleChange}
            />
            <label htmlFor="hygieneProducts" className="checkbox-label">
              {labels.survivalItems.hygieneProducts}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="blankets"
              name="blankets"
              checked={formData.survivalItems.blankets}
              onChange={handleChange}
            />
            <label htmlFor="blankets" className="checkbox-label">
              {labels.survivalItems.blankets}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="tents"
              name="tents"
              checked={formData.survivalItems.tents}
              onChange={handleChange}
            />
            <label htmlFor="tents" className="checkbox-label">
              {labels.survivalItems.tents}
            </label>
          </div>

          <div className="checkbox-container">
            <input
              type="checkbox"
              id="powerBanks"
              name="powerBanks"
              checked={formData.survivalItems.powerBanks}
              onChange={handleChange}
            />
            <label htmlFor="powerBanks" className="checkbox-label">
              {labels.survivalItems.powerBanks}
            </label>
          </div>
        </div>

        <div className="form-group">
          <label className="form-label">{labels.otherResources}</label>
          <input
            type="text"
            name="otherResources"
            value={formData.survivalItems.other}
            onChange={handleChange}
            placeholder={
              lang === "en"
                ? "Any other specific needs..."
                : "အခြားလိုအပ်သောအရာများ..."
            }
            className="form-input"
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "Submitting..." : labels.submit}
        </button>

        {success === "created" && (
          <div className="success-message">{labels.successMessage}</div>
        )}

        {success === "updated" && (
          <div className="success-message">{labels.updateMessage}</div>
        )}

        {error && (
          <div className="error-message">
            {labels.errorMessage}: {error}
          </div>
        )}
      </form>
    </div>
  );
}

export default SubmitResource;
