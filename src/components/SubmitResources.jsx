import React from "react";
import { useAuth0 } from "@auth0/auth0-react";

function SubmitResource() {
  const { isAuthenticated, loginWithRedirect, user } = useAuth0();

  if (!isAuthenticated) {
    return (
      <div style={{ textAlign: "center", marginTop: "2rem" }}>
        <h2>🔒 Restricted Access</h2>
        <p>Only verified organizations can submit resource updates.</p>
        <button
          onClick={() => loginWithRedirect()}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Log In to Continue
        </button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "2rem auto", padding: "1rem", backgroundColor: "#fff", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)" }}>
      <h2>📝 Submit Resource Report</h2>
      <p>Welcome, {user.name}</p>

      <form>
        <label>📍 Region Name:</label><br />
        <input type="text" placeholder="e.g., Mandalay" style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} /><br />

        <label>📦 Resources Needed:</label><br />
        <textarea rows="4" placeholder="e.g., Water, medical aid, tents..." style={{ width: "100%", padding: "0.5rem", marginBottom: "1rem" }} /><br />

        <button type="submit" style={{
          backgroundColor: "#28a745",
          color: "#fff",
          border: "none",
          padding: "0.5rem 1rem",
          borderRadius: "5px",
          cursor: "pointer"
        }}>
          Submit Report
        </button>
      </form>
    </div>
  );
}

export default SubmitResource;
