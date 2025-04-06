import React, { useState } from "react";
import { useAuth0 } from "@auth0/auth0-react";

function SubmitResource() {
  const { isAuthenticated, loginWithRedirect, user, logout } = useAuth0();
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
        <h2>🔒 Restricted Access</h2>
        <p>Only verified organizations can submit resource updates.</p>
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
          Log In to Continue
        </button>
      </div>
    );
  }

  // Update the handleChange function to properly handle peopleInNeed
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
      // Only allow digits (0-9)
      const digitsOnly = value.replace(/\D/g, "");

      // Convert to number (will be 0 if input is empty)
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

    // Convert survivalItems object to array of strings for backend
    const survivalItemsArray = Object.entries(formData.survivalItems)
      .filter(
        ([key, value]) =>
          value === true || (key === "other" && value.trim() !== "")
      )
      .map(([key, value]) => (key === "other" ? value : key));

    try {
      const response = await fetch("http://localhost:8000/api/surveys", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          location: {
            coordinates: [95.0, 22.0], // Placeholder - would be from Google API
            regionName: formData.location.address,
          },
          survivalItems: survivalItemsArray,
          peopleInNeed: formData.peopleInNeed,
          organization: formData.organization,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit survey");
      }

      setSuccess(true);
      // Reset form after successful submission
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
        📝 Submit Resource Needs
      </h2>

      <p style={{ fontSize: "1.1rem", marginBottom: "2rem" }}>
        Welcome, <strong>{user?.name}</strong>. Please provide details about the
        resources needed.
      </p>

      {success && (
        <div
          style={{
            padding: "15px",
            backgroundColor: "#d4edda",
            color: "#155724",
            borderRadius: "5px",
            marginBottom: "20px",
            display: "flex",
            alignItems: "center",
            fontWeight: "bold",
          }}
        >
          <span style={{ marginRight: "10px" }}>✅</span>
          Your resource needs have been submitted successfully!
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
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Organization Information */}
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
            Organization (if applicable)
          </label>
          <input
            type="text"
            id="organization"
            name="organization"
            value={formData.organization}
            onChange={handleChange}
            placeholder="Your organization name"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
          />
        </div>

        {/* Address */}
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
            Location Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.location.address}
            onChange={handleChange}
            placeholder="e.g., Kyauktada Township, Yangon"
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "5px",
              border: "1px solid #ddd",
              fontSize: "1rem",
            }}
            required
          />
          <p
            style={{
              margin: "8px 0 0",
              fontSize: "0.9rem",
              color: "#6c757d",
              fontStyle: "italic",
            }}
          >
            Please provide specific township and city information
          </p>
        </div>

        {/* People in Need */}
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
            Estimated People in Need
          </label>
          <input
            type="text" // Changed from "number" to "text" for better control
            inputMode="numeric" // Tells mobile devices to show numeric keyboard
            pattern="[0-9]*" // HTML5 validation for digits only
            id="peopleInNeed"
            name="peopleInNeed"
            value={formData.peopleInNeed === 0 ? "" : formData.peopleInNeed}
            onChange={handleChange}
            onKeyDown={(e) => {
              // Allow only: digits, backspace, delete, tab, escape, enter, arrow keys
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

        {/* Survival Items Checklist */}
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
            Resources Needed (select all that apply)
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
              <span style={checkboxLabelStyle}>Food</span>
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
              <span style={checkboxLabelStyle}>Water</span>
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
              <span style={checkboxLabelStyle}>Clothes</span>
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
              <span style={checkboxLabelStyle}>Medical Supplies</span>
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
              <span style={checkboxLabelStyle}>Sleeping Bags</span>
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
              <span style={checkboxLabelStyle}>Hygiene Products</span>
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
              <span style={checkboxLabelStyle}>Blankets</span>
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
              <span style={checkboxLabelStyle}>Tents</span>
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
              <span style={checkboxLabelStyle}>Power Banks</span>
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
            Other resources needed (please specify)
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

        {/* Submit and Logout Buttons */}
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
            {loading ? "Submitting..." : "Submit Report"}
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
            Log Out
          </button>
        </div>
      </form>
    </div>
  );
}

export default SubmitResource;
