// src/pages/Profile.jsx
import React from "react";

const Profile = () => {
    return (
        <div
            style={{
                maxWidth: 400,
                margin: "2rem auto",
                padding: "2rem",
                backgroundColor: "#f9f9f9",
                borderRadius: "12px",
                boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                textAlign: "center",
                fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
            }}
        >
            {/* Avatar */}
            <img
                src="https://via.placeholder.com/120"
                alt="User Avatar"
                style={{
                    width: 120,
                    height: 120,
                    borderRadius: "50%",
                    objectFit: "cover",
                    boxShadow: "0 4px 8px rgba(0,0,0,0.15)",
                }}
            />

            {/* Username */}
            <h2 style={{ marginTop: "1rem", marginBottom: "0.5rem", color: "#333" }}>
                Guest
            </h2>
            <p style={{ color: "#777", marginBottom: "2rem" }}>Welcome to FIMAX</p>

            {/* Settings button */}
            <button
                style={{
                    display: "block",
                    width: "100%",
                    padding: "0.8rem",
                    marginBottom: "1rem",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#007bff",
                    color: "white",
                    fontSize: "1rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                }}
                onMouseOver={(e) => (e.target.style.backgroundColor = "#0056b3")}
                onMouseOut={(e) => (e.target.style.backgroundColor = "#007bff")}
            >
                Settings
            </button>

            {/* Placeholder Logout (disabled) */}
            <button
                style={{
                    display: "block",
                    width: "100%",
                    padding: "0.8rem",
                    border: "none",
                    borderRadius: "8px",
                    backgroundColor: "#ccc",
                    color: "#555",
                    fontSize: "1rem",
                    cursor: "not-allowed",
                }}
                disabled
            >
                Logout
            </button>
        </div>
    );
};

export default Profile;
