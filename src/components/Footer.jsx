// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css'; // Keep your styling

const Footer = () => {
    return (
        <footer className="footer">
            {/* Home Icon */}
            <Link to="/" className="footer-icon" aria-label="Home">
                <i className="fas fa-home"></i>
                <span className="footer-label">Home</span>
            </Link>

            {/* Center Download Icon (replacing Library) */}
            <Link
                to="/downloads"
                className="footer-icon center-icon"
                aria-label="Downloads"
            >
                <i className="fas fa-download"></i>
                <span className="footer-label">Downloads</span>
            </Link>

            {/* Profile Icon */}
            <Link to="/profile" className="footer-icon" aria-label="Profile">
                <i className="fas fa-user"></i>
                <span className="footer-label">Profile</span>
            </Link>
        </footer>
    );
};

export default Footer;
