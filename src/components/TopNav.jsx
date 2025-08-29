import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './TopNav.css';

// ✅ Added extra genres to test horizontal scrolling
const genres = ['Action', 'Drama', 'Adventure', 'Horror', 'Sci-Fi', 'Romance', 'Thriller', 'Nollywood'];

const TopNav = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && searchTerm.trim()) {
            navigate(`/search?query=${encodeURIComponent(searchTerm.trim())}`);
            setSearchTerm('');
        }
    };

    return (
        <nav className="top-nav">
            {/* ✅ Added role="menubar" */}
            <ul className="nav-links" role="menubar">
                {genres.map((genre) => {
                    const path = `/genre/${genre.toLowerCase()}`;
                    const isActive = location.pathname === path;
                    return (
                        // ✅ Added role="menuitem"
                        <li key={genre} role="menuitem">
                            <Link to={path} className={isActive ? 'active' : ''}>
                                {genre}
                            </Link>
                        </li>
                    );
                })}
            </ul>
            <div className="search-container">
                <input
                    type="text"
                    placeholder="Search movies or genres..."
                    className="search-input"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={handleKeyPress}
                />
            </div>
        </nav>
    );
};

export default TopNav;
