import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import './TopNav.css';

const genres = ['Horror', 'Action', 'Comedy', 'Drama', 'Romance', 'Sci-Fi'];

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
            <div className="logo">FIMAX</div>
            <ul className="nav-links">
                {genres.map((genre) => {
                    const path = `/genre/${genre.toLowerCase()}`;
                    const isActive = location.pathname === path;
                    return (
                        <li key={genre}>
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
