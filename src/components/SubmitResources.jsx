import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { useLanguage } from "./LanguageContext";
import { translateText } from "./translate";

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

  const [labels, setLabels] = useState({
    title: "📝 Submit Resource Needs",
    welcome: "Welcome,",
    organization: "Organization (if applicable)",
    address: "Location Address",
    addressPlaceholder: "e.g., Kyauktada Township, Yangon",
    peopleInNeed: "Estimated People in Need",
    resourcesNeeded: "Resources Needed (select all that apply)",
    otherResources: "Other resources needed (please specify)",
    submit: "Submit Report",
    logout: "Log Out",
    restrictedAccess: "🔒 Restricted Access",
    restrictedMessage: "Only verified organizations can submit resource updates.",
    login: "Log In to Continue",
    successMessage: "Your resource needs have been submitted successfully!",
    updateMessage: "Your resource needs have been updated successfully!",
    errorMessage: "Failed to submit survey",
    survivalItems: {
      food: "Food",
      water: "Water",
      clothes: "Clothes",
      medicalSupplies: "Medical Supplies",
      sleepingBags: "Sleeping Bags",
      hygieneProducts: "Hygiene Products",
      blankets: "Blankets",
      tents: "Tents",
      powerBanks: "Power Banks",
    },
  });

  useEffect(() => {
    async function translateLabels() {
      if (lang === "my") {
        const translatedLabels = await Promise.all([
          translateText("📝 Submit Resource Needs", "my"),
          translateText("Welcome,", "my"),
          translateText("Organization (if applicable)", "my"),
          translateText("Location Address", "my"),
          translateText("e.g., Kyauktada Township, Yangon", "my"),
          translateText("Estimated People in Need", "my"),
          translateText("Resources Needed (select all that apply)", "my"),
          translateText("Other resources needed (please specify)", "my"),
          translateText("Submit Report", "my"),
          translateText("Log Out", "my"),
          translateText("🔒 Restricted Access", "my"),
          translateText("Only verified organizations can submit resource updates.", "my"),
          translateText("Log In to Continue", "my"),
          translateText("Your resource needs have been submitted successfully!", "my"),
          translateText("Your resource needs have been updated successfully!", "my"),
          translateText("Failed to submit survey", "my"),
        ]);

        const translatedSurvivalItems = await Promise.all([
          translateText("Food", "my"),
          translateText("Water", "my"),
          translateText("Clothes", "my"),
          translateText("Medical Supplies", "my"),
          translateText("Sleeping Bags", "my"),
          translateText("Hygiene Products", "my"),
          translateText("Blankets", "my"),
          translateText("Tents", "my"),
          translateText("Power Banks", "my"),
        ]);

        setLabels({
          title: translatedLabels[0],
          welcome: translatedLabels[1],
          organization: translatedLabels[2],
          address: translatedLabels[3],
          addressPlaceholder: translatedLabels[4],
          peopleInNeed: translatedLabels[5],
          resourcesNeeded: translatedLabels[6],
          otherResources: translatedLabels[7],
          submit: translatedLabels[8],
          logout: translatedLabels[9],
          restrictedAccess: translatedLabels[10],
          restrictedMessage: translatedLabels[11],
          login: translatedLabels[12],
          successMessage: translatedLabels[13],
          updateMessage: translatedLabels[14],
          errorMessage: translatedLabels[15],
          survivalItems: {
            food: translatedSurvivalItems[0],
            water: translatedSurvivalItems[1],
            clothes: translatedSurvivalItems[2],
            medicalSupplies: translatedSurvivalItems[3],
            sleepingBags: translatedSurvivalItems[4],
            hygieneProducts: translatedSurvivalItems[5],
            blankets: translatedSurvivalItems[6],
            tents: translatedSurvivalItems[7],
            powerBanks: translatedSurvivalItems[8],
          },
        });
      } else {
        setLabels({
          title: "📝 Submit Resource Needs",
          welcome: "Welcome,",
          organization: "Organization (if applicable)",
          address: "Location Address",
          addressPlaceholder: "e.g., Kyauktada Township, Yangon",
          peopleInNeed: "Estimated People in Need",
          resourcesNeeded: "Resources Needed (select all that apply)",
          otherResources: "Other resources needed (please specify)",
          submit: "Submit Report",
          logout: "Log Out",
          restrictedAccess: "🔒 Restricted Access",
          restrictedMessage: "Only verified organizations can submit resource updates.",
          login: "Log In to Continue",
          successMessage: "Your resource needs have been submitted successfully!",
          updateMessage: "Your resource needs have been updated successfully!",
          errorMessage: "Failed to submit survey",
          survivalItems: {
            food: "Food",
            water: "Water",
            clothes: "Clothes",
            medicalSupplies: "Medical Supplies",
            sleepingBags: "Sleeping Bags",
            hygieneProducts: "Hygiene Products",
            blankets: "Blankets",
            tents: "Tents",
            powerBanks: "Power Banks",
          },
        });
      }
    }

    translateLabels();
  }, [lang]);

  if (!isAuthenticated) {
    return (
      <div
        style={{
          textAlign: "center",
          marginTop: "2rem",
          backgroundColor: "#fff",
          padding: "2rem",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        }}
      >
        <h2>{labels.restrictedAccess}</h2>
        <p>{labels.restrictedMessage}</p>
        <button
          onClick={() => loginWithRedirect()}
          style={{
            padding: "0.75rem 1.5rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontSize: "1rem",
            fontWeight: "bold",
            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          }}
        >
          {labels.login}
        </button>
      </div>
    );
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "address") {
      setFormData({
        ...formData,
        location: {
          ...formData.location,
          address: value,
        },
      });
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
    } else if (name.startsWith("item-")) {
      const itemName = name.replace("item-", "");
      setFormData({
        ...formData,
        survivalItems: {
          ...formData.survivalItems,
          [itemName]: checked,
        },
      });
    } else if (name === "other") {
      setFormData({
        ...formData,
        survivalItems: {
          ...formData.survivalItems,
          other: value,
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
            coordinates: [95.0, 22.0],
            regionName: formData.location.address,
          },
          survivalItems: survivalItemsArray,
          peopleInNeed: formData.peopleInNeed,
          organization: formData.organization,
        }),
      });

      if (!response.ok) {
        throw new Error(labels.errorMessage);
      }

      const result = await response.json();
      const wasUpdated = result.message === "Survey updated successfully";

      setSuccess({
        isUpdate: wasUpdated,
        message: wasUpdated ? labels.updateMessage : labels.successMessage,
      });

      setFormData({
        location: {
          address: "",
          coordinates: [0, 0],
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
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkboxStyle = {
    display: "flex",
    alignItems: "center",
    marginBottom: "10px",
    padding: "8px 12px",
    backgroundColor: "#f8f9fa",
    borderRadius: "5px",
    transition: "background-color 0.2s",
  };

  const checkboxLabelStyle = {
    marginLeft: "10px",
    fontSize: "1rem",
    userSelect: "none",
  };

  return (
    <div
      style={{
        maxWidth: "700px",
        margin: "2rem auto",
        padding: "2rem",
        backgroundColor: "#fff",
        borderRadius: "10px",
        boxShadow: "0 3px 15px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          fontSize: "1.8rem",
          marginBottom: "1.5rem",
          color: "#2c3e50",
          borderBottom: "2px solid #f1f1f1",
          paddingBottom: "10px",
        }}
      >
        {labels.title}
      </h2>

      <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
        {labels.welcome} <strong>{user?.name}</strong>. {labels.restrictedMessage}
      </p>

      {success && (
        <div
          style={{
            padding: "15px",
            backgroundColor: success.isUpdate ? "#cce5ff" : "#d4edda",
            color: success.isUpdate ? "#004085" : "#155724",
            borderRadius: "5px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "10px" }}>
            {success.isUpdate ? "📝" : "✅"}
          </span>
          {success.isUpdate ? labels.updateMessage : labels.successMessage}
        </div>
      )}

      {error && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#f8d7da",
            color: "#721c24",
            borderRadius: "5px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "10px" }}>❌</span>
          {labels.errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="organization"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            {labels.organization}
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder={labels.organization}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="address"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            {labels.address}
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder={labels.addressPlaceholder}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            htmlFor="peopleInNeed"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            {labels.peopleInNeed}
          </label>
          <input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            id="peopleInNeed"
            name="peopleInNeed"
            value={formData.peopleInNeed === 0 ? "" : formData.peopleInNeed}
            onChange={handleChange}
            onKeyDown={(e) => {
              const allowedKeys = [
                "Backspace",
                "Delete",
                "Tab",
                "Escape",
                "Enter",
                "ArrowLeft",
                "ArrowRight",
                "ArrowUp",
                "ArrowDown",
              ];

              const isDigit = /^[0-9]$/.test(e.key);

              if (!isDigit && !allowedKeys.includes(e.key)) {
                e.preventDefault();
              }
            }}
            placeholder="0"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
            required
          />
        </div>

        <div style={{ marginBottom: "1.5rem" }}>
          <label
            style={{
              display: "block",
              marginBottom: "15px",
              fontSize: "1.1rem",
              fontWeight: "bold",
              color: "#2c3e50",
            }}
          >
            {labels.resourcesNeeded}
          </label>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
              gap: "10px",
              marginBottom: "20px",
            }}
          >
            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.food
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-food"
                checked={formData.survivalItems.food}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.food}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.water
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-water"
                checked={formData.survivalItems.water}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.water}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.clothes
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-clothes"
                checked={formData.survivalItems.clothes}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.clothes}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.medicalSupplies
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-medicalSupplies"
                checked={formData.survivalItems.medicalSupplies}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.medicalSupplies}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.sleepingBags
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-sleepingBags"
                checked={formData.survivalItems.sleepingBags}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.sleepingBags}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.hygieneProducts
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-hygieneProducts"
                checked={formData.survivalItems.hygieneProducts}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.hygieneProducts}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.blankets
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-blankets"
                checked={formData.survivalItems.blankets}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.blankets}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.tents
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-tents"
                checked={formData.survivalItems.tents}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.tents}</span>
            </label>

            <label
              style={{
                ...checkboxStyle,
                backgroundColor: formData.survivalItems.powerBanks
                  ? "#e3f2fd"
                  : "#f8f9fa",
              }}
            >
              <input
                type="checkbox"
                name="item-powerBanks"
                checked={formData.survivalItems.powerBanks}
                onChange={handleChange}
              />
              <span style={checkboxLabelStyle}>{labels.survivalItems.powerBanks}</span>
            </label>
          </div>

          <label
            htmlFor="other"
            style={{
              display: "block",
              marginBottom: "8px",
              fontSize: "1rem",
              color: "#2c3e50",
            }}
          >
            {labels.otherResources}
          </label>
          <input
            type="text"
            id="other"
            name="other"
            value={formData.survivalItems.other}
            onChange={handleChange}
            placeholder="Any other specific needs..."
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
          />
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: "2rem",
          }}
        >
          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#28a745",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
            }}
          >
            {loading ? "Submitting..." : labels.submit}
          </button>

          <button
            type="button"
            onClick={() =>
              logout({ logoutParams: { returnTo: window.location.origin } })
            }
            style={{
              backgroundColor: "#dc3545",
              color: "#fff",
              border: "none",
              padding: "12px 24px",
              borderRadius: "5px",
              fontSize: "1rem",
              fontWeight: "bold",
              cursor: "pointer",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              transition: "all 0.2s ease",
            }}
          >
            {labels.logout}
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmitResource;
